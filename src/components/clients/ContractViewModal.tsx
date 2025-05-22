"use client";

import { ContractData } from "@/types/contractTypes";
import React, { useState, useRef, useEffect } from "react";

interface ContractViewModalProps {
  contractData?: ContractData | null;
  onClose?: () => void;
    setShowViewModal: (show: boolean) => void;
  viewedContract: ContractData;
}

const ContractViewModal: React.FC<ContractViewModalProps> = ({
    setShowViewModal, // Destructured here
    viewedContract
}) => {
  const [editMode, setEditMode] = useState(false);
  const [contractForm, setContractForm] = useState<ContractData>({
    id: "",
    loanId: "",
    agreementDate: "",
    borrower: "",
    agreementType: "",
    signedDate: "",
    clearingDays: "",
    locStateCountry: "",
    returnChargeRate: "",
    returnChargeLimit: "",
    camf: "",
    camfCovenantRate: "",
    camfOffCovenantRate: "",
    turnOverLimit: "",
    camfCovenantFrequency: "",
    chargeCAMFOnTurnoverShortfall: "",
    creditInterestRate: "",
    whtRate: "",
    overdraftLimit: "",
    drRate: "",
    exRate: "",
    exChangeType: "",
    loanType: "",
    loanInterestRate: "",
    loanPenalRate: "",
    loanContribution: "",
    fees: [], // Initialize as empty array
    loanIds: [], // Initialize as empty array
    amounts: [], // Initialize as empty array
    lcCommission: "",
    preNegotiationRate: "",
    postNegotiationRate: "",
    note: "",
  });


  useEffect(() => {
    if (viewedContract) {
      setContractForm({
        ...viewedContract,
        fees: viewedContract.fees || [],
        loanIds: viewedContract.loanIds || [],
        amounts: viewedContract.amounts || [],
      });
    }
  }, [viewedContract]);

  // Don't render anything if viewedContract is null
  if (!viewedContract) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setContractForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  const handleFeeChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedFees = contractForm.fees.map((fee, i) =>
      i === index ? { ...fee, [name]: value } : fee
    );
    setContractForm((prev) => ({ ...prev, fees: updatedFees }));
  };

  const handleAddFee = () => {
    setContractForm((prev) => ({
      ...prev,
      fees: [...prev.fees, { product: "", type: "", rate: "", vat: "" }],
    }));
  };

  const handleRemoveFee = (index: number) => {
    setContractForm((prev) => ({
      ...prev,
      fees: prev.fees.filter((_, i) => i !== index),
    }));
  };

  const handleLoanIdChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const updatedLoanIds = contractForm.loanIds.map((loanId, i) =>
      i === index ? value : loanId
    );
    setContractForm((prev) => ({ ...prev, loanIds: updatedLoanIds }));
  };

  const handleAddLoanId = () => {
    setContractForm((prev) => ({
      ...prev,
      loanIds: [...prev.loanIds, ""],
    }));
  };

  const handleRemoveLoanId = (index: number) => {
    setContractForm((prev) => ({
      ...prev,
      loanIds: prev.loanIds.filter((_, i) => i !== index),
    }));
  };

  const handleAmountChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const updatedAmounts = contractForm.amounts.map((amount, i) =>
      i === index ? value : amount
    );
    setContractForm((prev) => ({ ...prev, amounts: updatedAmounts }));
  };

  const handleAddAmount = () => {
    setContractForm((prev) => ({
      ...prev,
      amounts: [...prev.amounts, ""],
    }));
  };

  const handleRemoveAmount = (index: number) => {
    setContractForm((prev) => ({
      ...prev,
      amounts: prev.amounts.filter((_, i) => i !== index),
    }));
  };

  const handleEditSave = () => {
    if (editMode) {
      // In save mode, handle saving the data
      console.log("Saving changes:", contractForm);
      // Here you would typically send `contractForm` to your API
      // e.g., fetch('/api/contracts', { method: 'PUT', body: JSON.stringify(contractForm) })
      //   .then(response => response.json())
      //   .then(data => { /* handle success */ })
      //   .catch(error => { /* handle error */ });
    }
    setEditMode(!editMode); // Toggle edit mode
  };

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
              {/* Only show edit icon if not in edit mode */}
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="absolute bottom-0 right-0 bg-white rounded-full shadow-sm p-1 text-gray-500 hover:text-gray-700"
                >
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
              )}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {contractForm.borrower || "N/A"}
              </h3>
              <p className="text-sm text-gray-500">
                {contractForm.agreementType || "N/A"}
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
              <label htmlFor="borrower" className="block text-xs font-medium text-gray-600 mb-1">
                Borrower
              </label>
              <input
                type="text"
                id="borrower"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={contractForm.borrower || ""}
                onChange={handleInputChange}
                readOnly={!editMode}
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
                value={contractForm.agreementType || ""}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>
            <div>
              <label htmlFor="agreementDate" className="block text-xs font-medium text-gray-600 mb-1">
                Agreement Date
              </label>
              <input
                type="date"
                id="agreementDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={contractForm.agreementDate || ""}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>
            <div>
              <label htmlFor="signedDate" className="block text-xs font-medium text-gray-600 mb-1">
                Signed Date
              </label>
              <input
                type="date"
                id="signedDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={contractForm.signedDate || ""}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>
            <div>
              <label htmlFor="clearingDays" className="block text-xs font-medium text-gray-600 mb-1">
                Clearing Days
              </label>
              <input
                type="text"
                id="clearingDays"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={contractForm.clearingDays || ""}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>
            <div>
              <label htmlFor="locStateCountry" className="block text-xs font-medium text-gray-600 mb-1">
                Local/Intra State/Up-country
              </label>
              <input
                type="text"
                id="locStateCountry"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={contractForm.locStateCountry || ""}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>
            <div>
              <label htmlFor="returnChargeRate" className="block text-xs font-medium text-gray-600 mb-1">
                Return Charge Rate
              </label>
              <input
                type="text"
                id="returnChargeRate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={contractForm.returnChargeRate || ""}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>
            <div>
              <label htmlFor="returnChargeLimit" className="block text-xs font-medium text-gray-600 mb-1">
                Return Charge Limit
              </label>
              <input
                type="text"
                id="returnChargeLimit"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={contractForm.returnChargeLimit || ""}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>
            <div>
              <label htmlFor="camf" className="block text-xs font-medium text-gray-600 mb-1">
                CAMF
              </label>
              <input
                type="text"
                id="camf"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={contractForm.camf || ""}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>
            <div>
              <label htmlFor="camfCovenantRate" className="block text-xs font-medium text-gray-600 mb-1">
                CAMF Covenant Rate
              </label>
              <input
                type="text"
                id="camfCovenantRate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={contractForm.camfCovenantRate || ""}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>
            <div>
              <label htmlFor="camfOffCovenantRate" className="block text-xs font-medium text-gray-600 mb-1">
                CAMF Off-Covenant Rate
              </label>
              <input
                type="text"
                id="camfOffCovenantRate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={contractForm.camfOffCovenantRate || ""}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>
            <div>
              <label htmlFor="turnOverLimit" className="block text-xs font-medium text-gray-600 mb-1">
                Turnover Limit
              </label>
              <input
                type="text"
                id="turnOverLimit"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={contractForm.turnOverLimit || ""}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>
            <div>
              <label htmlFor="camfCovenantFrequency" className="block text-xs font-medium text-gray-600 mb-1">
                CAMF Covenant Frequency
              </label>
              <input
                type="text"
                id="camfCovenantFrequency"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={contractForm.camfCovenantFrequency || ""}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>
            <div>
              <label htmlFor="chargeCAMFOnTurnoverShortfall" className="block text-xs font-medium text-gray-600 mb-1">
                Charge CAMF on Turnover Shortfall
              </label>
              <select
                id="chargeCAMFOnTurnoverShortfall"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={contractForm.chargeCAMFOnTurnoverShortfall || ""}
                onChange={handleInputChange}
                disabled={!editMode}
              >
                <option value="">Select Option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label htmlFor="creditInterestRate" className="block text-xs font-medium text-gray-600 mb-1">
                Credit Interest Rate
              </label>
              <input
                type="text"
                id="creditInterestRate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={contractForm.creditInterestRate || ""}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>
            <div>
              <label htmlFor="whtRate" className="block text-xs font-medium text-gray-600 mb-1">
                WHT Rate
              </label>
              <input
                type="text"
                id="whtRate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={contractForm.whtRate || ""}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>

            {/* Facility: Overdraft */}
            <div className="col-span-2">
              <h5 className="text-sm font-semibold text-gray-700 mt-4 mb-2">Facility: Overdraft</h5>
            </div>
            <div>
              <label htmlFor="overdraftLimit" className="block text-xs font-medium text-gray-600 mb-1">
                Overdraft Limit
              </label>
              <input
                type="text"
                id="overdraftLimit"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={contractForm.overdraftLimit || ""}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>
            <div>
              <label htmlFor="drRate" className="block text-xs font-medium text-gray-600 mb-1">
                Dr. Rate
              </label>
              <input
                type="text"
                id="drRate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={contractForm.drRate || ""}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>
            <div>
              <label htmlFor="exRate" className="block text-xs font-medium text-gray-600 mb-1">
                Ex. Rate
              </label>
              <input
                type="text"
                id="exRate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={contractForm.exRate || ""}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>
            <div>
              <label htmlFor="exChangeType" className="block text-xs font-medium text-gray-600 mb-1">
                Ex. Charge Type
              </label>
              <input
                type="text"
                id="exChangeType"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={contractForm.exChangeType || ""}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>

            {/* Facility: Loan */}
            <div className="col-span-2">
              <h5 className="text-sm font-semibold text-gray-700 mt-4 mb-2">Facility: Loan</h5>
            </div>
            <div>
              <label htmlFor="loanType" className="block text-xs font-medium text-gray-600 mb-1">
                Loan Type
              </label>
              <select
                id="loanType"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={contractForm.loanType || ""}
                onChange={handleInputChange}
                disabled={!editMode}
              >
                <option value="">Select Loan Type</option>
                <option value="Short Term Loan">Short Term Loan</option>
                <option value="Term Loan">Term Loan</option>
              </select>
            </div>
            <div>
              <label htmlFor="loanInterestRate" className="block text-xs font-medium text-gray-600 mb-1">
                Loan Interest Rate
              </label>
              <input
                type="text"
                id="loanInterestRate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={contractForm.loanInterestRate || ""}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>
            <div>
              <label htmlFor="loanPenalRate" className="block text-xs font-medium text-gray-600 mb-1">
                Loan Penal Rate
              </label>
              <input
                type="text"
                id="loanPenalRate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={contractForm.loanPenalRate || ""}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>
            <div>
              <label htmlFor="loanContribution" className="block text-xs font-medium text-gray-600 mb-1">
                Loan Contribution
              </label>
              <input
                type="text"
                id="loanContribution"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={contractForm.loanContribution || ""}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>

            {/* Fees Section */}
            <div className="col-span-2">
              <h5 className="text-sm font-semibold text-gray-700 mt-4 mb-2">Fees</h5>
            </div>
            {contractForm.fees.map((fee, index) => (
              <React.Fragment key={index}>
                <div className="col-span-2 grid grid-cols-2 gap-4 border-t border-gray-200 pt-4 mt-4">
                  <div>
                    <label htmlFor={`fee-${index}-product`} className="block text-xs font-medium text-gray-600 mb-1">
                      Fee #{index + 1} Product
                    </label>
                    <input
                      type="text"
                      id={`fee-${index}-product`}
                      name="product"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                      value={fee.product || ""}
                      onChange={(e) => handleFeeChange(index, e)}
                      readOnly={!editMode}
                    />
                  </div>
                  <div>
                    <label htmlFor={`fee-${index}-type`} className="block text-xs font-medium text-gray-600 mb-1">
                      Fee #{index + 1} Type
                    </label>
                    <input
                      type="text"
                      id={`fee-${index}-type`}
                      name="type"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                      value={fee.type || ""}
                      onChange={(e) => handleFeeChange(index, e)}
                      readOnly={!editMode}
                    />
                  </div>
                  <div>
                    <label htmlFor={`fee-${index}-rate`} className="block text-xs font-medium text-gray-600 mb-1">
                      Fee #{index + 1} Rate
                    </label>
                    <input
                      type="text"
                      id={`fee-${index}-rate`}
                      name="rate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                      value={fee.rate || ""}
                      onChange={(e) => handleFeeChange(index, e)}
                      readOnly={!editMode}
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-grow">
                      <label htmlFor={`fee-${index}-vat`} className="block text-xs font-medium text-gray-600 mb-1">
                        VAT
                      </label>
                      <input
                        type="text"
                        id={`fee-${index}-vat`}
                        name="vat"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                        value={fee.vat || ""}
                        onChange={(e) => handleFeeChange(index, e)}
                        readOnly={!editMode}
                      />
                    </div>
                    {editMode && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFee(index)}
                        className="text-red-500 hover:text-red-700 px-2 py-2 rounded-md text-sm font-medium focus:outline-none"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </React.Fragment>
            ))}
            {editMode && (
              <div className="col-span-2">
                <button
                  type="button"
                  onClick={handleAddFee}
                  className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md py-2 px-4 text-sm font-medium focus:outline-none"
                >
                  Add Another Fee
                </button>
              </div>
            )}

            {/* Loan ID Section */}
            <div className="col-span-2">
              <h5 className="text-sm font-semibold text-gray-700 mt-4 mb-2">Loan ID</h5>
            </div>
            {contractForm.loanIds.map((loanId, index) => (
              <div key={`loanId-${index}`} className="col-span-1 flex items-end gap-2">
                <div className="flex-grow">
                  <label htmlFor={`loanId-${index}`} className="block text-xs font-medium text-gray-600 mb-1">
                    Loan ID #{index + 1}
                  </label>
                  <input
                    type="text"
                    id={`loanId-${index}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                    value={loanId || ""}
                    onChange={(e) => handleLoanIdChange(index, e)}
                    readOnly={!editMode}
                  />
                </div>
                {editMode && (
                  <button
                    type="button"
                    onClick={() => handleRemoveLoanId(index)}
                    className="text-red-500 hover:text-red-700 px-2 py-2 rounded-md text-sm font-medium focus:outline-none"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            {editMode && (
              <div className="col-span-2">
                <button
                  type="button"
                  onClick={handleAddLoanId}
                  className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md py-2 px-4 text-sm font-medium focus:outline-none"
                >
                  Add Another Loan ID
                </button>
              </div>
            )}

            {/* Amount Section */}
            <div className="col-span-2">
              <h5 className="text-sm font-semibold text-gray-700 mt-4 mb-2">Amount</h5>
            </div>
            {contractForm.amounts.map((amount, index) => (
              <div key={`amount-${index}`} className="col-span-1 flex items-end gap-2">
                <div className="flex-grow">
                  <label htmlFor={`amount-${index}`} className="block text-xs font-medium text-gray-600 mb-1">
                    Amount #{index + 1}
                  </label>
                  <input
                    type="text"
                    id={`amount-${index}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                    value={amount || ""}
                    onChange={(e) => handleAmountChange(index, e)}
                    readOnly={!editMode}
                  />
                </div>
                {editMode && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAmount(index)}
                    className="text-red-500 hover:text-red-700 px-2 py-2 rounded-md text-sm font-medium focus:outline-none"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            {editMode && (
              <div className="col-span-2">
                <button
                  type="button"
                  onClick={handleAddAmount}
                  className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md py-2 px-4 text-sm font-medium focus:outline-none"
                >
                  Add Another Amount
                </button>
              </div>
            )}

            {/* Letter of Credit */}
            <div className="col-span-2">
              <h5 className="text-sm font-semibold text-gray-700 mt-4 mb-2">Letter of Credit</h5>
            </div>
            <div>
              <label htmlFor="lcCommission" className="block text-xs font-medium text-gray-600 mb-1">
                LC commission
              </label>
              <input
                type="text"
                id="lcCommission"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={contractForm.lcCommission || ""}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>
            <div>
              <label htmlFor="preNegotiationRate" className="block text-xs font-medium text-gray-600 mb-1">
                Pre-Negotiation rate
              </label>
              <input
                type="text"
                id="preNegotiationRate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={contractForm.preNegotiationRate || ""}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>
            <div>
              <label htmlFor="postNegotiationRate" className="block text-xs font-medium text-gray-600 mb-1">
                Post-Negotiation rate
              </label>
              <input
                type="text"
                id="postNegotiationRate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                value={contractForm.postNegotiationRate || ""}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="note" className="block text-xs font-medium text-gray-600 mb-1">
                Note
              </label>
              <textarea
                id="note"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                rows={3}
                value={contractForm.note || ""}
                onChange={handleInputChange}
                readOnly={!editMode}
              ></textarea>
            </div>

            <div className="col-span-2 flex md:flex-row gap-4 flex-col justify-end">
              <button
                onClick={handleEditSave}
                className={`rounded-md py-2 px-4 text-sm font-medium focus:outline-none focus:shadow-outline-orange active:bg-orange-700 ${
                  editMode
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
              >
                {editMode ? "Save Changes" : "Edit Changes"}
              </button>
              {editMode && (
                <button
                  onClick={() => {
                    setEditMode(false);
                    // Reset form to original viewedContract data, ensuring arrays are properly initialized
                    setContractForm(viewedContract ? {
                        ...viewedContract,
                        fees: viewedContract.fees || [],
                        loanIds: viewedContract.loanIds || [],
                        amounts: viewedContract.amounts || [],
                    } : {
                        id: "", loanId: "", agreementDate: "", borrower: "", agreementType: "",
                        signedDate: "", clearingDays: "", locStateCountry: "", returnChargeRate: "",
                        returnChargeLimit: "", camf: "", camfCovenantRate: "", camfOffCovenantRate: "",
                        turnOverLimit: "", camfCovenantFrequency: "", chargeCAMFOnTurnoverShortfall: "",
                        creditInterestRate: "", whtRate: "", overdraftLimit: "", drRate: "", exRate: "",
                        exChangeType: "", loanType: "", loanInterestRate: "", loanPenalRate: "",
                        loanContribution: "", fees: [], loanIds: [], amounts: [], lcCommission: "",
                        preNegotiationRate: "", postNegotiationRate: "", note: "",
                    });
                  }}
                  className="bg-gray-400 hover:bg-gray-500 text-white rounded-md py-2 px-4 text-sm font-medium focus:outline-none"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractViewModal;