"use client";

import { ContractData } from "@/types/contractTypes";
import React, { useState, useRef, useEffect, useCallback } from "react";

interface ContractViewModalProps {
  setShowViewModal: (show: boolean) => void;
  viewedContract: ContractData | null;
}

interface Document {
  id: string;
  name: string;
  file: File | null;
  url?: string;
}

interface RateAdjustment {
  id: string;
  type: string;
  rate: string;
  fromDate: string;
  toDate: string;
}

const ContractViewModal: React.FC<ContractViewModalProps> = ({
  setShowViewModal,
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
    fees: [],
    loanIds: [],
    amounts: [],
    lcCommission: "",
    preNegotiationRate: "",
    postNegotiationRate: "",
    note: "",
  });
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [rateAdjustments, setRateAdjustments] = useState<RateAdjustment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (viewedContract) {
      setContractForm({
        ...viewedContract,
        fees: viewedContract.fees || [],
        loanIds: viewedContract.loanIds || [],
        amounts: viewedContract.amounts || [],
      });
      
      // Initialize with any existing documents (if available in the contract data)
      if (viewedContract.documents) {
        setDocuments(viewedContract.documents.map((doc?: any) => ({
          id: doc.id || Math.random().toString(36).substr(2, 9),
          name: doc.name,
          file: null,
          url: doc.url
        })));
      }
      
      // Initialize rate adjustments (if available in the contract data)
      if (viewedContract.rateAdjustments) {
        setRateAdjustments(viewedContract.rateAdjustments);
      } else {
        // Initialize with default rate adjustments if none exist
        setRateAdjustments([
          { id: '1', type: 'drRate', rate: viewedContract.drRate || '', fromDate: '', toDate: '' },
          { id: '2', type: 'loanInterestRate', rate: viewedContract.loanInterestRate || '', fromDate: '', toDate: '' },
          { id: '3', type: 'lcCommission', rate: viewedContract.lcCommission || '', fromDate: '', toDate: '' },
          { id: '4', type: 'preNegotiationRate', rate: viewedContract.preNegotiationRate || '', fromDate: '', toDate: '' },
          { id: '5', type: 'postNegotiationRate', rate: viewedContract.postNegotiationRate || '', fromDate: '', toDate: '' },
          { id: '6', type: 'creditInterestRate', rate: viewedContract.creditInterestRate || '', fromDate: '', toDate: '' }
        ]);
      }
    }
  }, [viewedContract]);

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
    const updatedFees = contractForm.fees?.map((fee, i) =>
      i === index ? { ...fee, [name]: value } : fee
    );
    setContractForm((prev) => ({ ...prev, fees: updatedFees }));
  };

  const handleAddFee = () => {
    setContractForm((prev) => ({
      ...prev,
      fees: [...(prev.fees || []), { product: "", type: "", rate: "", vat: "" }],
    }));
  };

  const handleRemoveFee = (index: number) => {
    setContractForm((prev) => ({
      ...prev,
      fees: prev.fees?.filter((_, i) => i !== index),
    }));
  };

  const handleLoanIdChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const updatedLoanIds = contractForm.loanIds?.map((loanId, i) =>
      i === index ? value : loanId
    );
    setContractForm((prev) => ({ ...prev, loanIds: updatedLoanIds }));
  };

  const handleAddLoanId = () => {
    setContractForm((prev) => ({
      ...prev,
      loanIds: [...(prev.loanIds || []), ""],
    }));
  };
const handleCancelEdit = useCallback(() => {
  setEditMode(false);
  // Reset form to original viewedContract data
  if (viewedContract) {
    setContractForm({
      ...viewedContract,
      fees: viewedContract.fees || [],
      loanIds: viewedContract.loanIds || [],
      amounts: viewedContract.amounts || [],
    });
    if (viewedContract.documents) {
      setDocuments(viewedContract.documents.map((doc?: any) => ({
        id: doc.id || Math.random().toString(36).substr(2, 9),
        name: doc.name,
        file: null,
        url: doc.url
      })));
    }
    if (viewedContract.rateAdjustments) {
      setRateAdjustments(viewedContract.rateAdjustments);
    }
  }
}, [setEditMode, setContractForm, setDocuments, setRateAdjustments, viewedContract]); // Dependencies


  const handleRemoveLoanId = (index: number) => {
    setContractForm((prev) => ({
      ...prev,
      loanIds: prev.loanIds?.filter((_, i) => i !== index),
    }));
  };

  const handleAmountChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const updatedAmounts = contractForm.amounts?.map((amount, i) =>
      i === index ? value : amount
    );
    setContractForm((prev) => ({ ...prev, amounts: updatedAmounts }));
  };

  const handleAddAmount = () => {
    setContractForm((prev) => ({
      ...prev,
      amounts: [...(prev.amounts || []), ""],
    }));
  };

  const handleRemoveAmount = (index: number) => {
    setContractForm((prev) => ({
      ...prev,
      amounts: prev.amounts?.filter((_, i) => i !== index),
    }));
  };

  // Document handling functions
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newDocuments = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        file,
        url: undefined
      }));
      
      setDocuments(prev => [...prev, ...newDocuments]);
    }
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const handleRenameDocument = (id: string, newName: string) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === id ? { ...doc, name: newName } : doc
      )
    );
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Rate adjustment handling functions
  const handleRateAdjustmentChange = (id: string, field: string, value: string) => {
    setRateAdjustments(prev =>
      prev.map(adjustment =>
        adjustment.id === id ? { ...adjustment, [field]: value } : adjustment
      )
    );
  };

  const handleAddRateAdjustment = (type: string) => {
    setRateAdjustments(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        type,
        rate: "",
        fromDate: "",
        toDate: ""
      }
    ]);
  };

  const handleRemoveRateAdjustment = (id: string) => {
    setRateAdjustments(prev => prev.filter(adj => adj.id !== id));
  };

  const getRateLabel = (type: string) => {
    switch (type) {
      case 'drRate': return 'Dr. Rate';
      case 'loanInterestRate': return 'Loan Interest Rate';
      case 'lcCommission': return 'LC Commission';
      case 'preNegotiationRate': return 'Pre-Negotiation Rate';
      case 'postNegotiationRate': return 'Post-Negotiation Rate';
      case 'creditInterestRate': return 'Credit Interest Rate';
      default: return type;
    }
  };

  const handleEditSave = () => {
    if (editMode) {
      // Prepare the data to be saved
      const updatedContract = {
        ...contractForm,
        // Update the main rates with the latest from adjustments if needed
        drRate: rateAdjustments.find(a => a.type === 'drRate')?.rate || contractForm.drRate,
        loanInterestRate: rateAdjustments.find(a => a.type === 'loanInterestRate')?.rate || contractForm.loanInterestRate,
        lcCommission: rateAdjustments.find(a => a.type === 'lcCommission')?.rate || contractForm.lcCommission,
        preNegotiationRate: rateAdjustments.find(a => a.type === 'preNegotiationRate')?.rate || contractForm.preNegotiationRate,
        postNegotiationRate: rateAdjustments.find(a => a.type === 'postNegotiationRate')?.rate || contractForm.postNegotiationRate,
        creditInterestRate: rateAdjustments.find(a => a.type === 'creditInterestRate')?.rate || contractForm.creditInterestRate,
        rateAdjustments,
        documents
      };
      
      console.log("Saving changes:", updatedContract);
      // Here you would typically send `updatedContract` to your API
    }
    setEditMode(!editMode);
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-50 p-6 rounded-md shadow-md w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-orange-200 flex items-center justify-center overflow-hidden">
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
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="absolute bottom-0 right-0 bg-white rounded-full shadow-sm p-1 text-gray-500 hover:text-gray-700"
                >
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* First Column */}
            <div className="space-y-4">

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Contract Details</h4>
                <div className="space-y-4">
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
                </div>
              </div>

              {/* Facility: Overdraft */}
              <div>
                <h5 className="text-sm font-semibold text-gray-700 mt-4 mb-2">Facility: Overdraft</h5>
                <div className="space-y-4">
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
                </div>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Financial Details</h5>
                <div className="space-y-4">
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
                </div>
              </div>
            </div>

            {/* Second Column */}
            <div className="space-y-4">
              

              {/* Facility: Loan */}
              <div>
                <h5 className="text-sm font-semibold text-gray-700 mt-4 mb-2">Facility: Loan</h5>
                <div className="space-y-4">
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
                </div>
              </div>

               {/* Fees Section */}
            <div className="col-span-2">
              <h5 className="text-sm font-semibold text-gray-700 mt-4 mb-2">Fees</h5>
            </div>
            {contractForm.fees?.map((fee, index) => (
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
            {contractForm.loanIds?.map((loanId, index) => (
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
            {contractForm.amounts?.map((amount, index) => (
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

            </div>

            {/* Third Column */}
            <div className="space-y-4">
              {/* Documents Section */}
              <div>
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Documents</h5>
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex text-black items-center justify-between p-2 border border-gray-200 rounded">
                      {editMode ? (
                        <input
                          type="text"
                          value={doc.name}
                          onChange={(e) => handleRenameDocument(doc.id, e.target.value)}
                          className="flex-grow px-2 py-1 text-black border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        <span className="text-sm truncate">{doc.name}</span>
                      )}
                      <button
                        onClick={() => handleRemoveDocument(doc.id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                        disabled={!editMode}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {editMode && (
                    <div className="mt-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleDocumentUpload}
                        className="hidden"
                        multiple
                      />
                      <button
                        onClick={triggerFileInput}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded text-sm"
                      >
                        Upload Documents
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Rate Adjustments Section */}
              <div className="mt-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Rate Adjustments</h5>
                <div className="space-y-3">
                  {rateAdjustments.map((adjustment) => (
                    <div key={adjustment.id} className="border border-gray-200 rounded p-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-black font-medium">{getRateLabel(adjustment.type)}</span>
                        {editMode && (
                          <button
                            onClick={() => handleRemoveRateAdjustment(adjustment.id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">From Date</label>
                          <input
                            type="date"
                            value={adjustment.fromDate}
                            onChange={(e) => handleRateAdjustmentChange(adjustment.id, 'fromDate', e.target.value)}
                            className="w-full px-2 py-1 text-black border border-gray-300 rounded text-sm"
                            readOnly={!editMode}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">To Date</label>
                          <input
                            type="date"
                            value={adjustment.toDate}
                            onChange={(e) => handleRateAdjustmentChange(adjustment.id, 'toDate', e.target.value)}
                            className="w-full px-2 py-1 text-black border border-gray-300 rounded text-sm"
                            readOnly={!editMode}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Rate</label>
                        <input
                          type="text"
                          value={adjustment.rate}
                          onChange={(e) => handleRateAdjustmentChange(adjustment.id, 'rate', e.target.value)}
                          className="w-full px-2 py-1 text-black border border-gray-300 rounded text-sm"
                          readOnly={!editMode}
                        />
                      </div>
                    </div>
                  ))}
                  {editMode && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleAddRateAdjustment('drRate')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded text-xs"
                      >
                        + Dr. Rate
                      </button>
                      <button
                        onClick={() => handleAddRateAdjustment('loanInterestRate')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded text-xs"
                      >
                        + Loan Interest
                      </button>
                      <button
                        onClick={() => handleAddRateAdjustment('lcCommission')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded text-xs"
                      >
                        + LC Commission
                      </button>
                      <button
                        onClick={() => handleAddRateAdjustment('preNegotiationRate')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded text-xs"
                      >
                        + Pre-Neg Rate
                      </button>
                      <button
                        onClick={() => handleAddRateAdjustment('postNegotiationRate')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded text-xs"
                      >
                        + Post-Neg Rate
                      </button>
                      <button
                        onClick={() => handleAddRateAdjustment('creditInterestRate')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded text-xs"
                      >
                        + Credit Interest
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Note Section */}
              <div className="mt-4">
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
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={handleEditSave}
              className={`rounded-md py-2 px-4 text-sm font-medium focus:outline-none focus:shadow-outline-orange active:bg-orange-700 ${
                editMode
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              {editMode ? "Save Changes" : "Rate Adjustment"}
            </button>
           
         {editMode && (
  <button
    onClick={handleCancelEdit}
    className="bg-gray-400 hover:bg-gray-500 text-white rounded-md py-2 px-4 text-sm font-medium focus:outline-none"
  >
    Cancel
  </button>
)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractViewModal;