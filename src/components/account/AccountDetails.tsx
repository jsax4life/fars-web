"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaSearch, FaFilter, FaArchive } from "react-icons/fa";
import Sidebar from "@/components/utility/Sidebar";
import Link from "next/link";

interface Transaction {
  sNo: string;
  entryDate: string;
  transactionDate: string;
  valueDate: string;
  tellerNumber: string;
  transactionDescription: string;
  transactionType: string;
  chequeNo: string;
  originalValue: string;
}

const AccountDetails = () => {
  const [activeTab, setActiveTab] = useState("Entry");
  const [activeAccount, setActiveAccount] = useState("Account");

  const transactions: Transaction[] = [
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
    },
    {
      sNo: "08",
      entryDate: "02 - 04 - 2023",
      transactionDate: "03 - 04 - 2023",
      valueDate: "03 - 04 - 2023",
      tellerNumber: "GF20231040",
      transactionDescription: "Electronic Money Transfer Levy",
      transactionType: "Cash/Cheque",
      chequeNo: "736685940013",
      originalValue: "465,897.00",
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
    },
  ];

  // Action menu state
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [selectedTransactionForAction, setSelectedTransactionForAction] =
    useState<Transaction | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const actionButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>(
    {}
  );

  // Close menu when clicking outside
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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  const handleAccountChange = (tab: string) => {
    setActiveAccount(tab);
  };
  const openActionMenu = (
    transaction: Transaction,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setSelectedTransactionForAction(transaction);
    setIsActionMenuOpen(true);

    // Store the button reference
    if (transaction.sNo) {
      actionButtonRefs.current[transaction.sNo] = event.currentTarget;
    }
  };

  // Calculate position for the popup
  const getPopupPosition = () => {
    if (
      !selectedTransactionForAction?.sNo ||
      !actionButtonRefs.current[selectedTransactionForAction.sNo]
    ) {
      return { top: 0, left: 0 };
    }

    const button = actionButtonRefs.current[selectedTransactionForAction.sNo];
    if (!button) return { top: 0, left: 0 };

    const rect = button.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY,
      left: rect.right + window.scrollX - 130, // Adjust 130 to match your popup width
    };
  };

  const closeActionMenu = () => {
    setIsActionMenuOpen(false);
    setSelectedTransactionForAction(null);
  };

  const handleDeleteTransaction = (sNo: string) => {
    console.log("Deleting transaction:", sNo);
    closeActionMenu();
    // Implement your delete logic here
  };

  const openViewModal = (transaction: Transaction) => {
    console.log("Viewing transaction:", transaction);
    closeActionMenu();
    // Implement your view modal logic here
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar - hidden on mobile, shown on medium screens and up */}
      <div className="hidden md:block fixed h-full w-64">
        <Sidebar />
      </div>

      {/* Mobile header with menu button - shown only on small screens */}
      <div className="md:hidden bg-white shadow-sm p-4 flex items-center">
        <button className="mr-4">
          {/* Mobile menu icon would go here */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-xl font-semibold">Account</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 overflow-auto mt-16 md:mt-0">
        <div className="bg-gray-100 min-h-full p-4 md:p-6">
          <div className="bg-white rounded-md shadow-md p-4 md:p-6">
            <div className="flex items-start flex-col gap-4 justify-between mb-4">
              <h1 className=" text-gray-700 text-xl font-semibold">Account</h1>
              {/* Tabs - scrollable on mobile */}
              <div className="mb-4 overflow-x-auto">
                <div className="flex whitespace-nowrap border-b border-gray-200">
                  <button
                    onClick={() => handleAccountChange("Account")}
                    className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                      activeAccount === "Account"
                        ? "border-b-2 border-orange-500 text-orange-500"
                        : "text-gray-500 hover:text-orange-500"
                    } focus:outline-none`}
                  >
                    Account
                  </button>
                  <button
                    onClick={() => handleAccountChange("Close Account")}
                    className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                      activeAccount === "Close Account"
                        ? "border-b-2 border-orange-500 text-orange-500"
                        : "text-gray-500 hover:text-orange-500"
                    } focus:outline-none`}
                  >
                    Close Account
                  </button>
                  <button
                    onClick={() => handleAccountChange("Re-open Account")}
                    className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                      activeTab === "Re-open Account"
                        ? "border-b-2 border-orange-500 text-orange-500"
                        : "text-gray-500 hover:text-orange-500"
                    } focus:outline-none`}
                  >
                    Re-open Account
                  </button>
                  <button
                    onClick={() => handleAccountChange("Cheque Stock")}
                    className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                      activeTab === "Cheque Stock"
                        ? "border-b-2 border-orange-500 text-orange-500"
                        : "text-gray-500 hover:text-orange-500"
                    } focus:outline-none`}
                  >
                    Cheque Stock
                  </button>
                  <button
                    onClick={() => handleAccountChange("Printer Setup")}
                    className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                      activeTab === "Printer Setup"
                        ? "border-b-2 border-orange-500 text-orange-500"
                        : "text-gray-500 hover:text-orange-500"
                    } focus:outline-none`}
                  >
                    Printer Setup
                  </button>
                  <button
                    onClick={() => handleAccountChange("Plan")}
                    className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                      activeTab === "Plan"
                        ? "border-b-2 border-orange-500 text-orange-500"
                        : "text-gray-500 hover:text-orange-500"
                    } focus:outline-none`}
                  >
                    Plan
                  </button>
                  <button
                    onClick={() => handleAccountChange("Exit")}
                    className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                      activeTab === "Exit"
                        ? "border-b-2 border-orange-500 text-orange-500"
                        : "text-gray-500 hover:text-orange-500"
                    } focus:outline-none`}
                  >
                    Exit
                  </button>
                </div>
              </div>
            </div>

            {/* Account Selection */}
            {activeAccount === "Account" && (
              <div className="mb-6">
                <div className="font-semibold text-black text-lg mb-2">
                  Account Selection
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label
                      htmlFor="accountName"
                      className="block text-gray-700 text-sm font-bold mb-1"
                    >
                      Account Name
                    </label>
                    <input
                      type="text"
                      id="accountName"
                      className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="accountNumber"
                      className="block text-gray-700 text-sm font-bold mb-1"
                    >
                      Account Number
                    </label>
                    <input
                      type="text"
                      id="accountNumber"
                      className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="accountType"
                      className="block text-gray-700 text-sm font-bold mb-1"
                    >
                      Account Type
                    </label>
                    <input
                      type="text"
                      id="accountType"
                      className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="dateRange"
                      className="block text-gray-700 text-sm font-bold mb-1"
                    >
                      Date
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="dateRange"
                        placeholder="Select Date Range"
                        className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="currency"
                      className="block text-gray-700 text-sm font-bold mb-1"
                    >
                      Currency
                    </label>
                    <input
                      type="text"
                      id="currency"
                      value="NGN"
                      className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      readOnly
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="balance"
                      className="block text-gray-700 text-sm font-bold mb-1"
                    >
                      Balance
                    </label>
                    <input
                      type="text"
                      id="balance"
                      className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cleared"
                      className="block text-gray-700 text-sm font-bold mb-1"
                    >
                      Cleared
                    </label>
                    <input
                      type="text"
                      id="cleared"
                      className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="uncleared"
                      className="block text-gray-700 text-sm font-bold mb-1"
                    >
                      Uncleared
                    </label>
                    <input
                      type="text"
                      id="uncleared"
                      className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="bank"
                      className="block text-gray-700 text-sm font-bold mb-1"
                    >
                      Bank
                    </label>
                    <input
                      type="text"
                      id="bank"
                      className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="col-span-1 lg:col-span-3">
                    <label
                      htmlFor="address"
                      className="block text-gray-700 text-sm font-bold mb-1"
                    >
                      Address
                    </label>
                    <textarea
                      id="address"
                      className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    ></textarea>
                  </div>
                </div>
              </div>
            )}
            {activeAccount !== "Account" && (
              <div className="py-6 text-center text-gray-500">
                Content for "{activeAccount}" tab will be displayed here.
              </div>
            )}

            {/* Tabs - scrollable on mobile */}
            <div className="mb-4 overflow-x-auto">
              <div className="flex whitespace-nowrap border-b border-gray-200">
                <button
                  onClick={() => handleTabChange("Entry")}
                  className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                    activeTab === "Entry"
                      ? "border-b-2 border-orange-500 text-orange-500"
                      : "text-gray-500 hover:text-orange-500"
                  } focus:outline-none`}
                >
                  Entry
                </button>
                <button
                  onClick={() => handleTabChange("Reconstructed Statement")}
                  className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                    activeTab === "Reconstructed Statement"
                      ? "border-b-2 border-orange-500 text-orange-500"
                      : "text-gray-500 hover:text-orange-500"
                  } focus:outline-none`}
                >
                  Reconstructed Statement
                </button>
                <button
                  onClick={() => handleTabChange("Bank Statement")}
                  className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                    activeTab === "Bank Statement"
                      ? "border-b-2 border-orange-500 text-orange-500"
                      : "text-gray-500 hover:text-orange-500"
                  } focus:outline-none`}
                >
                  Bank Statement
                </button>
                <button
                  onClick={() => handleTabChange("Cash Back")}
                  className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                    activeTab === "Cash Back"
                      ? "border-b-2 border-orange-500 text-orange-500"
                      : "text-gray-500 hover:text-orange-500"
                  } focus:outline-none`}
                >
                  Cash Back
                </button>
                <button
                  onClick={() => handleTabChange("Trans Matched")}
                  className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                    activeTab === "Trans Matched"
                      ? "border-b-2 border-orange-500 text-orange-500"
                      : "text-gray-500 hover:text-orange-500"
                  } focus:outline-none`}
                >
                  Trans Matched
                </button>
                <button
                  onClick={() => handleTabChange("Query")}
                  className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                    activeTab === "Query"
                      ? "border-b-2 border-orange-500 text-orange-500"
                      : "text-gray-500 hover:text-orange-500"
                  } focus:outline-none`}
                >
                  Query
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
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            S/N
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Account Name
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">
                            Account Number
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Account Type
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Symbol
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">
                            Bank Name
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">
                            Bank Address
                          </th>
                          <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map((transaction) => (
                          <tr key={transaction.sNo}>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                              {transaction.sNo}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                              {transaction.entryDate}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                              {transaction.transactionDate}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 ">
                              {transaction.valueDate}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 ">
                              {transaction.tellerNumber}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500">
                              {transaction.transactionDescription}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 ">
                              {transaction.transactionType}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 ">
                              {transaction.chequeNo}
                            </td>
                            <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 relative">
                              <button
                                ref={(el) => {
                                  if (transaction.sNo)
                                    actionButtonRefs.current[transaction.sNo] =
                                      el;
                                }}
                                className="focus:outline-none z-0"
                                onClick={(e) => openActionMenu(transaction, e)}
                              >
                                <img
                                  src="/Users/action.svg"
                                  alt="Dropdown Icon"
                                  className="w-4 h-4 z-0 md:w-5 md:h-5"
                                />
                              </button>
                              {isActionMenuOpen &&
                                selectedTransactionForAction?.sNo ===
                                  transaction.sNo && (
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
                                        onClick={() =>
                                          openViewModal(transaction)
                                        }
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                                      >
                                        View
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteTransaction(
                                            transaction.sNo
                                          )
                                        }
                                        className="block px-4 py-2 text-sm text-gray-700 border-gray-700 text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
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
                <div className="mt-4 text-sm text-gray-500">
                  Showing 1 to {transactions.length} of {transactions.length}{" "}
                  entries
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

export default AccountDetails;
