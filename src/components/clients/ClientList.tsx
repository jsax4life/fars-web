"use client";

import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../utility/Sidebar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useClients } from "@/hooks/useClient";
import { useUserAuth } from "@/hooks/useUserAuth";
import { paginateItems } from "@/lib/utils";
import { toast } from "react-toastify";
import WordEditor from "../utility/TextEditor";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
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

  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [selectedUserForAction, setSelectedUserForAction] = useState<Client | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingUser, setReportingUser] = useState<Client | null>(null);
  const [deleteUser, setDeleteUser] = useState<Client | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewedUser, setViewedUser] = useState<Client | null>(null);

  const actionMenuRef = useRef<HTMLDivElement>(null);
  const actionButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewClient({ ...newClient, [name]: value });
  };

  const handleCreateUser = async () => {
    setIsLoading(true);
    try {
      const response = await createClient({
        firstName: newClient.fullName.split(" ")[0],
        lastName: newClient.fullName.split(" ")[1] || "",
        country: newClient.country,
        companyName: newClient.company,
        address: newClient.address,
        email: newClient.email,
        phone: newClient.contact,
        state: newClient.state,
        city: newClient.city,
      });
      
      if (response) {
        setUsers([...users, response]);
        setShowCreateModal(false);
        toast.success("Client created successfully");
      }
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error("Failed to create client");
    } finally {
      setIsLoading(false);
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
    }
  };

  const closeActionMenu = () => {
    setIsActionMenuOpen(false);
    setSelectedUserForAction(null);
  };

  const handleViewUser = (user: Client) => {
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

  const openActionMenu = (user: Client, event: React.MouseEvent<HTMLButtonElement>) => {
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
      left: rect.left + window.scrollX,
    };
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId) {
      setIsLoading(true);
      try {
        const response = await deleteClient(userId);
        if (response) {
          setUsers(users.filter(user => user.id !== userId));
          setDeleteUser(null);
          closeActionMenu();
          toast.success("Client deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting client:", error);
        toast.error("Failed to delete client");
      } finally {
        setIsLoading(false);
      }
    }
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

  const handleSaveReport = (fileName: string, content: string) => {
    if (reportingUser) {
      // In a real app, you would save the report to your backend here
      console.log('Saving report:', fileName, content);
      
      // Create a downloadable file
      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setShowReportModal(false);
      toast.success("Report generated successfully");
      setReportingUser(null);
    }
  };

  const handleViewReportClick = (user: Client) => {
    // In a real application, you would fetch and display the report content
    alert(`Viewing report for ${user.firstName} ${user.lastName}`);
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
        toast.error("Failed to fetch clients");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  const cleanedSearchQuery = searchQuery.toLowerCase().trim();

  const handleSaveEdit = async () => {
    if (!viewedUser) return;
    setIsLoading(true);
    try {
      const response = await updateClient(viewedUser.id, {
        firstName: viewedUser.firstName,
        lastName: viewedUser.lastName,
        companyName: viewedUser.companyName,
        email: viewedUser.email,
        address: viewedUser.address,
        phone: viewedUser.phone,
        country: viewedUser.country,
        state: viewedUser.state,
        city: viewedUser.city,
      });
      
      if (response) {
        setUsers(users.map(user => user.id === response.id ? response : user));
        toast.success("Client updated successfully");
      }
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error("Failed to update client");
    } finally {
      setIsLoading(false);
    }
  };

const filteredUsers = paginateItems(
  users.filter((client) => {
    if (!cleanedSearchQuery) return true;

    const fieldsToSearch = [
      client.companyName || '',
      client.firstName || '',
      client.lastName || '',
      client.address || '',
      client.country || '',
      client.email || '',
      client.state || '',
      client.city || '',
      client.phone || ''
    ];

    return fieldsToSearch.some(field => 
      field.toLowerCase().includes(cleanedSearchQuery)
    ); // <-- This closing parenthesis was missing
  }),
  page,
  10
);


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
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#F36F2E] hover:bg-[#F36F2E] text-white py-2 px-4 rounded text-sm w-full sm:w-auto"
            >
              Create Client
            </button>
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
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company name
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
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
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {index + 1 + (page * 10)}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.country}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 truncate max-w-[120px]">
                      {user.companyName}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {user.phone}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-500 relative">
                      <button
                        className="focus:outline-none"
                        onClick={(e) => openActionMenu(user, e)}
                      >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                      </button>
                      {isActionMenuOpen && selectedUserForAction?.id === user.id && (
                        <div
                          ref={actionMenuRef}
                          className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                          style={{
                            top: `${getPopupPosition().top}px`,
                            left: `${getPopupPosition().left}px`,
                          }}
                        >
                          <div className="py-1">
                            <button
                              onClick={() => openViewModal(user)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              View Details
                            </button>
                            <Link
                              href={`/ClientAccounts?clientId=${user.id}`}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              View Accounts
                            </Link>
                            <Link
                              href="/Contracts"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              View Contracts
                            </Link>
                            <Link
                              href="/NewAccount"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              Create Account
                            </Link>
                            <button
                              onClick={() => handleCreateReportClick(user)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              Create Report
                            </button>
                            <button
                              onClick={() => setDeleteUser(user)}
                              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
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
              Showing <span className="font-medium">{page * 10 + 1}</span> to{" "}
              <span className="font-medium">{Math.min((page + 1) * 10, users.length)}</span> of{" "}
              <span className="font-medium">{users.length}</span> entries
            </div>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={page === 0}
                onClick={() => setPage(prev => Math.max(prev - 1, 0))}
              >
                Previous
              </button>
              <button
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={page === Math.ceil(users.length / 10) - 1}
                onClick={() => setPage(prev => Math.min(prev + 1, Math.ceil(users.length / 10) - 1))}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Create Client Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
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
                  <label className="block  text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={newClient.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter Full name"
                    className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    required
                  />
                </div>
                <div>
                  <label className="block  text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={newClient.country}
                    onChange={handleInputChange}
                    placeholder="Enter Country"
                    className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    required
                  />
                </div>
                <div>
                  <label className="block  text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    name="company"
                    value={newClient.company}
                    onChange={handleInputChange}
                    placeholder="Enter Company Name"
                    className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    required
                  />
                </div>
                <div>
                  <label className="block  text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={newClient.address}
                    onChange={handleInputChange}
                    placeholder="Enter Company Address"
                    className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    required
                  />
                </div>
                <div>
                  <label className="block  text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newClient.email}
                    onChange={handleInputChange}
                    placeholder="Enter Company Email"
                    className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    required
                  />
                </div>
                <div>
                  <label className="block  text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="contact"
                    value={newClient.contact}
                    onChange={handleInputChange}
                    placeholder="Enter Phone Number"
                    className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                    required
                  />
                </div>
                <div>
                  <label className="block  text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={newClient.state}
                    onChange={handleInputChange}
                    placeholder="Enter State"
                    className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                  />
                </div>
                <div>
                  <label className="block  text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={newClient.city}
                    onChange={handleInputChange}
                    placeholder="Enter City"
                    className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                  />
                </div>

                <button
                  disabled={isLoading}
                  onClick={handleCreateUser}
                  className="w-full bg-[#F36F2E] text-white py-2 px-4 rounded-md hover:bg-[#E05C2B] transition-colors mt-4"
                >
                  {isLoading ? 'Creating...' : 'Create Client'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Report Modal */}
        {showReportModal && reportingUser && (
          <WordEditor 
            onSave={handleSaveReport}
            onClose={() => {
              setShowReportModal(false);
              setReportingUser(null);
            }}
            user={reportingUser}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deleteUser && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Delete Client</h3>
                <button
                  onClick={() => setDeleteUser(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete {deleteUser.firstName} {deleteUser.lastName}?
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setDeleteUser(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  disabled={isLoading}
                  onClick={() => handleDeleteUser(deleteUser.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:bg-red-400"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View/Edit Client Modal */}
        {showViewModal && viewedUser && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-orange-200 flex items-center justify-center overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-orange-700">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.125h15.002M9.75 21.75l-3 1.5-3-1.5m9.75 0l3 1.5 3-1.5M9.375 6a9.375 9.375 0 0116.875-3.75m-16.875 3.75l1.5-7.5m15-7.5l-1.5 7.5m-15 6.75a2.25 2.25 0 002.25 2.25m13.5 0a2.25 2.25 0 002.25-2.25m-16.5 0a2.25 2.25 0 012.25-2.25m13.5 0a2.25 2.25 0 012.25 2.25" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">{viewedUser.firstName} {viewedUser.lastName}</h3>
                    <p className="text-sm text-gray-500">{viewedUser.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowViewModal(false)} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block  text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    value={viewedUser.firstName}
                    onChange={(e) => setViewedUser({ ...viewedUser, firstName: e.target.value })}
                    className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                  />
                </div>
                <div>
                  <label className="block  text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    value={viewedUser.lastName}
                    onChange={(e) => setViewedUser({ ...viewedUser, lastName: e.target.value })}
                    className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                  />
                </div>
                <div>
                  <label className="block  text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    value={viewedUser.email}
                    onChange={(e) => setViewedUser({ ...viewedUser, email: e.target.value })}
                    className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                  />
                </div>
                <div>
                  <label className="block  text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    value={viewedUser.phone}
                    onChange={(e) => setViewedUser({ ...viewedUser, phone: e.target.value })}
                    className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block  text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    value={viewedUser.companyName}
                    onChange={(e) => setViewedUser({ ...viewedUser, companyName: e.target.value })}
                    className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block  text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    value={viewedUser.address}
                    onChange={(e) => setViewedUser({ ...viewedUser, address: e.target.value })}
                    className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                  />
                </div>
                <div>
                  <label className="block  text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    value={viewedUser.country}
                    onChange={(e) => setViewedUser({ ...viewedUser, country: e.target.value })}
                    className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                  />
                </div>
                <div>
                  <label className="block  text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    value={viewedUser.state}
                    onChange={(e) => setViewedUser({ ...viewedUser, state: e.target.value })}
                    className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                  />
                </div>
                <div>
                  <label className="block  text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    value={viewedUser.city}
                    onChange={(e) => setViewedUser({ ...viewedUser, city: e.target.value })}
                    className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  disabled={isLoading}
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-[#F36F2E] text-white rounded-md text-sm font-medium hover:bg-[#E05C2B] disabled:bg-orange-400"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientList;