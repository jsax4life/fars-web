"use client";

import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../utility/Sidebar";
import Navbar from "../nav/Navbar";


const RoleList = () => {
  // Removed useRouter as it's Next.js specific
  // const router = useRouter(); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  // State for selected and available account codes
  const [selectedAccountCodes, setSelectedAccountCodes] = useState<string[]>([]);
  const [availableAccountCodes, setAvailableAccountCodes] = useState([
    { code: "ACC001", name: "Main Account" },
    { code: "ACC002", name: "Savings Account" },
    { code: "ACC003", name: "Investment Account" },
    { code: "ACC004", name: "Business Account" },
    { code: "ACC005", name: "Personal Account" },
  ]);

  // New states for staff assignment
  const [selectedStaffs, setSelectedStaffs] = useState<string[]>([]);
  const [availableStaffs, setAvailableStaffs] = useState([
    { id: "STAFF001", name: "John Doe" },
    { id: "STAFF002", name: "Jane Smith" },
    { id: "STAFF003", name: "Peter Jones" },
    { id: "STAFF004", name: "Alice Brown" },
    { id: "STAFF005", name: "Robert Green" },
  ]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here, now including selectedStaffs
    console.log({ roleTitle, selectedStaffs, selectedAccountCodes, permissions });
    setIsModalOpen(false);
    // Reset form states after submission
    setRoleTitle("");
    setSelectedStaffs([]);
    setSelectedAccountCodes([]);
    setPermissions(Object.fromEntries(Object.keys(permissions).map(key => [key, false])) as typeof permissions); // Reset all permissions to false
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
    // For demo purposes, pre-select some account codes when editing
    setSelectedAccountCodes(["ACC001", "ACC003"]);
    // Also pre-select some staff for demo when editing, if needed
    // setSelectedStaffs(["STAFF001"]);
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
  <div className="flex-1 md:mt-0">
              <div className = "mb-4"><Navbar /></div>
              
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
    

        {/* Admin Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Admin</h2>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-[#F36F2E] hover:bg-[#E05C2B] text-white py-2 px-4 rounded-md text-sm transition-colors"
            >
              Create New Role
            </button>
          </div>
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
                      className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F36F2E] focus:border-transparent h-auto min-h-[42px]"
                      value={""} // Controlled component, reset value after selection
                    >
                      <option value="" disabled hidden>None</option>
                      {availableStaffs.map((staff) => (
                        // Only show staff not yet selected
                        !selectedStaffs.includes(staff.id) && (
                          <option key={staff.id} value={staff.id}>
                            {staff.name}
                          </option>
                        )
                      ))}
                    </select>
                    {selectedStaffs.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-700">Selected Staff:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedStaffs.map((id) => {
                            const staff = availableStaffs.find((s) => s.id === id);
                            return (
                              <span key={id} className="inline-flex items-center text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                {staff ? staff.name : id}
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
                      className="px-3 py-2 sm:px-4 sm:py-2 bg-[#F36F2E] text-white rounded-md hover:bg-[#E05C2B] transition-colors text-sm"
                    >
                      Create Role
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
