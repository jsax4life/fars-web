"use client";

import React, { use, useEffect, useRef, useState } from "react";
import Sidebar from "../utility/Sidebar";
import { useRouter } from "next/navigation";
import { useUsers } from "@/hooks/useUsers";
import { useUserAuth } from "@/hooks/useUserAuth";
import { User } from "@/types";
import { formatRole } from "@/lib/utils";

interface NewAdmin {
  fullName: string;
  email: string;
  phone: string;
  role: string;
}

const UserList = () => {
  const router = useRouter();
  const { getUsers, updateUser } = useUsers()
  const { user } = useUserAuth()
  const [role, setRole] = useState('staff');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false)

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState<NewAdmin>({
    fullName: "",
    email: "",
    phone: "",
    role: "Admin",
  });

  // Deactivation flow states
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showDeactivateForm, setShowDeactivateForm] = useState(false);
  const [deactivationReason, setDeactivationReason] = useState({
    title: "",
    message: "",
  });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Action menu state
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [selectedUserForAction, setSelectedUserForAction] = useState<User | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const actionButtonRef = useRef<HTMLButtonElement>(null);

  // View User Modal State
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewedUser, setViewedUser] = useState<User | null>(null);

  // Edit User Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
  });

  const fetchUsers = async () => {
    setLoading(true)
    const users = await getUsers(role.toUpperCase())
    if (users) {
      setUsers(users)
    } else {
      setUsers([])
    }
    setLoading(false)
  }
  useEffect(() => {
    fetchUsers()
  }, [role])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node) &&
        actionButtonRef.current && !actionButtonRef.current.contains(event.target as Node)) {
        setIsActionMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRoleChange = (userId: string, newRole: string) => {
    setLoading(true)
    updateUser(userId, { role: newRole.toUpperCase() }).then(() => {
      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ));
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAdmin({ ...newAdmin, [name]: value });
  };

  const handleDeactivationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDeactivationReason({ ...deactivationReason, [name]: value });
  };

  const openActionMenu = (user: User, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setSelectedUserForAction(user);
    setIsActionMenuOpen(true);
  };

  const closeActionMenu = () => {
    setIsActionMenuOpen(false);
    setSelectedUserForAction(null);
  };

  const handleDeactivateUser = (userId: string) => {
    setSelectedUserId(userId);
    setShowDeactivateConfirm(true);
    closeActionMenu();
  };

  const handleDeleteUser = (userId: string) => {
    console.log("Deleting user:", userId);
    setUsers(users.filter(user => user.id !== userId));
    closeActionMenu();
  };

  const openViewModal = (user: User) => {
    setViewedUser(user);
    setShowViewModal(true);
    closeActionMenu();
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewedUser(null);
  };

  const openEditModal = (user: User) => {
    setEditedUser(user);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
    });
    setShowEditModal(true);
    closeActionMenu();
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditedUser(null);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSaveEdit = () => {
    if (editedUser) {
      const updatedUsers = users.map(user =>
        user.id === editedUser.id
          ? { ...user, ...editFormData }
          : user
      );
      setUsers(updatedUsers);
      closeEditModal();
      setShowSuccessModal(true); // Optionally show a success message
    }
  };

  const handleCreateUser = () => {
    setShowCreateModal(false);
    setShowSuccessModal(true);
    setNewAdmin({
      fullName: "",
      email: "",
      phone: "",
      role: "Admin",
    });
  };

  const handleConfirmDeactivate = () => {
    setShowDeactivateConfirm(false);
    setShowDeactivateForm(true);
  };

  const handleSubmitDeactivation = () => {
    if (selectedUserId) {
      setUsers(users.map(user =>
        user.id === selectedUserId ? { ...user, isActive: false } : user
      ));
    }
    setShowDeactivateForm(false);
    setShowSuccessModal(true);
    setDeactivationReason({
      title: "",
      message: "",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#2E2D2D] to-[#2E2D2D]/90">
          <img src="/loader.gif" alt="Loading..." className="h-20 w-20" />
        </div>
      )}
      <div className="flex-1 p-4 md:p-6 mt-16 md:mt-0 overflow-x-hidden">
        <div className="mb-6">
          <h1 className="text-[#363636] text-xl md:text-2xl font-bold">
            Hi, {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            {new Date().toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-[#363636] text-lg md:text-xl font-semibold">
            {formatRole(user?.role)}
          </h2>
        </div>

        <div className="bg-white rounded-lg w-full shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2 sm:gap-4">
              <div className="relative w-full sm:w-auto">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500 text-sm w-full">
                  <option value={'admin'}>Admin</option>
                  <option value={'super_admin'}>Super Admin</option>
                  <option value={'staff'}>Staff</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-[#F36F2E] text-sm w-full"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2 sm:gap-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#F36F2E] hover:bg-[#F36F2E] text-white py-2 px-4 rounded text-sm w-full sm:w-auto"
              >
                Create User
              </button>
              <button
                onClick={() => router.push("/RoleList")}
                className="bg-[#fff] hover:bg-gray-300 text-[#F36F2E] border-[#F36F2E] border-2 py-2 px-4 rounded text-sm w-full sm:w-auto"
              >
                View Roles
              </button>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[500px]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S/N
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Photo
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full name
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Email
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Phone
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Date Added
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 z-1000">
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      <img
                        src={user.avatarUrl}
                        width={30}
                        height={30}
                        alt={`${user.firstName} ${user.lastName}`}
                      />
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 truncate max-w-[120px] hidden sm:table-cell">
                      {user.email}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 hidden md:table-cell">
                      {user.phone || 'N/A'}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      <div className="relative">
                        <select
                          value={user.role.toLocaleLowerCase()}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="block appearance-none bg-white border border-gray-300 text-gray-700 py-1 px-2 pr-6 rounded leading-tight focus:outline-none focus:border-[#F36F2E] text-xs md:text-sm"
                        >
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                      ${user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {user.isActive ? 'Active' : 'In Active'}
                      </span>
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 hidden lg:table-cell">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 relative">
                      <button
                        ref={actionButtonRef}
                        className="focus:outline-none"
                        onClick={(e) => openActionMenu(user, e)}
                      >
                        <img
                          src="/Users/action.svg"
                          alt="Dropdown Icon"
                          className="w-4 h-4 md:w-5 md:h-5"
                        />
                      </button>

                      {/* Action Popup */}
                      {isActionMenuOpen && selectedUserForAction?.id === user.id && (
                        <div
                          ref={actionMenuRef}
                          className="absolute right-0 z-5000 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                        >
                          <div className="py-1">
                            <button
                              onClick={() => openViewModal(user)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                            >
                              View
                            </button>
                            <button
                              onClick={() => openEditModal(user)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeactivateUser(user.id)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                            >
                              Deactivate
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left focus:outline-none"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          <div className="px-4 py-3 bg-white border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">10</span> of{" "}
              <span className="font-medium">38</span> entries
            </div>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>

          {/* Create User Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg text-black font-semibold">Create New Admin</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-black hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={newAdmin.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter Admin Full name"
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={newAdmin.email}
                      onChange={handleInputChange}
                      placeholder="Enter Admin Email"
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={newAdmin.phone}
                      onChange={handleInputChange}
                      placeholder="Enter Admin Phone Number"
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      name="role"
                      value={newAdmin.role}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    >
                      <option value="Admin">Admin</option>
                      <option value="User">User</option>
                      <option value="Editor">Editor</option>
                    </select>
                  </div>

                  <button
                    onClick={handleCreateUser}
                    className="w-full bg-[#F36F2E] text-white py-2 px-4 rounded-md hover:bg-[#E05C2B] transition-colors"
                  >
                    Create User
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Deactivate Confirmation Modal */}
          {showDeactivateConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Confirm Deactivation</h3>
                  <p className="text-gray-600 mt-2">
                    Are you sure you want to deactivate this user?
                  </p>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setShowDeactivateConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDeactivate}
                    className="px-4 py-2 bg-[#F36F2E] text-white rounded-md text-sm font-medium hover:bg-[#E05C2B]"
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Deactivation Reason Form */}
          {showDeactivateForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">Deactivation Reason</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason Title</label>
                    <input
                      type="text"
                      name="title"
                      value={deactivationReason.title}
                      onChange={handleDeactivationInputChange}
                      placeholder="Enter Reason Title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      name="message"
                      value={deactivationReason.message}
                      onChange={handleDeactivationInputChange}
                      placeholder="Enter Message Here"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex justify-end space-x-4">
                    <button
                      onClick={() => setShowDeactivateForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitDeactivation}
                      className="px-4 py-2 bg-[#F36F2E] text-white rounded-md text-sm font-medium hover:bg-[#E05C2B]"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Modal */}
          {showSuccessModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-md text-center">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-green-600">Successful</h3>
                  <p className="text-gray-600 mt-2">
                    Lorem ipsum dolor sit amet consectetur. Tellus pulvinar cras sed
                    posuere duis. Velit euismod quis sed ut quis.
                  </p>
                </div>

                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="bg-[#F36F2E] text-white py-2 px-6 rounded-md hover:bg-[#E05C2B] transition-colors"
                >
                  Ok
                </button>
              </div>
            </div>
          )}

          {showViewModal && viewedUser && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
              <div className="bg-gray-50 p-6 rounded-md shadow-md w-full max-w-2xl"> {/* Increased max-w */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-orange-200 flex items-center justify-center overflow-hidden">
                        {/* Replace with actual user image */}
                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-orange-700">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.125h15.002M9.75 21.75l-3 1.5-3-1.5m9.75 0l3 1.5 3-1.5M9.375 6a9.375 9.375 0 0116.875-3.75m-16.875 3.75l1.5-7.5m15-7.5l-1.5 7.5m-15 6.75a2.25 2.25 0 002.25 2.25m13.5 0a2.25 2.25 0 002.25-2.25m-16.5 0a2.25 2.25 0 012.25-2.25m13.5 0a2.25 2.25 0 012.25 2.25" />
                        </svg> */}
                        <img src={viewedUser.avatarUrl} alt="User Avatar" className="absolute inset-0 w-full h-full object-cover rounded-full" />
                      </div>
                      <button className="absolute bottom-0 right-0 bg-white rounded-full shadow-sm p-1 text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l-6.585 6.585a2.121 2.121 0 00-1.414.615l-1.93-1.93a2.121 2.121 0 00-.615-1.414l6.585-6.585a2.121 2.121 0 003 0 2.121 2.121 0 000 3zM12 17.768h.008v.008H12v-.008z" />
                        </svg>
                      </button>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">{viewedUser.firstName} {viewedUser.lastName}</h3>
                      <p className="text-sm text-gray-500">{viewedUser.email}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                    <svg className="h-6 w-6 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                  </button>
                </div>

                <div className="mb-6 p-4 bg-white rounded-md border border-gray-200">
                  <div className="md:grid md:grid-cols-2 md:items-start md:gap-6 mb-4"> {/* Flex layout for label and text */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700">Update Personal Details</h4>
                    </div>
                    <p className="text-xs text-gray-500 md:mt-1">Lorem ipsum dolor sit amet consectetur. Purus odio porttitor dignissim orci non odio porttitor dignissim orci non purus purus. Nunc nisl ut</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstname" className="block text-xs font-medium text-gray-600 mb-1">Firstname</label>
                      <input type="text" id="firstname" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value={viewedUser.firstName} readOnly />
                    </div>
                    <div>
                      <label htmlFor="lastname" className="block text-xs font-medium text-gray-600 mb-1">Lastname</label>
                      <input type="text" id="lastname" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value={viewedUser.lastName} readOnly />
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
                      <input type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value={viewedUser.email} readOnly />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs font-medium text-gray-600 mb-1">Phone Number</label>
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <div className="px-3 py-2 bg-gray-100 text-sm text-gray-700 rounded-l-md">
                          <select className="focus:outline-none">
                            <option>🇳🇬</option>
                            {/* Add more country codes */}
                          </select>
                        </div>
                        <input type="tel" id="phone" className="w-full px-3 py-2 text-sm text-gray-700 focus:outline-none" value={viewedUser.phone} readOnly />
                      </div>
                    </div>

                  </div>
                </div>

                <div className="p-4 bg-white rounded-md border border-gray-200">
                  <div className="md:grid md:grid-cols-2 md:items-start md:gap-6 mb-4"> {/* Flex layout for label and text */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-4">Password</h4>
                    </div>
                    <div className="text-xs text-gray-500 md:mt-1">Lorem ipsum dolor sit amet consectetur. Purus odio porttitor dignissim orci non odio porttitor dignissim orci non purus purus. Nunc nisl ut</div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="old-password" className="block text-xs font-medium text-gray-600 mb-1">Old Password</label>
                      <div className="relative">
                        <input type="password" id="old-password" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value="********" readOnly />
                        <button className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7 1.274 4.057 1.274 8.057 0 12-1.274 4.057-5.064 7-9.542 7-4.476 0-8.268-2.943-9.542-7 0-4.057 0-8.057 0-12z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="new-password" className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
                      <div className="relative">
                        <input type="password" id="new-password" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value="********" readOnly />
                        <button className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7 1.274 4.057 1.274 8.057 0 12-1.274 4.057-5.064 7-9.542 7-4.476 0-8.268-2.943-9.542-7 0-4.057 0-8.057 0-12z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                  </div>
                  <div className="mt-4 flex justify-end">
                    <button onClick={() => setShowViewModal(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md py-2 px-4 text-sm font-medium focus:outline-none focus:shadow-outline-gray active:bg-gray-500">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Edit User Modal */}
          {showEditModal && editedUser && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
              <div className="bg-gray-50 p-6 rounded-md shadow-md w-full max-w-2xl"> {/* Increased max-w */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-orange-200 flex items-center justify-center overflow-hidden">
                        {/* Replace with actual user image */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-orange-700">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.125h15.002M9.75 21.75l-3 1.5-3-1.5m9.75 0l3 1.5 3-1.5M9.375 6a9.375 9.375 0 0116.875-3.75m-16.875 3.75l1.5-7.5m15-7.5l-1.5 7.5m-15 6.75a2.25 2.25 0 002.25 2.25m13.5 0a2.25 2.25 0 002.25-2.25m-16.5 0a2.25 2.25 0 012.25-2.25m13.5 0a2.25 2.25 0 012.25 2.25" />
                        </svg>
                      </div>
                      <button className="absolute bottom-0 right-0 bg-white rounded-full shadow-sm p-1 text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l-6.585 6.585a2.121 2.121 0 00-1.414.615l-1.93-1.93a2.121 2.121 0 00-.615-1.414l6.585-6.585a2.121 2.121 0 003 0 2.121 2.121 0 000 3zM12 17.768h.008v.008H12v-.008z" />
                        </svg>
                      </button>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">Olayimika Oluwasegun</h3>
                      <p className="text-sm text-gray-500">olayimikaoluwasegun@gmail.com</p>
                    </div>
                  </div>
                  <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                    <svg className="h-6 w-6 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                  </button>
                </div>

                <div className="mb-6 p-4 bg-white rounded-md border border-gray-200">
                  <div className="md:grid md:grid-cols-2 md:items-start md:gap-6 mb-4"> {/* Flex layout for label and text */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700">Update Personal Details</h4>
                    </div>
                    <p className="text-xs text-gray-500 md:mt-1">Lorem ipsum dolor sit amet consectetur. Purus odio porttitor dignissim orci non odio porttitor dignissim orci non purus purus. Nunc nisl ut</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstname" className="block text-xs font-medium text-gray-600 mb-1">Firstname</label>
                      <input type="text" id="firstname" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value="Olayimika" readOnly />
                    </div>
                    <div>
                      <label htmlFor="lastname" className="block text-xs font-medium text-gray-600 mb-1">Lastname</label>
                      <input type="text" id="lastname" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value="Segun" readOnly />
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
                      <input type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value="olayimikaoluwasegun@gmail.com" readOnly />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs font-medium text-gray-600 mb-1">Phone Number</label>
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <div className="px-3 py-2 bg-gray-100 text-sm text-gray-700 rounded-l-md">
                          <select className="focus:outline-none">
                            <option>🇳🇬</option>
                            {/* Add more country codes */}
                          </select>
                        </div>
                        <input type="tel" id="phone" className="w-full px-3 py-2 text-sm text-gray-700 focus:outline-none" value="08101831001" readOnly />
                      </div>
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-md py-2 px-4 text-sm font-medium focus:outline-none focus:shadow-outline-orange active:bg-orange-700">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-md border border-gray-200">
                  <div className="md:grid md:grid-cols-2 md:items-start md:gap-6 mb-4"> {/* Flex layout for label and text */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-4">Password</h4>
                    </div>
                    <div className="text-xs text-gray-500 md:mt-1">Lorem ipsum dolor sit amet consectetur. Purus odio porttitor dignissim orci non odio porttitor dignissim orci non purus purus. Nunc nisl ut</div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="old-password" className="block text-xs font-medium text-gray-600 mb-1">Old Password</label>
                      <div className="relative">
                        <input type="password" id="old-password" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value="********" readOnly />
                        <button className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7 1.274 4.057 1.274 8.057 0 12-1.274 4.057-5.064 7-9.542 7-4.476 0-8.268-2.943-9.542-7 0-4.057 0-8.057 0-12z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="new-password" className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
                      <div className="relative">
                        <input type="password" id="new-password" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value="********" readOnly />
                        <button className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7 1.274 4.057 1.274 8.057 0 12-1.274 4.057-5.064 7-9.542 7-4.476 0-8.268-2.943-9.542-7 0-4.057 0-8.057 0-12z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-md py-2 px-4 text-sm font-medium focus:outline-none focus:shadow-outline-orange active:bg-orange-700">
                        Change Password
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button onClick={() => setShowEditModal(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md py-2 px-4 text-sm font-medium focus:outline-none focus:shadow-outline-gray active:bg-gray-500">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserList;