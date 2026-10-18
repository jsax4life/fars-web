"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import Sidebar from "@/components/utility/Sidebar";
import Link from "next/link";
import Navbar from "../nav/Navbar";
import { useBankAccounts } from "@/hooks/useBankAccount";
import { useClients } from "@/hooks/useClient";
import { useBanks } from "@/hooks/useBank";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { sortByNameAsc } from "@/lib/utils";

interface AccountData {
  id: string;
  clientId: string;
  bankId: string;
  bankName: string;
  clientName: string;
  code: string;
  accountName: string;
  accountNumber: string;
  accountType: string;
  currency: string;
  createdAt: string;
  rateId: string | null;
  rateCode: string | null;
  status?: "open" | "closed";
  report?: string;
}

interface ClientRecord {
  id: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email?: string;
}

function clientDisplayName(client: ClientRecord): string {
  if (client.companyName?.trim()) return client.companyName.trim();
  const personal = [client.firstName, client.lastName].filter(Boolean).join(" ").trim();
  return personal || client.email || "Unknown client";
}

const Account = () => {
  const router = useRouter();
  const [activeAccountTab, setActiveAccountTab] = useState("Account");
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);

  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [selectedAccountForAction, setSelectedAccountForAction] = useState<AccountData | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const actionButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const { getBankAccounts, unassignRateFromAccount } = useBankAccounts();
  const [unassigningAccountId, setUnassigningAccountId] = useState<string | null>(null);
  const { getClients } = useClients();
  const { getBanks } = useBanks();

  const getBankAccountsRef = useRef(getBankAccounts);
  const getClientsRef = useRef(getClients);
  const getBanksRef = useRef(getBanks);
  getBankAccountsRef.current = getBankAccounts;
  getClientsRef.current = getClients;
  getBanksRef.current = getBanks;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [accountsRaw, clientsRaw, banksRaw] = await Promise.all([
        getBankAccountsRef.current(),
        getClientsRef.current(),
        getBanksRef.current(),
      ]);

      const bankNameById = new Map<string, string>();
      if (Array.isArray(banksRaw)) {
        banksRaw.forEach((b: { id: string; name: string }) => {
          bankNameById.set(b.id, b.name);
        });
      }

      const clientNameById = new Map<string, string>();
      const clientList: ClientRecord[] = Array.isArray(clientsRaw) ? clientsRaw : [];
      clientList.forEach((c) => clientNameById.set(c.id, clientDisplayName(c)));
      setClients(clientList);

      if (Array.isArray(accountsRaw)) {
        const mapped = (accountsRaw as unknown as Array<Record<string, unknown>>).map((a) => {
          const bankObj = a.bank as { id?: string; name?: string; code?: string } | undefined;
          const bankId = (a.bankId as string) || bankObj?.id || "";
          const clientId = (a.clientId as string) || "";
          const bankName =
            bankObj?.name ||
            bankNameById.get(bankId) ||
            (typeof a.bankName === "string" ? a.bankName : "") ||
            "Unknown bank";

          return {
            id: String(a.id ?? ""),
            clientId,
            bankId,
            bankName,
            clientName: clientNameById.get(clientId) || "Unknown client",
            code: String(a.code ?? a.accountCode ?? ""),
            accountNumber: String(a.accountNumber ?? ""),
            accountName: String(a.accountName ?? ""),
            accountType: String(a.accountType ?? ""),
            currency: String(a.currency ?? ""),
            createdAt: String(a.createdAt ?? new Date().toISOString()),
            rateId: (a.rateId as string | null | undefined) ?? null,
            rateCode:
              (a.rate as { code?: string } | undefined)?.code ??
              (typeof a.rateCode === "string" ? a.rateCode : null),
            status: "open" as const,
          };
        });
        setAccounts(mapped.filter((a) => a.id));
      } else {
        setAccounts([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clientsWithAccounts = useMemo(() => {
    const idsWithAccounts = new Set(accounts.map((a) => a.clientId).filter(Boolean));
    const fromApi = sortByNameAsc(
      clients.map((c) => ({ ...c, name: clientDisplayName(c) })),
    );
    const withData = fromApi.filter((c) => idsWithAccounts.has(c.id));
    if (withData.length > 0) return withData;
    return fromApi;
  }, [clients, accounts]);

  const filteredClients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return clientsWithAccounts;
    return clientsWithAccounts.filter((c) => clientDisplayName(c).toLowerCase().includes(q));
  }, [clientsWithAccounts, searchQuery]);

  const banksForSelectedClient = useMemo(() => {
    if (!selectedClientId) return [];
    const map = new Map<string, string>();
    accounts
      .filter((a) => a.clientId === selectedClientId)
      .forEach((a) => {
        if (a.bankId) map.set(a.bankId, a.bankName);
      });
    return sortByNameAsc(
      [...map.entries()].map(([id, name]) => ({ id, name })),
    );
  }, [accounts, selectedClientId]);

  const visibleAccounts = useMemo(() => {
    const base =
      activeAccountTab === "Close Account"
        ? accounts.filter((a) => a.status === "closed")
        : accounts.filter((a) => (a.status ?? "open") === "open");

    return base.filter((a) => {
      if (selectedClientId && a.clientId !== selectedClientId) return false;
      if (selectedBankId && a.bankId !== selectedBankId) return false;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        a.accountNumber.toLowerCase().includes(q) ||
        a.accountName.toLowerCase().includes(q) ||
        a.bankName.toLowerCase().includes(q) ||
        a.clientName.toLowerCase().includes(q)
      );
    });
  }, [accounts, activeAccountTab, selectedClientId, selectedBankId, searchQuery]);

  const selectedClientName = useMemo(() => {
    if (!selectedClientId) return "";
    const c = clients.find((x) => x.id === selectedClientId);
    return c ? clientDisplayName(c) : accounts.find((a) => a.clientId === selectedClientId)?.clientName || "";
  }, [selectedClientId, clients, accounts]);

  const handleCreateNew = () => {
    if (!selectedClientId) {
      toast.error("Select a client first, or create one from Client Management.");
      router.push("/Clients");
      return;
    }
    router.push(
      `/NewAccount?clientId=${selectedClientId}&clientName=${encodeURIComponent(selectedClientName)}`,
    );
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((account) => account.id !== id));
    closeActionMenu();
  };

  const openActionMenu = (account: AccountData, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setSelectedAccountForAction(account);
    setIsActionMenuOpen(true);
    if (account.id) actionButtonRefs.current[account.id] = event.currentTarget;
  };

  const getPopupPosition = () => {
    if (!selectedAccountForAction?.id || !actionButtonRefs.current[selectedAccountForAction.id]) {
      return { top: 0, left: 0 };
    }
    const button = actionButtonRefs.current[selectedAccountForAction.id];
    if (!button) return { top: 0, left: 0 };
    const rect = button.getBoundingClientRect();
    return { top: rect.bottom + window.scrollY, left: rect.right + window.scrollX - 130 };
  };

  const closeActionMenu = () => {
    setIsActionMenuOpen(false);
    setSelectedAccountForAction(null);
  };

  const handleCloseAccount = (id: string) => {
    setAccounts((prev) =>
      prev.map((account) => (account.id === id ? { ...account, status: "closed" } : account)),
    );
    closeActionMenu();
  };

  const handleOpenAccount = (id: string) => {
    setAccounts((prev) =>
      prev.map((account) => (account.id === id ? { ...account, status: "open" } : account)),
    );
  };

  const handleCreateReportClick = (account: AccountData) => {
    setReportingAccount(account);
    setReportContent(account.report || "");
    setShowReportModal(true);
    closeActionMenu();
  };

  const handleSaveReport = () => {
    if (reportingAccount) {
      setAccounts((prev) =>
        prev.map((a) => (a.id === reportingAccount.id ? { ...a, report: reportContent } : a)),
      );
      setShowReportModal(false);
      setReportContent("");
      setReportingAccount(null);
    }
  };

  const handleUnassignRate = async (account: AccountData) => {
    if (!account.rateId) return;
    if (
      !window.confirm(
        `Unassign rate${account.rateCode ? ` (${account.rateCode})` : ""} from ${account.accountName}? Analysis requires a rate on the account.`,
      )
    ) {
      return;
    }
    setUnassigningAccountId(account.id);
    try {
      await unassignRateFromAccount(account.id);
      await loadData();
    } finally {
      setUnassigningAccountId(null);
      closeActionMenu();
    }
  };

  const handleViewReportClick = (account: AccountData) => {
    if (account.report) {
      alert(`Opening/displaying report:\n\n${account.report}`);
    } else {
      alert("No report available for this account.");
    }
    closeActionMenu();
  };

  const renderAccountsTable = (rows: AccountData[], showReopen?: boolean) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">S/N</th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank</th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account number</th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account name</th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Currency</th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-3 py-8 text-center text-sm text-gray-500">
                {selectedClientId
                  ? selectedBankId
                    ? "No accounts for this bank."
                    : "Select a bank to view account numbers."
                  : "Select a client to begin."}
              </td>
            </tr>
          ) : (
            rows.map((account, index) => (
              <tr key={account.id}>
                <td className="px-3 py-4 text-sm text-gray-500">{index + 1}</td>
                <td className="px-3 py-4 text-sm font-medium text-gray-900">{account.bankName}</td>
                <td className="px-3 py-4 text-sm text-gray-700">{account.accountNumber}</td>
                <td className="px-3 py-4 text-sm text-gray-600">{account.accountName}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{account.accountType}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{account.currency}</td>
                <td className="px-3 py-4 text-sm">
                  {account.rateId ? (
                    <span className="text-green-700 font-medium">
                      {account.rateCode || "Assigned"}
                    </span>
                  ) : (
                    <span className="text-amber-700 font-medium">Not assigned</span>
                  )}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 relative text-right">
                  {showReopen ? (
                    <button
                      type="button"
                      onClick={() => handleOpenAccount(account.id)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Open account
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        ref={(el) => {
                          if (account.id) actionButtonRefs.current[account.id] = el;
                        }}
                        className="focus:outline-none"
                        onClick={(e) => openActionMenu(account, e)}
                      >
                        <img src="/Users/action.svg" alt="Actions" className="w-5 h-5 inline" />
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
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => closeActionMenu()}
                            >
                              View
                            </Link>
                            <Link
                              href={`/AssignRate?accountId=${account.id}&accountName=${encodeURIComponent(account.accountName || "")}`}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => closeActionMenu()}
                            >
                              {account.rateId ? "Change rate" : "Assign rate"}
                            </Link>
                            {account.rateId && (
                              <button
                                type="button"
                                disabled={unassigningAccountId === account.id}
                                onClick={() => handleUnassignRate(account)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                              >
                                {unassigningAccountId === account.id
                                  ? "Unassigning…"
                                  : "Unassign rate"}
                              </button>
                            )}
                            {account.report ? (
                              <button
                                type="button"
                                onClick={() => handleViewReportClick(account)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                View report
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleCreateReportClick(account)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Create report
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleCloseAccount(account.id)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Close account
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAccount(account.id)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-auto flex flex-col mt-16 md:mt-0 pt-14 md:pt-0">
        <div className="mb-4 px-4 md:px-6 pt-2">
          <Navbar />
        </div>
        <div className="flex-1 overflow-auto px-4 md:px-6 pb-6">
          <div className="bg-white rounded-md shadow-md p-4 md:p-6">
            <div className="flex flex-col gap-4 mb-4">
              <div className="font-semibold text-black text-lg md:text-xl">Bank accounts</div>
              <p className="text-sm text-gray-500">
                Select a client, then a bank, to view account numbers. Bank names are shown instead of codes.
              </p>

              <div className="flex whitespace-nowrap border-b border-gray-200 overflow-x-auto">
                {["Account", "Close Account"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveAccountTab(tab)}
                    className={`py-2 px-4 -mb-px font-semibold text-sm ${
                      activeAccountTab === tab
                        ? "border-b-2 border-orange-500 text-orange-500"
                        : "text-gray-500 hover:text-orange-500"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex flex-col md:flex-row gap-2 md:items-center">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search clients, banks, or account numbers…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-md text-sm"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <FaSearch />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCreateNew}
                  className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 text-sm whitespace-nowrap"
                >
                  Create account
                </button>
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-gray-500 py-8 text-center">Loading bank accounts…</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-3 border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600 uppercase">
                    Clients
                  </div>
                  <ul className="max-h-64 lg:max-h-[420px] overflow-y-auto divide-y divide-gray-100">
                    {filteredClients.map((client) => {
                      const count = accounts.filter((a) => a.clientId === client.id).length;
                      const active = selectedClientId === client.id;
                      return (
                        <li key={client.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedClientId(client.id);
                              setSelectedBankId(null);
                            }}
                            className={`w-full text-left px-3 py-3 text-sm hover:bg-orange-50 ${
                              active ? "bg-orange-50 font-semibold text-orange-700" : "text-gray-800"
                            }`}
                          >
                            {clientDisplayName(client)}
                            <span className="block text-xs text-gray-500 mt-0.5">
                              {count} account{count === 1 ? "" : "s"}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="lg:col-span-3 border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600 uppercase">
                    Banks
                  </div>
                  {!selectedClientId ? (
                    <p className="p-4 text-sm text-gray-500">Select a client first.</p>
                  ) : banksForSelectedClient.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500">No banks for this client yet.</p>
                  ) : (
                    <ul className="max-h-64 lg:max-h-[420px] overflow-y-auto divide-y divide-gray-100">
                      {banksForSelectedClient.map((bank) => (
                        <li key={bank.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedBankId(bank.id)}
                            className={`w-full text-left px-3 py-3 text-sm hover:bg-orange-50 ${
                              selectedBankId === bank.id
                                ? "bg-orange-50 font-semibold text-orange-700"
                                : "text-gray-800"
                            }`}
                          >
                            {bank.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="lg:col-span-6 border border-gray-200 rounded-lg p-3 min-w-0">
                  <div className="mb-3 text-sm text-gray-700">
                    {selectedClientId ? (
                      <>
                        <span className="font-medium">{selectedClientName}</span>
                        {selectedBankId && (
                          <>
                            {" → "}
                            <span className="font-medium">
                              {banksForSelectedClient.find((b) => b.id === selectedBankId)?.name}
                            </span>
                          </>
                        )}
                      </>
                    ) : (
                      "Choose a client and bank to see accounts."
                    )}
                  </div>
                  {activeAccountTab === "Account"
                    ? renderAccountsTable(
                        selectedClientId && selectedBankId ? visibleAccounts : [],
                      )
                    : renderAccountsTable(
                        selectedClientId ? visibleAccounts : [],
                        true,
                      )}
                  <p className="mt-3 text-xs text-gray-500">
                    Showing {visibleAccounts.length} account{visibleAccounts.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showReportModal && reportingAccount && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-black font-semibold">
                Create report for {reportingAccount.accountName}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowReportModal(false);
                  setReportingAccount(null);
                  setReportContent("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <textarea
              value={reportContent}
              onChange={(e) => setReportContent(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Write your report here…"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowReportModal(false);
                  setReportingAccount(null);
                  setReportContent("");
                }}
                className="px-4 py-2 border rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveReport}
                className="px-4 py-2 bg-[#F36F2E] text-white rounded-md text-sm"
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
