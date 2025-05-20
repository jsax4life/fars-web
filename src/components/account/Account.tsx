"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa"; // Removed FaFilter, FaArchive as they were not used
import Sidebar from "@/components/utility/Sidebar";
import Link from "next/link";

interface AccountData {
  sNo: string;
  entryDate: string;
  transactionDate: string;
  valueDate: string;
  tellerNumber: string;
  transactionDescription: string;
  transactionType: string;
  chequeNo: string;
  accountCode: string;
  originalValue: string;
  status: "open" | "closed";
  report?: string; // Added optional report field to AccountData
}

const Account = () => {
  const [activeAccountTab, setActiveAccountTab] = useState("Account");
  const [accounts, setAccounts] = useState<AccountData[]>([
    { sNo: "01", entryDate: "02 - 04 - 2023", transactionDate: "02 - 04 - 2023", valueDate: "02 - 04 - 2023", tellerNumber: "N/A", transactionDescription: "Principal LIQ-406965523730001", accountCode: "465,897.00", transactionType: "Cash/Cheque", chequeNo: "Nil", originalValue: "44,897,985.89", status: "open" },
    { sNo: "02", entryDate: "02 - 04 - 2023", transactionDate: "02 - 04 - 2023", valueDate: "02 - 04 - 2023", tellerNumber: "U000001333", transactionDescription: "Debetuje baje ide Oluola", accountCode: "465,897.00", transactionType: "Cash/Cheque", chequeNo: "Cash", originalValue: "100,000.00", status: "open" },
    { sNo: "03", entryDate: "02 - 04 - 2023", transactionDate: "02 - 04 - 2023", valueDate: "02 - 04 - 2023", tellerNumber: "0000001333", transactionDescription: "Bebetuje baje ide Oluola", accountCode: "465,897.00", transactionType: "CHG", chequeNo: "CHG", originalValue: "400,000.00", status: "closed" },
    { sNo: "04", entryDate: "02 - 04 - 2023", transactionDate: "02 - 04 - 2023", valueDate: "02 - 04 - 2023", tellerNumber: "N/A", transactionDescription: "Electronic Money Transfer Levy", accountCode: "465,897.00", transactionType: "Cash/Cheque", chequeNo: "736685940013", originalValue: "465,897.00", status: "open" },
    { sNo: "05", entryDate: "02 - 04 - 2023", transactionDate: "02 - 04 - 2023", valueDate: "02 - 04 - 2023", tellerNumber: "N/A", transactionDescription: "SMS Charge, November 2023", accountCode: "465,897.00", transactionType: "Cash/Cheque", chequeNo: "Nil", originalValue: "100,000.00", status: "open" },
    { sNo: "06", entryDate: "02 - 04 - 2023", transactionDate: "02 - 04 - 2023", valueDate: "02 - 04 - 2023", tellerNumber: "N/A", transactionDescription: "Transfer Charge - FCO 34899999999", accountCode: "465,897.00", transactionType: "Cash/Cheque", chequeNo: "736685940013", originalValue: "300,000.00", status: "open" },
    { sNo: "07", entryDate: "02 - 04 - 2023", transactionDate: "02 - 04 - 2023", valueDate: "02 - 04 - 2023", tellerNumber: "0000002623", transactionDescription: "IBTC Place, Water kano, Lagos", accountCode: "465,897.00", transactionType: "Cash/Cheque", chequeNo: "736685940013", originalValue: "300,000.00", status: "open" },
    { sNo: "08", entryDate: "02 - 04 - 2023", transactionDate: "02 - 04 - 2023", valueDate: "02 - 04 - 2023", tellerNumber: "GF20231040", transactionDescription: "Electronic Money Transfer Levy", accountCode: "465,897.00", transactionType: "Cash/Cheque", chequeNo: "736685940013", originalValue: "465,897.00", status: "open" },
    { sNo: "09", entryDate: "02 - 04 - 2023", transactionDate: "03 - 04 - 2023", valueDate: "03 - 04 - 2023", tellerNumber: "U000003774", transactionDescription: "SMS Charge, October 2023", accountCode: "465,897.00", transactionType: "CHG", chequeNo: "CHG", originalValue: "400,000.00", status: "closed" },
    { sNo: "10", entryDate: "02 - 04 - 2023", transactionDate: "03 - 04 - 2023", valueDate: "03 - 04 - 2023", tellerNumber: "7108001649", transactionDescription: "Principal LIQ-406965523730001", accountCode: "465,897.00", transactionType: "Cash/Cheque", chequeNo: "CHG", originalValue: "465,897.00", status: "open" },
  ]);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [selectedAccountForAction, setSelectedAccountForAction] = useState<AccountData | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const actionButtonRefs = useRef<{[key: string]: HTMLButtonElement | null}>({});

  // State for the reporting modal, adjusted for account transactions
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingAccount, setReportingAccount] = useState<AccountData | null>(null);
  const [reportContent, setReportContent] = useState("");


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

  const handleCreateReportClick = (account: AccountData) => {
    setReportingAccount(account);
    setReportContent(account.report || ""); // Pre-fill if a report already exists
    setShowReportModal(true);
    closeActionMenu();
  };

  const handleSaveReport = () => {
    if (reportingAccount) {
      setAccounts(prevAccounts => prevAccounts.map(a =>
        a.sNo === reportingAccount.sNo ? { ...a, report: reportContent } : a
      ));
      setShowReportModal(false);
      setReportContent("");
      setReportingAccount(null);
    }
  };

  const handleViewReportClick = (account: AccountData) => {
    console.log("Viewing report for transaction:", account.transactionDescription, account.report);
    if (account.report) {
      alert(`Opening/displaying report:\n\n${account.report}`);
      // In a real app, you might render this in a dedicated modal or navigate
    } else {
      alert("No report available for this transaction.");
    }
    closeActionMenu();
  };

  const openActionMenu = (account: AccountData, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setSelectedAccountForAction(account);
    setIsActionMenuOpen(true);

    if (account.sNo) {
      actionButtonRefs.current[account.sNo] = event.currentTarget;
    }
  };

  const getPopupPosition = () => {
    if (!selectedAccountForAction?.sNo || !actionButtonRefs.current[selectedAccountForAction.sNo]) {
      return { top: 0, left: 0 };
    }

    const button = actionButtonRefs.current[selectedAccountForAction.sNo];
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

  const handleDeleteTransaction = (sNo: string) => {
    console.log("Deleting transaction:", sNo);
    setAccounts(prevAccounts => prevAccounts.filter(account => account.sNo !== sNo));
    closeActionMenu();
    // In a real application, you would also make an API call here.
  };

  const handleCloseAccount = (sNo: string) => {
    setAccounts(prevAccounts =>
      prevAccounts.map(account =>
        account.sNo === sNo ? { ...account, status: "closed" } : account
      )
    );
    closeActionMenu();
  };

  const handleOpenAccount = (sNo: string) => {
    setAccounts(prevAccounts =>
      prevAccounts.map(account =>
        account.sNo === sNo ? { ...account, status: "open" } : account
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

      <div className="md:hidden bg-white shadow-sm p-4 flex items-center">
        <button className="mr-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold">Account</h1>
      </div>

      <div className="flex-1 md:ml-64 overflow-auto mt-16 md:mt-0">
        <div className="bg-gray-100 min-h-full p-4 md:p-6">
          <div className="bg-white rounded-md shadow-md p-4 md:p-6">
            <div className="flex flex-col items-start gap-4 mb-4">
              <div className="font-semibold text-black text-lg md:text-xl mr-4">Account Selection</div>
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
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Type</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cheque No</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Code</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Teller No</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Value Date</th>
                          <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getOpenAccounts().map((account) => (
                          <tr key={account.sNo}>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{account.sNo}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{account.entryDate}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{account.transactionDescription}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 ">{account.transactionType}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 ">{account.chequeNo}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 ">{account.accountCode}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 ">{account.tellerNumber}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 ">{account.valueDate}</td>
                            <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 relative">
                              <button
                                ref={el => {
                                  if (account.sNo) actionButtonRefs.current[account.sNo] = el;
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
                              {isActionMenuOpen && selectedAccountForAction?.sNo === account.sNo && (
                                <div
                                  ref={actionMenuRef}
                                  className="fixed z-50 bg-white rounded-md shadow-lg"
                                  style={getPopupPosition()}
                                >
                                  <div className="py-1">
                                    <Link
                                      href={`/AccountDetails/${account.sNo}`} // Made dynamic
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                                    >
                                      View
                                    </Link>
                                    {account.report ? (
                                      <button
                                        onClick={() => handleViewReportClick(account)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                                      >
                                        View Report
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleCreateReportClick(account)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                                      >
                                        Create Report
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleCloseAccount(account.sNo)}
                                      className="block px-4 py-2 text-sm text-gray-700 border-gray-700 text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                                    >
                                      Close Account
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTransaction(account.sNo)}
                                      className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-left focus:outline-none"
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
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Type</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cheque No</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Code</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Teller No</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Value Date</th>
                          <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getClosedAccounts().map((account) => (
                          <tr key={account.sNo}>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{account.sNo}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{account.entryDate}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{account.transactionDescription}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 ">{account.transactionType}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 ">{account.chequeNo}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 ">{account.accountCode}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 ">{account.tellerNumber}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 ">{account.valueDate}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleOpenAccount(account.sNo)}
                                className="text-indigo-600 hover:text-indigo-800 focus:outline-none"
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
      {showReportModal && reportingAccount && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-black font-semibold">Create Report for Transaction: {reportingAccount.sNo}</h3>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportingAccount(null);
                  setReportContent("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div>
              <label htmlFor="report-content" className="block text-sm font-medium text-gray-700 mb-1">Report Content</label>
              <textarea
                id="report-content"
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F36F2E]"
                placeholder="Write your report here..."
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportingAccount(null);
                  setReportContent("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReport}
                className="px-4 py-2 bg-[#F36F2E] text-white rounded-md text-sm font-medium hover:bg-[#E05C2B]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;