"use client";

import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../utility/Sidebar";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  fullName: string;
  country: string;
  company: string;
  address: string;
  email: string;
  contact: string;
  state: string;
  city: string;
  action: string;
  dateAdded: string;
}

interface NewClient {
  fullName: string;
  country: string;
  company: string;
  address: string;
  email: string;
  contact: string;
  state: string;
  city: string;
}

const ClientList = () => {
  const router = useRouter();
 
  const [users, setUsers] = useState<User[]>([
    {
      id: "01",
      fullName: "Ashley",
      country: "Nigeria",
      company: "RHR",
      address: "bambari",
      email: "Admin@admin.com",
      contact: "0888888888",
      state: "FCT",
      city: "Abj",
      dateAdded: "Q2 - Q4 - 2023",
      action: "Active",
    },
    {
      id: "02",
      fullName: "John Doe",
      country: "USA",
      company: "Acme Corp",
      address: "123 Main St",
      email: "john.doe@example.com",
      contact: "123-456-7890",
      state: "CA",
      city: "San Francisco",
      dateAdded: "Q1 - Q3 - 2024",
      action: "Inactive",
    },
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newClient, setNewClient] = useState<NewClient>({
    fullName: "",
    country: "",
    company: "",
    address: "",
    email: "",
    contact: "",
    state: "",
    city: "",
  });

  // Action menu state
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [selectedUserForAction, setSelectedUserForAction] = useState<User | null>(null);

  // Deactivation flow states
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showDeactivateForm, setShowDeactivateForm] = useState(false);
  const [deactivationReason, setDeactivationReason] = useState({
    title: "",
    message: "",
  });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewClient({ ...newClient, [name]: value });
  };

  const handleDeactivationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDeactivationReason({ ...deactivationReason, [name]: value });
  };

  const handleCreateUser = () => {
    // Here you would typically send data to an API
    setShowCreateModal(false);
    setShowSuccessModal(true);
    // Reset form
    setNewClient({
      fullName: "",
      country: "",
      company: "",
      address: "",
      email: "",
      contact: "",
      state: "",
      city: "",
    });
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

  const handleViewUser = (user: User) => {
    console.log("Viewing user:", user);
    closeActionMenu();
    // Implement your view logic here, e.g., open a modal or navigate to a details page
  };
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const actionButtonRefs = useRef<{[key: string]: HTMLButtonElement | null}>({});

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        closeActionMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
 // View User Modal State
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewedUser, setViewedUser] = useState<User | null>(null);

  const openActionMenu = (user: User, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setSelectedUserForAction(user);
    setIsActionMenuOpen(true);
    
    // Store the button reference
    if (user.id) {
      actionButtonRefs.current[user.id] = event.currentTarget;
    }
  };

  // Calculate position for the popup
  const getPopupPosition = () => {
    if (!selectedUserForAction?.id || !actionButtonRefs.current[selectedUserForAction.id]) {
      return { top: 0, left: 0 };
    }

    const button = actionButtonRefs.current[selectedUserForAction.id];
    if (!button) return { top: 0, left: 0 };

    const rect = button.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY,
      left: rect.right + window.scrollX - 130, // Adjust 130 to match your popup width
    };
  };
  const handleDeleteUser = (userId: string) => {
    console.log("Deleting user:", userId);
    setUsers(users.filter((user) => user.id !== userId));
    closeActionMenu();
    // Implement your delete logic here, e.g., show a confirmation modal and then call an API
  };

  const handleConfirmDeactivate = () => {
    setShowDeactivateConfirm(false);
    setShowDeactivateForm(true);
  };

  const handleSubmitDeactivation = () => {
    // Update user status
    if (selectedUserId) {
      setUsers(
        users.map((user) =>
          user.id === selectedUserId ? { ...user, action: "Inactive" } : user
        )
      );
    }

    // Show success message
    setShowDeactivateForm(false);
    setShowSuccessModal(true);

    // Reset form
    setDeactivationReason({
      title: "",
      message: "",
    });
  };

  const openViewModal = (user: User) => {
    setViewedUser(user);
    setShowViewModal(true);
    closeActionMenu();
  };
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-4 md:p-6 mt-16 md:mt-0 overflow-x-hidden">
        <div className="mb-6">
          <h1 className="text-[#363636] text-xl md:text-2xl font-bold">
            Hi, Olayimmika
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            June 18th 2023 - 08:34 am
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-[#363636] text-lg md:text-xl font-semibold">
            Admin
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2 sm:gap-4">
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
                Upload
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S/N
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fullname
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Company name
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Address
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    State
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    City
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Added
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={user.id} className="relative">
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {user.fullName}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {user.country}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 truncate max-w-[120px] hidden sm:table-cell">
                      {user.company}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 hidden md:table-cell">
                      {user.address}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 hidden md:table-cell">
                      {user.email}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 hidden md:table-cell">
                      {user.contact}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 hidden lg:table-cell">
                      {user.state}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 hidden lg:table-cell">
                      {user.city}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 hidden lg:table-cell">
                      {user.dateAdded}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 relative">
                    <button
        ref={el => {
          if (user.id) actionButtonRefs.current[user.id] = el;
        }}
        className="focus:outline-none"
        onClick={(e) => openActionMenu(user, e)}
      >
        <img
          src="/Users/action.svg"
          alt="Dropdown Icon"
          className="w-4 h-4 md:w-5 md:h-5"
        />
      </button>
      {isActionMenuOpen && selectedUserForAction?.id === user.id && (
        <div
          ref={actionMenuRef}
          className="fixed z-50 bg-white rounded-md shadow-lg"
          style={{
            top: `${getPopupPosition().top}px`,
            left: `${getPopupPosition().left}px`,
          }}
        >
          <div className="py-1">
          <button
                            onClick={() => openViewModal(user)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                          >
                            View
                          </button>
            <button
              onClick={() => handleDeleteUser(user.id)}
              className="block px-4 py-2 text-sm text-gray-700 border-gray-700 text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
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
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg text-black font-semibold">Create New Client</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-500 hover:text-gray-700"
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
                      value={newClient.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter Full name"
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="email"
                      name="email"
                      value={newClient.country}
                      onChange={handleInputChange}
                      placeholder="Enter Email"
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      type="tel"
                      name="phone"
                      value={newClient.company}
                      onChange={handleInputChange}
                      placeholder="Enter Company Name"
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      name="fullName"
                      value={newClient.address}
                      onChange={handleInputChange}
                      placeholder="Enter Company Address"
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="text"
                      name="fullName"
                      value={newClient.email}
                      onChange={handleInputChange}
                      placeholder="Enter Company Email"
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="fullName"
                      value={newClient.contact}
                      onChange={handleInputChange}
                      placeholder="Enter Phone Number"
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      name="fullName"
                      value={newClient.state}
                      onChange={handleInputChange}
                      placeholder="Enter State"
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="fullName"
                      value={newClient.city}
                      onChange={handleInputChange}
                      placeholder="Enter City"
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>
                 

                  <button
                    onClick={handleCreateUser}
                    className="w-full bg-[#F36F2E] text-white py-2 px-4 rounded-md hover:bg-[#E05C2B] transition-colors"
                  >
                    Create Client
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
                  <h3 className="text-lg font-semibold">Lorem ipsum dolor sit amet consectetur.</h3>
                  <p className="text-gray-600 mt-2">
                    Lectus neque ut vestibulum molestie tincidunt.
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
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
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
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-center">
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
          <div className="col-span-2 flex md:flex-row gap-4 flex-col justify-end">
          <Link href="/NewAccount"
      className="bg-white text-orange-500 border-1 border-orange-500  rounded-md py-2 px-4 text-sm font-medium focus:outline-none focus:shadow-outline-orange active:bg-orange-700"
    >
      Create Bank Account
    </Link>
            <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-md py-2 px-4 text-sm font-medium focus:outline-none focus:shadow-outline-orange active:bg-orange-700">
              Edit Changes
            </button>
          </div>
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

export default ClientList;