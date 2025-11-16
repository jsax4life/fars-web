"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Sidebar from "../utility/Sidebar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import WordEditor from "../utility/TextEditor";
import Navbar from "../nav/Navbar";
import { useBanks } from "@/hooks/useBank";
import { formatDate } from "@/lib/utils";
import { toast } from 'sonner';

interface Bank {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

interface NewBank {
  name: string;
  code: string;
}

const BankList = () => {
  const router = useRouter();
  const bank = useBanks();
  const [banks, setBanks] = useState<Bank[]>([]);

  // Loading and submission states
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Search and Pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newBank, setNewBank] = useState<NewBank>({
    name: "",
    code: "",
  });

  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [selectedBankForAction, setSelectedBankForAction] = useState<Bank | null>(
    null
  );
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingBank, setReportingBank] = useState<Bank | null>(null);
  const [deactivationReason, setDeactivationReason] = useState({
    title: "",
    message: "",
  });

  // View and Edit Modal State
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewedBank, setViewedBank] = useState<Bank | null>(null);
  const [editableBank, setEditableBank] = useState<Bank | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const actionMenuRef = useRef<HTMLDivElement>(null);
  const actionButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>(
    {}
  );

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingBankId, setDeletingBankId] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewBank({ ...newBank, [name]: value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };


  // --- Handle Create Bank ---
  const handleCreateUser = async () => {
    // Prevent multiple submissions
    if (isCreating) return;

    // Basic validation
    if (!newBank.name.trim()) {
      toast.error('Bank name is required');
      return;
    }
    if (!newBank.code.trim()) {
      toast.error('Bank code is required');
      return;
    }

    setIsCreating(true);
    try {
      // Send only name and code as per API requirements
      const payload = {
        name: newBank.name.trim(),
        code: newBank.code.trim()
      };
      
      const createdBank = await bank.createBank(payload);
      if (createdBank) {
        // Add new bank to the top of the list for immediate visibility
        setBanks((prevBanks) => [createdBank, ...prevBanks]);

        setShowCreateModal(false);
        setShowSuccessModal(true);
        // Reset form
        setNewBank({
          name: "",
          code: "",
        });
      } else {
        console.error("Bank creation returned no data.");
      }
    } catch (error) {
      console.error("Error creating bank:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const closeActionMenu = () => {
    setIsActionMenuOpen(false);
    setSelectedBankForAction(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target as Node)
      ) {
        closeActionMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const openActionMenu = (
    bank: Bank,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setSelectedBankForAction(bank);
    setIsActionMenuOpen(true);

    if (bank.id) {
      actionButtonRefs.current[bank.id] = event.currentTarget;
    }
  };

  const getPopupPosition = () => {
    if (
      !selectedBankForAction?.id ||
      !actionButtonRefs.current[selectedBankForAction.id]
    ) {
      return { top: 0, left: 0 };
    }

    const button = actionButtonRefs.current[selectedBankForAction.id];
    if (!button) return { top: 0, left: 0 };

    const rect = button.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY,
      left: rect.right + window.scrollX - 130,
    };
  };

  // --- Delete Flow ---
  const handleDeleteClick = (bankId: string) => {
    setDeletingBankId(bankId);
    setShowDeleteConfirm(true);
    closeActionMenu();
  };

  const confirmDelete = () => {
    if (deletingBankId) {
      bank.deleteBank(deletingBankId).then((response) => {
        if (response) {
          setBanks(banks.filter((bank) => bank.id !== deletingBankId));
          setShowDeleteConfirm(false);
          setDeletingBankId(null);
        } else {
          console.error("Failed to delete bank");
        }
      }).catch((error) => {
        console.error("Error deleting bank:", error);
      });
    }
  };

  // --- Modal Logic ---
  const openViewModal = (bank: Bank) => {
    setViewedBank(bank);
    setEditableBank({ ...bank }); // Create a copy for editing
    setShowViewModal(true);
    setIsEditMode(false); // Always start in view mode
    closeActionMenu();
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editableBank) {
      const { name, value } = e.target;
      setEditableBank({ ...editableBank, [name]: value });
    }
  };

  const handleSaveChanges = () => {
    if (editableBank) {
      bank.updateBank(editableBank.id, { name: editableBank.name, code: editableBank.code }).then((response) => {
        if (response) {
          // Update the main banks list
          setBanks(
            banks.map((bank) =>
              bank.id === editableBank.id ? editableBank : bank
            )
          );
          // Update the bank being viewed in the modal
          setViewedBank(editableBank);
          // Exit edit mode
          setIsEditMode(false);
        }
      }).catch((error) => {
        console.error("Error updating bank:", error);
      })
    }
  };

  const handleCreateReportClick = (bank: Bank) => {
    setReportingBank(bank);
    setShowReportModal(true);
    closeActionMenu();
  };

  const handleSaveReport = (fileName: string, content: string) => {
    if (reportingBank) {
      // Report functionality can be implemented later if needed
      setShowReportModal(false);
      setReportingBank(null);
    }
  };

  const handleViewReportClick = (bank: Bank) => {
    // Report functionality can be implemented later if needed
    closeActionMenu();
  };

  // --- Fetch Initial Data ---
  useEffect(() => {
    setIsLoading(true);
    bank
      .getBanks()
      .then((response) => {
        if (response && Array.isArray(response)) {
          setBanks(response);
        } else {
          console.error("Failed to fetch banks");
          setBanks([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching banks:", error);
        setBanks([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []); // Dependency on `bank` object from the hook

  const filteredBanks = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) {
      return banks;
    }
    return banks.filter(
      (bank) =>
        bank.name.toLowerCase().includes(query) ||
        (bank.code && bank.code.toLowerCase().includes(query))
    );
  }, [banks, searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBanks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBanks.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto md:ml-64 pt-10 md:pt-10">
        <div className="mb-4">
          <Navbar />
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8 shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2 sm:gap-4">
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search by bank name or code..."
                  value={searchQuery}
                  onChange={handleSearchChange}
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
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    S/N
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                    Bank Name
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Code
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Date Added
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredBanks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No banks found
                    </td>
                  </tr>
                ) : (
                  currentItems.map((bank, index) => (
                    <tr key={bank.id} className="relative">
                      <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-3 py-2 md:px-6 md:py-4 text-xs md:text-sm text-gray-900 font-medium w-40 truncate">
                        {bank.name}
                      </td>
                      <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                        {bank.code}
                      </td>
                      <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                        {formatDate(bank.createdAt)}
                      </td>
                      <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 relative">
                        <button
                          ref={(el) => {
                            if (bank.id) actionButtonRefs.current[bank.id] = el;
                          }}
                          className="focus:outline-none"
                          onClick={(e) => openActionMenu(bank, e)}
                        >
                          <img
                            src="/Users/action.svg"
                            alt="Dropdown Icon"
                            className="w-4 h-4 md:w-5 md:h-5"
                          />
                        </button>
                        {isActionMenuOpen &&
                          selectedBankForAction?.id === bank.id && (
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
                                  onClick={() => openViewModal(bank)}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                                >
                                  View Bank Details
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(bank.id)}
                                  className="block px-4 py-2 text-sm text-gray-700 border-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 bg-white border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {filteredBanks.length > 0 ? indexOfFirstItem + 1 : 0}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredBanks.length)}
              </span>{" "}
              of <span className="font-medium">{filteredBanks.length}</span>{" "}
              entries
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handlePrevPage}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </button>
            </div>
          </div>

          {/* Create Bank Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg text-black font-semibold">
                    Create New Bank
                  </h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newBank.name}
                      onChange={handleInputChange}
                      placeholder="Enter Bank Name"
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={newBank.code}
                      onChange={handleInputChange}
                      placeholder="Enter Bank Code"
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                      required
                    />
                  </div>

                  <button
                    onClick={handleCreateUser}
                    disabled={isCreating}
                    className="w-full bg-[#F36F2E] text-white py-2 px-4 rounded-md hover:bg-[#E05C2B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? "Creating..." : "Create Bank"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* View/Edit Bank Modal */}
          {showViewModal && editableBank && (
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
              <div className="bg-gray-50 p-6 rounded-md shadow-md w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-orange-200 flex items-center justify-center overflow-hidden">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-10 h-10 text-orange-700"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.125h15.002M9.75 21.75l-3 1.5-3-1.5m9.75 0l3 1.5 3-1.5M9.375 6a9.375 9.375 0 0116.875-3.75m-16.875 3.75l1.5-7.5m15-7.5l-1.5 7.5m-15 6.75a2.25 2.25 0 002.25 2.25m13.5 0a2.25 2.25 0 002.25-2.25m-16.5 0a2.25 2.25 0 012.25-2.25m13.5 0a2.25 2.25 0 012.25 2.25"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {editableBank.name || "Unknown Bank"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Code: {editableBank.code || "N/A"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <svg
                      className="h-6 w-6 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>

                <div className="mb-6 p-4 bg-white rounded-md border border-gray-200">
                  <div className="md:grid md:grid-cols-2 md:items-start md:gap-6 mb-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700">
                        Bank Details
                      </h4>
                    </div>
                    <p className="text-xs text-gray-500 md:mt-1">
                      {isEditMode
                        ? "Update the information for this bank profile."
                        : "Review the essential information for this bank profile."}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Bank Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-medium text-gray-600 mb-1"
                      >
                        Bank Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                        value={editableBank.name || ""}
                        onChange={handleEditInputChange}
                        readOnly={!isEditMode}
                      />
                    </div>
                    {/* Bank Code */}
                    <div>
                      <label
                        htmlFor="code"
                        className="block text-xs font-medium text-gray-600 mb-1"
                      >
                        Bank Code
                      </label>
                      <input
                        type="text"
                        name="code"
                        id="code"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                        value={editableBank.code || ""}
                        onChange={handleEditInputChange}
                        readOnly={!isEditMode}
                      />
                    </div>
                    {/* Date Added */}
                    <div>
                      <label
                        htmlFor="createdAt"
                        className="block text-xs font-medium text-gray-600 mb-1"
                      >
                        Date Added
                      </label>
                      <input
                        type="text"
                        id="createdAt"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500 bg-gray-50"
                        value={formatDate(editableBank.createdAt) || "N/A"}
                        readOnly
                      />
                    </div>
                    {/* Last Updated */}
                    <div>
                      <label
                        htmlFor="updatedAt"
                        className="block text-xs font-medium text-gray-600 mb-1"
                      >
                        Last Updated
                      </label>
                      <input
                        type="text"
                        id="updatedAt"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500 bg-gray-50"
                        value={formatDate(editableBank.updatedAt) || "N/A"}
                        readOnly
                      />
                    </div>
                    {/* Action Button */}
                    <div className="col-span-2 flex md:flex-row gap-4 flex-col justify-end">
                      <button
                        onClick={
                          isEditMode ? handleSaveChanges : () => setIsEditMode(true)
                        }
                        className="bg-orange-500 hover:bg-orange-600 text-white rounded-md py-2 px-4 text-sm font-medium focus:outline-none focus:shadow-outline-orange active:bg-orange-700"
                      >
                        {isEditMode ? "Save Changes" : "Edit"}
                      </button>
                    </div>
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
                  <h3 className="mt-5 text-lg font-medium text-gray-900">Delete Bank</h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Are you sure you want to delete this bank?</p>
                    <p>This action cannot be undone.</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-center gap-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BankList;