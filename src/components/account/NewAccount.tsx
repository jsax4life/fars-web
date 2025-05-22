"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Sidebar from "@/components/utility/Sidebar";
import Link from "next/link";
import RateAdjustmentForm from "./RateAdjustment";

interface FormData {
  accountNumber?: string;
  dateValue?: string;
  accountCode?: string;
  accountCodeVersion?: string;
  accountName?: string;
  accountShortName?: string;
  locationOffline?: string;
  revenueType?: string;
  currency?: string;
  transactionTeam?: string;
  chequeNo?: boolean;
  postingBalance?: string;
  orderBy?: string;
  imnSCharge?: string;
  imnSChargeAmt?: string;
  locStateCountry?: string;
  returnChargeRate?: string;
  returnChargeLimit?: string;
  cotConvenantRate?: string;
  cotOffConvenantRate?: string;
  turnOverLimit?: string;
  cotConvenantFrequency?: string;
  chargeCOTOnTurnoverShortfall?: "yes" | "no";
  creditInterestRate?: string;
  vatWHTRate?: string;
  drRate?: string;
  exRate?: string;
  exChangeType?: string;
  limitAmount?: string;
  leadClient?: string;
  loanType?: "shortTerm" | "termLoan";
  loanInterestRate?: string;
  loanPenalRate?: string;
  loanContribution?: string;
  leadBank?: string;
  shareHolding?: string;
  street?: string;
  street2?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  telephoneNo?: string;
  faxNo?: string;
  email?: string;
  swiftCode?: string;
  accountOfficer?: string;
  bankingPreference?: "saturday" | "sunday";
  cotApplicable?: "yes";
}

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

const NewAccount = () => {
  const [formData, setFormData] = useState<FormData>({});
  const [showModal, setShowModal] = useState(false);
  const [modalFormData, setModalFormData] = useState<ModalFormData>({
    fromDate: "",
    toDate: "",
    localCheques: "",
    intraStateCheques: "",
    upCountryCheques: "",
    setAsPrevailingDays: false,
    setParametersAsPrevailing: false,
    camfFrequency: "",
    camfOnShortfall: "",
    camfCoverRate: "",
    camfOCRate: "",
    turnoverLimit: "",
    currencyDescription: "",
    rate: "",
    retChgRate: "",
    retChgLimit: "",
    overdraftLimit: "",
    drRate: "",
    exRate: "",
    exChargeType: "",
    creditInterestRate: "",
    whtRate: "",
  });

  const handleModalChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;

    if (type === "checkbox") {
      const checked = (event.target as HTMLInputElement).checked;
      setModalFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setModalFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSave = () => {
    console.log("Modal data:", modalFormData);
    setShowModal(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="hidden md:block w-64 bg-gray-200 fixed top-0 left-0 h-full overflow-y-auto">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 bg-white shadow-md rounded-lg overflow-y-auto md:ml-64">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Account Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="accountNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Account Number
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="dateValue"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date Range
                </label>
                <input
                  type="date"
                  id="dateValue"
                  name="dateValue"
                  value={formData.dateValue || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="accountName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Account Name
                </label>
                <input
                  type="text"
                  id="accountName"
                  name="accountName"
                  value={formData.accountName || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="accountShortName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Account Short Name
                </label>
                <input
                  type="text"
                  id="accountShortName"
                  name="accountShortName"
                  value={formData.accountShortName || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="locationOffline"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location/Office
                </label>
                <input
                  type="text"
                  id="locationOffline"
                  name="locationOffline"
                  value={formData.locationOffline || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="revenueType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Account Type
                </label>
                <select
                  id="revenueType"
                  name="revenueType"
                  value={formData.revenueType || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                >
                  <option value="">Select Type</option>
                  {/* Add actual options here */}
                </select>
              </div>
              <div>
                <label
                  htmlFor="currency"
                  className="block text-sm font-medium text-gray-700"
                >
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                >
                  <option value="">Select Currency</option>
                  {/* Add actual options here */}
                </select>
              </div>
              <div>
                <label
                  htmlFor="transactionTeam"
                  className="block text-sm font-medium text-gray-700"
                >
                  Transaction Type
                </label>
                <select
                  id="transactionTeam"
                  name="transactionTeam"
                  value={formData.transactionTeam || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                >
                  <option value="">Select Type</option>
                  {/* Add actual options here */}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label
                  htmlFor="chequeNo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Cheque No
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  disabled={!formData.chequeNo}
                />
              </div>
              <div className="flex items-center space-x-2">
                <label
                  htmlFor="tellerNo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Teller No
                </label>
                <input
                  type="text"
                  id="tellerNo"
                  name="tellerNo" // Added name attribute
                  className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  disabled={!formData.chequeNo}
                />
              </div>
              <div>
                <label
                  htmlFor="postingBalance"
                  className="block text-sm font-medium text-gray-700"
                >
                  Opening Balance
                </label>
                <input
                  type="text"
                  id="postingBalance"
                  name="postingBalance"
                  value={formData.postingBalance || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="orderBy"
                  className="block text-sm font-medium text-gray-700"
                >
                  Order By
                </label>
                <select
                  id="orderBy"
                  name="orderBy"
                  value={formData.orderBy || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                >
                  <option value="">Select Option</option>
                  {/* Add actual options here */}
                </select>
              </div>
              <div>
                <label
                  htmlFor="leadBank"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bank Name
                </label>
                <select
                  id="leadBank"
                  name="leadBank"
                  value={formData.leadBank || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                >
                  <option value="">Select Bank</option>
                  {/* Add actual options here */}
                </select>
              </div>
               <div>
                <label
                  htmlFor="leadBank"
                  className="block text-sm font-medium text-gray-700"
                >
                  Client Name
                </label>
                <select
                  id="leadBank"
                  name="leadBank"
                  value={formData.leadClient || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                >
                  <option value="">Select Client</option>
                  {/* Add actual options here */}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Link
              href="/AccountDetails"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Apply
            </Link>
          </div>
        </form>
      </div>

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
    </div>
  );
};

export default NewAccount;