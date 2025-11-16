"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Sidebar from "@/components/utility/Sidebar";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "../nav/Navbar";
import { useRates, type RateSummary } from "@/hooks/useRates";
import RateViewModal from "../clients/RateViewModal";

const Contracts = () => {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('clientId');
  const { getRatesByClientId } = useRates();
  const [activeAccountTab, setActiveAccountTab] = useState("Rates");
  const [rates, setRates] = useState<RateSummary[]>([]);
  const [loadingRates, setLoadingRates] = useState<boolean>(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [selectedRateForAction, setSelectedRateForAction] = useState<RateSummary | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const actionButtonRefs = useRef<{[key: string]: HTMLButtonElement | null}>({});

  useEffect(() => {
    let isCancelled = false;
    const fetchRates = async () => {
      if (!clientId) return;
      setLoadingRates(true);
      try {
        const data = await getRatesByClientId(clientId);
        if (!isCancelled && Array.isArray(data)) {
          setRates(data);
        }
      } catch (error) {
        console.error("Error fetching rates:", error);
        if (!isCancelled) setRates([]);
      } finally {
        if (!isCancelled) setLoadingRates(false);
      }
    };
    fetchRates();
    return () => { isCancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

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

  const openActionMenu = (rate: RateSummary, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setSelectedRateForAction(rate);
    setIsActionMenuOpen(true);

    if (rate.id) {
      actionButtonRefs.current[rate.id] = event.currentTarget;
    }
  };

  const getPopupPosition = () => {
    if (!selectedRateForAction?.id || !actionButtonRefs.current[selectedRateForAction.id]) {
      return { top: 0, left: 0 };
    }

    const button = actionButtonRefs.current[selectedRateForAction.id];
    if (!button) return { top: 0, left: 0 };

    const rect = button.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY,
      left: rect.right + window.scrollX - 130,
    };
  };

  const closeActionMenu = () => {
    setIsActionMenuOpen(false);
    setSelectedRateForAction(null);
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
              <div className="font-semibold text-black text-lg md:text-xl mr-4">Rate Selection</div>
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
                    onClick={() => handleAccountTabChange("Rates")}
                    className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                      activeAccountTab === "Rates"
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
                    href="/NewAccount"
                    className="w-full md:w-auto px-4 py-2 bg-orange-500 text-white rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-sm"
                  >
                    Create New Account
                  </Link>
                )}
                {activeAccountTab === "Rates" && (
                  <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <Link
                      href={`/Rates/New?clientId=${clientId || ''}`}
                      className="w-full md:w-auto px-4 py-2 bg-orange-500 text-white rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-sm"
                    >
                      Create New Rate
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
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DR Rate</th>
                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {rates.map((rate, index) => {
                            const drRate = rate.drRates && rate.drRates.length > 0 ? rate.drRates[0].rate : rate.debitRate || '-';
                            return (
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
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{drRate}</td>
                                <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 relative">
                                  <button
                                    ref={el => {
                                      if (rate.id) actionButtonRefs.current[rate.id] = el;
                                    }}
                                    className="focus:outline-none z-0"
                                    onClick={(e) => openActionMenu(rate, e)}
                                  >
                                    <img
                                      src="/Users/action.svg"
                                      alt="Dropdown Icon"
                                      className="w-4 h-4 z-0 md:w-5 md:h-5"
                                    />
                                  </button>
                                  {isActionMenuOpen && selectedRateForAction?.id === rate.id && (
                                    <div
                                      ref={actionMenuRef}
                                      className="fixed z-50 bg-white rounded-md shadow-lg"
                                      style={getPopupPosition()}
                                    >
                                      <div className="py-1">
                                        <button
                                          onClick={() => {
                                            setSelectedRateId(rate.id);
                                            setShowRateModal(true);
                                            closeActionMenu();
                                          }}
                                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none"
                                        >
                                          View Rate
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                          {rates.length === 0 && !loadingRates && (
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

export default Contracts;