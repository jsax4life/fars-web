"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../utility/Sidebar";
import { FiX, FiMoreVertical } from "react-icons/fi";
import { useClassificationPatterns } from "@/hooks/useClassificationPattern";
import { useBanks } from "@/hooks/useBank";
import { useClassifications } from "@/hooks/useClassification";
import Navbar from "../nav/Navbar";
import { toast } from 'sonner';
import { formatDate } from "@/lib/utils";

interface ClassificationPattern {
  id: string;
  keyword: string;
  isRegex: boolean;
  isGlobal?: boolean;
  bankId: string | null;
  classificationId: string;
  createdAt?: string;
  updatedAt?: string;
  bank?: {
    id: string;
    name: string;
    code: string;
  };
  classification?: {
    id: string;
    code: string;
    label: string;
    category: string;
  };
}

interface NewClassificationPattern {
  keyword: string;
  isRegex: boolean;
  bankId: string;
  classificationId: string;
}

interface Bank {
  id: string;
  name: string;
  code: string;
}

interface Classification {
  id: string;
  code: string;
  label: string;
  category: string;
}

const ClassificationPattern = () => {
  const { getClassificationPatterns, getClassificationPatternById, createClassificationPattern, updateClassificationPattern, deleteClassificationPattern } = useClassificationPatterns();
  const { getBanks } = useBanks();
  const { getClassifications } = useClassifications();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingView, setIsLoadingView] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingPatternId, setDeletingPatternId] = useState<string | null>(null);
  const [patterns, setPatterns] = useState<ClassificationPattern[]>([]);
  const [allPatterns, setAllPatterns] = useState<ClassificationPattern[]>([]); // Store all patterns for client-side search
  const [banks, setBanks] = useState<Bank[]>([]);
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [viewedPattern, setViewedPattern] = useState<ClassificationPattern | null>(null);
  const [editablePattern, setEditablePattern] = useState<ClassificationPattern | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState<{
    bankId: string;
    classificationId: string;
    isGlobal: string; // "true", "false", or ""
  }>({
    bankId: "",
    classificationId: "",
    isGlobal: "",
  });
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  
  const [newPattern, setNewPattern] = useState<NewClassificationPattern>({
    keyword: "",
    isRegex: false,
    bankId: "",
    classificationId: "",
  });

  // Action menu state
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [selectedPatternForAction, setSelectedPatternForAction] = useState<ClassificationPattern | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const actionButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [searchQuery, allPatterns]);

  const fetchData = async (customFilters?: typeof filters) => {
    setIsLoading(true);
    try {
      // Use customFilters if provided, otherwise use state filters
      const filtersToUse = customFilters || filters;
      
      // Build filter object for API call
      const apiFilters: {
        bankId?: string;
        classificationId?: string;
        isGlobal?: boolean;
      } = {};
      
      if (filtersToUse.bankId) {
        apiFilters.bankId = filtersToUse.bankId;
      }
      if (filtersToUse.classificationId) {
        apiFilters.classificationId = filtersToUse.classificationId;
      }
      if (filtersToUse.isGlobal !== "") {
        apiFilters.isGlobal = filtersToUse.isGlobal === "true";
      }

      const [patternsData, banksData, classificationsData] = await Promise.all([
        getClassificationPatterns(Object.keys(apiFilters).length > 0 ? apiFilters : undefined),
        getBanks(),
        getClassifications(),
      ]);

      // Handle new response structure with data and meta keys
      if (patternsData) {
        if (Array.isArray(patternsData)) {
          setAllPatterns(patternsData);
        } else if (patternsData.data && Array.isArray(patternsData.data)) {
          setAllPatterns(patternsData.data);
        } else {
          setAllPatterns([]);
        }
      } else {
        setAllPatterns([]);
      }

      if (banksData && Array.isArray(banksData)) {
        setBanks(banksData);
      } else {
        setBanks([]);
      }

      if (classificationsData && Array.isArray(classificationsData)) {
        setClassifications(classificationsData);
      } else {
        setClassifications([]);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setAllPatterns([]);
      setBanks([]);
      setClassifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    let filtered = [...allPatterns];

    // Apply client-side search on keyword
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((pattern) =>
        pattern.keyword.toLowerCase().includes(query)
      );
    }

    setPatterns(filtered);
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearFilters = () => {
    const clearedFilters = {
      bankId: "",
      classificationId: "",
      isGlobal: "",
    };
    setFilters(clearedFilters);
    setSearchQuery("");
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
    setNewPattern({
      keyword: "",
      isRegex: false,
      bankId: "",
      classificationId: "",
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
      setNewPattern((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setNewPattern((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCreatePattern = async () => {
    if (!newPattern.keyword.trim()) {
      toast.error("Keyword is required");
      return;
    }
    if (!newPattern.classificationId) {
      toast.error("Classification is required");
      return;
    }

    setIsCreating(true);
    try {
      const payload = {
        keyword: newPattern.keyword,
        isRegex: newPattern.isRegex,
        bankId: newPattern.bankId || null,
        classificationId: newPattern.classificationId,
      };
      const result = await createClassificationPattern(payload);
      if (result) {
        setIsCreateModalOpen(false);
        setNewPattern({
          keyword: "",
          isRegex: false,
          bankId: "",
          classificationId: "",
        });
        // Refresh the list
        await fetchData();
      }
    } catch (error: any) {
      console.error("Error creating classification pattern:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const openActionMenu = (pattern: ClassificationPattern) => {
    setSelectedPatternForAction(pattern);
    setIsActionMenuOpen(true);
  };

  const closeActionMenu = () => {
    setIsActionMenuOpen(false);
    setSelectedPatternForAction(null);
  };

  const openViewModal = async (pattern: ClassificationPattern) => {
    setIsViewModalOpen(true);
    setIsLoadingView(true);
    setIsActionMenuOpen(false);
    try {
      const data = await getClassificationPatternById(pattern.id);
      if (data) {
        setViewedPattern(data);
      } else {
        setViewedPattern(pattern);
      }
    } catch (error) {
      console.error('Failed to load classification pattern details:', error);
      setViewedPattern(pattern);
    } finally {
      setIsLoadingView(false);
    }
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewedPattern(null);
  };

  const openEditModal = (pattern: ClassificationPattern) => {
    setIsEditModalOpen(true);
    setIsActionMenuOpen(false);
    setEditablePattern(pattern);
    // Pre-populate the form with pattern data
    setNewPattern({
      keyword: pattern.keyword,
      isRegex: pattern.isRegex,
      bankId: pattern.bankId || "",
      classificationId: pattern.classificationId,
    });
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditablePattern(null);
    setNewPattern({
      keyword: "",
      isRegex: false,
      bankId: "",
      classificationId: "",
    });
  };

  const handleUpdatePattern = async () => {
    if (!editablePattern) return;

    if (!newPattern.keyword.trim()) {
      toast.error("Keyword is required");
      return;
    }
    if (!newPattern.classificationId) {
      toast.error("Classification is required");
      return;
    }

    setIsUpdating(true);
    try {
      const payload = {
        keyword: newPattern.keyword,
        isRegex: newPattern.isRegex,
        bankId: newPattern.bankId || null,
        classificationId: newPattern.classificationId,
      };
      
      const result = await updateClassificationPattern(editablePattern.id, payload);
      if (result) {
        setIsEditModalOpen(false);
        setEditablePattern(null);
        setNewPattern({
          keyword: "",
          isRegex: false,
          bankId: "",
          classificationId: "",
        });
        // Refresh the list
        await fetchData();
      }
    } catch (error: any) {
      console.error("Error updating classification pattern:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = (pattern: ClassificationPattern) => {
    setDeletingPatternId(pattern.id);
    setShowDeleteConfirm(true);
    closeActionMenu();
  };

  const handleDeletePattern = async () => {
    if (!deletingPatternId) return;

    setIsDeleting(true);
    try {
      const result = await deleteClassificationPattern(deletingPatternId);
      if (result) {
        // Refresh the list
        await fetchData();
        setShowDeleteConfirm(false);
        setDeletingPatternId(null);
      }
    } catch (error: any) {
      console.error('Error deleting classification pattern:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletingPatternId(null);
  };

  const getBankName = (bankId: string | null) => {
    if (!bankId) return "N/A (Global Pattern)";
    const bank = banks.find((b) => b.id === bankId);
    return bank ? bank.name : "N/A";
  };

  const getClassificationLabel = (classificationId: string) => {
    const classification = classifications.find((c) => c.id === classificationId);
    return classification ? `${classification.code} - ${classification.label}` : "N/A";
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
                Classification Patterns
              </h1>
              <button
                onClick={openCreateModal}
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Create New Pattern
              </button>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-6 space-y-4">
              {/* Search */}
              <div>
                <input
                  type="text"
                  placeholder="Search patterns by keyword..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full md:w-1/3 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Filters */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-300">
                  Parameters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Bank Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      <span className="font-semibold">bankId</span>
                      <span className="text-gray-500 ml-1">string (query)</span>
                    </label>
                    <p className="text-xs text-gray-600 mb-2">
                      Filter patterns by a specific bank ID.
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

                  {/* Classification Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      <span className="font-semibold">classificationId</span>
                      <span className="text-gray-500 ml-1">string (query)</span>
                    </label>
                    <p className="text-xs text-gray-600 mb-2">
                      Filter patterns by a specific classification ID.
                    </p>
                    <select
                      name="classificationId"
                      value={filters.classificationId}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select Classification</option>
                      {classifications.map((classification) => (
                        <option key={classification.id} value={classification.id}>
                          {classification.code} - {classification.label}
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
                      Filter patterns based on their global status (true or false).
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
                <p className="text-gray-500">Loading patterns...</p>
              </div>
            ) : patterns.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No classification patterns found</p>
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
                        Is Regex
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Classification
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {patterns.map((pattern, index) => (
                      <tr key={pattern.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pattern.keyword}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pattern.isRegex ? (
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
                          {getBankName(pattern.bankId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getClassificationLabel(pattern.classificationId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
                          <button
                            ref={actionButtonRef}
                            onClick={() => openActionMenu(pattern)}
                            className="text-gray-600 hover:text-gray-900 focus:outline-none"
                          >
                            <FiMoreVertical className="h-5 w-5" />
                          </button>
                          {isActionMenuOpen &&
                            selectedPatternForAction?.id === pattern.id && (
                              <div
                                ref={actionMenuRef}
                                className="absolute right-0 z-5000 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                              >
                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      if (selectedPatternForAction) {
                                        openViewModal(selectedPatternForAction);
                                      }
                                    }}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (selectedPatternForAction) {
                                        openEditModal(selectedPatternForAction);
                                      }
                                    }}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (selectedPatternForAction) {
                                        handleDeleteClick(selectedPatternForAction);
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
                  Create New Classification Pattern
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
                    value={newPattern.keyword}
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
                      name="isRegex"
                      checked={newPattern.isRegex}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Is Regex Pattern
                    </span>
                  </label>
                </div>
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
                    value={newPattern.bankId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md text-black shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  >
                    <option value="">Select Bank (Optional - for global pattern)</option>
                    {banks.map((bank) => (
                      <option key={bank.id} value={bank.id}>
                        {bank.name} ({bank.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="classificationId"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Classification <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="classificationId"
                    name="classificationId"
                    value={newPattern.classificationId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md text-black shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    required
                  >
                    <option value="" disabled>
                      Select Classification
                    </option>
                    {classifications.map((classification) => (
                      <option key={classification.id} value={classification.id}>
                        {classification.code} - {classification.label}
                      </option>
                    ))}
                  </select>
                </div>
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
                    onClick={handleCreatePattern}
                    disabled={isCreating}
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? "Creating..." : "Create Pattern"}
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
                  Classification Pattern Details
                </h3>
                {isLoadingView ? (
                  <p className="text-gray-500 text-center py-4">Loading...</p>
                ) : viewedPattern ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-1">
                        Keyword
                      </label>
                      <p className="text-gray-900 text-sm">{viewedPattern.keyword}</p>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-1">
                        Is Regex
                      </label>
                      <p className="text-gray-900 text-sm">
                        {viewedPattern.isRegex ? (
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
                        {viewedPattern.bankId 
                          ? getBankName(viewedPattern.bankId) 
                          : "N/A (Global Pattern)"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-1">
                        Classification
                      </label>
                      <p className="text-gray-900 text-sm">
                        {viewedPattern.classificationId 
                          ? getClassificationLabel(viewedPattern.classificationId) 
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-1">
                        Created At
                      </label>
                      <p className="text-gray-900 text-sm">
                        {viewedPattern.createdAt 
                          ? formatDate(viewedPattern.createdAt) 
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-1">
                        Updated At
                      </label>
                      <p className="text-gray-900 text-sm">
                        {viewedPattern.updatedAt 
                          ? formatDate(viewedPattern.updatedAt) 
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
                  Edit Classification Pattern
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
                    value={newPattern.keyword}
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
                      name="isRegex"
                      checked={newPattern.isRegex}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Is Regex Pattern
                    </span>
                  </label>
                </div>
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
                    value={newPattern.bankId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md text-black shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  >
                    <option value="">Select Bank (Optional - for global pattern)</option>
                    {banks.map((bank) => (
                      <option key={bank.id} value={bank.id}>
                        {bank.name} ({bank.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="edit-classificationId"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Classification <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="edit-classificationId"
                    name="classificationId"
                    value={newPattern.classificationId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md text-black shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    required
                  >
                    <option value="" disabled>
                      Select Classification
                    </option>
                    {classifications.map((classification) => (
                      <option key={classification.id} value={classification.id}>
                        {classification.code} - {classification.label}
                      </option>
                    ))}
                  </select>
                </div>
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
                    onClick={handleUpdatePattern}
                    disabled={isUpdating}
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? "Updating..." : "Update Pattern"}
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
                  Are you sure you want to delete this classification pattern? This action cannot be undone.
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
                  onClick={handleDeletePattern}
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

export default ClassificationPattern;

