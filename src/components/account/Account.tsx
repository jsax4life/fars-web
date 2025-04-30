"use client";

import React, { useState } from "react";
import {
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaCaretDown,
  FaArchive,
} from "react-icons/fa";
import Sidebar from "@/components/utility/Sidebar";

const Account = () => {
  const [activeTab, setActiveTab] = useState("Entry");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [transactions, setTransactions] = useState([
    {
      sNo: "01",
      entryDate: "02 - 04 - 2023",
      transactionDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      tellerNumber: "N/A",
      transactionDescription: "Principal LIQ-406965523730001",
      transactionType: "Cash/Cheque",
      chequeNo: "Nil",
      originalValue: "44,897,985.89",
      debit: "44,897,985.89",
      credit: "",
    },
    {
      sNo: "02",
      entryDate: "02 - 04 - 2023",
      transactionDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      tellerNumber: "U000001333",
      transactionDescription: "Debetuje baje ide Oluola",
      transactionType: "Cash/Cheque",
      chequeNo: "Cash",
      originalValue: "100,000.00",
      debit: "100,000.00",
      credit: "",
    },
    {
      sNo: "03",
      entryDate: "02 - 04 - 2023",
      transactionDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      tellerNumber: "0000001333",
      transactionDescription: "Bebetuje baje ide Oluola",
      transactionType: "CHG",
      chequeNo: "CHG",
      originalValue: "400,000.00",
      debit: "400,000.00",
      credit: "",
    },
    {
      sNo: "04",
      entryDate: "02 - 04 - 2023",
      transactionDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      tellerNumber: "N/A",
      transactionDescription: "Electronic Money Transfer Levy",
      transactionType: "Cash/Cheque",
      chequeNo: "736685940013",
      originalValue: "465,897.00",
      debit: "465,897.00",
      credit: "",
    },
    {
      sNo: "05",
      entryDate: "02 - 04 - 2023",
      transactionDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      tellerNumber: "N/A",
      transactionDescription: "SMS Charge, November 2023",
      transactionType: "Cash/Cheque",
      chequeNo: "Nil",
      originalValue: "100,000.00",
      debit: "100,000.00",
      credit: "",
    },
    {
      sNo: "06",
      entryDate: "02 - 04 - 2023",
      transactionDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      tellerNumber: "N/A",
      transactionDescription: "Transfer Charge - FCO 34899999999",
      transactionType: "Cash/Cheque",
      chequeNo: "736685940013",
      originalValue: "300,000.00",
      debit: "300,000.00",
      credit: "",
    },
    {
      sNo: "07",
      entryDate: "02 - 04 - 2023",
      transactionDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      tellerNumber: "0000002623",
      transactionDescription: "IBTC Place, Water kano, Lagos",
      transactionType: "Cash/Cheque",
      chequeNo: "736685940013",
      originalValue: "300,000.00",
      debit: "300,000.00",
      credit: "",
    },
    {
      sNo: "08",
      entryDate: "02 - 04 - 2023",
      transactionDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      tellerNumber: "GF20231040",
      transactionDescription: "Electronic Money Transfer Levy",
      transactionType: "Cash/Cheque",
      chequeNo: "736685940013",
      originalValue: "465,897.00",
      debit: "465,897.00",
      credit: "",
    },
    {
      sNo: "09",
      entryDate: "02 - 04 - 2023",
      transactionDate: "03 - 04 - 2023",
      valueDate: "03 - 04 - 2023",
      tellerNumber: "U000003774",
      transactionDescription: "SMS Charge, October 2023",
      transactionType: "CHG",
      chequeNo: "CHG",
      originalValue: "400,000.00",
      debit: "400,000.00",
      credit: "",
    },
    {
      sNo: "10",
      entryDate: "02 - 04 - 2023",
      transactionDate: "03 - 04 - 2023",
      valueDate: "03 - 04 - 2023",
      tellerNumber: "7108001649",
      transactionDescription: "Principal LIQ-406965523730001",
      transactionType: "Cash/Cheque",
      chequeNo: "CHG",
      originalValue: "465,897.00",
      debit: "465,897.00",
      credit: "",
    },
  ]);

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    // In a real application, you would fetch data based on the selected tab
  };
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white rounded-md shadow-md p-6">
        {/* Account Header */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Account</h2>
          <div className="flex space-x-4">
            <button className="text-sm text-gray-600 hover:text-orange-500 focus:outline-none">
              Close Account
            </button>
            <button className="text-sm text-gray-600 hover:text-orange-500 focus:outline-none">
              Re-open Account
            </button>
            <button className="text-sm text-gray-600 hover:text-orange-500 focus:outline-none">
              Cheque Book
            </button>
            <button className="text-sm text-gray-600 hover:text-orange-500 focus:outline-none">
              Cheque Stop
            </button>
            <button className="text-sm text-gray-600 hover:text-orange-500 focus:outline-none">
              Printer Set Up
            </button>
            <button className="text-sm text-gray-600 hover:text-orange-500 focus:outline-none">
              PIN
            </button>
            <button className="text-sm text-gray-600 hover:text-orange-500 focus:outline-none">
              Exit
            </button>
          </div>
          <hr className="my-3" />
        </div>

        {/* Account Selection */}
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
              Account Name
            </label>
            <input
              type="text"
              id="accountName"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="dateRange"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="balance" className="block text-sm font-medium text-gray-700 mb-1">
              Balance
            </label>
            <div className="space-y-1">
              <div className="flex items-center">
                <input type="radio" id="cleared" name="balanceType" className="mr-2" />
                <label htmlFor="cleared" className="text-sm text-gray-700">
                  Cleared
                </label>
              </div>
              <div className="flex items-center">
                <input type="radio" id="uncleared" name="balanceType" className="mr-2" />
                <label htmlFor="uncleared" className="text-sm text-gray-700">
                  Uncleared
                </label>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Account Number
            </label>
            <input
              type="text"
              id="accountNumber"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <div className="relative">
              <select
                id="currency"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10 cursor-pointer"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option>NGN</option>
                {/* Add more currency options */}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FaCaretDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="bank" className="block text-sm font-medium text-gray-700 mb-1">
              Bank
            </label>
            <input
              type="text"
              id="bank"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              readOnly
              value="Your Bank" // Replace with actual bank info
            />
          </div>
          <div>
            <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-1">
              Account Type
            </label>
            <input
              type="text"
              id="accountType"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="clearedBalance" className="block text-sm font-medium text-gray-700 mb-1">
              Cleared
            </label>
            <input
              type="text"
              id="clearedBalance"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              readOnly
              value="0.00" // Replace with actual cleared balance
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              id="address"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              readOnly
              value="Your Bank Address" // Replace with actual bank address
            />
          </div>
          <div>
            <label htmlFor="unclearedBalance" className="block text-sm font-medium text-gray-700 mb-1">
              Uncleared
            </label>
            <input
              type="text"
              id="unclearedBalance"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              readOnly
              value="0.00" // Replace with actual uncleared balance
            />
          </div>
          <div>
            <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              id="address2"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              readOnly
              value="Another Address Line" // Replace with actual bank address line 2
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-4 flex border-b border-gray-200">
          <button
            onClick={() => handleTabChange("Entry")}
            className={`py-2 px-4 -mb-px font-semibold text-sm ${
              activeTab === "Entry"
                ? "border-b-2 border-orange-500 text-orange-500"
                : "text-gray-500 hover:text-orange-500"
            } focus:outline-none`}
          >
            Entry</button>
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

        {/* Search and Filter for Active Tab (Entry in this case) */}
        {activeTab === "Entry" && (
          <div className="mb-4 flex items-center">
            <div className="relative flex-grow mr-2">
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <FaSearch />
              </div>
            </div>
            <button className="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 focus:outline-none mr-2">
              <FaFilter />
            </button>
            <button className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none sm:text-sm">
              <FaArchive className="mr-2" />
              Archive
            </button>
          </div>
        )}

        {/* Transaction List (Visible when Entry tab is active) */}
        {activeTab === "Entry" && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S/N
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teller Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cheque No.
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Original Value
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Debit
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credit
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.sNo}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.sNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.entryDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.transactionDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.valueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.tellerNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {transaction.transactionDescription}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.transactionType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.chequeNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                      {transaction.originalValue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-500">
                      {transaction.debit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-500">
                      {transaction.credit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== "Entry" && (
          <div className="py-6 text-center text-gray-500">
            Content for "{activeTab}" tab will be displayed here.
          </div>
        )}

        {/* Pagination */}
        {activeTab === "Entry" && (
          <div className="mt-4 text-sm text-gray-500">
            Showing 1 to 10 of {transactions.length} entries
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Account;