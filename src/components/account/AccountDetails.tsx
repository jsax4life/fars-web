"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Sidebar from "@/components/utility/Sidebar";
import AccountInformation from "./AccountInformation";
import TransactionTable from "@/components/account/Table/TransactionTable";
import QueryForm from "@/components/account/Table/QueryForm";
import { Transaction } from "@/types/Transaction";
import { EyeIcon, ArrowDownTrayIcon, TrashIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import Modal from "@/components/utility/Modal";
import { PlusIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import RateAdjustmentForm from "./RateAdjustment";

// Dummy user data for the dropdown
const users = [
    { id: 1, name: "Alice Smith", avatar: "/images/avatar-1.png" },
    { id: 2, name: "Bob Johnson", avatar: "/images/avatar-2.png" },
    { id: 3, name: "Charlie Brown", avatar: "/images/avatar-3.png" },
    { id: 4, name: "Diana Lee", avatar: "/images/avatar-4.png" },
    { id: 5, name: "Eve Williams", avatar: "/images/avatar-5.png" },
    { id: 6, name: "Frank Miller", avatar: "/images/avatar-6.png" },
    { id: 7, name: "Grace Davis", avatar: "/images/avatar-7.png" },
    { id: 8, name: "Henry Wilson", avatar: "/images/avatar-8.png" },
    { id: 9, name: "Ivy Moore", avatar: "/images/avatar-9.png" },
    { id: 10, name: "Jack Taylor", avatar: "/images/avatar-10.png" },
];

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

interface AssignedUser {
    id: number;
    name: string;
    avatar: string;
}

const AccountDetails = () => {
    const [activeTab, setActiveTab] = useState("Entry");
    const [entryTransactions, setEntryTransactions] = useState<Transaction[]>([
        { sNo: "01", entryDate: "02-04-2023", transactionDate: "02-04-2023", valueDate: "02-04-2023", tellerNumber: "N/A", transactionDescription: "Principal LIQ...", transactionType: "Cash/Cheque", chequeNo: "Nil", originalValue: "44,897,985.89" },
        { sNo: "02", entryDate: "02-04-2023", transactionDate: "02-04-2023", valueDate: "02-04-2023", tellerNumber: "U000...", transactionDescription: "Debetuje baje...", transactionType: "Cash/Cheque", chequeNo: "Cash", originalValue: "100,000.00" },
        // ... more entry data
    ]);

    const bankStatementTransactions: Transaction[] = [
        { no: "1", class: "Debit", transDate: "03-05-2025", valueDate: "03-05-2025", transactionDescription: "ATM Withdrawal", tellerNo: "N/A", chequeNo: "N/A", debit: "5,000.00", credit: "0.00", balance: "10,000.00", remarks: "" },
        { no: "2", class: "Credit", transDate: "04-05-2025", valueDate: "04-05-2025", transactionDescription: "Salary Deposit", tellerNo: "ABC123", chequeNo: "N/A", debit: "0.00", credit: "20,000.00", balance: "30,000.00", remarks: "" },
        // ... more bank statement data
    ];
        const queryTransactions: Transaction[] = [
        { no: "1", class: "Debit", transDate: "03-05-2025", valueDate: "03-05-2025", transactionDescription: "ATM Withdrawal", tellerNo: "N/A", chequeNo: "N/A", debit: "5,000.00", credit: "0.00", balance: "10,000.00", remarks: "" },
        { no: "2", class: "Credit", transDate: "04-05-2025", valueDate: "04-05-2025", transactionDescription: "Salary Deposit", tellerNo: "ABC123", chequeNo: "N/A", debit: "0.00", credit: "20,000.00", balance: "30,000.00", remarks: "" },
        // ... more bank statement data
    ];

    const reconstructedStatementTransactions: Transaction[] = [
        { no: "1", entryDate: "02-05-2025", transDate: "03-05-2025", valueDate: "03-05-2025", tellerNo: "N/A", transactionDescription: "Online Transfer", transType: "Debit", chequeNo: "N/A", originalValue: "2,500.00", debit: "2,500.00", credit: "0.00", balance: "7,500.00", currency: "NGN", confirmation: "Yes", cleared: "Yes", exchangeRate: "1.00", clearance: "Completed" },
        { no: "2", entryDate: "03-05-2025", transDate: "04-05-2025", valueDate: "04-05-2025", tellerNo: "DEF456", transactionDescription: "Mobile Recharge", transType: "Debit", chequeNo: "N/A", originalValue: "1,000.00", debit: "1,000.00", credit: "0.00", balance: "6,500.00", currency: "NGN", confirmation: "Yes", cleared: "Yes", exchangeRate: "1.00", clearance: "Completed" },
        // ... more reconstructed statement data
    ];

    const cashBookTransactions: Transaction[] = [
        { no: "1", class: "Payment", transDate: "05-05-2025", transactionDescription: "Stationery Purchase", tellerNo: "GHI789", chequeNo: "1001", debit: "500.00", credit: "0.00", balance: "6,000.00", remarks: "Invoice #123" },
        { no: "2", class: "Receipt", transDate: "06-05-2025", transactionDescription: "Client Payment", tellerNo: "JKL012", chequeNo: "N/A", debit: "0.00", credit: "2,000.00", balance: "8,000.00", remarks: "Project Alpha" },
        // ... more cash book data
    ];

    const transMatchedTransactions: Transaction[] = [
        { no: "1", src: "System A", class: "Match", transDate: "07-05-2025", transactionDescription: "Transaction ID 123", tellerNo: "MNO345", cheque: "N/A", debit: "1,500.00", credit: "1,500.00", balance: "9,500.00" },
        { no: "2", src: "System B", class: "Mismatch", transDate: "08-05-2025", transactionDescription: "Transaction Ref 456", tellerNo: "PQR678", cheque: "2002", debit: "750.00", credit: "0.00", balance: "8,750.00" },
        // ... more trans matched data
    ];

    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [previewDocumentUrl, setPreviewDocumentUrl] = useState<string | null>(null);
    const [isUserListOpen, setIsUserListOpen] = useState(false);
    const [assignedUsers, setAssignedUsers] = useState<AssignedUser[]>([]);
    const [isUploadDropdownOpen, setIsUploadDropdownOpen] = useState(false);
    
        const [formData, setFormData] = useState<FormData>({});
      const [step, setStep] = useState<number>(1);
    const [uploadType, setUploadType] = useState<"cashbook" | "bankstatement" | null>(null);
    const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
 const [showModal, setShowModal] = useState(false);
    const [modalFormData, setModalFormData] = useState<ModalFormData>({
      fromDate: '', // Initialize From Date
        toDate: '',   // Initialize To Date
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
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const getTableDataAndHeaders = () => {
        switch (activeTab) {
            case "Bank Statement":
                return {
                    headers: ["No.", "Class", "Trans Date", "Value Date", "Transaction Description", "Teller No.", "Cheque No.", "Debit", "Credit", "Balance", "Remarks"],
                    data: bankStatementTransactions,
                };
            case "Reconstructed Statement":
                return {
                    headers: ["No.", "Entry Date", "Trans Date", "Value Date", "Teller No", "Transaction Description", "Trans Type", "Cheque No", "Original Value", "Debit", "Credit", "Balance", "Curr.", "Conf.", "Clr", "Exch. Rate", "Clearance"],
                    data: reconstructedStatementTransactions,
                };
            case "Cash Book":
                return {
                    headers: ["No.", "Class", "Trans Date", "Transaction Description", "Teller No.", "Cheque No.", "Debit", "Credit", "Balance", "Remarks"],
                    data: cashBookTransactions,
                };
            case "Trans Matched":
                return {
                    headers: ["No.", "Src", "Class", "Trans Date", "Transaction Description", "Teller No.", "Cheque", "Debit", "Credit", "Balance"],
                    data: transMatchedTransactions,
                };
            case "Query":
                return {
                     headers: ["No.", "Class", "Trans Date", "Value Date", "Transaction Description", "Teller No.", "Cheque No.", "Debit", "Credit", "Balance", "Remarks"],
                      data: queryTransactions,
                };
            default: // "Entry"
                return {
                    headers: ["S/N", "Date", "Account Name", "Account Number", "Account Type", "Symbol", "Bank Name", "Bank Address"],
                    data: entryTransactions.map(t => ({ ...t, date: t.entryDate })), // Map entryDate to a generic 'date' for the table
                };
        }
    };

    const { headers, data } = getTableDataAndHeaders();

    const handleUploadButtonClick = () => {
        setIsUploadDropdownOpen(!isUploadDropdownOpen);
    };

    const handleUploadOptionClick = (type: "cashbook" | "bankstatement") => {
        setUploadType(type);
        setIsUploadDropdownOpen(false);
        alert(`Initiating upload for ${type}`);
        // In a real application, you would trigger the file upload dialog here
    };

    const handleFilePreview = (filename: string) => {
        // In a real application, you would fetch the actual document URL
        // For this example, we'll just set a placeholder
        setPreviewDocumentUrl("/pdf-placeholder.pdf");
        setIsPreviewModalOpen(true);
    };

    const handleClosePreviewModal = () => {
        setIsPreviewModalOpen(false);
        setPreviewDocumentUrl(null);
    };

    const handleFileDownload = (filename: string) => {
        alert(`Downloading file: ${filename}`);
        // Implement your file download logic here (e.g., trigger a download)
    };

    const handleFileDelete = (filename: string) => {
        alert(`Deleting file: ${filename}`);
        // Implement your file deletion logic here (e.g., remove from state/storage)
        setEntryTransactions(prevTransactions =>
            prevTransactions.filter(transaction => transaction.transactionDescription !== filename)
        );
    };

    const toggleUserList = () => {
        setIsUserListOpen(!isUserListOpen);
    };

    const assignUser = (user: (typeof users)[0]) => {
        if (!assignedUsers.some((assigned) => assigned.id === user.id)) {
            setAssignedUsers([...assignedUsers, user]);
        }
        setIsUserListOpen(false);
    };

    const unassignUser = (userId: number) => {
        setAssignedUsers(assignedUsers.filter((user) => user.id !== userId));
    };

    const toggleQueryModal = () => {
        setIsQueryModalOpen(!isQueryModalOpen);
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-100 ">
            <div className="hidden md:block fixed h-full w-64">
                <Sidebar />
            </div>

            <div className="md:hidden bg-white shadow-sm p-4 flex items-center">
                {/* Mobile menu button */}
                <h1 className="text-xl font-semibold">Account</h1>
            </div>

            <div className="flex-1 md:ml-64 overflow-auto mt-16 md:mt-0">
                <div className="bg-gray-100 min-h-full p-4 md:p-6">
                    <div className="bg-white rounded-md shadow-md p-4 md:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className=" text-gray-700 text-xl font-semibold">user.id Account</h1>
                            <div className="flex items-center space-x-3">
                                <div className="flex -space-x-2">
                                    {assignedUsers.map((user) => (
                                        <div key={user.id} className="relative w-8 h-8 rounded-full shadow">
                                            <Image src={user.avatar} alt={user.name} fill className="rounded-full object-cover" />
                                            <button
                                                onClick={() => unassignUser(user.id)}
                                                className="absolute top-0 right-0 -mt-1 -mr-1 bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center text-gray-500 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            >
                                                <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={toggleUserList}
                                        className="relative w-8 h-8 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <PlusIcon className="h-5 w-5" />
                                    </button>

                                </div>
                                {activeTab === "Entry" && (
                                    <div className="relative">
                                        <button
                                            onClick={handleUploadButtonClick}
                                            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline-orange active:bg-orange-700"
                                        >
                                            <div className="flex items-center">
                                                <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                                                <span>Upload</span>
                                            </div>
                                        </button>
                                        {isUploadDropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10">
                                                <button
                                                    onClick={() => handleUploadOptionClick("cashbook")}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                >
                                                    Cash Book
                                                </button>
                                                <button
                                                    onClick={() => handleUploadOptionClick("bankstatement")}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                >
                                                    Bank Statement
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {activeTab === "Query" && (
                                    <button
                                        onClick={toggleQueryModal}
                                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline-orange active:bg-orange-700"
                                    >
                                        New Query
                                    </button>
                                )}
                            </div>
                        </div>
 <div className="flex justify-end mb-4">
                            <button 
                                type="button" 
                                onClick={() => setShowModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                            >
                                Rate Adjustment
                            </button>
                        </div>
                        <AccountInformation />

                        <div className="mb-4 overflow-x-auto">
                            <div className="flex whitespace-nowrap border-b border-gray-200">
                                <button
                                    onClick={() => handleTabChange("Entry")}
                                    className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                                        activeTab === "Entry"
                                            ? "border-b-2 border-orange-500 text-orange-500"
                                            : "text-gray-500 hover:text-orange-500"
                                        } focus:outline-none`}
                                >
                                    Entry
                                </button>
                                <button
                                    onClick={() => handleTabChange("Bank Statement")}
                                    className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                                        activeTab === "Bank Statement"
                                            ? "border-b-2 border-orange-500 text-orange-500"
                                            : "text-gray-500 hover:text-orange-500"
                                        } focus:outline-none`}
                                >
                                    Bank Statement
                                </button>
                                <button
                                    onClick={() => handleTabChange("Reconstructed Statement")}
                                    className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                                        activeTab === "Reconstructed Statement"
                                            ? "border-b-2 border-orange-500 text-orange-500"
                                            : "text-gray-500 hover:text-orange-500"
                                        } focus:outline-none`}
                                >
                                    Reconstructed Statement
                                </button>
                                <button
                                    onClick={() => handleTabChange("Cash Book")}
                                    className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                                        activeTab === "Cash Book"
                                            ? "border-b-2 border-orange-500 text-orange-500"
                                            : "text-gray-500 hover:text-orange-500"
                                        } focus:outline-none`}
                                >
                                    Cash Book
                                </button>
                                <button
                                    onClick={() => handleTabChange("Trans Matched")}
                                    className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                                        activeTab === "Trans Matched"
                                            ? "border-b-2 border-orange-500 text-orange-500"
                                            : "text-gray-500 hover:text-orange-500"
                                        } focus:outline-none`}
                                >
                                    Trans Matched
                                </button>
                                <button
                                    onClick={() => handleTabChange("Query")}
                                    className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                                        activeTab === "Query"
                                            ? "border-b-2 border-orange-500 text-orange-500"
                                            : "text-gray-500 hover:text-orange-500"
                                        } focus:outline-none`}
                                >
                                    Query
                                </button>
                            </div>
                        </div>
                        {activeTab === "Entry" && (
                            <>


                                <div>

                                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Bank Statement</h2>
                                    <div className="bg-white rounded-md shadow-sm mb-3 border border-gray-200 overflow-y-auto max-h-48">
                                        {entryTransactions.map((transaction, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-center py-3 px-4 ${
                                                    index < entryTransactions.length - 1
                                                        ? 'border-b border-gray-200'
                                                        : ''
                                                    }`}
                                            >
                                                <div className="w-10 h-10 bg-red-100 text-red-500 rounded-md flex items-center justify-center mr-4">
                                                    <span>PDF</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h6 className="font-semibold text-gray-800">
                                                        Investment Contracts
                                                    </h6>
                                                    <p className="text-gray-500 text-sm">
                                                        investment contracts.pdf
                                                    </p>
                                                    <p className="text-gray-500 text-sm">
                                                        by Kelechi David Eze, 17 days ago at 7:47 AM - 132.73 KB
                                                    </p>
                                                </div>
                                                <div className="text-gray-500 text-sm mr-4 hidden md:block">
                                                    23 Days left
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button

                                                        onClick={() => handleFilePreview("investment contracts.pdf")}
                                                        className="text-gray-500 hover:text-orange-500 focus:outline-none"
                                                    >
                                                        <EyeIcon className="h-5 w-5" />
                                                        <span className="sr-only">Preview</span>
                                                    </button>
                                                    <button


                                                        onClick={() => handleFileDownload("investment contracts.pdf")}
                                                        className="text-gray-500 hover:text-orange-500 focus:outline-none"
                                                    >
                                                        <ArrowDownTrayIcon className="h-5 w-5" />
                                                        <span className="sr-only">Download</span>
                                                    </button>
                                                    <button


                                                        onClick={() => handleFileDelete("investment contracts.pdf")}
                                                        className="text-gray-500 hover:text-red-500 focus:outline-none"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                        <span className="sr-only">Remove</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Cash Book</h2>
                                    <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-y-auto max-h-48">
                                        {entryTransactions.slice(0, 5).map((transaction, index) => (
                                            <div
                                                key={`csv-${index}`}
                                                className={`flex items-center py-3 px-4 ${
                                                    index < 4 ? 'border-b border-gray-200' : ''
                                                    }`}
                                            >
                                                <div className="w-10 h-10 bg-blue-100 text-blue-500 rounded-md flex items-center justify-center mr-4">
                                                    <span>CSV</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h6 className="font-semibold text-gray-800">
                                                        Investment Contracts
                                                    </h6>
                                                    <p className="text-gray-500 text-sm">
                                                        investment contracts.pdf
                                                    </p>
                                                    <p className="text-gray-500 text-sm">
                                                        by Kelechi David Eze, 17 days ago at 7:47 AM - 132.73 KB
                                                    </p>
                                                </div>
                                                <div className="text-gray-500 text-sm mr-4 hidden md:block">
                                                    23 Days left
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button

                                                        onClick={() => handleFilePreview("investment contracts.pdf")}
                                                        className="text-gray-500 hover:text-orange-500 focus:outline-none"
                                                    >
                                                        <EyeIcon className="h-5 w-5" />
                                                        <span className="sr-only">Preview</span>
                                                    </button>
                                                    <button


                                                        onClick={() => handleFileDownload("investment contracts.pdf")}
                                                        className="text-gray-500 hover:text-orange-500 focus:outline-none"
                                                    >
                                                        <ArrowDownTrayIcon className="h-5 w-5" />
                                                        <span className="sr-only">Download</span>
                                                    </button>
                                                    <button


                                                        onClick={()=> handleFileDelete("investment contracts.pdf")}
                                                        className="text-gray-500 hover:text-red-500 focus:outline-none"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                        <span className="sr-only">Remove</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                        {(activeTab === "Query" || activeTab === "Bank Statement" || activeTab === "Reconstructed Statement" || activeTab === "Cash Book" || activeTab === "Trans Matched") && (
                            <div className="overflow-y-auto max-h-[600px]">
                                <TransactionTable headers={headers} data={data} />
                            </div>
                        )}

                        {/* {activeTab === "Query" && (
                            <div className="relative">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full leading-normal">
                                        <thead className="bg-gray-50 text-gray-700">
                                            <tr>
                                                {headers.map((header) => (
                                                    <th key={header} className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((row, index) => (
                                                <tr key={index}>
                                                    {Object.values(row).map((cell, cellIndex) => (
                                                        <td key={cellIndex} className="px-5 py-3 border-b border-gray-200 text-sm">
                                                            {cell}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )} */}
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {isPreviewModalOpen && (
                <Modal isOpen={isPreviewModalOpen} onClose={handleClosePreviewModal}>
                    {previewDocumentUrl ? (
                        <iframe
                            src={previewDocumentUrl}
                            title="Document Preview"
                            className="w-full h-[600px]" // Adjust height as needed
                        />
                    ) : (
                        <p>No document to preview.</p>
                    )}
                </Modal>
            )}


            {isUserListOpen && (
                <Modal isOpen={isUserListOpen} onClose={toggleUserList}>
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Assign Users</h2>
                    <div className="overflow-y-auto max-h-80">
                        <h3 className="font-semibold mb-2 text-gray-600">Assigned Users</h3>
                        {assignedUsers.length > 0 ? (
                            <ul>
                                {assignedUsers.map((user) => (
                                    <li key={user.id} className="flex items-center justify-between py-2">
                                        <div className="flex items-center text-gray-700">
                                            <div className="w-8 h-8 rounded-full shadow text-gray-700 mr-2 relative">
                                                <Image src={user.avatar} alt={user.name} fill className="rounded-full object-cover" />
                                            </div>
                                            <span>{user.name}</span>
                                        </div>
                                        <button
                                            onClick={() => unassignUser(user.id)}
                                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-1 px-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                            Unassign
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 mb-2">No users assigned yet.</p>
                        )}

                        <h3 className="font-semibold mt-4 mb-2 text-gray-600">Unassigned Users</h3>
                        <ul>
                            {users
                                .filter((user) => !assignedUsers.some((assigned) => assigned.id === user.id))
                                .map((user) => (
                                    <li key={user.id} className="flex items-center justify-between py-2">
                                        <div className="flex items-center text-gray-700">
                                            <div className="w-8 h-8 rounded-full shadow text-gray-700 mr-2 relative">
                                                <Image src={user.avatar} alt={user.name} fill className="rounded-full object-cover" />
                                            </div>
                                            <span>{user.name}</span>
                                        </div>
                                        <button
                                            onClick={() => assignUser(user)}
                                            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            Assign
                                        </button>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </Modal>
            )}

            {isQueryModalOpen && (
                <Modal isOpen={isQueryModalOpen} onClose={toggleQueryModal}>
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">New Query</h2>
                    <QueryForm  />
                </Modal>
            )}
            {showModal && (
                            <div className="fixed inset-0 bg-black/50 overflow-y-auto z-50">
                        <RateAdjustmentForm  setShowModal = {setShowModal}
                            modalFormData = {modalFormData}
                            handleModalChange = {handleModalChange}
                            handleSelectChange = {handleSelectChange}
                            handleSave = {handleSave} /> 
                    </div>
                        )}
        </div>
    );
};

export default AccountDetails;
