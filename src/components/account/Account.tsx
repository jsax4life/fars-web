"use client";

import React, { useState } from "react";
import { FaSearch, FaFilter, FaArchive } from "react-icons/fa";
import Sidebar from "@/components/utility/Sidebar";

const Account = () => {
  const [activeTab, setActiveTab] = useState("Entry");
  const transactions = [
    { sNo: "01", entryDate: "02 - 04 - 2023", transactionDate: "02 - 04 - 2023", valueDate: "02 - 04 - 2023", tellerNumber: "N/A", transactionDescription: "Principal LIQ-406965523730001", transactionType: "Cash/Cheque", chequeNo: "Nil", originalValue: "44,897,985.89" },
    { sNo: "02", entryDate: "02 - 04 - 2023", transactionDate: "02 - 04 - 2023", valueDate: "02 - 04 - 2023", tellerNumber: "U000001333", transactionDescription: "Debetuje baje ide Oluola", transactionType: "Cash/Cheque", chequeNo: "Cash", originalValue: "100,000.00" },
    { sNo: "03", entryDate: "02 - 04 - 2023", transactionDate: "02 - 04 - 2023", valueDate: "02 - 04 - 2023", tellerNumber: "0000001333", transactionDescription: "Bebetuje baje ide Oluola", transactionType: "CHG", chequeNo: "CHG", originalValue: "400,000.00" },
    { sNo: "04", entryDate: "02 - 04 - 2023", transactionDate: "02 - 04 - 2023", valueDate: "02 - 04 - 2023", tellerNumber: "N/A", transactionDescription: "Electronic Money Transfer Levy", transactionType: "Cash/Cheque", chequeNo: "736685940013", originalValue: "465,897.00" },
    { sNo: "05", entryDate: "02 - 04 - 2023", transactionDate: "02 - 04 - 2023", valueDate: "02 - 04 - 2023", tellerNumber: "N/A", transactionDescription: "SMS Charge, November 2023", transactionType: "Cash/Cheque", chequeNo: "Nil", originalValue: "100,000.00" },
    { sNo: "06", entryDate: "02 - 04 - 2023", transactionDate: "02 - 04 - 2023", valueDate: "02 - 04 - 2023", tellerNumber: "N/A", transactionDescription: "Transfer Charge - FCO 34899999999", transactionType: "Cash/Cheque", chequeNo: "736685940013", originalValue: "300,000.00" },
    { sNo: "07", entryDate: "02 - 04 - 2023", transactionDate: "02 - 04 - 2023", valueDate: "02 - 04 - 2023", tellerNumber: "0000002623", transactionDescription: "IBTC Place, Water kano, Lagos", transactionType: "Cash/Cheque", chequeNo: "736685940013", originalValue: "300,000.00" },
    { sNo: "08", entryDate: "02 - 04 - 2023", transactionDate: "02 - 04 - 2023", valueDate: "02 - 04 - 2023", tellerNumber: "GF20231040", transactionDescription: "Electronic Money Transfer Levy", transactionType: "Cash/Cheque", chequeNo: "736685940013", originalValue: "465,897.00" },
    { sNo: "09", entryDate: "02 - 04 - 2023", transactionDate: "03 - 04 - 2023", valueDate: "03 - 04 - 2023", tellerNumber: "U000003774", transactionDescription: "SMS Charge, October 2023", transactionType: "CHG", chequeNo: "CHG", originalValue: "400,000.00" },
    { sNo: "10", entryDate: "02 - 04 - 2023", transactionDate: "03 - 04 - 2023", valueDate: "03 - 04 - 2023", tellerNumber: "7108001649", transactionDescription: "Principal LIQ-406965523730001", transactionType: "Cash/Cheque", chequeNo: "CHG", originalValue: "465,897.00" },
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Fixed Sidebar - assuming your sidebar is 64px wide */}
      <div className="fixed h-full w-64">
        <Sidebar />
      </div>

      {/* Scrollable Main Content */}
      <div className="flex-1 ml-64 overflow-auto">
        <div className="bg-gray-100 min-h-full p-6">
          <div className="bg-white rounded-md shadow-md p-6">
            <div className="mb-4 flex border-b border-gray-200">
              <button
                onClick={() => handleTabChange("Entry")}
                className={`py-2 px-4 -mb-px font-semibold text-sm ${
                  activeTab === "Entry"
                    ? "border-b-2 border-orange-500 text-orange-500"
                    : "text-gray-500 hover:text-orange-500"
                } focus:outline-none`}
              >
                Entry
              </button>
              <button
                onClick={() => handleTabChange("Reconstructed Statement")}
                className={`py-2 px-4 -mb-px font-semibold text-sm ${
                  activeTab === "Reconstructed Statement"
                    ? "border-b-2 border-orange-500 text-orange-500"
                    : "text-gray-500 hover:text-orange-500"
                } focus:outline-none`}
              >
                Reconstructed Statement
              </button>
              <button
                onClick={() => handleTabChange("Bank Statement")}
                className={`py-2 px-4 -mb-px font-semibold text-sm ${
                  activeTab === "Bank Statement"
                    ? "border-b-2 border-orange-500 text-orange-500"
                    : "text-gray-500 hover:text-orange-500"
                } focus:outline-none`}
              >
                Bank Statement
              </button>
              <button
                onClick={() => handleTabChange("Cash Back")}
                className={`py-2 px-4 -mb-px font-semibold text-sm ${
                  activeTab === "Cash Back"
                    ? "border-b-2 border-orange-500 text-orange-500"
                    : "text-gray-500 hover:text-orange-500"
                } focus:outline-none`}
              >
                Cash Back
              </button>
              <button
                onClick={() => handleTabChange("Trans Matched")}
                className={`py-2 px-4 -mb-px font-semibold text-sm ${
                  activeTab === "Trans Matched"
                    ? "border-b-2 border-orange-500 text-orange-500"
                    : "text-gray-500 hover:text-orange-500"
                } focus:outline-none`}
              >
                Trans Matched
              </button>
              <button
                onClick={() => handleTabChange("Query")}
                className={`py-2 px-4 -mb-px font-semibold text-sm ${
                  activeTab === "Query"
                    ? "border-b-2 border-orange-500 text-orange-500"
                    : "text-gray-500 hover:text-orange-500"
                } focus:outline-none`}
              >
                Query
              </button>
            </div>

            <div className="flex flex-col items-start gap-4 mb-4">
              <div className="font-semibold text-xl mr-4">Account Selection</div>
              <div className="flex items-center mb-4">
                <div className="relative mr-2">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 sm:text-sm"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <FaSearch />
                  </div>
                </div>
                <div className="relative mr-2">
                  <input
                    type="text"
                    placeholder="Account Number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="relative mr-4">
                  <input
                    type="text"
                    placeholder="Account Code"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <button className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none sm:text-sm">
                  Create New
                </button>
              </div>
            </div>

            {activeTab === "Entry" && (
              <>
                <div className="overflow-x-auto">
                  <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Number</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Address</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map((transaction) => (
                          <tr key={transaction.sNo}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.sNo}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.entryDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.transactionDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.valueDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.tellerNumber}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{transaction.transactionDescription}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.transactionType}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.chequeNo}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                              <button>
                                <img
                                  src="/Users/action.svg"
                                  alt="Dropdown Icon"
                                  className="w-4 h-4 md:w-5 md:h-5"
                                />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Showing 1 to {transactions.length} of {transactions.length} entries
                </div>
              </>
            )}

            {activeTab !== "Entry" && (
              <div className="py-6 text-center text-gray-500">
                Content for "{activeTab}" tab will be displayed here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;