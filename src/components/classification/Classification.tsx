"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../utility/Sidebar";
import { FiX } from "react-icons/fi";

interface Classification {
  code: string;
  description: string;
  category: string;
  id: string; // Add an ID for each classification
}

const classificationCodes: string[] = Array.from(
  { length: 11 },
  (_, i) => `Code ${i + 1}`
);
const categories: string[] = ["Debit", "Credit"];

const Classification = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [newClassification, setNewClassification] = useState<Classification>({
    code: "",
    description: "NGN",
    category: "Debit",
    id: "",
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
    const initialData: Classification[] = [
      {
        code: "Code 1",
        description: "Nigerian Naira",
        category: "Debit",
        id: "1",
      },
      {
        code: "Code 2",
        description: "Nigerian Naira",
        category: "Credit",
        id: "2",
      },
      {
        code: "Code 3",
        description: "Nigerian Naira",
        category: "Debit",
        id: "3",
      },
    ];
    setClassifications(initialData);
  }, []);

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    setNewClassification({
      code: "",
      description: "NGN",
      category: "Debit",
      id: "",
    });
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
  const handleCreateClass = () => {
    if (!newClassification.code || !newClassification.category) return;
    const newClassWithId = { ...newClassification, id: crypto.randomUUID() };
    setClassifications((prevClassifications) => [
      ...prevClassifications,
      newClassWithId,
    ]);
    closeCreateModal();
  };

  const handleSaveChanges = () => {
    if (!newClassification.code || !newClassification.category) return;
    if (selectedClassificationForEdit) {
      // Update the existing classification
      setClassifications((prevClassifications) =>
        prevClassifications.map((c) =>
          c.id === selectedClassificationForEdit.id
            ? { ...newClassification, id: selectedClassificationForEdit.id }
            : c
        )
      );
    }
    closeEditModal();
  };

  const handleDeleteClassification = (id: string) => {
    setClassifications((prevClassifications) =>
      prevClassifications.filter((c) => c.id !== id)
    );
    closeActionMenu();
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
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar (fixed on medium and larger screens) */}
      <div className="md:block fixed h-full w-64">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-auto mt-16 md:mt-0 md:ml-64">
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
                        Classification Code
                      </th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">
                        Description
                      </th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">
                        Category
                      </th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {classifications.map((classification) => (
                      <tr
                        key={classification.id}
                        className="hover:bg-gray-50 text-gray-700"
                      >
                        <td className="py-2 px-4">{classification.code}</td>
                        <td className="py-2 px-4">
                          {classification.description}
                        </td>
                        <td className="py-2 px-4">{classification.category}</td>
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
                                      openEditModal(classification)
                                    }
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteClassification(
                                        classification.id
                                      )
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
                    ))}
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
                  Classification Code
                </label>
                <select
                  id="code"
                  name="code"
                  onChange={handleInputChange}
                  value={newClassification.code}
                  className="mt-1 block w-full border border-gray-300 rounded-md text-black shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm bg-gray-100"
                >
                  <option value="" disabled>
                    Select Date-Range
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
                  htmlFor="description"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={newClassification.description}
                  className="mt-1 block w-full border border-gray-300 rounded-md text-black shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm bg-gray-100"
                  readOnly
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="category"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  onChange={handleInputChange}
                  value={newClassification.category}
                  className="mt-1 block w-full border border-gray-300 rounded-md text-black shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm bg-gray-100"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-end">
                <button
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handleCreateClass}
                >
                  OK
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
                <select
                  id="edit-code"
                  name="code"
                  onChange={handleInputChange}
                  value={newClassification.code}
                  className="mt-1 block w-full border border-gray-300 rounded-md text-black shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm bg-gray-100"
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
                  htmlFor="edit-description"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Description
                </label>
                <input
                  type="text"
                  id="edit-description"
                  name="description"
                  value={newClassification.description}
                  className="mt-1 block w-full border border-gray-300 rounded-md text-black shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm bg-gray-100"
                  readOnly
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="edit-category"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Category
                </label>
                <select
                  id="edit-category"
                  name="category"
                  onChange={handleInputChange}
                  value={newClassification.category}
                  className="mt-1 block w-full border border-gray-300 rounded-md text-black shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm bg-gray-100"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-end">
                <button
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handleSaveChanges}
                >
                  Save Changes
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
    </div>
  );
};

export default Classification;

