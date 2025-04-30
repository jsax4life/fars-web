"use client";

import React from "react";
import {
  FaArrowLeft,
  FaSearch,
  FaFilter,
  FaFilePdf,
  FaFileWord,
  FaSortAmountDown,
  FaDownload,
  FaEye,
  FaTrashAlt,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";
import Sidebar from "../utility/Sidebar";

const SavedFiles = () => {
  const fileData = [
    {
      id: 1,
      type: "PDF",
      name: "Investment Contracts",
      filename: "investment_contracts.pdf",
      author: "Kelechi David Eze",
      date: "17 days ago at 7:47 am",
      size: "132.73 KB",
      timeLeft: "23 Days left",
    },
    {
      id: 2,
      type: "PDF",
      name: "Investment Contracts",
      filename: "investment_contracts.pdf",
      author: "Kelechi David Eze",
      date: "17 days ago at 7:47 am",
      size: "132.73 KB",
      timeLeft: "23 Days left",
    },
    {
      id: 3,
      type: "PDF",
      name: "Investment Contracts",
      filename: "investment_contracts.pdf",
      author: "Kelechi David Eze",
      date: "17 days ago at 7:47 am",
      size: "132.73 KB",
      timeLeft: "23 Days left",
    },
    {
      id: 4,
      type: "CSV",
      name: "Investment Contracts",
      filename: "investment_contracts.pdf",
      author: "Kelechi David Eze",
      date: "17 days ago at 7:47 am",
      size: "132.73 KB",
      timeLeft: "23 Days left",
    },
    {
      id: 5,
      type: "CSV",
      name: "Investment Contracts",
      filename: "investment_contracts.pdf",
      author: "Kelechi David Eze",
      date: "17 days ago at 7:47 am",
      size: "132.73 KB",
      timeLeft: "23 Days left",
    },
  ];

  const pdfFiles = fileData.filter((file : any) => file.type === "PDF");
  const csvFiles = fileData.filter((file : any) => file.type === "CSV");

  return (
    <div className="flex min-h-screen bg-gray-100">
    {/* Sidebar */}
    <Sidebar />

    {/* Main Content */}
    <div className="flex-1 p-6 bg-white shadow-md rounded-lg overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <button className="flex items-center gap-2 text-gray-600">
          <FaArrowLeft />
          Saved Files
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

      {/* Search and Filter */}
      <div className="flex items-center mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <FaSearch />
          </div>
        </div>
        <button className="ml-2 p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-200">
          <FaFilter />
        </button>
        <button className="ml-auto bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none">
          <FaSortAmountDown className="mr-2" />
          Sort
        </button>
        <button className="ml-2 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none">
          <FaDownload className="mr-2" />
          Download
        </button>
      </div>

      {/* PDF Files */}
      {pdfFiles.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">PDF</h2>
          <div className="bg-white rounded-md shadow-sm">
            {pdfFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center border-b last:border-b-0 p-4"
              >
                <div className="w-10 h-10 rounded-md bg-red-100 flex items-center justify-center text-red-500">
                  <FaFilePdf size={20} />
                </div>
                <div className="ml-3 flex-grow">
                  <div className="text-sm font-medium text-gray-700">
                    {file.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {file.filename} by {file.author}, {file.date} - {file.size}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mr-4">
                  {file.timeLeft}
                </div>
                <button className="text-gray-600 hover:text-blue-500 focus:outline-none mr-2">
                  <FaEye />
                  <span className="ml-1 text-xs">Preview</span>
                </button>
                <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
                  <FaDownload />
                </button>
                <button className="text-gray-600 hover:text-red-500 focus:outline-none ml-2">
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CSV Files */}
      {csvFiles.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">CSV</h2>
          <div className="bg-white rounded-md shadow-sm">
            {csvFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center border-b last:border-b-0 p-4"
              >
                <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center text-blue-500">
                  <FaFileWord size={20} />
                </div>
                <div className="ml-3 flex-grow">
                  <div className="text-sm font-medium text-gray-700">
                    {file.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {file.filename} by {file.author}, {file.date} - {file.size}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mr-4">
                  {file.timeLeft}
                </div>
                <button className="text-gray-600 hover:text-blue-500 focus:outline-none mr-2">
                  <FaEye />
                  <span className="ml-1 text-xs">Preview</span>
                </button>
                <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
                  <FaDownload />
                </button>
                <button className="text-gray-600 hover:text-red-500 focus:outline-none ml-2">
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default SavedFiles;