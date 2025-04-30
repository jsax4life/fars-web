"use client";

import React, { useState } from "react";
import { FaCalendarAlt, FaTrashAlt, FaCaretDown } from "react-icons/fa";
import Sidebar from "@/components/utility/Sidebar";

const RateAdjustment = () => {
  // State declarations
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [fromRate, setFromRate] = useState("1.000000");
  const [toRate, setToRate] = useState("");
  const [fromChangeLimit, setFromChangeLimit] = useState("1.000000");
  const [toChangeLimit, setToChangeLimit] = useState("");
  const [overDraftLimit, setOverDraftLimit] = useState("1.000000");
  const [debitInterestRate, setDebitInterestRate] = useState("1.000000");
  const [creditInterestRate, setCreditInterestRate] = useState("");
  const [accountClassType, setAccountClassType] = useState("");
  const [accountName, setAccountName] = useState("");
  const [creditOrDebit, setCreditOrDebit] = useState("Credit");
  const [voucherOrCheque, setVoucherOrCheque] = useState("Cheque/Cash");
  const [voucherNo, setVoucherNo] = useState("");
  const [chequeNo, setChequeNo] = useState("");
  const [tellerNo, setTellerNo] = useState("");

  // Handler functions
  const handleFromDateChange = (e) => setFromDate(e.target.value);
  const handleToDateChange = (e) => setToDate(e.target.value);
  const handleCurrencyChange = (e) => setCurrency(e.target.value);
  const handleFromRateChange = (e) => setFromRate(e.target.value);
  const handleToRateChange = (e) => setToRate(e.target.value);
  const handleFromChangeLimitChange = (e) => setFromChangeLimit(e.target.value);
  const handleToChangeLimitChange = (e) => setToChangeLimit(e.target.value);
  const handleOverDraftLimitChange = (e) => setOverDraftLimit(e.target.value);
  const handleDebitInterestRateChange = (e) => setDebitInterestRate(e.target.value);
  const handleCreditInterestRateChange = (e) => setCreditInterestRate(e.target.value);
  const handleAccountClassTypeChange = (e) => setAccountClassType(e.target.value);
  const handleAccountNameChange = (e) => setAccountName(e.target.value);
  const handleCreditOrDebitChange = (e) => setCreditOrDebit(e.target.value);
  const handleVoucherOrChequeChange = (e) => setVoucherOrCheque(e.target.value);
  const handleVoucherNoChange = (e) => setVoucherNo(e.target.value);
  const handleChequeNoChange = (e) => setChequeNo(e.target.value);
  const handleTellerNoChange = (e) => setTellerNo(e.target.value);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
          {/* Form Header */}
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Rate Adjustment Form</h2>

          {/* Date Range Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={fromDate}
                  onChange={handleFromDateChange}
                />
                <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
                {fromDate && (
                  <button
                    onClick={() => setFromDate("")}
                    className="absolute right-8 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <FaTrashAlt />
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={toDate}
                  onChange={handleToDateChange}
                />
                <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
                {toDate && (
                  <button
                    onClick={() => setToDate("")}
                    className="absolute right-8 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <FaTrashAlt />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Checkbox Section */}
          <div className="mb-6">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Close old transactions (COR/Transactional parameters)
              </span>
            </label>
          </div>

          {/* Currency and Rate Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency Description</label>
              <div className="relative">
                <select
                  className="w-full p-2 border border-gray-300 rounded-md appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={currency}
                  onChange={handleCurrencyChange}
                >
                  <option>NGN</option>
                  <option>USD</option>
                  <option>EUR</option>
                </select>
                <FaCaretDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rate</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={toRate}
                onChange={handleToRateChange}
              />
            </div>
          </div>

          {/* Rate Change Limit Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ret. Change Rate</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={fromChangeLimit}
                onChange={handleFromChangeLimitChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ret. Change Limit</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={toChangeLimit}
                onChange={handleToChangeLimitChange}
              />
            </div>
          </div>

          {/* Single Field Sections */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Over Draft Limit</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={overDraftLimit}
              onChange={handleOverDraftLimitChange}
            />
          </div>

          {/* Interest Rates Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dr. Interest Rate</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={debitInterestRate}
                onChange={handleDebitInterestRateChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cr. Interest Rate</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={creditInterestRate}
                onChange={handleCreditInterestRateChange}
              />
            </div>
          </div>

          {/* Account Information Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Class Type</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={accountClassType}
              onChange={handleAccountClassTypeChange}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
            <div className="relative">
              <select
                className="w-full p-2 border border-gray-300 rounded-md appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={accountName}
                onChange={handleAccountNameChange}
              >
                <option>Account 1</option>
                <option>Account 2</option>
              </select>
              <FaCaretDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Credit/Debit Radio Buttons */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Credit or Debit</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600 focus:ring-blue-500"
                  name="creditOrDebit"
                  value="Credit"
                  checked={creditOrDebit === "Credit"}
                  onChange={handleCreditOrDebitChange}
                />
                <span className="ml-2">Credit</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600 focus:ring-blue-500"
                  name="creditOrDebit"
                  value="Debit"
                  checked={creditOrDebit === "Debit"}
                  onChange={handleCreditOrDebitChange}
                />
                <span className="ml-2">Debit</span>
              </label>
            </div>
          </div>

          {/* Voucher/Cheque Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Voucher/Cheque</label>
            <div className="relative">
              <select
                className="w-full p-2 border border-gray-300 rounded-md appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={voucherOrCheque}
                onChange={handleVoucherOrChequeChange}
              >
                <option>Cheque/Cash</option>
                <option>Voucher</option>
              </select>
              <FaCaretDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Number Inputs Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Voucher No</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={voucherNo}
                onChange={handleVoucherNoChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cheque No</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={chequeNo}
                onChange={handleChequeNoChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teller No</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={tellerNo}
                onChange={handleTellerNoChange}
              />
            </div>
          </div>

          {/* Final Checkbox */}
          <div className="mb-6">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Erase old transactions (COR/Transactional parameters)
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateAdjustment;