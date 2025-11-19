"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Sidebar from "@/components/utility/Sidebar";
import Link from "next/link";
import RateAdjustmentForm from "../account/RateAdjustment";
import ContractViewModal from "./ContractViewModal";
import { useBankAccounts } from "@/hooks/useBankAccount";
import { useSearchParams, useRouter } from "next/navigation";
import type { ClientBankAccountResponse } from "@/hooks/useBankAccount";
import { useRates, type RateSummary } from "@/hooks/useRates";
import RateViewModal from "./RateViewModal";

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

interface ContractData {
  id: string;
  loanId: string;
  agreementDate: string;
  borrower: string;
  agreementType: string;
  signedDate: string;
  bankName: string;
  accountOfficer: string;
  email: string;
  swiftCode: string;
  telephone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  fax: string;
  locStateCountry: string;
  returnChargeRate: string;
  returnChargeLimit: string;
  cotConvenantRate: string;
  cotOffConvenantRate: string;
  turnOverLimit: string;
  cotConvenantFrequency: string;
  chargeCOTOnTurnoverShortfall: string;
  creditInterestRate: string;
  vatWHTRate: string;
  limitAmount: string;
  drRate: string;
  exRate: string;
  exChangeType: string;
  loanType: string;
  loanInterestRate: string;
  loanPenalRate: string;
  loanContribution: string;
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
  status: "open" | "closed";
  report?: string;
}

const Account = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clientId = searchParams.get('clientId');
  const clientName = searchParams.get('clientName') || '';
  const { getBankAccountsByClient, deleteBankAccount } = useBankAccounts()
  const { getRatesByClientId } = useRates();
  const [activeAccountTab, setActiveAccountTab] = useState("Account");
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [rates, setRates] = useState<RateSummary[]>([]);
  const [loadingRates, setLoadingRates] = useState<boolean>(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [selectedAccountForAction, setSelectedAccountForAction] = useState<AccountData | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const actionButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewedContract, setViewedContract] = useState<ContractData | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingAccount, setReportingAccount] = useState<AccountData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
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
      bankName: "GTBank",
      accountOfficer: "Jane Smith",
      email: "john.doe@example.com",
      swiftCode: "GTBINGLA",
      telephone: "08012345678",
      street: "123 Main St",
      city: "Lagos",
      state: "Lagos",
      zipCode: "100001",
      country: "Nigeria",
      fax: "012345678",
      locStateCountry: "Lagos, Nigeria",
      returnChargeRate: "5%",
      returnChargeLimit: "₦50,000",
      cotConvenantRate: "2%",
      cotOffConvenantRate: "1.5%",
      turnOverLimit: "₦1,000,000",
      cotConvenantFrequency: "Monthly",
      chargeCOTOnTurnoverShortfall: "Yes",
      creditInterestRate: "15%",
      vatWHTRate: "7.5%",
      limitAmount: "₦5,000,000",
      drRate: "20%",
      exRate: "₦415/$",
      exChangeType: "Spot",
      loanType: "Term Loan",
      loanInterestRate: "25%",
      loanPenalRate: "5%",
      loanContribution: "20%"
    },
    // Add more contracts as needed
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
    setDeletingId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const ok = await deleteBankAccount(deletingId);
      if (ok) {
        setAccounts(prev => prev.filter(a => a.id !== deletingId));
        setShowDeleteConfirm(false);
        setDeletingId(null);
        closeActionMenu();
      }
    } finally {
      setIsDeleting(false);
    }
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

  useEffect(() => {
    let isCancelled = false;
    const fetchingRef = { current: false } as { current: boolean };

    const fetchClientAccounts = async () => {
      if (!clientId || fetchingRef.current) return;
      fetchingRef.current = true;
      setLoading(true);
      try {
        const data = await getBankAccountsByClient(clientId);
        if (!isCancelled) {
          if (Array.isArray(data)) {
            const mapped: AccountData[] = data.map((acc: ClientBankAccountResponse) => ({
              id: acc.id,
              entryDate: new Date(acc.createdAt).toLocaleDateString(),
              accountName: acc.accountName,
              accountNumber: acc.accountNumber,
              accountType: acc.accountType,
              accountCode: acc.code,
              symbol: acc.currency,
              bankName: acc.bank?.name || "-",
              status: "open",
            }));
            setAccounts(mapped);
          } else {
            setAccounts([]);
          }
        }
      } catch (_) {
        if (!isCancelled) setAccounts([]);
      } finally {
        if (!isCancelled) setLoading(false);
        fetchingRef.current = false;
      }
    };

    fetchClientAccounts();
    return () => { isCancelled = true; };
  }, [clientId])

  useEffect(() => {
    if (activeAccountTab === "Rates" && clientId) {
      let isCancelled = false;
      const fetchRates = async () => {
        setLoadingRates(true);
        try {
          const data = await getRatesByClientId(clientId);
          if (!isCancelled && Array.isArray(data)) {
            setRates(data);
          }
        } catch (_) {
          if (!isCancelled) setRates([]);
        } finally {
          if (!isCancelled) setLoadingRates(false);
        }
      };
      fetchRates();
      return () => { isCancelled = true; };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAccountTab, clientId])

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
      <div className="hidden md:block fixed h-full w-64">
        <Sidebar />
      </div>

      <div className="flex-1 md:ml-64 overflow-auto mt-16 md:mt-0">
        <div className="bg-gray-100 min-h-full p-4 md:p-6">
          <div className="bg-white rounded-md shadow-md p-4 md:p-6">
              <div className="flex flex-col items-start gap-4 mb-4">
              <div className="flex items-center gap-3">
                <button
                  aria-label="Back to Clients"
                  onClick={() => router.push('/Clients')}
                  className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="font-semibold text-black text-lg md:text-xl mr-4">Client Account {clientName ? `- ${clientName}` : ''}</div>
              </div>
              <div className="mb-4 overflow-x-auto">
                <div className="flex whitespace-nowrap border-b border-gray-200">
                  <button
                    onClick={() => handleAccountTabChange("Account")}
                    className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${activeAccountTab === "Account"
                      ? "border-b-2 border-orange-500 text-orange-500"
                      : "text-gray-500 hover:text-orange-500"
                      } focus:outline-none`}
                  >
                    Account
                  </button>
                  <button
                    onClick={() => handleAccountTabChange("Close Account")}
                    className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${activeAccountTab === "Close Account"
                      ? "border-b-2 border-orange-500 text-orange-500"
                      : "text-gray-500 hover:text-orange-500"
                      } focus:outline-none`}
                  >
                    Close Account
                  </button>
                  <button
                    onClick={() => handleAccountTabChange("Rates")}
                    className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${activeAccountTab === "Rates"
                      ? "border-b-2 border-orange-500 text-orange-500"
                      : "text-gray-500 hover:text-orange-500"
                      } focus:outline-none`}
                  >
                    Rates
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
                    href={`/NewAccount${clientId ? `?clientId=${clientId}&clientName=${encodeURIComponent(clientName)}` : ''}`}
                    className="w-full md:w-auto px-4 py-2 bg-orange-500 text-white rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-sm"
                  >
                    Create New Account
                  </Link>
                )}
                {activeAccountTab === "Rates" && (
                  <Link
                    href={`/Rates/New${clientId ? `?clientId=${clientId}` : ''}`}
                    className="w-full md:w-auto px-4 py-2 bg-orange-500 text-white rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-sm"
                  >
                    Create New Rate
                  </Link>
                )}
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
                          {/* <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Bank Address</th> */}
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
                                      href={`/AccountDetails/${account.id}`}
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                                    >
                                      View Details
                                    </Link>
                                    <Link
                                      href={`/AssignRate?accountId=${account.id}&accountName=${encodeURIComponent(account.accountName || '')}`}
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                                      onClick={() => closeActionMenu()}
                                    >
                                      Assign Rate
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

            {activeAccountTab === "Rates" && (
              <>
                <div className="overflow-x-auto">
                  <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                    {loadingRates ? (
                      <div className="flex items-center justify-center h-40">
                        <p className="text-gray-500">Loading rates...</p>
                      </div>
                    ) : (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate Type</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective From</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective To</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {rates.map((rate, index) => (
                            <tr key={rate.id}>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{rate.code}</td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{rate.rateType || '-'}</td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{rate.currency || '-'}</td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                {rate.effectiveFrom ? new Date(rate.effectiveFrom).toLocaleDateString() : '-'}
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                {rate.effectiveTo ? new Date(rate.effectiveTo).toLocaleDateString() : '-'}
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                {rate.createdAt ? new Date(rate.createdAt).toLocaleDateString() : '-'}
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap text-right text-sm">
                                <button
                                  onClick={() => {
                                    setSelectedRateId(rate.id);
                                    setShowRateModal(true);
                                  }}
                                  className="text-orange-600 hover:text-orange-700"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                          {rates.length === 0 && (
                            <tr>
                              <td colSpan={8} className="px-3 py-6 text-center text-gray-500 text-sm">
                                No rates found for this client.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
                {!loadingRates && (
                  <div className="mt-4 text-sm text-gray-500">
                    Showing 1 to {rates.length} of {rates.length} entries
                  </div>
                )}
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
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="mb-4">
              <h3 className="text-lg text-black font-semibold">Confirm Deletion</h3>
              <p className="text-gray-600 mt-2">Are you sure you want to delete this bank account? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeletingId(null); }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAccount}
                disabled={isDeleting}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${isDeleting ? 'bg-red-400' : 'bg-red-600 hover:bg-red-500'}`}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
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
      {showViewModal && (
        <ContractViewModal
          setShowViewModal={setShowViewModal}
          viewedContract={viewedContract}
        />
      )}
      {showRateModal && selectedRateId && (
        <RateViewModal
          rateId={selectedRateId}
          isOpen={showRateModal}
          onClose={() => {
            setShowRateModal(false);
            setSelectedRateId(null);
          }}
        />
      )}
    </div>
  );
};

export default Account;