"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../utility/Sidebar";
import { FiX } from "react-icons/fi";
import { useClassifications } from "@/hooks/useClassification";
import Navbar from "../nav/Navbar";
import { toast } from 'sonner';
import { formatDate } from "@/lib/utils";

interface Classification {
  id: string;
  code: string;
  category: string;
  label: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

const classificationCodes: string[] = ["CD", "LCD", "UCD", "LD", "RET", "REV", "INT", "CW", "IT", "ET", "LR", "LNT", "CO", "FEE", "VF", "MC", "CAMF", "VC", "WHT"];
const categories: string[] = ["DEPOSIT", "WITHDRAWAL", "CREDIT", "DEBIT"];

const Classification = () => {
  const {getClassifications, getClassificationById, updateClassification, deleteClassification, createClassification} = useClassifications();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [viewedClassification, setViewedClassification] = useState<Classification | null>(null);
  const [isLoadingView, setIsLoadingView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingClassificationId, setDeletingClassificationId] = useState<string | null>(null);
  const [newClassification, setNewClassification] = useState<Classification>({
    code: "",
    category: "DEPOSIT",
    label: "",
    description: "",
  });
  const [classifications, setClassifications] = useState<Classification[]>([]);
  // Action menu state
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [selectedClassificationForAction, setSelectedClassificationForAction] =
    useState<Classification | null>(null);
  const [selectedClassificationForEdit, setSelectedClassificationForEdit] =
    useState<Classification | null>(null); // State for the classification being edited
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const actionButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsLoading(true);
    getClassifications().then((data) => {
      if (data && Array.isArray(data)) {
        setClassifications(data);
      } else {
        setClassifications([]);
      }
    }).catch((error) => {
      console.error("Failed to fetch classifications:", error);
      setClassifications([]);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    setNewClassification({
      code: "",
      category: "DEPOSIT",
      label: "",
      description: "",
    });
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const openViewModal = async (classification: Classification) => {
    setIsViewModalOpen(true);
    setIsLoadingView(true);
    setIsActionMenuOpen(false);
    try {
      const data = await getClassificationById(classification.id);
      if (data) {
        setViewedClassification(data);
      } else {
        setViewedClassification(classification);
      }
    } catch (error) {
      console.error('Failed to load classification details:', error);
      setViewedClassification(classification);
    } finally {
      setIsLoadingView(false);
    }
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewedClassification(null);
  };

  const openEditModal = (classification: Classification) => {
    setSelectedClassificationForEdit(classification);
    setNewClassification(classification); // Initialize the form with the data to be edited
    setIsEditModalOpen(true);
    setIsActionMenuOpen(false); // Close action menu when opening edit modal
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedClassificationForEdit(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewClassification((prevClassification) => ({
      ...prevClassification,
      [name]: value,
    }));
  };
  const openActionMenu = (
    classification: Classification,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setSelectedClassificationForAction(classification);
    setIsActionMenuOpen(true);
  };

  const closeActionMenu = () => {
    setIsActionMenuOpen(false);
    setSelectedClassificationForAction(null);
  };
  const handleCreateClass = async () => {
    // Validation
    if (!newClassification.code || !newClassification.category || !newClassification.label) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isCreating) return;

    setIsCreating(true);
    try {
      const payload = {
        code: newClassification.code.trim(),
        category: newClassification.category,
        label: newClassification.label.trim(),
        description: newClassification.description.trim() || undefined
      };

      const result = await createClassification(payload);
      if (result) {
        // Refresh the list
        const data = await getClassifications();
        if (data && Array.isArray(data)) {
          setClassifications(data);
        }
        closeCreateModal();
      }
    } catch (error: any) {
      // Error is already handled in the hook, but we can add additional handling here if needed
      console.error('Error creating classification:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedClassificationForEdit) return;

    // Validation
    if (!newClassification.code || !newClassification.category || !newClassification.label) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsCreating(true);
    try {
      const payload = {
        code: newClassification.code.trim(),
        category: newClassification.category,
        label: newClassification.label.trim(),
        description: newClassification.description?.trim() || undefined
      };

      const result = await updateClassification(selectedClassificationForEdit.id, payload);
      if (result) {
        // Refresh the list
        setIsLoading(true);
        const data = await getClassifications();
        if (data && Array.isArray(data)) {
          setClassifications(data);
        }
        setIsLoading(false);
        closeEditModal();
      }
    } catch (error: any) {
      console.error('Error updating classification:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeletingClassificationId(id);
    setShowDeleteConfirm(true);
    closeActionMenu();
  };

  const handleDeleteClassification = async () => {
    if (!deletingClassificationId) return;

    setIsDeleting(true);
    try {
      const result = await deleteClassification(deletingClassificationId);
      if (result) {
        // Refresh the list
        setIsLoading(true);
        const data = await getClassifications();
        if (data && Array.isArray(data)) {
          setClassifications(data);
        }
        setIsLoading(false);
        setShowDeleteConfirm(false);
        setDeletingClassificationId(null);
      }
    } catch (error: any) {
      console.error('Error deleting classification:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletingClassificationId(null);
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto md:ml-64 pt-10 md:pt-10">
        <div className="mb-4">
          <Navbar />
        </div>
        <div className="flex-1 overflow-auto">
        
        <div className="bg-gray-100 min-h-full p-4 md:p-6">
          <div className="bg-white rounded-md shadow-md p-4 md:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-end mb-4">
                <button
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={openCreateModal}
                >
                  Create Class
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">
                        Code
                      </th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">
                        Category
                      </th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">
                        Label
                      </th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">
                        Description
                      </th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-gray-500">
                          Loading...
                        </td>
                      </tr>
                    ) : classifications.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-gray-500">
                          No classifications found
                        </td>
                      </tr>
                    ) : (
                      classifications.map((classification) => (
                        <tr
                          key={classification.id}
                          className="hover:bg-gray-50 text-gray-700"
                        >
                          <td className="py-2 px-4">{classification.code}</td>
                          <td className="py-2 px-4">{classification.category}</td>
                          <td className="py-2 px-4">{classification.label}</td>
                          <td className="py-2 px-4 truncate">{classification.description}</td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 relative">
                          <button
                            ref={actionButtonRef}
                            className="focus:outline-none"
                            onClick={(e) =>
                              openActionMenu(classification, e)
                            }
                          >
                            <img
                              src="/Users/action.svg"
                              alt="Dropdown Icon"
                              className="w-4 h-4 md:w-5 md:h-5"
                            />
                          </button>

                          {/* Action Popup */}
                          {isActionMenuOpen &&
                            selectedClassificationForAction?.id ===
                              classification.id && (
                              <div
                                ref={actionMenuRef}
                                className="absolute right-0 z-5000 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                              >
                                <div className="py-1">
                                  <button
                                    onClick={() =>
                                      openViewModal(classification)
                                    }
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={() =>
                                      openEditModal(classification)
                                    }
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteClick(classification.id)
                                    }
                                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left focus:outline-none"
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
            </div>
          </div>
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
                Create New Class
              </h3>
              <div className="mb-4">
                <label
                  htmlFor="code"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Classification Code <span className="text-red-500">*</span>
                </label>
                <select
                  id="code"
                  name="code"
                  onChange={handleInputChange}
                  value={newClassification.code}
                  className="mt-1 block w-full border border-gray-300 rounded-md text-black shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  required
                >
                  <option value="" disabled>
                    Select Code
                  </option>
                  {classificationCodes.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  onChange={handleInputChange}
                  value={newClassification.category}
                  className="mt-1 block w-full border border-gray-300 rounded-md text-black shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="label"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="label"
                  name="label"
                  value={newClassification.label}
                  onChange={handleInputChange}
                  placeholder="Enter label"
                  className="mt-1 block w-full border border-gray-300 rounded-md text-black shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newClassification.description}
                  onChange={handleInputChange}
                  placeholder="Enter description (optional)"
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md text-black shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
              <div className="flex items-center justify-end">
                <button
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                  onClick={handleCreateClass}
                  disabled={isCreating}
                >
                  {isCreating ? "Creating..." : "Create"}
                </button>
                <button
                  className="bg-transparent hover:bg-gray-200 text-orange-500 font-semibold py-2 px-4 border border-orange-500 rounded focus:outline-none focus:shadow-outline ml-2"
                  type="button"
                  onClick={closeCreateModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedClassificationForEdit && (
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
                Edit Classification
              </h3>
              <div className="mb-4">
                <label
                  htmlFor="edit-code"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Classification Code
                </label>
                <input
                  type="text"
                  id="edit-code"
                  name="code"
                  value={newClassification.code}
                  readOnly
                  className="mt-1 block w-full border border-gray-300 rounded-md text-gray-500 bg-gray-100 shadow-sm py-2 px-3 sm:text-sm cursor-not-allowed"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="edit-category"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="edit-category"
                  name="category"
                  onChange={handleInputChange}
                  value={newClassification.category}
                  className="mt-1 block w-full border border-gray-300 rounded-md text-black shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="edit-label"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="edit-label"
                  name="label"
                  value={newClassification.label}
                  onChange={handleInputChange}
                  placeholder="Enter label"
                  className="mt-1 block w-full border border-gray-300 rounded-md text-black shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="edit-description"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={newClassification.description || ""}
                  onChange={handleInputChange}
                  placeholder="Enter description (optional)"
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md text-black shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
              <div className="flex items-center justify-end">
                <button
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={isCreating}
                >
                  {isCreating ? "Saving..." : "Save Changes"}
                </button>
                <button
                  className="bg-transparent hover:bg-gray-200 text-orange-500 font-semibold py-2 px-4 border border-orange-500 rounded focus:outline-none focus:shadow-outline ml-2"
                  type="button"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && viewedClassification && (
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
                Classification Details
              </h3>
              {isLoadingView ? (
                <p className="text-gray-500 text-center py-4">Loading...</p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">
                      Code
                    </label>
                    <p className="text-gray-900 text-sm">{viewedClassification.code}</p>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">
                      Category
                    </label>
                    <p className="text-gray-900 text-sm">{viewedClassification.category}</p>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">
                      Label
                    </label>
                    <p className="text-gray-900 text-sm">{viewedClassification.label}</p>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">
                      Description
                    </label>
                    <p className="text-gray-900 text-sm">{viewedClassification.description || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">
                      Created At
                    </label>
                    <p className="text-gray-900 text-sm">{viewedClassification.createdAt ? formatDate(viewedClassification.createdAt) : "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">
                      Updated At
                    </label>
                    <p className="text-gray-900 text-sm">{viewedClassification.updatedAt ? formatDate(viewedClassification.updatedAt) : "N/A"}</p>
                  </div>
                </div>
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
                Are you sure you want to delete this classification? This action cannot be undone.
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
                onClick={handleDeleteClassification}
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

export default Classification;

