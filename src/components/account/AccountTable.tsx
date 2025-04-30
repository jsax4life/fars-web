"use client";

import React from "react";
import Sidebar from "@/components/utility/Sidebar"; // Assuming Sidebar.js is in your components directory

const AccountTable = () => {
  // Sample data matching your image
  const accounts = [
    {
      id: 1,
      date: "02 - 04 - 2023",
      name: "Tata Aprira, Fafa",
      number: "0801013001",
      type: "Chequing",
      symbol: "NGN",
      bank: "Access Bank PLC",
      address: "V1 Lupus, Lupus, Nigeria",
      status: "Active"
    },
    {
      id: 2,
      date: "03 - 04 - 2023",
      name: "Abdullah Ayubami",
      number: "0801013001",
      type: "Chequing",
      symbol: "NGN",
      bank: "Diamond Bank PLC",
      address: "Marine Lupus, Lupus, Nigeria",
      status: "Active"
    },
    {
      id: 3,
      date: "05 - 04 - 2023",
      name: "Kuzumi Kawu",
      number: "0801013001",
      type: "Savings",
      symbol: "NGN",
      bank: "First Bank PLC",
      address: "36 Marine Lupus, Lupus, Nigeria",
      status: "Active"
    },
    // Add more accounts as needed...
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Hi, Olayimmika</h1>
          <p className="text-sm text-gray-500">
            June 18th 2023 - 08:34 am
          </p>
        </div>

        {/* Account Actions */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          <div className="flex space-x-4 mb-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Close Account
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Re-open Account
            </button>
            <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
              Cheque Stock
            </button>
            <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
              Printer Set up
            </button>
            <button className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600">
              Plan
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              Exit
            </button>
          </div>

          {/* Search Section */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Selection</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Q. Search"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Account Number"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Account Code"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-4 border-t border-gray-300" />

        {/* Account Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md p-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accounts.map((account, index) => (
                <tr key={account.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{account.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.symbol}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.bank}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      account.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {account.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="mt-4 text-sm text-gray-500">
          Showing 1 to 10 of 38 entries
        </div>
      </div>
    </div>
  );
};

export default AccountTable;