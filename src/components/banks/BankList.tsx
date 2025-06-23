"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "../utility/Sidebar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import WordEditor from "../utility/TextEditor";

interface User {
  id: string;
  bankName: string;
  email: string;
  swift: string;
  officer: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  phone: string;
  fax: string;
  dateAdded: string;
  action: string;
  report?: string | null;
}

interface NewBank {
  bankName: string;
  email: string;
  officer: string;
  swift: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  phone: string;
  fax: string;
}

interface Bank {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
}


const BankList = () => {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([
    {
      id: "01",
      bankName: "Ashley",
      email: "Nigeria",
      officer: "RHR",
      swift: "222",
      street: "bambari",
      city: "Admin@admin.com",
      state: "0888888888",
      country: "FCT",
      zip: "Abj",
      phone: "08122222222",
      fax: "123",
      dateAdded: "Q2 - Q4 - 2023",
      action: "Active",
      report: null,
    },
    {
      id: "02",
      bankName: "Ashley",
      email: "Nigeria",
      officer: "RHR",
      swift: "222",
      street: "bambari",
      city: "Admin@admin.com",
      state: "0888888888",
      country: "FCT",
      zip: "Abj",
      phone: "08122222222",
      fax: "123",
      dateAdded: "Q2 - Q4 - 2023",
      action: "Active",
      report: null,
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newBank, setNewBank] = useState<NewBank>({
    bankName: "",
    email: "",
    officer: "",
    swift: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    phone: "",
    fax: "",
  });

  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [selectedUserForAction, setSelectedUserForAction] = useState<User | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingUser, setReportingUser] = useState<User | null>(null);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showDeactivateForm, setShowDeactivateForm] = useState(false);
  const [deactivationReason, setDeactivationReason] = useState({
    title: "",
    message: "",
  });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewedUser, setViewedUser] = useState<User | null>(null);

  const actionMenuRef = useRef<HTMLDivElement>(null);
  const actionButtonRefs = useRef<{[key: string]: HTMLButtonElement | null}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewBank({ ...newBank, [name]: value });
  };

  const handleDeactivationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDeactivationReason({ ...deactivationReason, [name]: value });
  };

  const handleCreateUser = () => {
    setShowCreateModal(false);
    setShowSuccessModal(true);
    setNewBank({
      bankName: "",
      email: "",
      officer: "",
      swift: "",
      street: "",
      city: "",
      state: "",
      country: "",
      zip: "",
      phone: "",
      fax: "",
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
  };

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

  const openActionMenu = (user: User, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setSelectedUserForAction(user);
    setIsActionMenuOpen(true);

    if (user.id) {
      actionButtonRefs.current[user.id] = event.currentTarget;
    }
  };

  const getPopupPosition = () => {
    if (!selectedUserForAction?.id || !actionButtonRefs.current[selectedUserForAction.id]) {
      return { top: 0, left: 0 };
    }

    const button = actionButtonRefs.current[selectedUserForAction.id];
    if (!button) return { top: 0, left: 0 };

    const rect = button.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY,
      left: rect.right + window.scrollX - 130,
    };
  };

  const handleDeleteUser = (userId: string) => {
    console.log("Deleting user:", userId);
    setUsers(users.filter((user) => user.id !== userId));
    closeActionMenu();
  };

  const handleConfirmDeactivate = () => {
    setShowDeactivateConfirm(false);
    setShowDeactivateForm(true);
  };

  const handleSubmitDeactivation = () => {
    if (selectedUserId) {
      setUsers(
        users.map((user) =>
          user.id === selectedUserId ? { ...user, action: "Inactive" } : user
        )
      );
    }

    setShowDeactivateForm(false);
    setShowSuccessModal(true);
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

  const handleCreateReportClick = (user: User) => {
    setReportingUser(user);
    setShowReportModal(true);
    closeActionMenu();
  };

  const handleSaveReport = (fileName: string, content: string) => {
    if (reportingUser) {
      setUsers(users.map(u =>
        u.id === reportingUser.id ? { ...u, report: fileName } : u
      ));
      setShowReportModal(false);
      setReportingUser(null);
    }
  };

  const handleViewReportClick = (user: User) => {
    if (user.report) {
      alert(`Opening/displaying report: ${user.report}`);
    } else {
      alert("No report available.");
    }
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
            Banks
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
                Create Bank
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
                    Bank Name
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Address
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account Officer
                  </th> 
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Swift Code
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Street
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    State
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zip Code
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telephone
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fax No.
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
                      {user.bankName}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 truncate max-w-[120px]">
                      {user.officer}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {user.swift}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {user.street}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {user.city}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {user.state}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {user.country}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {user.zip}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {user.phone}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {user.fax}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
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
                              View Bank Details
                            </button>
                            {user.report ? (
                              <button
                                onClick={() => handleViewReportClick(user)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                              >
                                View Report
                              </button>
                            ) : (
                              <button
                                onClick={() => handleCreateReportClick(user)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                Create Report
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="block px-4 py-2 text-sm text-gray-700 border-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
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

          {showCreateModal && (
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg text-black font-semibold">Create New Bank</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-150px)]">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                    <input
                      type="text"
                      name="bankName"
                      value={newBank.bankName}
                      onChange={handleInputChange}
                      placeholder="Enter Bank Name"
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="text"
                      name="email"
                      value={newBank.email}
                      onChange={handleInputChange}
                      placeholder="Enter Email"
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Officer</label>
                    <input
                      type="text"
                      name="officer"
                      value={newBank.officer}
                      onChange={handleInputChange}
                      placeholder="Enter Account Officer"
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Swift Code</label>
                    <input
                      type="text"
                      name="swift"
                      value={newBank.swift}
                      onChange={handleInputChange}
                      placeholder="Enter Swift Code"
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={newBank.phone}
                      onChange={handleInputChange}
                      placeholder="Enter Phone Number"
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                    <input
                      type="text"
                      name="street"
                      value={newBank.street}
                      onChange={handleInputChange}
                      placeholder="Enter Street"
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={newBank.city}
                      onChange={handleInputChange}
                      placeholder="Enter City"
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={newBank.state}
                      onChange={handleInputChange}
                      placeholder="Enter State"
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={newBank.country}
                      onChange={handleInputChange}
                      placeholder="Enter Country"
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                    <input
                      type="text"
                      name="zip"
                      value={newBank.zip}
                      onChange={handleInputChange}
                      placeholder="Enter Zip Code"
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fax</label>
                    <input
                      type="text"
                      name="fax"
                      value={newBank.fax}
                      onChange={handleInputChange}
                      placeholder="Enter Fax"
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>

                  <button
                    onClick={handleCreateUser}
                    className="w-full bg-[#F36F2E] text-white py-2 px-4 rounded-md hover:bg-[#E05C2B] transition-colors"
                  >
                    Create Bank
                  </button>
                </div>
              </div>
            </div>
          )}

          {showReportModal && reportingUser && (
            <WordEditor 
              onSave={handleSaveReport}
              onClose={() => {
                setShowReportModal(false);
                setReportingUser(null);
              }}
              user={{
                firstName: reportingUser.bankName,
                lastName: "",
                companyName: "",
                email: reportingUser.email,
                phone: reportingUser.phone,
                address: reportingUser.street,
                city: reportingUser.city,
                state: reportingUser.state,
                country: reportingUser.country
              }}
            />
          )}

          {showDeactivateConfirm && (
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
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
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-center">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg></button>
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
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
    <div className="bg-gray-50 p-6 rounded-md shadow-md w-full max-w-2xl max-h-[90vh] overflow-y-auto"> {/* Added max-h-[90vh] and overflow-y-auto */}
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-orange-200 flex items-center justify-center overflow-hidden">
                        {/* Replace with actual bank logo or icon */}
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
                    <h3 className="text-lg font-semibold text-gray-800">Bank Name Here</h3>
                    <p className="text-sm text-gray-500">bank.email@example.com</p>
                </div>
            </div>
            <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <svg className="h-6 w-6 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
        </div>

        <div className="mb-6 p-4 bg-white rounded-md border border-gray-200">
            <div className="md:grid md:grid-cols-2 md:items-start md:gap-6 mb-4">
                <div>
                    <h4 className="text-sm font-semibold text-gray-700">Bank Details</h4>
                </div>
                <p className="text-xs text-gray-500 md:mt-1">Review and update the essential information for your bank profile.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="bankName" className="block text-xs font-medium text-gray-600 mb-1">Bank Name</label>
                    <input type="text" id="bankName" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value="Example National Bank" readOnly />
                </div>
                <div>
                    <label htmlFor="accountOfficer" className="block text-xs font-medium text-gray-600 mb-1">Account Officer</label>
                    <input type="text" id="accountOfficer" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value="Jane Doe" readOnly />
                </div>
                <div className="col-span-2">
                    <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
                    <input type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value="bank.email@example.com" readOnly />
                </div>
                <div>
                    <label htmlFor="swiftCode" className="block text-xs font-medium text-gray-600 mb-1">SWIFT Code</label>
                    <input type="text" id="swiftCode" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value="EXAMPLEBANK" readOnly />
                </div>
                <div>
                    <label htmlFor="telephone" className="block text-xs font-medium text-gray-600 mb-1">Telephone</label>
                    <input type="tel" id="telephone" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value="+1234567890" readOnly />
                </div>
                <div className="col-span-2">
                    <label htmlFor="street" className="block text-xs font-medium text-gray-600 mb-1">Street Address</label>
                    <input type="text" id="street" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value="123 Bank Street" readOnly />
                </div>
                <div>
                    <label htmlFor="city" className="block text-xs font-medium text-gray-600 mb-1">City</label>
                    <input type="text" id="city" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value="Bankville" readOnly />
                </div>
                <div>
                    <label htmlFor="state" className="block text-xs font-medium text-gray-600 mb-1">State/Province</label>
                    <input type="text" id="state" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value="Bankington" readOnly />
                </div>
                <div>
                    <label htmlFor="zipCode" className="block text-xs font-medium text-gray-600 mb-1">Zip Code</label>
                    <input type="text" id="zipCode" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value="12345" readOnly />
                </div>
                <div>
                    <label htmlFor="country" className="block text-xs font-medium text-gray-600 mb-1">Country</label>
                    <input type="text" id="country" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value="USA" readOnly />
                </div>
                 <div>
                    <label htmlFor="fax" className="block text-xs font-medium text-gray-600 mb-1">Fax</label>
                    <input type="tel" id="fax" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" value="+1234567891" readOnly />
                </div>
                <div className="col-span-2 flex md:flex-row gap-4 flex-col justify-end">
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

export default BankList;