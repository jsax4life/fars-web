"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../utility/Sidebar";
import { FiX } from "react-icons/fi";

interface Classification {
  code: string;
  description: string;
  category: string;
}

const classificationCodes: string[] = Array.from(
  { length: 11 },
  (_, i) => `Code ${i + 1}`
);
const categories: string[] = ["Debit", "Credit"];

const Classification = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newClassification, setNewClassification] = useState<Classification>({
    code: "",
    description: "NGN",
    category: "Debit",
  });
  const [classifications, setClassifications] = useState<Classification[]>([]);

  useEffect(() => {
    const initialData: Classification[] = [
      { code: "Code 1", description: "Nigerian Naira", category: "Debit" },
      { code: "Code 2", description: "Nigerian Naira", category: "Credit" },
      { code: "Code 3", description: "Nigerian Naira", category: "Debit" },
    ];
    setClassifications(initialData);
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    setNewClassification({ code: "", description: "NGN", category: "Debit" });
  };

  const closeModal = () => {
    setIsModalOpen(false);
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

  const handleCreateClass = () => {
    setClassifications((prevClassifications) => [
      ...prevClassifications,
      newClassification,
    ]);
    closeModal();
  };

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
                  onClick={openModal}
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
                    </tr>
                  </thead>
                  <tbody>
                    {classifications.map((classification, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 text-gray-700"
                      >
                        <td className="py-2 px-4">{classification.code}</td>
                        <td className="py-2 px-4">
                          {classification.description}
                        </td>
                        <td className="py-2 px-4">{classification.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-end p-2">
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={closeModal}
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
                  onClick={closeModal}
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