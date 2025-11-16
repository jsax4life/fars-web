"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../utility/Sidebar";
import { FiX, FiMoreVertical } from "react-icons/fi";
import { useReversalKeywords } from "@/hooks/useReversalKeyword";
import { useBanks } from "@/hooks/useBank";
import Navbar from "../nav/Navbar";
import { toast } from 'sonner';
import { formatDate } from "@/lib/utils";

interface ReversalKeyword {
  id: string;
  keyword: string;
  isGlobal: boolean;
  bankId: string | null;
  createdAt?: string;
  updatedAt?: string;
  bank?: {
    id: string;
    name: string;
    code: string;
  };
}

interface NewReversalKeyword {
  keyword: string;
  isGlobal: boolean;
  bankId: string;
}

interface Bank {
  id: string;
  name: string;
  code: string;
}

const ReversalKeyword = () => {
  const { getReversalKeywords, getReversalKeywordById, createReversalKeyword, updateReversalKeyword, deleteReversalKeyword } = useReversalKeywords();
  const { getBanks } = useBanks();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingView, setIsLoadingView] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingKeywordId, setDeletingKeywordId] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<ReversalKeyword[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [viewedKeyword, setViewedKeyword] = useState<ReversalKeyword | null>(null);
  const [editableKeyword, setEditableKeyword] = useState<ReversalKeyword | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState<{
    bankId: string;
    isGlobal: string; // "true", "false", or ""
  }>({
    bankId: "",
    isGlobal: "",
  });
  
  const [newKeyword, setNewKeyword] = useState<NewReversalKeyword>({
    keyword: "",
    isGlobal: true,
    bankId: "",
  });

  // Action menu state
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [selectedKeywordForAction, setSelectedKeywordForAction] = useState<ReversalKeyword | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const actionButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (customFilters?: typeof filters) => {
    setIsLoading(true);
    try {
      // Use customFilters if provided, otherwise use state filters
      const filtersToUse = customFilters || filters;
      
      // Build filter object for API call
      const apiFilters: {
        bankId?: string;
        isGlobal?: boolean;
      } = {};
      
      if (filtersToUse.bankId) {
        apiFilters.bankId = filtersToUse.bankId;
      }
      if (filtersToUse.isGlobal !== "") {
        apiFilters.isGlobal = filtersToUse.isGlobal === "true";
      }

      const [keywordsData, banksData] = await Promise.all([
        getReversalKeywords(Object.keys(apiFilters).length > 0 ? apiFilters : undefined),
        getBanks(),
      ]);

      if (keywordsData && Array.isArray(keywordsData)) {
        setKeywords(keywordsData);
      } else {
        setKeywords([]);
      }

      if (banksData && Array.isArray(banksData)) {
        setBanks(banksData);
      } else {
        setBanks([]);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setKeywords([]);
      setBanks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    const clearedFilters = {
      bankId: "",
      isGlobal: "",
    };
    setFilters(clearedFilters);
    // Refetch data without filters
    fetchData(clearedFilters);
  };

  const applyFilters = () => {
    // Refetch data with current filters
    fetchData();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target as Node) &&
        actionButtonRef.current &&
        !actionButtonRef.current.contains(event.target as Node)
      ) {
        setIsActionMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    setNewKeyword({
      keyword: "",
      isGlobal: true,
      bankId: "",
    });
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setNewKeyword((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setNewKeyword((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCreateKeyword = async () => {
    if (!newKeyword.keyword.trim()) {
      toast.error("Keyword is required");
      return;
    }

    setIsCreating(true);
    try {
      const payload = {
        keyword: newKeyword.keyword,
        isGlobal: newKeyword.isGlobal,
        bankId: newKeyword.isGlobal ? null : (newKeyword.bankId || null),
      };
      const result = await createReversalKeyword(payload);
      if (result) {
        setIsCreateModalOpen(false);
        setNewKeyword({
          keyword: "",
          isGlobal: true,
          bankId: "",
        });
        // Refresh the list
        await fetchData();
      }
    } catch (error: any) {
      console.error("Error creating reversal keyword:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const openActionMenu = (keyword: ReversalKeyword) => {
    setSelectedKeywordForAction(keyword);
    setIsActionMenuOpen(true);
  };

  const closeActionMenu = () => {
    setIsActionMenuOpen(false);
    setSelectedKeywordForAction(null);
  };

  const openViewModal = async (keyword: ReversalKeyword) => {
    setIsViewModalOpen(true);
    setIsLoadingView(true);
    setIsActionMenuOpen(false);
    try {
      const data = await getReversalKeywordById(keyword.id);
      if (data) {
        setViewedKeyword(data);
      } else {
        setViewedKeyword(keyword);
      }
    } catch (error) {
      console.error('Failed to load reversal keyword details:', error);
      setViewedKeyword(keyword);
    } finally {
      setIsLoadingView(false);
    }
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewedKeyword(null);
  };

  const openEditModal = (keyword: ReversalKeyword) => {
    setIsEditModalOpen(true);
    setIsActionMenuOpen(false);
    setEditableKeyword(keyword);
    // Pre-populate the form with keyword data
    setNewKeyword({
      keyword: keyword.keyword,
      isGlobal: keyword.isGlobal,
      bankId: keyword.bankId || "",
    });
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditableKeyword(null);
    setNewKeyword({
      keyword: "",
      isGlobal: true,
      bankId: "",
    });
  };

  const handleUpdateKeyword = async () => {
    if (!editableKeyword) return;

    if (!newKeyword.keyword.trim()) {
      toast.error("Keyword is required");
      return;
    }

    setIsUpdating(true);
    try {
      const payload = {
        keyword: newKeyword.keyword,
        isGlobal: newKeyword.isGlobal,
        bankId: newKeyword.isGlobal ? null : (newKeyword.bankId || null),
      };
      
      const result = await updateReversalKeyword(editableKeyword.id, payload);
      if (result) {
        setIsEditModalOpen(false);
        setEditableKeyword(null);
        setNewKeyword({
          keyword: "",
          isGlobal: true,
          bankId: "",
        });
        // Refresh the list
        await fetchData();
      }
    } catch (error: any) {
      console.error("Error updating reversal keyword:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = (keyword: ReversalKeyword) => {
    setDeletingKeywordId(keyword.id);
    setShowDeleteConfirm(true);
    closeActionMenu();
  };

  const handleDeleteKeyword = async () => {
    if (!deletingKeywordId) return;

    setIsDeleting(true);
    try {
      const result = await deleteReversalKeyword(deletingKeywordId);
      if (result) {
        // Refresh the list
        await fetchData();
        setShowDeleteConfirm(false);
        setDeletingKeywordId(null);
      }
    } catch (error: any) {
      console.error('Error deleting reversal keyword:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletingKeywordId(null);
  };

  const getBankName = (bankId: string | null) => {
    if (!bankId) return "N/A (Global)";
    const bank = banks.find((b) => b.id === bankId);
    return bank ? bank.name : "N/A";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 md:ml-64 pt-10 md:pt-10 overflow-y-auto">
        <Navbar />
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Reversal Keywords
              </h1>
              <button
                onClick={openCreateModal}
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Create New Keyword
              </button>
            </div>

            {/* Filters */}
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-300">
                  Parameters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bank Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      <span className="font-semibold">bankId</span>
                      <span className="text-gray-500 ml-1">string (query)</span>
                    </label>
                    <p className="text-xs text-gray-600 mb-2">
                      Filter keywords by a specific bank ID.
                    </p>
                    <select
                      name="bankId"
                      value={filters.bankId}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select Bank</option>
                      {banks.map((bank) => (
                        <option key={bank.id} value={bank.id}>
                          {bank.name} ({bank.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* IsGlobal Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      <span className="font-semibold">isGlobal</span>
                      <span className="text-gray-500 ml-1">boolean (query)</span>
                    </label>
                    <p className="text-xs text-gray-600 mb-2">
                      Filter keywords based on their global status (true or false).
                    </p>
                    <select
                      name="isGlobal"
                      value={filters.isGlobal}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">All</option>
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={applyFilters}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={clearFilters}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading keywords...</p>
              </div>
            ) : keywords.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No reversal keywords found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                        S/N
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Keyword
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Is Global
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {keywords.map((keyword, index) => (
                      <tr key={keyword.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {keyword.keyword}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {keyword.isGlobal ? (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Yes
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getBankName(keyword.bankId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {keyword.createdAt ? formatDate(keyword.createdAt) : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
                          <button
                            ref={actionButtonRef}
                            onClick={() => openActionMenu(keyword)}
                            className="text-gray-600 hover:text-gray-900 focus:outline-none"
                          >
                            <FiMoreVertical className="h-5 w-5" />
                          </button>
                          {isActionMenuOpen &&
                            selectedKeywordForAction?.id === keyword.id && (
                              <div
                                ref={actionMenuRef}
                                className="absolute right-0 z-5000 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                              >
                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      if (selectedKeywordForAction) {
                                        openViewModal(selectedKeywordForAction);
                                      }
                                    }}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (selectedKeywordForAction) {
                                        openEditModal(selectedKeywordForAction);
                                      }
                                    }}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (selectedKeywordForAction) {
                                        handleDeleteClick(selectedKeywordForAction);
                                      }
                                    }}
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
            )}
          </div>
        </div>

        {/* Create Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="flex justify-end p-2">
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  onClick={closeCreateModal}
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Create New Reversal Keyword
                </h3>
                <div className="mb-4">
                  <label
                    htmlFor="keyword"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Keyword <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="keyword"
                    name="keyword"
                    value={newKeyword.keyword}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Enter keyword"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isGlobal"
                      checked={newKeyword.isGlobal}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Is Global
                    </span>
                  </label>
                </div>
                {!newKeyword.isGlobal && (
                  <div className="mb-4">
                    <label
                      htmlFor="bankId"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Bank
                    </label>
                    <select
                      id="bankId"
                      name="bankId"
                      value={newKeyword.bankId}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md text-black shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    >
                      <option value="">Select Bank</option>
                      {banks.map((bank) => (
                        <option key={bank.id} value={bank.id}>
                          {bank.name} ({bank.code})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex items-center justify-end mt-6">
                  <button
                    type="button"
                    onClick={closeCreateModal}
                    className="mr-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateKeyword}
                    disabled={isCreating}
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? "Creating..." : "Create Keyword"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {isViewModalOpen && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="flex justify-end p-2">
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  onClick={closeViewModal}
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Reversal Keyword Details
                </h3>
                {isLoadingView ? (
                  <p className="text-gray-500 text-center py-4">Loading...</p>
                ) : viewedKeyword ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-1">
                        Keyword
                      </label>
                      <p className="text-gray-900 text-sm">{viewedKeyword.keyword}</p>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-1">
                        Is Global
                      </label>
                      <p className="text-gray-900 text-sm">
                        {viewedKeyword.isGlobal ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Yes
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            No
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-1">
                        Bank
                      </label>
                      <p className="text-gray-900 text-sm">
                        {viewedKeyword.bankId 
                          ? getBankName(viewedKeyword.bankId) 
                          : "N/A (Global Keyword)"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-1">
                        Created At
                      </label>
                      <p className="text-gray-900 text-sm">
                        {viewedKeyword.createdAt 
                          ? formatDate(viewedKeyword.createdAt) 
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-1">
                        Updated At
                      </label>
                      <p className="text-gray-900 text-sm">
                        {viewedKeyword.updatedAt 
                          ? formatDate(viewedKeyword.updatedAt) 
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No data available</p>
                )}
                <div className="flex items-center justify-end mt-6">
                  <button
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={closeViewModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="flex justify-end p-2">
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  onClick={closeEditModal}
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Edit Reversal Keyword
                </h3>
                <div className="mb-4">
                  <label
                    htmlFor="edit-keyword"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Keyword <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-keyword"
                    name="keyword"
                    value={newKeyword.keyword}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Enter keyword"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isGlobal"
                      checked={newKeyword.isGlobal}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Is Global
                    </span>
                  </label>
                </div>
                {!newKeyword.isGlobal && (
                  <div className="mb-4">
                    <label
                      htmlFor="edit-bankId"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Bank
                    </label>
                    <select
                      id="edit-bankId"
                      name="bankId"
                      value={newKeyword.bankId}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md text-black shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    >
                      <option value="">Select Bank</option>
                      {banks.map((bank) => (
                        <option key={bank.id} value={bank.id}>
                          {bank.name} ({bank.code})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex items-center justify-end mt-6">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="mr-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateKeyword}
                    disabled={isUpdating}
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? "Updating..." : "Update Keyword"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Confirm Deletion</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Are you sure you want to delete this reversal keyword? This action cannot be undone.
                </p>
              </div>
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={cancelDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteKeyword}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReversalKeyword;

