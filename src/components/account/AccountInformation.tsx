"use client";

import React, { useState, ChangeEvent, useEffect } from "react";

interface FormData {
  accountNumber?: string;
  dateValue?: string;
  accountCode?: string;
  accountCodeVersion?: string;
  accountName?: string;
  accountShortName?: string;
  locationOffline?: string;
  revenueType?: "Select Type" | "savings" | "current" | "corporate";
  currency?: "Select Currency" | "NGN" | "USD" | "GBP";
  transactionTeam?: string;
  chequeNo?: boolean;
  postingBalance?: string;
  orderBy?: string;
  imnSCharge?: string;
  imnSChargeAmt?: string;
  returnChargeRate?: string;
  returnChargeAmt?: string;
  cdfConvRate?: string;
  cdfConvAmt?: string;
  totOfSCharge?: string;
  totOfSChargeAmt?: string;
  lsCreditTenorDays?: string;
  CAMFRate?: string;
  limitStartDate?: string;
  limitEndDate?: string;
  limitAmount?: string;
  leadBank?: "Select Bank" | string;
  leadClient?: "Select Client" | string;
  shareHolding?: string;
  street?: string;
  street2?: string;
  city?: string;
  state?: string;
  country?: "Select Country" | string;
  zipCode?: string;
  telephoneNo?: string;
  faxNo?: string;
  email?: string;
  swiftCode?: string;
  accountOfficer?: string;
  locStateCountry?: string;
  returnChargeLimit?: string;
  CAMFConvenantRate?: string;
  CAMFOffConvenantRate?: string;
  turnOverLimit?: string;
  CAMFConvenantFrequency?: string;
  creditInterestRate?: string;
  vatWHTRate?: string;
  drRate?: string;
  exRate?: string;
  exChargeType?: "Select Type" | string;
  bankingPreference?: "saturday" | "sunday";
  CAMFApplicable?: "yes";
  // Add other form fields here with their respective types
}

interface Field {
  id: keyof FormData;
  label: string;
  type: "text" | "date" | "select" | "checkbox" | "radio" | "tel" | "email";
  options?: string[] | { label: string; value: string }[];
}

type InitialData = Partial<{
  accountNumber: string;
  accountCode: string;
  accountName: string;
  revenueType: string;
  currency: string;
  postingBalance: string;
  leadBank: string;
  drRate: string;
  exRate: string;
  exChargeType: string;
  CAMFRate: string;
  returnChargeRate: string;
  returnChargeLimit: string;
  CAMFConvenantRate: string;
  CAMFOffConvenantRate: string;
  turnOverLimit: string;
  CAMFConvenantFrequency: string;
  creditInterestRate: string;
  vatWHTRate: string;
}>;

const AccountInformation = ({ initialData }: { initialData?: InitialData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState<FormData>({});

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        accountNumber: initialData.accountNumber ?? prev.accountNumber,
        accountCode: initialData.accountCode ?? prev.accountCode,
        accountName: initialData.accountName ?? prev.accountName,
        revenueType: (initialData.revenueType as any) ?? prev.revenueType,
        currency: (initialData.currency as any) ?? prev.currency,
        postingBalance: initialData.postingBalance ?? prev.postingBalance,
        leadBank: initialData.leadBank ?? prev.leadBank,
        drRate: initialData.drRate ?? prev.drRate,
        exRate: initialData.exRate ?? prev.exRate,
        exChargeType: (initialData.exChargeType as any) ?? prev.exChargeType,
        CAMFRate: initialData.CAMFRate ?? prev.CAMFRate,
        returnChargeRate: initialData.returnChargeRate ?? prev.returnChargeRate,
        returnChargeLimit: initialData.returnChargeLimit ?? prev.returnChargeLimit,
        CAMFConvenantRate: initialData.CAMFConvenantRate ?? prev.CAMFConvenantRate,
        CAMFOffConvenantRate: initialData.CAMFOffConvenantRate ?? prev.CAMFOffConvenantRate,
        turnOverLimit: initialData.turnOverLimit ?? prev.turnOverLimit,
        CAMFConvenantFrequency: initialData.CAMFConvenantFrequency ?? prev.CAMFConvenantFrequency,
        creditInterestRate: initialData.creditInterestRate ?? prev.creditInterestRate,
        vatWHTRate: initialData.vatWHTRate ?? prev.vatWHTRate,
      }));
    }
  }, [initialData]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const firstEightFields: Field[] = [
    { id: "accountNumber", label: "Account Number", type: "text" },
    { id: "accountCode", label: "Account Code", type: "text" },
    { id: "accountName", label: "Account Name", type: "text" },
    {
      id: "revenueType",
      label: "Account Type",
      type: "select",
      options: [
        "Select Type",
        "savings" as const,
        "current" as const,
        "corporate" as const,
      ],
    },
    {
      id: "currency",
      label: "Currency",
      type: "select",
      options: ["Select Currency", "NGN" as const, "USD" as const, "GBP" as const],
    },
    { id: "postingBalance", label: "Opening Balance", type: "text" },
    { id: "leadBank", label: "Bank Name", type: "text" },
  ];

  const allFields: Field[] = [
    ...firstEightFields,
    { id: "returnChargeRate", label: "Return Charge Rate", type: "text" },
    { id: "returnChargeLimit", label: "Return Charge Limit", type: "text" },
    { id: "CAMFRate", label: "CAMF Rate", type: "text" },
    { id: "CAMFConvenantRate", label: "CAMF Convenant Rate", type: "text" },
    { id: "CAMFOffConvenantRate", label: "CAMF Off Convenant Rate", type: "text" },
    { id: "CAMFConvenantFrequency", label: "CAMF Convenant Frequency", type: "text" },
    { id: "turnOverLimit", label: "Turnover Limit", type: "text" },
    { id: "drRate", label: "Dr. Rate", type: "text" },
    { id: "exRate", label: "Ex. Rate", type: "text" },
    {
      id: "exChargeType",
      label: "Ex. Charge Type.",
      type: "select",
      options: ["Select Type", "flat", "percentage"],
    },
    { id: "creditInterestRate", label: "Credit Interest Rate", type: "text" },
    { id: "vatWHTRate", label: "WHT Rate", type: "text" },
  ];

  return (
    <div className="mb-6">
      <div className="font-semibold text-black text-lg mb-2 flex items-center justify-between">
        Account Information
        <button onClick={toggleExpand} className="text-gray-500 focus:outline-none">
          <svg
            className={`w-5 h-5 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4`}>
        {(isExpanded ? allFields : firstEightFields).map((field) => (
          <div key={field.id}>
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-gray-700"
            >
              {field.label}
            </label>
            {field.type === "text" ||
            field.type === "date" ||
            field.type === "tel" ||
            field.type === "email" ? (
              <input
                type={field.type}
                id={field.id}
                name={field.id}
                value={formData[field.id] as string || ""}
                onChange={handleChange}
                readOnly
                className="mt-1 block w-full rounded-md shadow-sm py-2 px-3 sm:text-sm bg-gray-100 border-transparent focus:border-orange-500 focus:ring-orange-500"
                style={{ border: 'none' }}
              />
            ) : field.type === "select" ? (
              <select
                id={field.id}
                name={field.id}
                value={formData[field.id] as string || ""}
                onChange={handleChange}
                disabled
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm bg-gray-100"
              >
                {field.options?.map((option, index) => (
                  <option
                    key={index}
                    value={typeof option === "string" ? option : option.value}
                  >
                    {typeof option === "string" ? option : option.label}
                  </option>
                ))}
              </select>
            ) : field.type === "radio" ? (
              <div className="flex items-center space-x-4">
                {field.options?.map((option) => (
                  <div
                    key={typeof option === "string" ? option : option.value}
                    className="flex items-center"
                  >
                    <input
                      id={`${field.id}-${
                        typeof option === "string" ? option : option.value
                      }`}
                      name={field.id}
                      type="radio"
                      value={
                        typeof option === "string" ? option : option.value
                      }
                      checked={
                        formData[field.id] ===
                        (typeof option === "string" ? option : option.value)
                      }
                      onChange={handleChange}
                      className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300"
                    />
                    <label
                      htmlFor={`${field.id}-${
                        typeof option === "string" ? option : option.value
                      }`}
                      className="ml-2 block text-gray-700 text-sm"
                    >
                      {typeof option === "string" ? option : option.label}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <input
                type="checkbox"
                id={field.id}
                name={field.id}
                checked={formData[field.id] as boolean || false}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
            )}
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default AccountInformation;