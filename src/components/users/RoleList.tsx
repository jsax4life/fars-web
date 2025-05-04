"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Sidebar from "../utility/Sidebar";
import { useRouter } from "next/navigation";

const RoleList = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [permissions, setPermissions] = useState({
    setCommission: false,
    editCommission: false,
    option3: false,
    option4: false,
    option5: false,
  });
  const modalRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ roleTitle, permissions });
    setIsModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle edit form submission here
    console.log({ currentRole, permissions });
    setIsEditModalOpen(false);
  };

  const togglePermission = (permission: keyof typeof permissions) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }));
  };

  const handleRoleClick = (role: string) => {
    setCurrentRole(role);
    setIsEditModalOpen(true);
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
        setIsEditModalOpen(false);
      }
    };

    if (isModalOpen || isEditModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen, isEditModalOpen]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-[#F36F2E] transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-1" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                clipRule="evenodd" 
              />
            </svg>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Admin</h2>
          </button>

          {/* Greeting and Date */}
          <div className="mt-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Hi, Olayimmika</h1>
            <p className="text-gray-500 text-xs sm:text-sm">June 18th 2023 - 08:34 am</p>
          </div>
        </div>

        {/* Admin Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Admin</h2>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-[#F36F2E] hover:bg-[#E05C2B] text-white py-2 px-4 rounded-md text-sm transition-colors"
            >
              Create New Role
            </button>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-4">
          {/* Role Cards Section */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button 
                onClick={() => handleRoleClick("Super admin")}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:border-[#F36F2E] hover:text-[#F36F2E] transition-colors shadow-sm"
              >
                <span className="text-sm sm:text-base font-bold text-[#404141]">Admin/Staff</span>
                <span className="text-gray-400">→</span>
              </button>
              <button 
                onClick={() => handleRoleClick("Client/Staff")}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:border-[#F36F2E] hover:text-[#F36F2E] transition-colors shadow-sm"
              >
                <span className="text-sm sm:text-base font-bold text-[#404141]">Client/Staff</span>
                <span className="text-gray-400">→</span>
              </button>
              <button 
                onClick={() => handleRoleClick("Bank")}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:border-[#F36F2E] hover:text-[#F36F2E] transition-colors shadow-sm"
              >
                <span className="text-sm sm:text-base font-bold text-[#404141]">Bank</span>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Create New Role Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md mx-2 sm:mx-0" ref={modalRef}>
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className="text-lg font-bold text-black">Create New Role</h3>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4 sm:mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F36F2E] focus:border-transparent"
                      placeholder="Enter Role Title"
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4 sm:mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Assign Permission <span className="text-red-500">*</span></h4>
                    
                    <div className="space-y-2">
                      {Object.entries(permissions).map(([key, value]) => (
                        <div key={key} className="p-2 rounded-md">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-black">
                              {key.split(/(?=[A-Z])/).join(' ').replace(/^./, str => str.toUpperCase())}
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={value as boolean}
                                onChange={() => togglePermission(key as keyof typeof permissions)}
                              />
                              <div className={`w-10 h-6 rounded-full peer ${value ? 'bg-[#F36F2E]' : 'bg-gray-300'}`}></div>
                              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${value ? 'transform translate-x-4' : ''}`}></div>
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas sem massa dui placerat ut sit.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-2 sm:px-4 sm:py-2 bg-[#F36F2E] text-white rounded-md hover:bg-[#E05C2B] transition-colors text-sm"
                    >
                      Create Role
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Role Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md mx-2 sm:mx-0" ref={modalRef}>
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className="text-lg font-bold text-black">Edit {currentRole}</h3>
                  <button 
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-4 sm:mb-6">
                    <div className="space-y-2">
                      {Object.entries(permissions).map(([key, value]) => (
                        <div key={key} className="p-2 rounded-md">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-black">
                              {key.split(/(?=[A-Z])/).join(' ').replace(/^./, str => str.toUpperCase())}
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={value as boolean}
                                onChange={() => togglePermission(key as keyof typeof permissions)}
                              />
                              <div className={`w-10 h-6 rounded-full peer ${value ? 'bg-[#F36F2E]' : 'bg-gray-300'}`}></div>
                              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${value ? 'transform translate-x-4' : ''}`}></div>
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas sem massa dui placerat ut sit.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-2 sm:px-4 sm:py-2 bg-[#F36F2E] text-white rounded-md hover:bg-[#E05C2B] transition-colors text-sm"
                    >
                      Update Role
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RoleList;