"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/components/utility/Sidebar";
import Navbar from "@/components/nav/Navbar";
import { useRates, type RateSummary } from "@/hooks/useRates";
import { useBankAccounts } from "@/hooks/useBankAccount";

const AssignRate = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const accountId = searchParams.get("accountId");
  const accountName = searchParams.get("accountName") || "";
  const { getRatesByClientAndBank, getRatesByClientId } = useRates();
  const { assignRateToAccount, unassignRateFromAccount, getBankAccountById } =
    useBankAccounts();
  const [rates, setRates] = useState<RateSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRateId, setSelectedRateId] = useState<string>("");
  const [currentRateId, setCurrentRateId] = useState<string | null>(null);
  const [currentRateCode, setCurrentRateCode] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isUnassigning, setIsUnassigning] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!accountId) return;

      setLoading(true);
      try {
        // First, fetch the account to get the clientId
        const account = await getBankAccountById(accountId);
        if (!cancelled && account) {
          const acct = account as {
            clientId?: string;
            bankId?: string;
            rateId?: string | null;
            rate?: { id?: string; code?: string };
          };
          const accountClientId = acct.clientId;
          const accountBankId = acct.bankId;
          const assignedRateId = acct.rateId ?? acct.rate?.id ?? null;
          if (assignedRateId) {
            setCurrentRateId(assignedRateId);
            setSelectedRateId(assignedRateId);
            setCurrentRateCode(acct.rate?.code ?? null);
          }
          if (accountClientId && accountBankId) {
            setClientId(accountClientId);
            let res = await getRatesByClientAndBank(
              accountClientId,
              accountBankId,
            );
            if ((!res || res.length === 0) && accountClientId) {
              res = await getRatesByClientId(accountClientId);
            }
            if (!cancelled && Array.isArray(res)) {
              setRates(res);
              if (assignedRateId) {
                const match = res.find((r) => r.id === assignedRateId);
                if (match?.code) setCurrentRateCode(match.code);
              }
            }
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  const handleUnassignRate = async () => {
    if (!accountId || !currentRateId) return;
    if (
      !window.confirm(
        "Unassign the rate from this account? Analysis will fail until a new rate is assigned.",
      )
    ) {
      return;
    }
    setIsUnassigning(true);
    try {
      await unassignRateFromAccount(accountId);
      setCurrentRateId(null);
      setCurrentRateCode(null);
      setSelectedRateId("");
    } finally {
      setIsUnassigning(false);
    }
  };

  const handleAssignRate = async () => {
    if (!accountId) {
      alert("Account ID is missing");
      return;
    }
    if (!selectedRateId) {
      alert("Please select a rate");
      return;
    }

    setIsAssigning(true);
    try {
      await assignRateToAccount(accountId, selectedRateId);
      setCurrentRateId(selectedRateId);
      const assigned = rates.find((r) => r.id === selectedRateId);
      if (assigned?.code) setCurrentRateCode(assigned.code);
      router.back();
    } catch (error) {
      console.error("Error assigning rate:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  const minimalRate = (
    r?: { rate: number; effectiveFrom: string; effectiveTo: string }[]
  ) => {
    if (!r || r.length === 0) return { rate: "-", from: "-", to: "-" };
    const it = r[0];
    return { rate: it.rate, from: it.effectiveFrom, to: it.effectiveTo };
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 min-w-0 md:mt-0">
        <div className="mb-4">
          <Navbar />
        </div>
        <main className="p-4 sm:p-6 lg:p-8 pt-32 md:pt-32">
          <div className="flex items-center gap-3 mb-6">
            <button
              aria-label="Back"
              onClick={() => router.back()}
              className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-700"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <h2 className="text-[#363636] text-lg md:text-xl font-semibold">
              Assign Rate {accountName && `- ${accountName}`}
            </h2>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div
              className={`mb-6 rounded-md border p-4 text-sm ${
                currentRateId
                  ? "border-green-200 bg-green-50 text-green-900"
                  : "border-amber-200 bg-amber-50 text-amber-900"
              }`}
            >
              {currentRateId ? (
                <p>
                  Current rate:{" "}
                  <span className="font-semibold">
                    {currentRateCode || currentRateId}
                  </span>
                  . Choose another rate below to replace it, or unassign.
                </p>
              ) : (
                <p>
                  No rate is assigned to this account. Analysis requires a rate
                  config — select a rate below and assign it.
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Rate <span className="text-red-500">*</span>
              </label>
              {loading ? (
                <div className="text-center text-gray-500 py-4">
                  Loading rates...
                </div>
              ) : rates.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  No rates available
                </div>
              ) : (
                <div className="border border-gray-300 rounded-md max-h-96 overflow-y-auto">
                  <div className="divide-y divide-gray-200">
                    {rates.map((rate) => {
                      const dr = minimalRate(rate.drRates);
                      const clientName =
                        rate.client?.companyName ||
                        [rate.client?.firstName, rate.client?.lastName]
                          .filter(Boolean)
                          .join(" ") ||
                        "Unknown Client";
                      return (
                        <label
                          key={rate.id}
                          className={`flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                            selectedRateId === rate.id ? "bg-orange-50" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="rate"
                            value={rate.id}
                            checked={selectedRateId === rate.id}
                            onChange={(e) => setSelectedRateId(e.target.value)}
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                          />
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {rate.code}
                            </p>
                            <p className="text-xs text-gray-500">
                              {clientName}
                            </p>
                            <p className="text-xs text-gray-500">
                              Currency: {rate.currency || "-"} | DR Rate:{" "}
                              {dr.rate}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-gray-200">
              {currentRateId && (
                <button
                  type="button"
                  onClick={handleUnassignRate}
                  disabled={isUnassigning || isAssigning}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-md text-sm font-medium hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed mr-auto"
                >
                  {isUnassigning ? "Unassigning..." : "Unassign rate"}
                </button>
              )}
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isAssigning || isUnassigning}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignRate}
                disabled={
                  isAssigning ||
                  isUnassigning ||
                  !selectedRateId ||
                  (!!currentRateId && selectedRateId === currentRateId)
                }
                className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAssigning
                  ? "Saving..."
                  : currentRateId
                    ? "Update rate"
                    : "Assign rate"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AssignRate;
