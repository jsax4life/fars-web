"use client";

import React, { useState, useRef, useEffect } from "react";

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

const ContractViewModal: React.FC<{
  setShowViewModal: (show: boolean) => void;
  viewedContract: ContractData | null;
}> = ({ setShowViewModal, viewedContract }) => {
  // If viewedContract is null, don't render anything
  if (!viewedContract) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
      <div className="bg-gray-50 p-6 rounded-md shadow-md w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-orange-200 flex items-center justify-center overflow-hidden">
                {/* Bank icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-10 h-10 text-orange-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.125h15.002M9.75 21.75l-3 1.5-3-1.5m9.75 0l3 1.5 3-1.5M9.375 6a9.375 9.375 0 0116.875-3.75m-16.875 3.75l1.5-7.5m15-7.5l-1.5 7.5m-15 6.75a2.25 2.25 0 002.25 2.25m13.5 0a2.25 2.25 0 002.25-2.25m-16.5 0a2.25 2.25 0 012.25-2.25m13.5 0a2.25 2.25 0 012.25 2.25"
                  />
                </svg>
              </div>
              <button className="absolute bottom-0 right-0 bg-white rounded-full shadow-sm p-1 text-gray-500 hover:text-gray-700">
                {/* Edit icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l-6.585 6.585a2.121 2.121 0 00-1.414.615l-1.93-1.93a2.121 2.121 0 00-.615-1.414l6.585-6.585a2.121 2.121 0 003 0 2.121 2.121 0 000 3zM12 17.768h.008v.008H12v-.008z"
                  />
                </svg>
              </button>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {viewedContract.bankName || "N/A"}
              </h3>
              <p className="text-sm text-gray-500">
                {viewedContract.email || "N/A"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowViewModal(false)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {/* Close icon */}
            <svg
              className="h-6 w-6 fill-current"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div className="mb-6 p-4 bg-white rounded-md border border-gray-200">
          <div className="md:grid md:grid-cols-2 md:items-start md:gap-6 mb-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Contract Details</h4>
            </div>
            <p className="text-xs text-gray-500 md:mt-1">
              Review and update the essential information for this contract.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="loanId" className="block text-xs font-medium text-gray-600 mb-1">
                Loan Id
              </label>
              <input
                type="text"
                id="loanId"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={viewedContract.loanId || "N/A"}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="borrowerName" className="block text-xs font-medium text-gray-600 mb-1">
                Borrower Name
              </label>
              <input
                type="text"
                id="borrowerName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={viewedContract.borrower || "N/A"}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="agreementType" className="block text-xs font-medium text-gray-600 mb-1">
                Agreement Type
              </label>
              <input
                type="text"
                id="agreementType"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={viewedContract.agreementType || "N/A"}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="agreementDate" className="block text-xs font-medium text-gray-600 mb-1">
                Agreement Date
              </label>
              <input
                type="text"
                id="agreementDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={viewedContract.agreementDate || "N/A"}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="signedDate" className="block text-xs font-medium text-gray-600 mb-1">
                Signed Date
              </label>
              <input
                type="text"
                id="signedDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={viewedContract.signedDate || "N/A"}
                readOnly
              />
            </div>
            {/* Bank Details from original snippet */}
            <div>
              <label htmlFor="bankName" className="block text-xs font-medium text-gray-600 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                id="bankName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={viewedContract.bankName || "N/A"}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="accountOfficer" className="block text-xs font-medium text-gray-600 mb-1">
                Account Officer
              </label>
              <input
                type="text"
                id="accountOfficer"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={viewedContract.accountOfficer || "N/A"}
                readOnly
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={viewedContract.email || "N/A"}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="swiftCode" className="block text-xs font-medium text-gray-600 mb-1">
                SWIFT Code
              </label>
              <input
                type="text"
                id="swiftCode"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={viewedContract.swiftCode || "N/A"}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="telephone" className="block text-xs font-medium text-gray-600 mb-1">
                Telephone
              </label>
              <input
                type="tel"
                id="telephone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={viewedContract.telephone || "N/A"}
                readOnly
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="street" className="block text-xs font-medium text-gray-600 mb-1">
                Street Address
              </label>
              <input
                type="text"
                id="street"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={viewedContract.street || "N/A"}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-xs font-medium text-gray-600 mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={viewedContract.city || "N/A"}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-xs font-medium text-gray-600 mb-1">
                State/Province
              </label>
              <input
                type="text"
                id="state"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={viewedContract.state || "N/A"}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-xs font-medium text-gray-600 mb-1">
                Zip Code
              </label>
              <input
                type="text"
                id="zipCode"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={viewedContract.zipCode || "N/A"}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-xs font-medium text-gray-600 mb-1">
                Country
              </label>
              <input
                type="text"
                id="country"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={viewedContract.country || "N/A"}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="fax" className="block text-xs font-medium text-gray-600 mb-1">
                Fax
              </label>
              <input
                type="tel"
                id="fax"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={viewedContract.fax || "N/A"}
                readOnly
              />
            </div>
            <div className="col-span-2 flex md:flex-row gap-4 flex-col justify-end">
              <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-md py-2 px-4 text-sm font-medium focus:outline-none focus:shadow-outline-orange active:bg-orange-700">
                Edit Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractViewModal;