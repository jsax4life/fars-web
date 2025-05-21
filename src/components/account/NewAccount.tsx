"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Sidebar from "@/components/utility/Sidebar"; // Adjust path if needed
import Link from "next/link";
import { X } from "lucide-react";
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
    const [step, setStep] = useState<number>(1);
    const [formData, setFormData] = useState<FormData>({});
    const [showModal, setShowModal] = useState(false);
    const [modalFormData, setModalFormData] = useState<ModalFormData>({
        fromDate: '',
        toDate: '',
        localCheques: '',
        intraStateCheques: '',
        upCountryCheques: '',
        setAsPrevailingDays: false,
        setParametersAsPrevailing: false,
        camfFrequency: '',
        camfOnShortfall: '',
        camfCoverRate: '',
        camfOCRate: '',
        turnoverLimit: '',
        currencyDescription: '',
        rate: '',
        retChgRate: '',
        retChgLimit: '',
        overdraftLimit: '',
        drRate: '',
        exRate: '',
        exChargeType: '',
        creditInterestRate: '',
        whtRate: '',
    });

    const handleModalChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = event.target;

        if (type === 'checkbox') {
            const checked = (event.target as HTMLInputElement).checked;
            setModalFormData(prevData => ({
                ...prevData,
                [name]: checked,
            }));
        } else {
            setModalFormData(prevData => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSelectChange = (name: keyof ModalFormData, value: string) => {
        setModalFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = () => {
        console.log("Modal data:", modalFormData);
        setShowModal(false);
    };

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
                                <input type="text" id="accountNumber" name="accountNumber" value={formData.accountNumber || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="dateValue" className="block text-sm font-medium text-gray-700">Date Range</label>
                                <input type="date" id="dateValue" name="dateValue" value={formData.dateValue || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="accountCode" className="block text-sm font-medium text-gray-700">Account Code</label>
                                <input type="text" id="accountCode" name="accountCode" value={formData.accountCode || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="accountCodeVersion" className="block text-sm font-medium text-gray-700">Account Code Verifier</label>
                                <select id="accountCodeVersion" name="accountCodeVersion" value={formData.accountCodeVersion || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
                                    <option value="">Select Verifier</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">Account Name</label>
                                <input type="text" id="accountName" name="accountName" value={formData.accountName || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="accountShortName" className="block text-sm font-medium text-gray-700">Account Short Name</label>
                                <input type="text" id="accountShortName" name="accountShortName" value={formData.accountShortName || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="locationOffline" className="block text-sm font-medium text-gray-700">Location/Office</label>
                                <input type="text" id="locationOffline" name="locationOffline" value={formData.locationOffline || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="revenueType" className="block text-sm font-medium text-gray-700">Account Type</label>
                                <select id="revenueType" name="revenueType" value={formData.revenueType || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
                                    <option value="">Select Type</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
                                <select id="currency" name="currency" value={formData.currency || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
                                    <option value="">Select Currency</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="transactionTeam" className="block text-sm font-medium text-gray-700">Transaction Type</label>
                                <select id="transactionTeam" name="transactionTeam" value={formData.transactionTeam || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
                                    <option value="">Select Type</option>
                                </select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="chequeNo" name="chequeNo" checked={formData.chequeNo || false} onChange={handleChange} className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
                                <label htmlFor="chequeNo" className="block text-sm font-medium text-gray-700">Cheque No</label>
                                <input type="text" className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" disabled={!formData.chequeNo} />
                            </div>
                            <div className="flex items-center space-x-2">
                                <label htmlFor="chequeNo" className="block text-sm font-medium text-gray-700">Teller No</label>
                                <input type="text" className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" disabled={!formData.chequeNo} />
                            </div>
                            <div>
                                <label htmlFor="postingBalance" className="block text-sm font-medium text-gray-700">Opening Balance</label>
                                <input type="text" id="postingBalance" name="postingBalance" value={formData.postingBalance || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="orderBy" className="block text-sm font-medium text-gray-700">Order By</label>
                                <select id="orderBy" name="orderBy" value={formData.orderBy || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
                                    <option value="">Select Option</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <div className="flex justify-end mb-4">
                            <button 
                                type="button" 
                                onClick={() => setShowModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                            >
                                Rate Adjustment
                            </button>
                        </div>
                        <h2 className="text-xl font-semibold mb-6 text-gray-800">Clearing Days</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 mb-6">
                            <div>
                                <label htmlFor="locStateCountry" className="block text-sm font-medium text-gray-700">Local/Intra State/Up-country</label>
                                <input type="text" id="locStateCountry" name="locStateCountry" value={formData.locStateCountry || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="returnChargeRate" className="block text-sm font-medium text-gray-700">Return Charge Rate</label>
                                <input type="text" id="returnChargeRate" name="returnChargeRate" value={formData.returnChargeRate || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="returnChargeLimit" className="block text-sm font-medium text-gray-700">Return Charge Limit</label>
                                <input type="text" id="returnChargeLimit" name="returnChargeLimit" value={formData.returnChargeLimit || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                        </div>

                        <h2 className="text-xl font-semibold mb-6 text-gray-800">CAMF</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 mb-6">
                            <div>
                                <label htmlFor="cotConvenantRate" className="block text-sm font-medium text-gray-700">CAMF Covenant Rate</label>
                                <input type="text" id="cotConvenantRate" name="cotConvenantRate" value={formData.cotConvenantRate || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="cotOffConvenantRate" className="block text-sm font-medium text-gray-700">CAMF Off-Covenant Rate</label>
                                <input type="text" id="cotOffConvenantRate" name="cotOffConvenantRate" value={formData.cotOffConvenantRate || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="turnOverLimit" className="block text-sm font-medium text-gray-700">Turnover Limit</label>
                                <input type="text" id="turnOverLimit" name="turnOverLimit" value={formData.turnOverLimit || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <div className="col-span-3">
                                <label htmlFor="cotConvenantFrequency" className="block text-sm font-medium text-gray-700">CAMF Covenant Frequency</label>
                                <select id="cotConvenantFrequency" name="cotConvenantFrequency" value={formData.cotConvenantFrequency || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
                                    <option value="">Select Frequency</option>
                                </select>
                            </div>
                            <div className="col-span-3">
                                <label htmlFor="chargeCOTOnTurnoverShortfall" className="block text-sm font-medium text-gray-700">Charge CAMF on Turnover Shortfall</label>
                                <select id="chargeCOTOnTurnoverShortfall" name="chargeCOTOnTurnoverShortfall" value={formData.chargeCOTOnTurnoverShortfall || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
                                    <option value="">Select Option</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                        </div>

                        <h2 className="text-xl font-semibold mb-6 text-gray-800">Credit Interest/Cash Cover/Cash Collateral</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                            <div>
                                <label htmlFor="creditInterestRate" className="block text-sm font-medium text-gray-700">Credit Interest Rate</label>
                                <input type="text" id="creditInterestRate" name="creditInterestRate" value={formData.creditInterestRate || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="vatWHTRate" className="block text-sm font-medium text-gray-700">WHT Rate</label>
                                <input type="text" id="vatWHTRate" name="vatWHTRate" value={formData.vatWHTRate || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                        </div>

                        <h2 className="text-xl font-semibold mb-6 text-gray-800">Facility</h2>
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Overdraft</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
                            <div>
                                <label htmlFor="limitAmount" className="block text-sm font-medium text-gray-700">Overdraft Limit</label>
                                <input type="text" id="limitAmount" name="limitAmount" value={formData.limitAmount || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="drRate" className="block text-sm font-medium text-gray-700">Dr. Rate</label>
                                <input type="text" id="drRate" name="drRate" value={formData.drRate || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="exRate" className="block text-sm font-medium text-gray-700">Ex. Rate</label>
                                <input type="text" id="exRate" name="exRate" value={formData.exRate || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <div className="col-span-3">
                                <label htmlFor="exChangeType" className="block text-sm font-medium text-gray-700">Ex. Charge Type.</label>
                                <select id="exChangeType" name="exChangeType" value={formData.exChangeType || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
                                    <option value="">Select Type</option>
                                </select>
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Loan</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                            <div>
                                <label htmlFor="loanType" className="block text-sm font-medium text-gray-700">Loan Type</label>
                                <select id="loanType" name="loanType" value={formData.loanType || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
                                    <option value="">Select Loan Type</option>
                                    <option value="shortTerm">Short Term Loan</option>
                                    <option value="termLoan">Term Loan</option>
                                </select>
                            </div>
                            {formData.loanType === "shortTerm" && (
                                <>
                                    <div>
                                        <label htmlFor="loanInterestRate" className="block text-sm font-medium text-gray-700">Interest Rate</label>
                                        <input type="text" id="loanInterestRate" name="loanInterestRate" value={formData.loanInterestRate || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="loanPenalRate" className="block text-sm font-medium text-gray-700">Penal Rate</label>
                                        <input type="text" id="loanPenalRate" name="loanPenalRate" value={formData.loanPenalRate || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                                    </div>
                                </>
                            )}
                            {formData.loanType === "termLoan" && (
                                <>
                                    <div>
                                        <label htmlFor="loanInterestRate" className="block text-sm font-medium text-gray-700">Interest Rate</label>
                                        <input type="text" id="loanInterestRate" name="loanInterestRate" value={formData.loanInterestRate || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="loanPenalRate" className="block text-sm font-medium text-gray-700">Penal Rate</label>
                                        <input type="text" id="loanPenalRate" name="loanPenalRate" value={formData.loanPenalRate || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="loanContribution" className="block text-sm font-medium text-gray-700">Contribution</label>
                                        <input type="text" id="loanContribution" name="loanContribution" value={formData.loanContribution || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                                    </div>
                                </>
                            )}
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
                                <select id="leadBank" name="leadBank" value={formData.leadBank || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
                                    <option value="">Select Bank</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street</label>
                                <input type="text" id="street" name="street" value={formData.street || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="street2" className="block text-sm font-medium text-gray-700">Street 2</label>
                                <input type="text" id="street2" name="street2" value={formData.street2 || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                <input type="text" id="city" name="city" value={formData.city || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                                <input type="text" id="state" name="state" value={formData.state || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                                <select id="country" name="country" value={formData.country || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm">
                                    <option value="">Select Country</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">Zip Code</label>
                                <input type="text" id="zipCode" name="zipCode" value={formData.zipCode || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="telephoneNo" className="block text-sm font-medium text-gray-700">Telephone No</label>
                                <input type="tel" id="telephoneNo" name="telephoneNo" value={formData.telephoneNo || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="faxNo" className="block text-sm font-medium text-gray-700">Fax No</label>
                                <input type="tel" id="faxNo" name="faxNo" value={formData.faxNo || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" id="email" name="email" value={formData.email || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="swiftCode" className="block text-sm font-medium text-gray-700">Swift Code</label>
                                <input type="text" id="swiftCode" name="swiftCode" value={formData.swiftCode || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="accountOfficer" className="block text-sm font-medium text-gray-700">Account Officer</label>
                                <input type="text" id="accountOfficer" name="accountOfficer" value={formData.accountOfficer || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
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
                                        C.A.M.F. Applicable to International Transfer/Order
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="hidden md:block w-64 bg-gray-200 fixed top-0 left-0 h-full overflow-y-auto">
                <Sidebar />
            </div>

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
                            <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                                Apply
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 overflow-y-auto z-50">
                    <RateAdjustmentForm  
                        setShowModal={setShowModal}
                        modalFormData={modalFormData}
                        handleModalChange={handleModalChange}
                        // handleSelectChange={handleSelectChange}
                        handleSave={handleSave} 
                    /> 
                </div>
            )}
        </div>
    );
};

export default NewAccount;