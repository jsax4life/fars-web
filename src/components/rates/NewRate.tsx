"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/utility/Sidebar";
import Navbar from "@/components/nav/Navbar";
import { useRates } from "@/hooks/useRates";
import { useClients } from "@/hooks/useClient";
import { useBanks } from "@/hooks/useBank";
import RateDecimalInput from "@/components/rates/RateDecimalInput";
import {
  LOAN_INTEREST_TYPE_OPTIONS,
  normalizeLoanInterestTypeForApi,
  optionalDecimalPayload,
  parseDecimalInput,
  RATE_CURRENCIES,
} from "@/lib/rateFormUtils";
import { buildFeesPayload, emptyRateFee, type RateFeeEntry } from "@/types/rateFees";

interface RateArrayItem {
  rate: string;
  effectiveFrom: string;
  effectiveTo: string;
}

interface LoanInterestRateItem extends RateArrayItem {
  loanType: string;
}

interface FormData {
  clientId: string;
  bankId: string;
  drRates: RateArrayItem[];
  loanInterestRates: LoanInterestRateItem[];
  lcCommissions: RateArrayItem[];
  preNegotiationRates: RateArrayItem[];
  postNegotiationRates: RateArrayItem[];
  creditInterestRates: RateArrayItem[];
  camfRate: string;
  managementFeeRate: string;
  returnChargeRate: string;
  returnChargeLimit: string;
  cotCovenantRate: string;
  cotOffCoverRate: string;
  cotOICRate: string;
  turnoverLimit: string;
  cotCovenantFrequency: string;
  chargeCOTOnShortfall: boolean;
  debitRate: string;
  excessRate: string;
  excessRateType: string;
  vatRate: string;
  whtRate: string;
  rateType: string;
  currency: string;
  effectiveFrom: string;
  effectiveTo: string;
}

interface Client {
  id: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

interface Bank {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

const NewRate = () => {
  const router = useRouter();
  const { createRate } = useRates();
  const { getClients } = useClients();
  const { getBanks } = useBanks();
  const [banks, setBanks] = useState<Bank[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fees, setFees] = useState<RateFeeEntry[]>([emptyRateFee()]);

  const emptyRateRow = (): RateArrayItem => ({ rate: "", effectiveFrom: "", effectiveTo: "" });
  const emptyLoanInterestRow = (): LoanInterestRateItem => ({
    rate: "",
    effectiveFrom: "",
    effectiveTo: "",
    loanType: "SHORT_TERM",
  });

  const [formData, setFormData] = useState<FormData>({
    clientId: "",
    bankId: "",
    drRates: [emptyRateRow()],
    loanInterestRates: [emptyLoanInterestRow()],
    lcCommissions: [emptyRateRow()],
    preNegotiationRates: [emptyRateRow()],
    postNegotiationRates: [emptyRateRow()],
    creditInterestRates: [emptyRateRow()],
    camfRate: "",
    managementFeeRate: "",
    returnChargeRate: "",
    returnChargeLimit: "",
    cotCovenantRate: "",
    cotOffCoverRate: "",
    cotOICRate: "",
    turnoverLimit: "",
    cotCovenantFrequency: "monthly",
    chargeCOTOnShortfall: false,
    debitRate: "",
    excessRate: "",
    excessRateType: "flat",
    vatRate: "",
    whtRate: "",
    rateType: "tiered",
    currency: "NGN",
    effectiveFrom: "",
    effectiveTo: "",
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const clientsData = await getClients();
        if (clientsData && Array.isArray(clientsData)) {
          setClients(clientsData);
        }
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchBanks = async () => {
      try {
        setIsLoading(true);
        const banksData = await getBanks();
        if (banksData && Array.isArray(banksData)) {
          setBanks(banksData);
        }
      } catch (error) {
        console.error("Failed to fetch banks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanks();

    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name.includes(".")) {
      // Handle nested rate array fields
      const [arrayName, index, field] = name.split(".");
      const idx = parseInt(index);
      setFormData((prev) => {
        const key = arrayName as keyof FormData;
        const current = prev[key];
        if (!Array.isArray(current)) return prev;
        const newArray = [...(current as unknown as Record<string, string>[])];
        newArray[idx] = { ...newArray[idx], [field]: value };
        return { ...prev, [arrayName]: newArray };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFeeChange = (index: number, field: keyof RateFeeEntry, value: string) => {
    setFees((prev) =>
      prev.map((fee, i) => (i === index ? { ...fee, [field]: value } : fee)),
    );
  };

  const addFeeRow = () => setFees((prev) => [...prev, emptyRateFee()]);
  const removeFeeRow = (index: number) =>
    setFees((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));

  const parseRateArray = (items: RateArrayItem[]) =>
    items
      .map((r) => ({
        rate: parseDecimalInput(r.rate),
        effectiveFrom: r.effectiveFrom,
        effectiveTo: r.effectiveTo,
      }))
      .filter(
        (r) =>
          r.rate !== undefined &&
          r.rate > 0 &&
          Boolean(r.effectiveFrom) &&
          Boolean(r.effectiveTo),
      )
      .map((r) => ({
        rate: r.rate as number,
        effectiveFrom: r.effectiveFrom,
        effectiveTo: r.effectiveTo,
      }));

  const parseLoanInterestArray = (items: LoanInterestRateItem[]) =>
    items
      .map((r) => ({
        rate: parseDecimalInput(r.rate),
        loanType: normalizeLoanInterestTypeForApi(r.loanType || "SHORT_TERM"),
        effectiveFrom: r.effectiveFrom,
        effectiveTo: r.effectiveTo,
      }))
      .filter(
        (r) =>
          r.rate !== undefined &&
          r.rate > 0 &&
          Boolean(r.effectiveFrom) &&
          Boolean(r.effectiveTo),
      )
      .map((r) => ({
        rate: r.rate as number,
        loanType: r.loanType,
        effectiveFrom: r.effectiveFrom,
        effectiveTo: r.effectiveTo,
      }));

  const addRateItem = (arrayName: keyof FormData) => {
    setFormData((prev) => {
      const currentArray = prev[arrayName] as RateArrayItem[];
      return {
        ...prev,
        [arrayName]:
          arrayName === "loanInterestRates"
            ? [...(currentArray as LoanInterestRateItem[]), emptyLoanInterestRow()]
            : [...(currentArray as RateArrayItem[]), emptyRateRow()],
      };
    });
  };

  const removeRateItem = (arrayName: keyof FormData, index: number) => {
    setFormData((prev) => {
      const currentArray = prev[arrayName] as RateArrayItem[];
      if (currentArray.length <= 1) return prev;
      return {
        ...prev,
        [arrayName]: currentArray.filter((_, i) => i !== index),
      };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.clientId) {
      return;
    }

    setIsSubmitting(true);
    try {
      const loanInterestRates = parseLoanInterestArray(formData.loanInterestRates);

      const payload: Parameters<typeof createRate>[0] = {
        clientId: formData.clientId,
        bankId: formData.bankId || undefined,
        drRates: parseRateArray(formData.drRates),
        loanInterestRates: loanInterestRates.length ? loanInterestRates : undefined,
        lcCommissions: parseRateArray(formData.lcCommissions),
        preNegotiationRates: parseRateArray(formData.preNegotiationRates),
        postNegotiationRates: parseRateArray(formData.postNegotiationRates),
        creditInterestRates: parseRateArray(formData.creditInterestRates),
        camfRate: optionalDecimalPayload(formData.camfRate),
        managementFeeRate: optionalDecimalPayload(formData.managementFeeRate),
        fees: buildFeesPayload(fees),
        returnChargeRate: optionalDecimalPayload(formData.returnChargeRate),
        returnChargeLimit: optionalDecimalPayload(formData.returnChargeLimit),
        cotCovenantRate: optionalDecimalPayload(formData.cotCovenantRate),
        cotOffCoverRate: optionalDecimalPayload(formData.cotOffCoverRate),
        cotOICRate: optionalDecimalPayload(formData.cotOICRate),
        turnoverLimit: optionalDecimalPayload(formData.turnoverLimit),
        cotCovenantFrequency: formData.cotCovenantFrequency,
        chargeCOTOnShortfall: formData.chargeCOTOnShortfall,
        debitRate: optionalDecimalPayload(formData.debitRate),
        excessRate: optionalDecimalPayload(formData.excessRate),
        excessRateType: formData.excessRateType,
        vatRate: optionalDecimalPayload(formData.vatRate),
        whtRate: optionalDecimalPayload(formData.whtRate),
        rateType: formData.rateType,
        currency: formData.currency,
        effectiveFrom: formData.effectiveFrom,
        effectiveTo: formData.effectiveTo,
      };

      const response = await createRate(payload);
      if (response) {
        router.push("/Rates");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderLoanInterestRates = () => {
    const array = formData.loanInterestRates;
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Loan interest rates</h3>
          <button
            type="button"
            onClick={() => addRateItem("loanInterestRates")}
            className="text-sm text-orange-600 hover:text-orange-700"
          >
            + Add loan interest rate
          </button>
        </div>
        {array.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-3 p-3 bg-gray-50 rounded-md"
          >
            <div>
              <label className="block text-xs text-gray-600 mb-1">Loan type</label>
              <select
                name={`loanInterestRates.${index}.loanType`}
                value={item.loanType}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
              >
                {LOAN_INTEREST_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Rate (%)</label>
              <RateDecimalInput
                name={`loanInterestRates.${index}.rate`}
                value={item.rate}
                onChange={handleChange}
                placeholder="e.g. 25"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Effective from</label>
              <input
                type="date"
                name={`loanInterestRates.${index}.effectiveFrom`}
                value={item.effectiveFrom}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Effective to</label>
              <input
                type="date"
                name={`loanInterestRates.${index}.effectiveTo`}
                value={item.effectiveTo}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="flex items-end">
              {array.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRateItem("loanInterestRates", index)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderRateArray = (arrayName: keyof FormData, label: string) => {
    const array = formData[arrayName] as RateArrayItem[];
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
          <button
            type="button"
            onClick={() => addRateItem(arrayName)}
            className="text-sm text-orange-600 hover:text-orange-700"
          >
            + Add {label}
          </button>
        </div>
        {array.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 p-3 bg-gray-50 rounded-md"
          >
            <div>
              <label className="block text-xs text-gray-600 mb-1">Rate (%)</label>
              <RateDecimalInput
                name={`${String(arrayName)}.${index}.rate`}
                value={item.rate}
                onChange={handleChange}
                placeholder="e.g. 25"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Effective From
              </label>
              <input
                type="date"
                name={`${String(arrayName)}.${index}.effectiveFrom`}
                value={item.effectiveFrom}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Effective To
              </label>
              <input
                type="date"
                name={`${String(arrayName)}.${index}.effectiveTo`}
                value={item.effectiveTo}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="flex items-end">
              {array.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRateItem(arrayName, index)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
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
              aria-label="Back to Rates"
              onClick={() => router.push("/Rates")}
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
              Create Rate
            </h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              Loading clients...
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow p-4 md:p-6"
            >
              {/* Basic Information */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-800 mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="clientId"
                      value={formData.clientId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select Client</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.companyName ||
                            `${client.firstName || ""} ${
                              client.lastName || ""
                            }`.trim() ||
                            client.id}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {RATE_CURRENCIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="bankId"
                      value={formData.bankId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select Bank</option>
                      {banks.map((bank) => (
                        <option key={bank.id} value={bank.id}>
                          {bank.name || bank.code || bank.id}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rate Type
                    </label>
                    <select
                      name="rateType"
                      value={formData.rateType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="tiered">Tiered</option>
                      <option value="flat">Flat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Effective From
                    </label>
                    <input
                      type="date"
                      name="effectiveFrom"
                      value={formData.effectiveFrom}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Effective To
                    </label>
                    <input
                      type="date"
                      name="effectiveTo"
                      value={formData.effectiveTo}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Standalone CAMF & management fee */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-800 mb-4">
                  CAMF &amp; Management Fee
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CAMF Rate (%)
                    </label>
                    <RateDecimalInput
                      name="camfRate"
                      value={formData.camfRate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Management Fee Rate (%)
                    </label>
                    <RateDecimalInput
                      name="managementFeeRate"
                      value={formData.managementFeeRate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Related fees */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-semibold text-gray-800">
                    Rate change &amp; related fees
                  </h3>
                  <button
                    type="button"
                    onClick={addFeeRow}
                    className="text-sm text-orange-600 hover:text-orange-700"
                  >
                    + Add fee
                  </button>
                </div>
                {fees.map((fee, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3 p-3 bg-gray-50 rounded-md"
                  >
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">Name</label>
                      <input
                        type="text"
                        value={fee.name}
                        onChange={(e) => handleFeeChange(index, "name", e.target.value)}
                        placeholder="Rate change management fee"
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Charge type</label>
                      <select
                        value={fee.chargeType}
                        onChange={(e) =>
                          handleFeeChange(
                            index,
                            "chargeType",
                            e.target.value as RateFeeEntry["chargeType"],
                          )
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="rate">Rate (%)</option>
                        <option value="amount">Flat amount</option>
                      </select>
                    </div>
                    {fee.chargeType === "rate" ? (
                      <>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Rate (%)</label>
                          <RateDecimalInput
                            name={`fee.${index}.rate`}
                            value={fee.rate}
                            onChange={(e) => handleFeeChange(index, "rate", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Effective from</label>
                          <input
                            type="date"
                            value={fee.effectiveFrom}
                            onChange={(e) =>
                              handleFeeChange(index, "effectiveFrom", e.target.value)
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Effective to</label>
                          <input
                            type="date"
                            value={fee.effectiveTo}
                            onChange={(e) =>
                              handleFeeChange(index, "effectiveTo", e.target.value)
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="md:col-span-3">
                        <label className="block text-xs text-gray-600 mb-1">Amount</label>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={fee.amount}
                          onChange={(e) => handleFeeChange(index, "amount", e.target.value)}
                          placeholder="50000"
                          className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    )}
                    <div className="flex items-end">
                      {fees.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeeRow(index)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Rate Arrays */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-800 mb-4">
                  Rate Arrays
                </h3>
                {renderRateArray("drRates", "DR Rates")}
                {renderLoanInterestRates()}
                {renderRateArray("lcCommissions", "LC Commissions")}
                {renderRateArray(
                  "preNegotiationRates",
                  "Pre-Negotiation Rates"
                )}
                {renderRateArray(
                  "postNegotiationRates",
                  "Post-Negotiation Rates"
                )}
                {renderRateArray(
                  "creditInterestRates",
                  "Credit Interest Rates"
                )}
              </div>

              {/* Scalar Rates */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-800 mb-4">
                  Rate Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Return Charge Rate
                    </label>
                    <RateDecimalInput
                      name="returnChargeRate"
                      value={formData.returnChargeRate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Return Charge Limit
                    </label>
                    <RateDecimalInput
                      name="returnChargeLimit"
                      value={formData.returnChargeLimit}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      COT Covenant Rate
                    </label>
                    <RateDecimalInput
                      name="cotCovenantRate"
                      value={formData.cotCovenantRate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      COT Off Cover Rate
                    </label>
                    <RateDecimalInput
                      name="cotOffCoverRate"
                      value={formData.cotOffCoverRate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      COT OIC Rate
                    </label>
                    <RateDecimalInput
                      name="cotOICRate"
                      value={formData.cotOICRate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Turnover Limit
                    </label>
                    <RateDecimalInput
                      name="turnoverLimit"
                      value={formData.turnoverLimit}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      COT Covenant Frequency
                    </label>
                    <select
                      name="cotCovenantFrequency"
                      value={formData.cotCovenantFrequency}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Debit Rate
                    </label>
                    <RateDecimalInput
                      name="debitRate"
                      value={formData.debitRate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Excess Rate
                    </label>
                    <RateDecimalInput
                      name="excessRate"
                      value={formData.excessRate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Excess Rate Type
                    </label>
                    <select
                      name="excessRateType"
                      value={formData.excessRateType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="flat">Flat</option>
                      <option value="percentage">Percentage</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      VAT Rate
                    </label>
                    <RateDecimalInput
                      name="vatRate"
                      value={formData.vatRate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      WHT Rate
                    </label>
                    <RateDecimalInput
                      name="whtRate"
                      value={formData.whtRate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="chargeCOTOnShortfall"
                      checked={formData.chargeCOTOnShortfall}
                      onChange={handleChange}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Charge COT On Shortfall
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.push("/Rates")}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Create Rate"}
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
};

export default NewRate;
