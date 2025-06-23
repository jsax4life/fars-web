"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Sidebar from "@/components/utility/Sidebar";
import Link from "next/link";
import RateAdjustmentForm from "./RateAdjustment";
import ContractViewModal from "../clients/ContractViewModal";
import { ContractData, Fee } from "@/types/contractTypes";
import Navbar from "../nav/Navbar";
interface ModalFormData {
    fromDate: string;
    toDate: string;
    localCheques: string;
    intraStateCheques: string;
    upCountryCheques: string;
    setAsPrevailingDays: boolean;
    setParametersAsPrevailing: boolean;
    camfFrequency: string;
    camfOnShortfall: string;
    camfCoverRate: string;
    camfOCRate: string;
    turnoverLimit: string;
    currencyDescription: string;
    rate: string;
    retChgRate: string;
    retChgLimit: string;
    overdraftLimit: string;
    drRate: string;
    exRate: string;
    exChargeType: string;
    creditInterestRate: string;
    whtRate: string;
}
interface ContractViewModalProps {
  contractData: ContractData; // <--- ADDED '| null' HERE
  onClose: () => void;
  // ... other props
}

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
  report?: string;
}

const Contracts = () => {
  const [activeAccountTab, setActiveAccountTab] = useState("Contracts");
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
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewedContract, setViewedContract] = useState<ContractData | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingAccount, setReportingAccount] = useState<AccountData | null>(null);
  const [reportContent, setReportContent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalFormData, setModalFormData] = useState<ModalFormData>({
    fromDate: '',
    toDate: '',
    localCheques: '',
    intraStateCheques: '',
    upCountryCheques: '',
    setAsPrevailingDays: false,
    setParametersAsPrevailing: false,
    camfFrequency: '',
    camfOnShortfall: '',
    camfCoverRate: '',
    camfOCRate: '',
    turnoverLimit: '',
    currencyDescription: '',
    rate: '',
    retChgRate: '',
    retChgLimit: '',
    overdraftLimit: '',
    drRate: '',
    exRate: '',
    exChargeType: '',
    creditInterestRate: '',
    whtRate: '',
  });
 const [contracts, setContracts] = useState<ContractData[]>([
  {
    id: "1",
    loanId: "LOAN-001",
    agreementDate: "2023-01-15",
    borrower: "John Doe",
    agreementType: "Personal Loan",
    signedDate: "2023-01-20",
    clearingDays: "2",
    locStateCountry: "Lagos, Nigeria",
    returnChargeRate: "5%",
    returnChargeLimit: "₦50,000",
    camf: "Active",
    camfCovenantRate: "2%",
    camfOffCovenantRate: "1.5%",
    turnOverLimit: "₦1,000,000",
    camfCovenantFrequency: "Monthly",
    chargeCAMFOnTurnoverShortfall: "Yes",
    creditInterestRate: "15%",
    whtRate: "7.5%",
    overdraftLimit: "₦5,000,000",
    drRate: "20%",
    exRate: "₦415/$",
    exChangeType: "Spot",
    loanType: "Term Loan",
    loanInterestRate: "25%",
    loanPenalRate: "5%",
    loanContribution: "20%",
    fees: [{ product: "Setup", type: "Flat", rate: "1%", vat: "7.5%" }],
    loanIds: ["LID-001", "LID-002"],
    amounts: ["100000", "200000"],
    lcCommission: "0.5%",
    preNegotiationRate: "2%",
    postNegotiationRate: "3%",
    note: "Sample contract note.",
  },
    // Add more contracts as needed, ensuring all fields are present
  ]);
  const handleModalChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;

    if (type === 'checkbox') {
      const checked = (event.target as HTMLInputElement).checked;
      setModalFormData(prevData => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setModalFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSave = () => {
    console.log("Modal data:", modalFormData);
    setShowModal(false);
  };

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

  const handleDeleteAccount = (id: string) => {
    console.log("Deleting account:", id);
    setAccounts(prevAccounts => prevAccounts.filter(account => account.id !== id));
    closeActionMenu();
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

  const handleCreateReportClick = (account: AccountData) => {
    setReportingAccount(account);
    setReportContent(account.report || "");
    setShowReportModal(true);
    closeActionMenu();
  };

  const handleSaveReport = () => {
    if (reportingAccount) {
      setAccounts(prevAccounts => prevAccounts.map(a =>
        a.id === reportingAccount.id ? { ...a, report: reportContent } : a
      ));
      setShowReportModal(false);
      setReportContent("");
      setReportingAccount(null);
    }
  };

  const handleViewReportClick = (account: AccountData) => {
    console.log("Viewing report for account:", account.accountName, account.report);
    if (account.report) {
      alert(`Opening/displaying report:\n\n${account.report}`);
    } else {
      alert("No report available for this account.");
    }
    closeActionMenu();
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
      <div className="hidden md:block fixed h-full w-64">
        <Sidebar />
      </div>

      <div className="flex-1 md:ml-64 overflow-auto ">
          <div className = "mb-4"><Navbar /></div>
        
        <div className="bg-gray-100 min-h-full p-4 md:p-6 mt-16 md:mt-0">
          <div className="bg-white rounded-md shadow-md p-4 md:p-6">
            <div className="flex flex-col items-start gap-4 mb-4">
              <div className="font-semibold text-black text-lg md:text-xl mr-4">Contract Selection</div>
              <div className="mb-4 overflow-x-auto">
                <div className="flex whitespace-nowrap border-b border-gray-200">
                  {/* <button
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
                  </button> */}
                  <button
                    onClick={() => handleAccountTabChange("Contracts")}
                    className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                      activeAccountTab === "Contracts"
                        ? "border-b-2 border-orange-500 text-orange-500"
                        : "text-gray-500 hover:text-orange-500"
                    } focus:outline-none`}
                  >
                    Contracts
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
                {activeAccountTab === "Account" && (
                  <Link
                    href="/NewAccount"
                    className="w-full md:w-auto px-4 py-2 bg-orange-500 text-white rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-sm"
                  >
                    Create New Account
                  </Link>
                )}
                {activeAccountTab === "Contracts" && (
                  <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    {/* <button
                      onClick={() => setShowModal(true)}
                      className="w-full md:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      Rate Adjustment
                    </button> */}
                    
                    <Link
                      href="/NewContract"
                      className="w-full md:w-auto px-4 py-2 bg-orange-500 text-white rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-sm"
                    >
                      Create New Contract
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* {activeAccountTab === "Account" && (
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
                                  style={getPopupPosition()}
                                >
                                  <div className="py-1">
                                    <Link
                                      href="/AccountDetails"
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                                    >
                                      View Account
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
                                      onClick={() => handleCloseAccount(account.id)}
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                                    >
                                      Close Account
                                    </button>
                                    <button
                                      onClick={() => handleDeleteAccount(account.id)}
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
            )} */}

            {/* {activeAccountTab === "Close Account" && (
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
            )} */}
            
            {activeAccountTab === "Contracts" && (
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
                                  style={getPopupPosition()}
                                >
                                  <div className="py-1">
                                 <button
  onClick={() => {
    // Find the contract associated with this account
    const accountContract = contracts.find(c => c.id === account.id);
    setViewedContract(accountContract || null);
    setShowViewModal(true);
  }}
  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
>
  View Contract
</button>
 <button
                      onClick={() => setShowModal(true)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                    >
                      Rate Adjustment
                    </button>
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
                                      onClick={() => handleCloseAccount(account.id)}
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                                    >
                                      Close Account
                                    </button>
                                    <button
                                      onClick={() => handleDeleteAccount(account.id)}
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
          </div>
        </div>
      </div>
      {showReportModal && reportingAccount && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-black font-semibold">Create Report for {reportingAccount.accountName}</h3>
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
      {showModal && (
        <div className="fixed inset-0 bg-black/50 overflow-y-auto z-50">
          <RateAdjustmentForm  
            setShowModal={setShowModal}
            modalFormData={modalFormData}
            handleModalChange={handleModalChange}
            handleSave={handleSave} 
          /> 
        </div>
      )}
    {showViewModal && viewedContract && (
                <ContractViewModal
                    setShowViewModal={setShowViewModal} // Matches prop name in modal component
                    viewedContract={viewedContract}     // Matches prop name in modal component
                />
            )}
    </div>
  );
};

export default Contracts;