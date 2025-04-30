"use client";

import React from "react";
import Sidebar from "@/components/utility/Sidebar"; // Adjust path if needed

const NewAccount = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-white shadow-md rounded-lg overflow-y-auto">
        <h1 className="text-xl font-semibold mb-4 text-gray-800">Account Information</h1>

        <form className="space-y-4">
          {/* Account Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">Account Number</label>
              <input type="text" id="accountNumber" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="dateValue" className="block text-sm font-medium text-gray-700">Date Value</label>
              <input type="date" id="dateValue" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="accountCode" className="block text-sm font-medium text-gray-700">Account Code</label>
              <input type="text" id="accountCode" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="accountCodeVersion" className="block text-sm font-medium text-gray-700">Account Code Version</label>
              <select id="accountCodeVersion" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option>Select Version</option>
                {/* Add options here */}
              </select>
            </div>
            <div>
              <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">Account Name</label>
              <input type="text" id="accountName" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="accountShortName" className="block text-sm font-medium text-gray-700">Account Short Name</label>
              <input type="text" id="accountShortName" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="locationOffline" className="block text-sm font-medium text-gray-700">Location Offline</label>
              <input type="text" id="locationOffline" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            {/* Empty cell for layout */}
            <div></div>
            <div>
              <label htmlFor="revenueType" className="block text-sm font-medium text-gray-700">Revenue Type</label>
              <select id="revenueType" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option>Select Type</option>
                {/* Add options here */}
              </select>
            </div>
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
              <select id="currency" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option>Select Currency</option>
                {/* Add options here */}
              </select>
            </div>
            <div>
              <label htmlFor="transactionTeam" className="block text-sm font-medium text-gray-700">Transaction Team</label>
              <select id="transactionTeam" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option>Select Team</option>
                {/* Add options here */}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="chequeNo" className="block text-sm font-medium text-gray-700">Cheque No</label>
              <input type="checkbox" id="chequeNo" className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" disabled />
            </div>
            <div>
              <label htmlFor="postingBalance" className="block text-sm font-medium text-gray-700">Posting Balance</label>
              <input type="text" id="postingBalance" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="ledgerBalance" className="block text-sm font-medium text-gray-700">Ledger Balance</label>
              <input type="text" id="ledgerBalance" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            {/* Order By */}
            <div>
              <label htmlFor="orderBy" className="block text-sm font-medium text-gray-700">Order By</label>
              <select id="orderBy" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option>Select Option</option>
                {/* Add options here */}
              </select>
            </div>
            {/* Empty cell for layout */}
            <div></div>
          </div>

          {/* Clearing Days and Rates */}
          <div className="border-t pt-4 mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Clearing Days and Rates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="imnSCharge" className="block text-sm font-medium text-gray-700">IMN S. Charge %</label>
                <input type="text" id="imnSCharge" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="imnSChargeAmt" className="block text-sm font-medium text-gray-700">IMN S. Charge Amt</label>
                <input type="text" id="imnSChargeAmt" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="returnChargeRate" className="block text-sm font-medium text-gray-700">Return Charge Rate</label>
                <input type="text" id="returnChargeRate" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="returnChargeAmt" className="block text-sm font-medium text-gray-700">Return Charge Amt</label>
                <input type="text" id="returnChargeAmt" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="cdfConvRate" className="block text-sm font-medium text-gray-700">CDF Convert Rate</label>
                <input type="text" id="cdfConvRate" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="cdfConvAmt" className="block text-sm font-medium text-gray-700">CDF Convert Amt</label>
                <input type="text" id="cdfConvAmt" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="totOfSCharge" className="block text-sm font-medium text-gray-700">Tot Of S/Charge</label>
                <input type="text" id="totOfSCharge" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="totOfSChargeAmt" className="block text-sm font-medium text-gray-700">Tot Of S/Charge Amt</label>
                <input type="text" id="totOfSChargeAmt" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="lsCreditTenorDays" className="block text-sm font-medium text-gray-700">LS Credit Tenor Days</label>
                <input type="text" id="lsCreditTenorDays" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>
          </div>

          {/* Charge COT on Covenant Short Fall */}
          <div className="border-t pt-4 mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Charge COT on Covenant Short Fall</h2>
            <div>
              <label htmlFor="cotRate" className="block text-sm font-medium text-gray-700">COT Rate %</label>
              <input type="text" id="cotRate" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
          </div>

          {/* Facility Limit */}
          <div className="border-t pt-4 mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Facility Limit</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="limitStartDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                <input type="date" id="limitStartDate" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="limitEndDate" className="block text-sm font-medium text-gray-700">End Date</label>
                <input type="date" id="limitEndDate" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="limitAmount" className="block text-sm font-medium text-gray-700">Limit Amount</label>
                <input type="text" id="limitAmount" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>
            {/* Add the circular button and "Change Account" button here if needed */}
          </div>

          {/* Bank Information */}
          <div className="border-t pt-4 mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Bank Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="leadBank" className="block text-sm font-medium text-gray-700">Lead Bank</label>
                <select id="leadBank" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <option>Select Bank</option>
                  {/* Add options here */}
                </select>
              </div>
              <div>
                <label htmlFor="shareHolding" className="block text-sm font-medium text-gray-700">Share Holding %</label>
                <input type="text" id="shareHolding" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street</label>
                <input type="text" id="street" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="street2" className="block text-sm font-medium text-gray-700">Street 2 (Appartment/Suite/Building)</label>
                <input type="text" id="street2" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input type="text" id="city" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                <input type="text" id="state" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                <select id="country" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <option>Select Country</option>
                  {/* Add country options here */}
                </select>
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">Zip Code</label>
                <input type="text" id="zipCode" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="telephoneNo" className="block text-sm font-medium text-gray-700">Telephone No</label>
                <input type="tel" id="telephoneNo" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="faxNo" className="block text-sm font-medium text-gray-700">Fax No</label>
                <input type="tel" id="faxNo" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="swiftCode" className="block text-sm font-medium text-gray-700">Swift Code</label>
                <input type="text" id="swiftCode" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="accountOfficer" className="block text-sm font-medium text-gray-700">Account Officer</label>
                <select id="accountOfficer" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <option>Select Officer</option>
                  {/* Add account officer options here */}
                </select>
              </div>
              {/* More Bank Information fields can be added here */}
            </div>
          </div>

          <div className="flex justify-start gap-4 mt-6">
            <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Apply
            </button>
            <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAccount;