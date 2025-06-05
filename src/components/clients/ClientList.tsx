"use client";

import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../utility/Sidebar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useClients } from "@/hooks/useClient";
import { useUserAuth } from "@/hooks/useUserAuth";
import { paginateItems } from "@/lib/utils";

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  country: string;
  companyName: string;
  address: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface NewClient {
  fullName: string;
  country: string;
  // password: string;
  company: string;
  address: string;
  email: string;
  contact: string;
  state: string;
  city: string;
}

const ClientList = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { getClients, createClient, updateClient, deleteClient } = useClients()
  const { user } = useUserAuth()
  const [users, setUsers] = useState<Client[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [newClient, setNewClient] = useState<NewClient>({
    fullName: "",
    country: "",
    // password: "",
    company: "",
    address: "",
    email: "",
    contact: "",
    state: "",
    city: "",
  });

  // Action menu state
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [selectedUserForAction, setSelectedUserForAction] = useState<Client | null>(null);

  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportContent, setReportContent] = useState("");
  const [reportingUser, setReportingUser] = useState<Client | null>(null);

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

  const handleCreateUser = async () => {
    // Here you would typically send data to an API
    setIsLoading(true);
    await createClient({
      firstName: newClient.fullName.split(" ")[0],
      lastName: newClient.fullName.split(" ")[1] || "",
      country: newClient.country,
      companyName: newClient.company,
      address: newClient.address,
      email: newClient.email,
      phone: newClient.contact,
      state: newClient.state,
      city: newClient.city,
    }).then((response) => {
        if (response) {
          setUsers([...users, response]);
          setShowCreateModal(false);
          setShowSuccessModal(true);
        } else {
          console.error("Failed to create client");
        }
      })
      .catch((error) => {
        console.error("Error creating client:", error);
      })
      .finally(() => {
        setIsLoading(false);
         // Reset form
    setNewClient({
      fullName: "",
      country: "",
      // password: "",
      company: "",
      address: "",
      email: "",
      contact: "",
      state: "",
      city: "",
    });
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

  const handleViewUser = (user: Client) => {
    console.log("Viewing user:", user);
    closeActionMenu();
    // Implement your view logic here, e.g., open a modal or navigate to a details page
  };
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const actionButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

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
  const [viewedUser, setViewedUser] = useState<Client | null>(null);

  const openActionMenu = (user: Client, event: React.MouseEvent<HTMLButtonElement>) => {
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

  const openViewModal = (user: Client) => {
    setViewedUser(user);
    setShowViewModal(true);
    closeActionMenu();
  };

  const handleCreateReportClick = (user: Client) => {
    setReportingUser(user);
    setShowReportModal(true);
    closeActionMenu();
  };

  const handleSaveReport = () => {
    if (reportingUser) {
      setUsers(users.map(u =>
        u.id === reportingUser.id ? { ...u, report: `report_${reportingUser.firstName.replace(/\s+/g, '_').toLowerCase()}.docx` } : u
      ));
      setShowReportModal(false);
      setReportContent("");
      setReportingUser(null);
    }
  };

  const handleViewReportClick = (user: Client) => {
    // In a real application, you would fetch and display the report content
    // console.log("Viewing report for:", user.firstName, user.report);
    // For now, let's just open a new tab or show a modal with a message
    // if (user.report) {
    //   alert(`Opening/displaying report: ${user.report}`);
    //   // You might use window.open or a modal here to display/edit the report
    // } else {
    //   alert("No report available.");
    // }
    closeActionMenu();
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clients = await getClients();
        if (!clients || clients.length === 0) {
          console.warn("No clients found or failed to fetch clients.");
          setUsers([]);
          return;
        }
        setUsers(clients);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  const cleanedSearchQuery = searchQuery.toLowerCase().trim();


  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-4 md:p-6 mt-16 md:mt-0 overflow-x-hidden">
        <div className="mb-6">
          <h1 className="text-[#363636] text-xl md:text-2xl font-bold">
            Hi, {user?.firstName || "User"}
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
            Clients
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2 sm:gap-4">
              <div className="relative w-full sm:w-auto">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                Create Client
              </button>
              {/* <button
                onClick={() => router.push("/RoleList")}
                className="bg-[#fff] hover:bg-gray-300 text-[#F36F2E] border-[#F36F2E] border-2 py-2 px-4 rounded text-sm w-full sm:w-auto"
              >
                Upload
              </button> */}
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
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">
                    Company name
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">
                    Address
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">
                    State
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">
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
                {paginateItems(users, page, 10).filter((client) => {
                  // If the search query is empty, you might want to show all users
                  if (!cleanedSearchQuery) {
                    return true;
                  }

                  // Check each relevant field, converting to lowercase for case-insensitive search
                  // and providing a fallback for null/undefined fields.
                  const companyNameMatch = (client.companyName || '').toLowerCase().includes(cleanedSearchQuery);
                  const firstNameMatch = (client.firstName || '').toLowerCase().includes(cleanedSearchQuery);
                  const lastNameMatch = (client.lastName || '').toLowerCase().includes(cleanedSearchQuery);
                  const addressMatch = (client.address || '').toLowerCase().includes(cleanedSearchQuery);
                  const countryMatch = (client.country || '').toLowerCase().includes(cleanedSearchQuery);
                  const emailMatch = (client.email || '').toLowerCase().includes(cleanedSearchQuery);
                  const stateMatch = (client.state || '').toLowerCase().includes(cleanedSearchQuery);
                  const cityMatch = (client.city || '').toLowerCase().includes(cleanedSearchQuery);

                  return companyNameMatch || firstNameMatch || lastNameMatch || addressMatch || emailMatch || countryMatch || stateMatch || cityMatch;
                }).map((user, index) => (
                  <tr key={user.id} className="relative">
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {user.country}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 truncate max-w-[120px] ">
                      {user.companyName}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 ">
                      {user.address}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 ">
                      {user.email}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {user.phone}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 ">
                      {user.state}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 ">
                      {user.city}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 ">
                      {new Date(user.createdAt).toLocaleString()}
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
                              View Client Details
                            </button>
                            <Link
                              href="/ClientAccounts"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                            >
                              View Accounts
                            </Link>
                            <Link
                              href="/Contracts"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                            >
                              View Contracts
                            </Link>
                            <Link
                              href="/NewAccount"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                            >
                              Create Account
                            </Link>
                            {/* {user.report ? (
                              <button
                                onClick={() => handleViewReportClick(user)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                              >
                                View Report
                              </button>
                            ) : (
                              <button
                                onClick={() => handleCreateReportClick(user)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                              >
                                Create Report
                              </button>
                            )} */}
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
              <span className="font-medium">{users.length >= 10 ? 10 : users.length}</span> of{" "}
              <span className="font-medium">{users.length}</span> entries
            </div>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={page === 0}
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              >
                Previous
              </button>
              <button
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={page === Math.ceil(users.length / 10) - 1}
                onClick={() => setPage((prev) => Math.min(prev + 1, Math.ceil(users.length / 10) - 1))}
              //  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>

          {/* Create User Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
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

                <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-150px)]"> {/* Added scrollbar and max height */}
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
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="text"
                      name="password"
                      value={newClient.password}
                      onChange={handleInputChange}
                      placeholder="Enter Password"
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div> */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={newClient.country}
                      onChange={handleInputChange}
                      placeholder="Enter Country"
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      name="company"
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
                      name="address"
                      value={newClient.address}
                      onChange={handleInputChange}
                      placeholder="Enter Company Address"
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={newClient.email}
                      onChange={handleInputChange}
                      placeholder="Enter Company Email"
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="contact"
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
                      name="state"
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
                      name="city"
                      value={newClient.city}
                      onChange={handleInputChange}
                      placeholder="Enter City"
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    />
                  </div>


                  <button
                    disabled={isLoading}
                    onClick={handleCreateUser}
                    className="w-full bg-[#F36F2E] text-white py-2 px-4 rounded-md hover:bg-[#E05C2B] transition-colors"
                  >
                    Create Client
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Report Modal */}
          {showReportModal && reportingUser && (
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg text-black font-semibold">Create Report for {reportingUser.firstName}</h3>
                  <button
                    onClick={() => {
                      setShowReportModal(false);
                      setReportingUser(null);
                      setReportContent("");
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div>
                  <label htmlFor="report-content" className="block text-sm font-medium text-gray-700 mb-1">Report Content</label>
                  <textarea
                    id="report-content"
                    value={reportContent}
                    onChange={(e) => setReportContent(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    placeholder="Write your report here..."
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setShowReportModal(false);
                      setReportingUser(null);
                      setReportContent("");
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveReport}
                    className="px-4 py-2 bg-[#F36F2E] text-white rounded-md text-sm font-medium hover:bg-[#E05C2B]"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Deactivate Confirmation Modal */}
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

          {/* Deactivation Reason Form */}
          {showDeactivateForm && (
            <div className="fixed inset-0 bg-black bg-opacity-0 flex items-center justify-center z-50 p-4">
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
                    The client has been successfully created.
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
              <div className="bg-gray-50 p-6 rounded-md shadow-md w-full max-w-2xl">
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
                  <div className="md:grid md:grid-cols-2 md:items-start md:gap-6 mb-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700">Update Personal Details</h4>
                    </div>
                    <p className="text-xs text-gray-500 md:mt-1">Lorem ipsum dolor sit amet consectetur. Purus odio porttitor dignissim orci non odio porttitor dignissim orci non purus purus. Nunc nisl ut</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullname" className="block text-xs font-medium text-gray-600 mb-1">Fullname</label>
                      <input type="text" id="fullname" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" placeholder="Enter full name" />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-xs font-medium text-gray-600 mb-1">Country</label>
                      <input type="text" id="country" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" placeholder="Enter country" />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label htmlFor="companyName" className="block text-xs font-medium text-gray-600 mb-1">Company Name</label>
                      <input type="text" id="companyName" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" placeholder="Enter company name" />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label htmlFor="address" className="block text-xs font-medium text-gray-600 mb-1">Address</label>
                      <input type="text" id="address" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" placeholder="Enter address" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                      <input type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" placeholder="Enter email" />
                    </div>
                    <div>
                      <label htmlFor="contact" className="block text-xs font-medium text-gray-600 mb-1">Contact</label>
                      <input type="text" id="contact" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" placeholder="Enter contact number" />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-xs font-medium text-gray-600 mb-1">State</label>
                      <input type="text" id="state" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" placeholder="Enter state" />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-xs font-medium text-gray-600 mb-1">City</label>
                      <input type="text" id="city" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500" placeholder="Enter city" />
                    </div>
                    <div className="col-span-1 md:col-span-2 flex md:flex-row gap-4 flex-col justify-end mt-4">
                      <Link href="/NewAccount"
                        className="bg-white text-orange-500 border border-orange-500 rounded-md py-2 px-4 text-sm font-medium focus:outline-none focus:shadow-outline-orange active:bg-orange-700"
                      >
                        Create Bank Account
                      </Link>
                      <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-md py-2 px-4 text-sm font-medium focus:outline-none focus:shadow-outline-orange active:bg-orange-700">
                        Save Changes
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