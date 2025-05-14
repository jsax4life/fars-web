"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaSearch, FaFilter, FaArchive } from "react-icons/fa";
import Sidebar from "@/components/utility/Sidebar";
import Link from "next/link";

interface AccountData {
  id: string;
  entryDate: string;
  accountName: string;
  accountNumber: string;
  accountType: string;
  accountCode: string;
  symbol: string;
  bankName: string;
  bankAddress: string;
  status: "open" | "closed";
}

const Account = () => {
  const [activeAccountTab, setActiveAccountTab] = useState("Account");
  const [accounts, setAccounts] = useState<AccountData[]>([
    { id: "1", entryDate: "02 - 04 - 2023", accountName: "Savings Account", accountNumber: "1234567890", accountType: "Savings", accountCode: "465,897.00", symbol: "NGN", bankName: "GTBank", bankAddress: "Lagos", status: "open" },
    { id: "2", entryDate: "02 - 04 - 2023", accountName: "Current Account", accountNumber: "0987654321", accountType: "Current", accountCode: "1,234,567.00", symbol: "USD", bankName: "Zenith Bank", bankAddress: "Abuja", status: "open" },
    { id: "3", entryDate: "03 - 04 - 2023", accountName: "Investment Account", accountNumber: "1122334455", accountType: "Investment", accountCode: "5,000,000.00", symbol: "EUR", bankName: "Access Bank", bankAddress: "Port Harcourt", status: "closed" },
    { id: "4", entryDate: "05 - 04 - 2023", accountName: "Domiciliary Account", accountNumber: "6677889900", accountType: "Savings", accountCode: "10,000.00", symbol: "GBP", bankName: "UBA", bankAddress: "Kano", status: "open" },
  ]);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [selectedAccountForAction, setSelectedAccountForAction] = useState<AccountData | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const actionButtonRefs = useRef<{[key: string]: HTMLButtonElement | null}>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        closeActionMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAccountTabChange = (tab: string) => {
    setActiveAccountTab(tab);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        closeActionMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  const handleDeleteTransaction = (id: string) => {
    console.log("Deleting transaction:", id);
    closeActionMenu();
    // Implement your delete logic here
  };
  const openActionMenu = (account: AccountData, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setSelectedAccountForAction(account);
    setIsActionMenuOpen(true);

    if (account.id) {
      actionButtonRefs.current[account.id] = event.currentTarget;
    }
  };

  const getPopupPosition = () => {
    if (!selectedAccountForAction?.id || !actionButtonRefs.current[selectedAccountForAction.id]) {
      return { top: 0, left: 0 };
    }

    const button = actionButtonRefs.current[selectedAccountForAction.id];
    if (!button) return { top: 0, left: 0 };

    const rect = button.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY,
      left: rect.right + window.scrollX - 130,
    };
  };

  const closeActionMenu = () => {
    setIsActionMenuOpen(false);
    setSelectedAccountForAction(null);
  };

  const handleCloseAccount = (id: string) => {
    setAccounts(prevAccounts =>
      prevAccounts.map(account =>
        account.id === id ? { ...account, status: "closed" } : account
      )
    );
    closeActionMenu();
  };

  const handleOpenAccount = (id: string) => {
    setAccounts(prevAccounts =>
      prevAccounts.map(account =>
        account.id === id ? { ...account, status: "open" } : account
      )
    );
  };

  const getOpenAccounts = () => accounts.filter(account => account.status === "open");
  const getClosedAccounts = () => accounts.filter(account => account.status === "closed");

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
      <div className="hidden md:block fixed h-full w-64">
        <Sidebar />
      </div>

      <div className="flex-1 md:ml-64 overflow-auto mt-16 md:mt-0">
        <div className="bg-gray-100 min-h-full p-4 md:p-6">
          <div className="bg-white rounded-md shadow-md p-4 md:p-6">
            <div className="flex flex-col items-start gap-4 mb-4">
              <div className="font-semibold text-black text-lg md:text-xl mr-4">Client user.id Account Selection</div>
              <div className="mb-4 overflow-x-auto">
                <div className="flex whitespace-nowrap border-b border-gray-200">
                  <button
                    onClick={() => handleAccountTabChange("Account")}
                    className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                      activeAccountTab === "Account"
                        ? "border-b-2 border-orange-500 text-orange-500"
                        : "text-gray-500 hover:text-orange-500"
                    } focus:outline-none`}
                  >
                    Account
                  </button>
                  <button
                    onClick={() => handleAccountTabChange("Close Account")}
                    className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                      activeAccountTab === "Close Account"
                        ? "border-b-2 border-orange-500 text-orange-500"
                        : "text-gray-500 hover:text-orange-500"
                    } focus:outline-none`}
                  >
                    Close Account
                  </button>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 w-full mb-4">
                <div className="relative w-full md:w-auto md:flex-1">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 text-sm"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <FaSearch />
                  </div>
                </div>
                <div className="relative w-full md:w-auto md:flex-1">
                  <input
                    type="text"
                    placeholder="Account Number"
                    className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
                <div className="relative w-full md:w-auto md:flex-1">
                  <input
                    type="text"
                    placeholder="Account Code"
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
                <Link href="/NewAccount" className="w-full md:w-auto bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none text-sm">
                  Create New
                </Link>
              </div>
            </div>

            {activeAccountTab === "Account" && (
              <>
                <div className="overflow-x-auto">
                  <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Name</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Account Number</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Type</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Code</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Bank Name</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Bank Address</th>
                          <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getOpenAccounts().map((account, index) => (
                          <tr key={account.id}>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{account.entryDate}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{account.accountName}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 ">{account.accountNumber}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 ">{account.accountType}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 ">{account.accountCode}</td>
                            <td className="px-3 py-4 text-sm text-gray-500">{account.symbol}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 ">{account.bankName}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 ">{account.bankAddress}</td>
                            <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 relative">
                              <button
                                ref={el => {
                                  if (account.id) actionButtonRefs.current[account.id] = el;
                                }}
                                className="focus:outline-none z-0"
                                onClick={(e) => openActionMenu(account, e)}
                              >
                                <img
                                  src="/Users/action.svg"
                                  alt="Dropdown Icon"
                                  className="w-4 h-4 z-0 md:w-5 md:h-5"
                                />
                              </button>
                              {isActionMenuOpen && selectedAccountForAction?.id === account.id && (
                                <div
                                  ref={actionMenuRef}
                                  className="fixed z-50 bg-white rounded-md shadow-lg"
                                  style={{
                                    top: `${getPopupPosition().top}px`,
                                    left: `${getPopupPosition().left}px`,
                                  }}
                                >
                                  <div className="py-1">
                                    <Link
                                      href="/AccountDetails"
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                                    >
                                      View
                                    </Link>
                                    <button
                                      onClick={() => handleCloseAccount(account.id)}
                                      className="block px-4 py-2 text-sm text-gray-700 border-gray-700 text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                                    >
                                      Close Account
                                    </button>
                                    <button
                                       onClick={() => handleDeleteTransaction(account.id)}
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
                  Showing 1 to {getOpenAccounts().length} of {getOpenAccounts().length} entries
                </div>
              </>
            )}

            {activeAccountTab === "Close Account" && (
              <>
                <div className="overflow-x-auto">
                  <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Name</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Account Number</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Type</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Code</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Bank Name</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Bank Address</th>
                          <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getClosedAccounts().map((account, index) => (
                          <tr key={account.id}>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{account.entryDate}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{account.accountName}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 ">{account.accountNumber}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 ">{account.accountType}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 ">{account.accountCode}</td>
                            <td className="px-3 py-4 text-sm text-gray-500">{account.symbol}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 ">{account.bankName}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 ">{account.bankAddress}</td>
                            <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 relative">
                              <button
                                onClick={() => handleOpenAccount(account.id)}
                                className="focus:outline-none text-indigo-600 hover:text-indigo-800"
                              >
                                Open Account
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Showing 1 to {getClosedAccounts().length} of {getClosedAccounts().length} entries
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;