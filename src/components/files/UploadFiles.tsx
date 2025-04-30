"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaCloudUploadAlt,
  FaFileUpload,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";
import Sidebar from "../utility/Sidebar";

const UploadFiles = () => {

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  // Simulate file upload progress
  useEffect(() => {
    if (isUploading) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          // Simulate upload completion delay
          setTimeout(() => {
            setIsUploading(false);
            // Redirect to another page after successful upload
            router.push("/SavedFiles"); // Replace '/dashboard' with your desired route
          }, 1000);
        }
      }, 300); // Adjust interval for faster/slower simulation
      return () => clearInterval(interval);
    }
  }, [isUploading, router]);

  const handleUploadClick = () => {
    setIsUploading(true);
    setUploadProgress(0);
    // In a real application, you would trigger the actual file upload here
    // using an API call.
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
    {/* Sidebar */}
    <Sidebar />

    {/* Main Content */}
    <div className="flex-1 p-6 bg-white shadow-md rounded-lg overflow-y-auto">
    <div className="bg-gray-100 min-h-screen p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button className="flex items-center gap-2 text-gray-600">
          <FaArrowLeft />
          Upload Bank Statement
        </button>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full text-gray-600 hover:bg-gray-200">
            <FaBell size={20} />
          </button>
          <div className="flex items-center">
            <FaUserCircle size={30} className="text-gray-500" />
            <div className="ml-2 text-right">
              <div className="text-sm font-semibold text-gray-700">
                Charles John
              </div>
              <div className="text-xs text-gray-500">
                charles.john@gmail.com
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-md shadow-md p-8 flex flex-col items-center justify-center">
        {!isUploading ? (
          <>
            <div className="relative w-32 h-32 mb-4">
              <div className="absolute inset-0 bg-orange-200 rounded-full flex items-center justify-center text-orange-500 text-4xl opacity-75">
                <FaCloudUploadAlt />
              </div>
              {/* You might want to add a file upload icon here */}
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Upload Bank Statement
            </h2>
            <p className="text-center text-gray-500 mb-4">
              Click below to upload your bank statement.
            </p>
            <button
              onClick={handleUploadClick}
              className="bg-orange-500 text-white py-2 px-8 rounded-md hover:bg-orange-600 focus:outline-none"
            >
              Upload File
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="relative w-32 h-32 mb-4">
              <div className="absolute inset-0 bg-orange-200 rounded-full flex items-center justify-center text-orange-500 text-4xl opacity-75">
                <FaCloudUploadAlt />
              </div>
              {/* You might want to add a loading/uploading icon here */}
            </div>
            <div className="text-xl font-semibold text-gray-700 mb-2">
              Uploading File...
            </div>
            <div className="text-gray-500 mb-4">
              {uploadProgress}%
            </div>
            <div className="w-64 bg-gray-200 rounded-full h-6">
              <div
                className="bg-green-500 rounded-full h-6"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            {uploadProgress === 100 && (
              <div className="mt-4 text-green-500 font-semibold">
                Upload Complete. Redirecting...
              </div>
            )}
          </div>
        )}
      </div>
    </div>

    </div>
    </div>
  );
};

export default UploadFiles;