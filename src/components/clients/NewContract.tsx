"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Sidebar from "@/components/utility/Sidebar"; // Adjust path if needed
import { useRouter } from "next/navigation"; // Import useRouter
import RateAdjustmentForm from "../account/RateAdjustment";


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
    borrower?: string;
    agreementDate?: string;
    agreementType?: string;
    signedDate?: string;
    loanID?: string;
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

    const router = useRouter(); // Initialize useRouter

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
        // You can add your form submission logic here
        console.log("Form Data:", formData);
        // Navigate to /Account route
        router.push("/ClientAccounts");
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="hidden md:block w-64 bg-gray-200 fixed top-0 left-0 h-full overflow-y-auto">
                <Sidebar />
            </div>

            <div className="flex-1 p-6 bg-white shadow-md rounded-lg overflow-y-auto md:ml-64">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Contract Information</h2>
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
                            <h2 className="text-xl font-semibold mb-6 text-gray-800">Contract Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 mb-6">
                                <div>
                                    <label htmlFor="borrower" className="block text-sm font-medium text-gray-700">Borrower</label>
                                    <input type="text" id="borrower" name="borrower" value={formData.borrower || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                                </div>

                                <div>
                                    <label htmlFor="agreementType" className="block text-sm font-medium text-gray-700">Agreement Type</label>
                                    <input type="text" id="agreementType" name="agreementType" value={formData.agreementType || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                                </div>

                                <div>
                                    <label htmlFor="agreementDate" className="block text-sm font-medium text-gray-700">Agreement Date</label>
                                    <input type="date" id="agreementDate" name="agreementDate" value={formData.agreementDate || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                                </div>

                                <div>
                                    <label htmlFor="signedDate" className="block text-sm font-medium text-gray-700">Signed Date</label>
                                    <input type="date" id="signedDate" name="signedDate" value={formData.signedDate || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                                </div>
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
                                        {/* Add more options as needed */}
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
                                        {/* Add more options as needed */}
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
                                            <label htmlFor="loanID" className="block text-sm font-medium text-gray-700">Loan ID</label>
                                            <input type="text" id="loanID" name="loanID" value={formData.loanID || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                                        </div>
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
                                            <label htmlFor="loanID" className="block text-sm font-medium text-gray-700">Loan ID</label>
                                            <input type="text" id="loanID" name="loanID" value={formData.loanID || ""} onChange={handleChange} className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                                        </div>
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
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                            Apply
                        </button>
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