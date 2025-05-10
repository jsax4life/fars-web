"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Sidebar from "@/components/utility/Sidebar"; // Adjust path if needed
import Link from "next/link";

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
  returnChargeRate?: string;
  returnChargeAmt?: string;
  cdfConvRate?: string;
  cdfConvAmt?: string;
  totOfSCharge?: string;
  totOfSChargeAmt?: string;
  lsCreditTenorDays?: string;
  cotRate?: string;
  limitStartDate?: string;
  limitEndDate?: string;
  limitAmount?: string;
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
  locStateCountry?: string;
  returnChargeLimit?: string;
  cotConvenantRate?: string;
  cotOffConvenantRate?: string;
  turnOverLimit?: string;
  cotConvenantFrequency?: string;
  creditInterestRate?: string;
  vatWHTRate?: string;
  drRate?: string;
  exRate?: string;
  exChangeType?: string;
  bankingPreference?: "saturday" | "sunday";
  cotApplicable?: "yes";
  // Add other form fields here with their respective types
}

const NewAccount = () => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({});

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
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
    // Here you would typically handle the form submission logic
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">Account Number</label>
                <input type="text" id="accountNumber" name="accountNumber" value={formData.accountNumber || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="dateValue" className="block text-sm font-medium text-gray-700">Date Range</label>
                <input type="date" id="dateValue" name="dateValue" value={formData.dateValue || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="accountCode" className="block text-sm font-medium text-gray-700">Account Code</label>
                <input type="text" id="accountCode" name="accountCode" value={formData.accountCode || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="accountCodeVersion" className="block text-sm font-medium text-gray-700">Account Code Verifier</label>
                <select id="accountCodeVersion" name="accountCodeVersion" value={formData.accountCodeVersion || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
                  <option>Select Verifier</option>
                  {/* Add options here */}
                </select>
              </div>
              <div>
                <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">Account Name</label>
                <input type="text" id="accountName" name="accountName" value={formData.accountName || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
              </div>

              <div>
                <label htmlFor="locationOffline" className="block text-sm font-medium text-gray-700">Location/Office</label>
                <input type="text" id="locationOffline" name="locationOffline" value={formData.locationOffline || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
              </div>
              <div></div> {/* Empty cell for layout */}
              <div>
                <label htmlFor="revenueType" className="block text-sm font-medium text-gray-700">Account Type</label>
                <select id="revenueType" name="revenueType" value={formData.revenueType || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
                  <option>Select Type</option>
                  {/* Add options here */}
                </select>
              </div>
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
                <select id="currency" name="currency" value={formData.currency || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
                  <option>Select Currency</option>
                  {/* Add options here */}
                </select>
              </div>
              <div>
                <label htmlFor="transactionTeam" className="block text-sm font-medium text-gray-700">Transaction Type</label>
                <select id="transactionTeam" name="transactionTeam" value={formData.transactionTeam || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
                  <option>Select Type</option>
                  {/* Add options here */}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="chequeNo" className="block text-sm font-medium text-gray-700">Cheque No</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" disabled={!formData.chequeNo} />
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="chequeNo" className="block text-sm font-medium text-gray-700">Teller No</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" disabled={!formData.chequeNo} />
              </div>
              <div>
                <label htmlFor="postingBalance" className="block text-sm font-medium text-gray-700">Opening Balance</label>
                <input type="text" id="postingBalance" name="postingBalance" value={formData.postingBalance || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
              </div>

              <div>
                <label htmlFor="orderBy" className="block text-sm font-medium text-gray-700">Order By</label>
                <select id="orderBy" name="orderBy" value={formData.orderBy || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
                  <option>Select Option</option>
                  {/* Add options here */}
                </select>
              </div>
              <div></div> {/* Empty cell for layout */}
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Clearing Days and Rates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 mb-6">
              <div>
                <label htmlFor="locStateCountry" className="block text-sm font-medium text-gray-700">Loc/l. State/ U. Country</label>
                <input type="text" id="locStateCountry" name="locStateCountry" value={formData.locStateCountry || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
              </div>
              <div></div> {/* Empty div for spacing */}
              <div></div> {/* Empty div for spacing */}
              <div>
                <label htmlFor="returnChargeRate" className="block text-sm font-medium text-gray-700">Return Charge Rate</label>
                <input type="text" id="returnChargeRate" name="returnChargeRate" value={formData.returnChargeRate || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="returnChargeLimit" className="block text-sm font-medium text-gray-700">Return Charge Limit</label>
                <input type="text" id="returnChargeLimit" name="returnChargeLimit" value={formData.returnChargeLimit || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
              </div>
              <div></div> {/* Empty div for spacing */}
              <div>
                <label htmlFor="cotConvenantRate" className="block text-sm font-medium text-gray-700">COT Convenant Rate</label>
                <input type="text" id="cotConvenantRate" name="cotConvenantRate" value={formData.cotConvenantRate || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="cotOffConvenantRate" className="block text-sm font-medium text-gray-700">COT Off-Convenant Rate</label>
                <input type="text" id="cotOffConvenantRate" name="cotOffConvenantRate" value={formData.cotOffConvenantRate || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="turnOverLimit" className="block text-sm font-medium text-gray-700">Turn Over Limit</label>
                <input type="text" id="turnOverLimit" name="turnOverLimit" value={formData.turnOverLimit || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
              </div>
              <div className="col-span-3">
                <label htmlFor="cotConvenantFrequency" className="block text-sm font-medium text-gray-700">COT Convenant Frequency</label>
                <select id="cotConvenantFrequency" name="cotConvenantFrequency" value={formData.cotConvenantFrequency || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
                  <option>Select Frequency</option>
                  {/* Add frequency options here */}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Charge COT on Convenant Short Fall</h2>
              <div>
                <label htmlFor="creditInterestRate" className="block text-sm font-medium text-gray-700">Credit Interest Rate</label>
                <input type="text" id="creditInterestRate" name="creditInterestRate" value={formData.creditInterestRate || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="vatWHTRate" className="block text-sm font-medium text-gray-700">VAT WHT Rate</label>
                <input type="text" id="vatWHTRate" name="vatWHTRate" value={formData.vatWHTRate || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Facility Limit</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">

                <div>
                  <label htmlFor="drRate" className="block text-sm font-medium text-gray-700">Dr. Rate</label>
                  <input type="text" id="drRate" name="drRate" value={formData.drRate || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="exRate" className="block text-sm font-medium text-gray-700">Ex. Rate</label>
                  <input type="text" id="exRate" name="exRate" value={formData.exRate || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                </div>
                <div className="col-span-3">
                  <label htmlFor="exChangeType" className="block text-sm font-medium text-gray-700">Ex. Change Type.</label>
                  <select id="exChangeType" name="exChangeType" value={formData.exChangeType || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
                    <option>Select Type</option>
                    {/* Add exchange type options here */}
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Bank Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="leadBank" className="block text-sm font-medium text-gray-700">Bank Name</label>
                <select id="leadBank" name="leadBank" value={formData.leadBank || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
                  <option>Select Bank</option>
                  {/* Add options here */}
                </select>
              </div>

              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street</label>
                <input type="text" id="street" name="street" value={formData.street || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input type="text" id="city" name="city" value={formData.city || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                <input type="text" id="state" name="state" value={formData.state || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                <select id="country" name="country" value={formData.country || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
                  <option>Select Country</option>
                  {/* Add country options here */}
                </select>
              </div>

              <div>
                <label htmlFor="telephoneNo" className="block text-sm font-medium text-gray-700">Telephone No</label>
                <input type="tel" id="telephoneNo" name="telephoneNo" value={formData.telephoneNo || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="faxNo" className="block text-sm font-medium text-gray-700">Fax No</label>
                <input type="tel" id="faxNo" name="faxNo" value={formData.faxNo || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" name="email" value={formData.email || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="swiftCode" className="block text-sm font-medium text-gray-700">Remark</label>
                <input type="text" id="swiftCode" name="swiftCode" value={formData.swiftCode || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
              </div>

              <div className="col-span-full">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input id="saturdayBanking" name="bankingPreference" type="radio" value="saturday" checked={formData.bankingPreference === "saturday"} onChange={handleChange} className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300" />
                    <label htmlFor="saturdayBanking" className="ml-2 block text-sm font-medium text-gray-700">
                      Saturday Banking
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input id="sundayBanking" name="bankingPreference" type="radio" value="sunday" checked={formData.bankingPreference === "sunday"} onChange={handleChange} className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300" />
                    <label htmlFor="sundayBanking" className="ml-2 block text-sm font-medium text-gray-700">
                      Sunday Banking
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <div className="flex items-center">
                  <input id="cotApplicable" name="cotApplicable" type="radio" value="yes" checked={formData.cotApplicable === "yes"} onChange={handleChange} className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300" />
                  <label htmlFor="cotApplicable" className="ml-2 block text-sm font-medium text-gray-700">
                    C.O.T. Applicable to International Transfer/Order
                  </label>
                </div>
              </div>

              {/* More Bank Information fields can be added here */}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:block w-64 bg-gray-200 fixed top-0 left-0 h-full overflow-y-auto">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-white shadow-md rounded-lg overflow-y-auto md:ml-64">

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStep()}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button type="button" onClick={prevStep} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                Previous
              </button>
            )}
            {step < 3 ? (
              <button type="button" onClick={nextStep} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                Next
              </button>
            ) : (
              <Link href = "/Account" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                Apply
              </Link>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default NewAccount;