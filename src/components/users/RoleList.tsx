"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import Sidebar from "../utility/Sidebar";
import Navbar from "../nav/Navbar";
import { useUsers } from "@/hooks/useUsers";
import { formatRole } from "@/lib/utils";
import {
  API_PERMISSIONS,
  extractPermissionNames,
  getLatestAssignmentForStaff,
  loadRoleAssignments,
  permissionsFromToggleState,
  RoleAssignmentRecord,
  saveRoleAssignments,
  SystemRole,
} from "@/lib/roleManagement";

interface StaffUser {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  username?: string;
  email?: string;
  permissions?: unknown;
}

function staffLabel(user: StaffUser): string {
  const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email || "Unknown";
  const meta = [user.username, formatRole(user.role)].filter(Boolean).join(" · ");
  return meta ? `${name} (${meta})` : name;
}

const RoleList = () => {
  const { getStaff, updateUser } = useUsers();
  const getStaffRef = useRef(getStaff);
  getStaffRef.current = getStaff;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [systemRole, setSystemRole] = useState<SystemRole>("STAFF");
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [assignments, setAssignments] = useState<RoleAssignmentRecord[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAccountCodes, setSelectedAccountCodes] = useState<string[]>([]);
  const [selectedStaffs, setSelectedStaffs] = useState<string[]>([]);

  const refreshStaff = useCallback(async () => {
    setLoadingStaff(true);
    try {
      const data = await getStaffRef.current();
      if (Array.isArray(data)) {
        setStaffUsers(data as StaffUser[]);
      }
    } finally {
      setLoadingStaff(false);
    }
  }, []);

  useEffect(() => {
    refreshStaff();
    setAssignments(loadRoleAssignments());
  }, [refreshStaff]);

  const openCreateRoleModal = () => {
    refreshStaff();
    setIsModalOpen(true);
  };

  const [permissions, setPermissions] = useState({
    accessOwnerInformation: false,
    accountsBalance: false,
    accountInformation: false,
    bankStatement: false,
    accountCurrencyList: false,
    cashBook: false,
    cashBookBalance: false,
    changePassword: false,
    chequeClearingDays: false,
    chequeStock: false,
    createStaff: false,
    createClient: false,
    editClientInformation: false,
    editStaffInformation: false,
    closeAccount: false,
    createAccountReplica: false,
    createNewAccount: false,
    editAccountDetails: false,
    emptyArchive: false,
    exportAccount: false,
    importAccount: false,
    importCashBook: false,
    markHoliday: false,
    mergeAccount: false,
    printerSetup: false,
    reopenAccount: false,
    reconstructedStatement: false,
    releaseAccount: false,
    removeAccountDetails: false,
    returnChargeAndRates: false,
    reverseHoliday: false,
    assignPermission: false,
    cancelPermission: false,
    editStandingOrder: false,
    stopStandingOrder: false,
    transactionMatched: false,
    accountActivities: false,
    allTansactions: false,
  });
  const modalRef = useRef<HTMLDivElement>(null);
  const accountCodesDropdownRef = useRef<HTMLSelectElement>(null);
  // Ref for the staff dropdown
  const staffDropdownRef = useRef<HTMLSelectElement>(null);

  const resetCreateForm = () => {
    setRoleTitle("");
    setSystemRole("STAFF");
    setSelectedStaffs([]);
    setSelectedAccountCodes([]);
    setPermissions(
      Object.fromEntries(Object.keys(permissions).map((key) => [key, false])) as typeof permissions,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const title = roleTitle.trim();
    if (!title) {
      toast.error("Role title is required.");
      return;
    }
    if (selectedStaffs.length === 0) {
      toast.error("Select at least one staff member to assign this role.");
      return;
    }

    const apiPermissions = permissionsFromToggleState(permissions);
    if (apiPermissions.length === 0) {
      toast.error("Turn on at least one permission for this role.");
      return;
    }

    setSubmitting(true);
    try {
      for (const staffId of selectedStaffs) {
        await updateUser(staffId, {
          role: systemRole,
          permissions: apiPermissions,
        });
      }

      const record: RoleAssignmentRecord = {
        id: crypto.randomUUID(),
        roleTitle: title,
        systemRole,
        staffIds: [...selectedStaffs],
        permissions: apiPermissions,
        createdAt: new Date().toISOString(),
      };
      const nextAssignments = [...assignments, record];
      setAssignments(nextAssignments);
      saveRoleAssignments(nextAssignments);

      await refreshStaff();
      toast.success(`Role "${title}" assigned successfully.`);
      setIsModalOpen(false);
      resetCreateForm();
    } catch {
      toast.error("Could not assign role. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle edit form submission here
    console.log({ currentRole, selectedAccountCodes, permissions });
    setIsEditModalOpen(false);
  };

  const togglePermission = (permission: keyof typeof permissions) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  const handleRoleClick = (role: string) => {
    setCurrentRole(role);
    setSelectedAccountCodes([]);
    setIsEditModalOpen(true);
  };

  const handleAccountCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue && !selectedAccountCodes.includes(selectedValue)) {
      setSelectedAccountCodes([...selectedAccountCodes, selectedValue]);
      // Optionally reset the dropdown to its default state
      if (accountCodesDropdownRef.current) {
        accountCodesDropdownRef.current.value = "";
      }
    }
  };

  const removeSelectedAccountCode = (codeToRemove: string) => {
    setSelectedAccountCodes(selectedAccountCodes.filter((code) => code !== codeToRemove));
  };

  // Handler for staff dropdown change
  const handleStaffChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (selectedId && !selectedStaffs.includes(selectedId)) {
      setSelectedStaffs([...selectedStaffs, selectedId]);
      // Reset dropdown to "None"
      if (staffDropdownRef.current) {
        staffDropdownRef.current.value = "";
      }
    }
  };

  // Handler to remove a selected staff
  const removeSelectedStaff = (idToRemove: string) => {
    setSelectedStaffs(selectedStaffs.filter((id) => id !== idToRemove));
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
        setIsEditModalOpen(false);
      }
    };

    if (isModalOpen || isEditModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen, isEditModalOpen]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
  <div className="flex-1 min-w-0 md:mt-0 pt-14 md:pt-0">
              <div className = "mb-4"><Navbar /></div>
              
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
    

        {/* Admin Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Role Management</h2>

            <button
              type="button"
              onClick={openCreateRoleModal}
              className="w-full sm:w-auto bg-[#F36F2E] hover:bg-[#E05C2B] text-white py-2 px-4 rounded-md text-sm transition-colors"
            >
              Create New Role
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">Staff & assigned roles</h3>
              <p className="text-xs text-gray-500 mt-1">
                Staff are loaded from the API. Custom role titles appear after you create a role assignment.
              </p>
            </div>
            {loadingStaff ? (
              <div className="p-6 text-center text-sm text-gray-500">Loading staff…</div>
            ) : staffUsers.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">
                No staff found. Add staff in User Management first.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Staff name</th>
                      <th className="px-4 py-3 font-medium">Custom role</th>
                      <th className="px-4 py-3 font-medium">System role</th>
                      <th className="px-4 py-3 font-medium">Permissions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {staffUsers.map((user) => {
                      const assignment = getLatestAssignmentForStaff(assignments, user.id);
                      const permissionList = extractPermissionNames(user);
                      const displayPermissions =
                        permissionList.length > 0
                          ? permissionList.join(", ")
                          : assignment?.permissions.join(", ") ?? "—";

                      return (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-900 font-medium">
                            {user.firstName} {user.lastName}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {assignment?.roleTitle ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {formatRole(assignment?.systemRole ?? user.role)}
                          </td>
                          <td className="px-4 py-3 text-gray-600 text-xs">{displayPermissions}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {assignments.length > 0 && (
            <div className="mt-4 bg-orange-50 border border-orange-100 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Recently created roles</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                {[...assignments].reverse().slice(0, 5).map((record) => (
                  <li key={record.id}>
                    <span className="font-medium">{record.roleTitle}</span>
                    {" — "}
                    {record.staffIds
                      .map((id) => {
                        const user = staffUsers.find((s) => s.id === id);
                        return user ? staffLabel(user) : id;
                      })
                      .join(", ")}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="space-y-4">
          {/* Role Cards Section */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => handleRoleClick("Super admin")}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:border-[#F36F2E] hover:text-[#F36F2E] transition-colors shadow-sm"
              >
                <span className="text-sm sm:text-base font-bold text-[#404141]">Admin/Staff</span>
                <span className="text-gray-400">→</span>
              </button>
              <button
                onClick={() => handleRoleClick("Client/Staff")}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:border-[#F36F2E] hover:text-[#F36F2E] transition-colors shadow-sm"
              >
                <span className="text-sm sm:text-base font-bold text-[#404141]">Client/Staff</span>
                <span className="text-gray-400">→</span>
              </button>
              <button
                onClick={() => handleRoleClick("Bank")}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:border-[#F36F2E] hover:text-[#F36F2E] transition-colors shadow-sm"
              >
                <span className="text-sm sm:text-base font-bold text-[#404141]">Bank</span>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Create New Role Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md mx-2 sm:mx-0 max-h-[90vh] flex flex-col" ref={modalRef}>
              <div className="p-4 sm:p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className="text-lg font-bold text-black">Create New Role</h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Staff Assignment Dropdown */}
                  <div className="mb-4 sm:mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assign Staff
                    </label>
                    <select
                      ref={staffDropdownRef}
                      onChange={handleStaffChange}
                      disabled={loadingStaff || staffUsers.length === 0}
                      className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F36F2E] focus:border-transparent h-auto min-h-[42px] disabled:bg-gray-100"
                      value=""
                    >
                      <option value="" disabled>
                        {loadingStaff
                          ? "Loading staff from system…"
                          : staffUsers.length === 0
                            ? "No staff in system — add users in User Management"
                            : "Select a staff member"}
                      </option>
                      {staffUsers
                        .filter((user) => !selectedStaffs.includes(user.id))
                        .map((user) => (
                          <option key={user.id} value={user.id}>
                            {staffLabel(user)}
                          </option>
                        ))}
                    </select>
                    {selectedStaffs.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-700">Selected Staff:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedStaffs.map((id) => {
                            const user = staffUsers.find((s) => s.id === id);
                            return (
                              <span key={id} className="inline-flex items-center text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                {user ? staffLabel(user) : id}
                                <button
                                  type="button"
                                  onClick={() => removeSelectedStaff(id)}
                                  className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-4 sm:mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F36F2E] focus:border-transparent"
                      placeholder="Enter Role Title"
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4 sm:mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      System role (API) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={systemRole}
                      onChange={(e) => setSystemRole(e.target.value as SystemRole)}
                      className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F36F2E] focus:border-transparent"
                    >
                      <option value="STAFF">Staff</option>
                      <option value="ADMIN">Admin</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                  </div>

                  <div className="mb-4 sm:mb-6">
                    <p className="text-xs font-medium text-gray-700 mb-2">Quick permissions (saved to API)</p>
                    <div className="flex flex-wrap gap-2">
                      {API_PERMISSIONS.map((perm) => {
                        const on =
                          perm === "VIEW_CLIENTS"
                            ? permissions.createClient || permissions.editClientInformation
                            : permissions.allTansactions || permissions.transactionMatched;
                        return (
                          <button
                            key={perm}
                            type="button"
                            onClick={() => {
                              if (perm === "VIEW_CLIENTS") {
                                setPermissions((prev) => ({
                                  ...prev,
                                  createClient: !on,
                                  editClientInformation: !on,
                                }));
                              } else {
                                setPermissions((prev) => ({
                                  ...prev,
                                  allTansactions: !on,
                                  transactionMatched: !on,
                                }));
                              }
                            }}
                            className={`px-3 py-1 rounded-full border text-xs ${
                              on
                                ? "bg-[#F36F2E] text-white border-[#F36F2E]"
                                : "bg-white text-gray-700 border-gray-300"
                            }`}
                          >
                            {perm}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Account Codes dropdown (commented out in original, kept as is) */}
                  {/* <div className="mb-4 sm:mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Codes</label>
                    <select
                      ref={accountCodesDropdownRef}
                      onChange={handleAccountCodeChange}
                      className="w-full px-3 py-2 border text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F36F2E] focus:border-transparent h-auto min-h-[42px]"
                    >
                      <option value="" disabled hidden>Select Account Code</option>
                      {availableAccountCodes.map((account) => (
                        <option key={account.code} value={account.code}>
                          {account.code} - {account.name}
                        </option>
                      ))}
                    </select>
                    {selectedAccountCodes.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-700">Selected Account Codes:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedAccountCodes.map((code) => {
                            const account = availableAccountCodes.find((ac) => ac.code === code);
                            return (
                              <span key={code} className="inline-flex items-center text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                {account ? `${account.code} - ${account.name}` : code}
                                <button
                                  type="button"
                                  onClick={() => removeSelectedAccountCode(code)}
                                  className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div> */}

                  <div className="mb-4 sm:mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Assign Permission <span className="text-red-500">*</span></h4>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                      {Object.entries(permissions).map(([key, value]) => (
                        <div key={key} className="p-2 rounded-md hover:bg-gray-50">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-black text-sm">
                              {key.split(/(?=[A-Z])/).join(' ').replace(/^./, (str) => str.toUpperCase())}
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={value as boolean}
                                onChange={() => togglePermission(key as keyof typeof permissions)}
                              />
                              <div className={`w-10 h-6 rounded-full peer ${value ? 'bg-[#F36F2E]' : 'bg-gray-300'}`}></div>
                              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${value ? 'transform translate-x-4' : ''}`}></div>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-3 py-2 sm:px-4 sm:py-2 bg-[#F36F2E] text-white rounded-md hover:bg-[#E05C2B] transition-colors text-sm disabled:opacity-60"
                    >
                      {submitting ? "Saving…" : "Create Role"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Role Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md mx-2 sm:mx-0 max-h-[90vh] flex flex-col" ref={modalRef}>
              <div className="p-4 sm:p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className="text-lg font-bold text-black">Edit {currentRole}</h3>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleEditSubmit}>
                  {/* Note: Account Codes section is commented out in original code, maintaining that here. */}
                  {/* <div className="mb-4 sm:mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Codes</label>
                    <select
                      ref={accountCodesDropdownRef}
                      onChange={handleAccountCodeChange}
                      className="w-full px-3 py-2 border text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F36F2E] focus:border-transparent h-auto min-h-[42px]"
                    >
                      <option value="" disabled hidden>Select Account Code</option>
                      {availableAccountCodes.map((account) => (
                        <option key={account.code} value={account.code}>
                          {account.code} - {account.name}
                        </option>
                      ))}
                    </select>
                    {selectedAccountCodes.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-700">Selected Account Codes:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedAccountCodes.map((code) => {
                            const account = availableAccountCodes.find((ac) => ac.code === code);
                            return (
                              <span key={code} className="inline-flex items-center text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                {account ? `${account.code} - ${account.name}` : code}
                                <button
                                  type="button"
                                  onClick={() => removeSelectedAccountCode(code)}
                                  className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div> */}

                  <div className="mb-4 sm:mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Assign Permission <span className="text-red-500">*</span></h4>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                      {Object.entries(permissions).map(([key, value]) => (
                        <div key={key} className="p-2 rounded-md hover:bg-gray-50">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-black text-sm">
                              {key.split(/(?=[A-Z])/).join(' ').replace(/^./, (str) => str.toUpperCase())}
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={value as boolean}
                                onChange={() => togglePermission(key as keyof typeof permissions)}
                              />
                              <div className={`w-10 h-6 rounded-full peer ${value ? 'bg-[#F36F2E]' : 'bg-gray-300'}`}></div>
                              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${value ? 'transform translate-x-4' : ''}`}></div>
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas sem massa dui placerat ut sit.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-2 sm:px-4 sm:py-2 bg-[#F36F2E] text-white rounded-md hover:bg-[#E05C2B] transition-colors text-sm"
                    >
                      Update Role
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        
      </main>
      </div>
    </div>

  );
};

export default RoleList;
