"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
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
import Navbar from "../nav/Navbar";
import { useParams, useRouter } from "next/navigation";
import { useBankAccounts } from "@/hooks/useBankAccount";
import { useUsers } from "@/hooks/useUsers";
import { useTransactions, TransactionPreview } from "@/hooks/useTransactions";
import { toast } from "sonner";
import TransactionPreviewModal from "./TransactionPreviewModal";
import AccountTransactions from "./AccountTransactions";

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
    id: string;
    userId?: string;
    user?: {
        id: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        avatarUrl?: string;
    };
    firstName?: string;
    lastName?: string;
    email?: string;
    avatarUrl?: string;
    name?: string;
    avatar?: string;
}

// type AnalysisType = "CMF" | "ST Loan" | "LT Loan" | "Interest" | "Debit" | "Credit" | "Collateral" | "Fees" | null;

const AccountDetails = () => {
    const params = useParams();
    const router = useRouter();
    const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string | undefined);
    const { getBankAccountById, getStaffAssignmentsByAccount, assignStaffToAccount, unassignStaffFromAccount } = useBankAccounts();
    const { getUsers } = useUsers();
    const { uploadTransaction } = useTransactions();
    const [accountHeader, setAccountHeader] = useState<string>("");
    const [activeTab, setActiveTab] = useState("Entry");
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingAssignments, setLoadingAssignments] = useState(false);
    const [showAssignedUsers, setShowAssignedUsers] = useState(true);
    const [entryTransactions, setEntryTransactions] = useState<Transaction[]>([
        { sNo: "01", entryDate: "02-04-2023", transactionDate: "02-04-2023", valueDate: "02-04-2023", tellerNumber: "N/A", transactionDescription: "Principal LIQ...", transactionType: "Cash/Cheque", chequeNo: "Nil", originalValue: "44,897,985.89" },
        { sNo: "02", entryDate: "02-04-2023", transactionDate: "02-04-2023", valueDate: "02-04-2023", tellerNumber: "U000...", transactionDescription: "Debetuje baje...", transactionType: "Cash/Cheque", chequeNo: "Cash", originalValue: "100,000.00" },
    ]);

    const bankStatementTransactions: Transaction[] = [
        { no: "1", class: "Debit", transDate: "03-05-2025", valueDate: "03-05-2025", transactionDescription: "ATM Withdrawal", tellerNo: "N/A", chequeNo: "N/A", debit: "5,000.00", credit: "0.00", balance: "10,000.00", remarks: "" },
        { no: "2", class: "Credit", transDate: "04-05-2025", valueDate: "04-05-2025", transactionDescription: "Salary Deposit", tellerNo: "ABC123", chequeNo: "N/A", debit: "0.00", credit: "20,000.00", balance: "30,000.00", remarks: "" },
    ];

    const queryTransactions: Transaction[] = [
        { no: "1", class: "Debit", transDate: "03-05-2025", valueDate: "03-05-2025", transactionDescription: "ATM Withdrawal", tellerNo: "N/A", chequeNo: "N/A", debit: "5,000.00", credit: "0.00", balance: "10,000.00", remarks: "" },
        { no: "2", class: "Credit", transDate: "04-05-2025", valueDate: "04-05-2025", transactionDescription: "Salary Deposit", tellerNo: "ABC123", chequeNo: "N/A", debit: "0.00", credit: "20,000.00", balance: "30,000.00", remarks: "" },
    ];

    const reconstructedStatementTransactions: Transaction[] = [
        { no: "1", entryDate: "02-05-2025", transDate: "03-05-2025", valueDate: "03-05-2025", tellerNo: "N/A", transactionDescription: "Online Transfer", transType: "Debit", chequeNo: "N/A", originalValue: "2,500.00", debit: "2,500.00", credit: "0.00", balance: "7,500.00", currency: "NGN", confirmation: "Yes", cleared: "Yes", exchangeRate: "1.00", clearance: "Completed" },
        { no: "2", entryDate: "03-05-2025", transDate: "04-05-2025", valueDate: "04-05-2025", tellerNo: "DEF456", transactionDescription: "Mobile Recharge", transType: "Debit", chequeNo: "N/A", originalValue: "1,000.00", debit: "1,000.00", credit: "0.00", balance: "6,500.00", currency: "NGN", confirmation: "Yes", cleared: "Yes", exchangeRate: "1.00", clearance: "Completed" },
    ];

    const cashBookTransactions: Transaction[] = [
        { no: "1", class: "Payment", transDate: "05-05-2025", transactionDescription: "Stationery Purchase", tellerNo: "GHI789", chequeNo: "1001", debit: "500.00", credit: "0.00", balance: "6,000.00", remarks: "Invoice #123" },
        { no: "2", class: "Receipt", transDate: "06-05-2025", transactionDescription: "Client Payment", tellerNo: "JKL012", chequeNo: "N/A", debit: "0.00", credit: "2,000.00", balance: "8,000.00", remarks: "Project Alpha" },
    ];

    const transMatchedTransactions: Transaction[] = [
        { no: "1", src: "System A", class: "Match", transDate: "07-05-2025", transactionDescription: "Transaction ID 123", tellerNo: "MNO345", cheque: "N/A", debit: "1,500.00", credit: "1,500.00", balance: "9,500.00" },
        { no: "2", src: "System B", class: "Mismatch", transDate: "08-05-2025", transactionDescription: "Transaction Ref 456", tellerNo: "PQR678", cheque: "2002", debit: "750.00", credit: "0.00", balance: "8,750.00" },
    ];

    // // Analysis data
    // const cmfAnalysisData = [
    //     { id: "1", date: "2023-01-01", description: "CMF Charge", amount: "1,500.00", rate: "0.5%", calculated: "750.00", status: "Applied" },
    //     { id: "2", date: "2023-01-15", description: "CMF Adjustment", amount: "1,500.00", rate: "0.5%", calculated: "750.00", status: "Pending" },
    // ];

    // const stLoanAnalysisData = [
    //     { id: "1", date: "2023-01-01", principal: "50,000.00", interestRate: "10%", days: "30", interest: "416.67", status: "Paid" },
    //     { id: "2", date: "2023-02-01", principal: "50,000.00", interestRate: "10%", days: "28", interest: "388.89", status: "Pending" },
    // ];

    // const ltLoanAnalysisData = [
    //     { id: "1", date: "2023-01-01", principal: "500,000.00", interestRate: "12%", term: "12 months", monthlyPayment: "44,432.90", remaining: "400,000.00" },
    //     { id: "2", date: "2023-02-01", principal: "500,000.00", interestRate: "12%", term: "11 months", monthlyPayment: "44,432.90", remaining: "355,567.10" },
    // ];

    // const interestAnalysisData = [
    //     { id: "1", period: "Jan 2023", creditBalance: "100,000.00", debitBalance: "50,000.00", interestRate: "5%", creditInterest: "416.67", debitInterest: "208.33", netInterest: "208.34" },
    //     { id: "2", period: "Feb 2023", creditBalance: "120,000.00", debitBalance: "40,000.00", interestRate: "5%", creditInterest: "500.00", debitInterest: "166.67", netInterest: "333.33" },
    // ];

    // const debitAnalysisData = [
    //     { id: "1", date: "2023-01-05", description: "Overdraft Charge", amount: "10,000.00", days: "5", rate: "0.05%", interest: "25.00" },
    //     { id: "2", date: "2023-01-12", description: "Overdraft Charge", amount: "15,000.00", days: "3", rate: "0.05%", interest: "22.50" },
    // ];

    // const creditAnalysisData = [
    //     { id: "1", date: "2023-01-31", description: "Credit Interest", balance: "100,000.00", days: "31", rate: "5%", interest: "424.66" },
    //     { id: "2", date: "2023-02-28", description: "Credit Interest", balance: "120,000.00", days: "28", rate: "5%", interest: "460.27" },
    // ];

    // const collateralAnalysisData = [
    //     { id: "1", date: "2023-01-01", description: "Cash Collateral", amount: "50,000.00", coverage: "125%", required: "40,000.00", status: "Adequate" },
    //     { id: "2", date: "2023-02-01", description: "Cash Collateral", amount: "45,000.00", coverage: "112.5%", required: "40,000.00", status: "Adequate" },
    // ];

    // const feesAnalysisData = [
    //     { id: "1", date: "2023-01-05", description: "Account Maintenance", amount: "1,000.00", frequency: "Monthly", status: "Applied" },
    //     { id: "2", date: "2023-01-15", description: "Wire Transfer Fee", amount: "500.00", frequency: "Per Transaction", status: "Applied" },
    // ];

    // Summary data for debit/credit analysis
    // const debitCreditSummaryData = [
    //     { category: "Total Debit Interest", amount: "47.50" },
    //     { category: "Total Credit Interest", amount: "884.93" },
    //     { category: "Net Interest", amount: "837.43" },
    // ];
    //   const summarizedTransactions: Transaction[] = [
    //     { no: "1", src: "System A", class: "Match", transDate: "07-05-2025", transactionDescription: "Transaction ID 123", tellerNo: "MNO345", cheque: "N/A", debit: "1,500.00", credit: "1,500.00", balance: "9,500.00" },
    //     { no: "2", src: "System B", class: "Mismatch", transDate: "08-05-2025", transactionDescription: "Transaction Ref 456", tellerNo: "PQR678", cheque: "2002", debit: "750.00", credit: "0.00", balance: "8,750.00" },
    //     // ... more trans matched data
    // ];
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [previewDocumentUrl, setPreviewDocumentUrl] = useState<string | null>(null);
    const [isUserListOpen, setIsUserListOpen] = useState(false);
    const [assignedUsers, setAssignedUsers] = useState<AssignedUser[]>([]);
    const [isUploadDropdownOpen, setIsUploadDropdownOpen] = useState(false);
    // const [isAnalysisDropdownOpen, setIsAnalysisDropdownOpen] = useState(false);
    const [formData, setFormData] = useState<FormData>({});
    const [step, setStep] = useState<number>(1);
    const [uploadType, setUploadType] = useState<"cashbook" | "bankstatement" | null>(null);
    const [showTransactionPreview, setShowTransactionPreview] = useState(false);
    const [previewTransactions, setPreviewTransactions] = useState<TransactionPreview[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    // const [analysisType, setAnalysisType] = useState<AnalysisType>(null);
    const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
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

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
      
    };

    useEffect(() => {
        if (!id) return;
        getBankAccountById(id).then((a: any) => {
            if (!a) return;
            setAccountHeader(`${a.accountName || ''} Account`);
            // Prefill top section with all available data
            initialInfo = {
                accountNumber: a.accountNumber,
                accountCode: a.code,
                accountName: a.accountName,
                revenueType: (a.accountType || '').toLowerCase(),
                currency: a.currency,
                postingBalance: a.openingBalance?.toString() || '',
                leadBank: a.bank?.name || '',
                // Rate information
                drRate: a.rate?.debitRate?.toString() || '',
                exRate: a.rate?.excessRate?.toString() || '',
                exChargeType: a.rate?.excessRateType || '',
                CAMFRate: a.rate?.camfRate?.toString() || '',
                returnChargeRate: a.rate?.returnChargeRate?.toString() || '',
                returnChargeLimit: a.rate?.returnChargeLimit?.toString() || '',
                CAMFConvenantRate: a.rate?.cotCovenantRate?.toString() || '',
                CAMFOffConvenantRate: a.rate?.cotOffCoverRate?.toString() || '',
                turnOverLimit: a.rate?.turnoverLimit?.toString() || '',
                CAMFConvenantFrequency: a.rate?.cotCovenantFrequency || '',
                creditInterestRate: a.rate?.creditInterestRates?.[0]?.rate?.toString() || '',
                vatWHTRate: a.rate?.whtRate?.toString() || '',
            };
            setInitialInfoState(initialInfo);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    let initialInfo: any = {};
    const [initialInfoState, setInitialInfoState] = useState<any>({});

    const getTableDataAndHeaders = () => {
        switch (activeTab) {
            case "Bank Statement":
                return {
                    headers: ["No.", "Class", "Trans Date", "Value Date", "Transaction Description", "Teller No.", "Cheque No.", "Debit", "Credit", "Balance", "Remarks"],
                    data: bankStatementTransactions,
                    title: "Bank Statement"
                };
            case "Classified Statement":
                return {
                    headers: ["No.", "Entry Date", "Trans Date", "Value Date", "Teller No", "Transaction Description", "Trans Type", "Cheque No", "Original Value", "Debit", "Credit", "Balance", "Curr.", "Conf.", "Clr", "Exch. Rate", "Clearance"],
                    data: reconstructedStatementTransactions,
                    title: "Classified Statement"
                };
            case "Cash Book":
                return {
                    headers: ["No.", "Class", "Trans Date", "Transaction Description", "Teller No.", "Cheque No.", "Debit", "Credit", "Balance", "Remarks"],
                    data: cashBookTransactions,
                    title: "Cash Book"
                };
            case "Trans Matched":
                return {
                    headers: ["No.", "Src", "Class", "Trans Date", "Transaction Description", "Teller No.", "Cheque", "Debit", "Credit", "Balance"],
                    data: transMatchedTransactions,
                    title: "Transaction Matching"
                };
            case "Query":
                return {
                    headers: ["No.", "Class", "Trans Date", "Value Date", "Transaction Description", "Teller No.", "Cheque No.", "Debit", "Credit", "Balance", "Remarks"],
                    data: queryTransactions,
                    title: "Query Results"
                };
            // case "Analysis":
            //     return getAnalysisTableData();
            // case "Summary":
            //     return {
            //         headers: ["No.", "Category", "Amount"],
            //         data: summarizedTransactions,
            //         title: "Summary"
            //     };
            default: // "Entry"
                return {
                    headers: ["S/N", "Date", "Account Name", "Account Number", "Account Type", "Symbol", "Bank Name", "Bank Address"],
                    data: entryTransactions.map(t => ({ ...t, date: t.entryDate })),
                    title: "Account Entries"
                };
        }
    };

    // const getAnalysisTableData = () => {
    //     if (!analysisType) return { headers: [], data: [], title: "Analysis" };

    //     switch (analysisType) {
    //         case "CMF":
    //             return {
    //                 headers: ["ID", "Date", "Description", "Amount", "Rate", "Calculated", "Status"],
    //                 data: cmfAnalysisData,
    //                 title: "CMF Analysis",
    //                 showSummary: false
    //             };
    //         case "ST Loan":
    //             return {
    //                 headers: ["ID", "Date", "Principal", "Interest Rate", "Days", "Interest", "Status"],
    //                 data: stLoanAnalysisData,
    //                 title: "Short Term Loan Analysis",
    //                 showSummary: false
    //             };
    //         case "LT Loan":
    //             return {
    //                 headers: ["ID", "Date", "Principal", "Interest Rate", "Term", "Monthly Payment", "Remaining"],
    //                 data: ltLoanAnalysisData,
    //                 title: "Long Term Loan Analysis",
    //                 showSummary: false
    //             };
    //         case "Interest":
    //             return {
    //                 headers: ["ID", "Period", "Credit Balance", "Debit Balance", "Interest Rate", "Credit Interest", "Debit Interest", "Net Interest"],
    //                 data: interestAnalysisData,
    //                 title: "Interest Analysis",
    //                 showSummary: false
    //             };
    //         case "Debit":
    //             return {
    //                 headers: ["ID", "Date", "Description", "Amount", "Days", "Rate", "Interest"],
    //                 data: debitAnalysisData,
    //                 title: "Debit Interest Analysis",
    //                 showSummary: true,
    //                 summaryData: debitCreditSummaryData,
    //                 summaryTitle: "Debit Interest Summary"
    //             };
    //         case "Credit":
    //             return {
    //                 headers: ["ID", "Date", "Description", "Balance", "Days", "Rate", "Interest"],
    //                 data: creditAnalysisData,
    //                 title: "Credit Interest Analysis",
    //                 showSummary: true,
    //                 summaryData: debitCreditSummaryData,
    //                 summaryTitle: "Credit Interest Summary"
    //             };
    //         case "Collateral":
    //             return {
    //                 headers: ["ID", "Date", "Description", "Amount", "Coverage", "Required", "Status"],
    //                 data: collateralAnalysisData,
    //                 title: "Collateral Analysis",
    //                 showSummary: false
    //             };
    //         case "Fees":
    //             return {
    //                 headers: ["ID", "Date", "Description", "Amount", "Frequency", "Status"],
    //                 data: feesAnalysisData,
    //                 title: "Fees Analysis",
    //                 showSummary: false
    //             };
    //         default:
    //             return { headers: [], data: [], title: "Analysis" };
    //     }
    // };

    const { headers, data, title } = getTableDataAndHeaders();

    const handleUploadButtonClick = () => {
        setIsUploadDropdownOpen(!isUploadDropdownOpen);
    };

    // const handleUploadAnalysisClick = () => {
    //     setIsAnalysisDropdownOpen(!isAnalysisDropdownOpen);
    // };

    const handleUploadOptionClick = (type: "cashbook" | "bankstatement") => {
        setUploadType(type);
        setIsUploadDropdownOpen(false);
        // Trigger file input
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !id) {
            return;
        }

        setIsUploading(true);
        try {
            const preview = await uploadTransaction(id, file);
            if (preview && preview.length > 0) {
                setPreviewTransactions(preview);
                setShowTransactionPreview(true);
            }
        } catch (error) {
            console.error("Failed to upload transaction:", error);
        } finally {
            setIsUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleTransactionPreviewClose = () => {
        setShowTransactionPreview(false);
        setPreviewTransactions([]);
    };

    const handleTransactionCreateSuccess = () => {
        // Refresh transactions or show success message
        toast.success("Transactions created successfully!");
        // Optionally refresh the entry transactions list
    };

    // const handleAnalyzeOptionClick = (type: AnalysisType) => {
    //     setAnalysisType(type);
    //     setIsAnalysisDropdownOpen(false);
    //     setActiveTab("Analysis");
    // };

    const handleFilePreview = (filename: string) => {
        setPreviewDocumentUrl("/pdf-placeholder.pdf");
        setIsPreviewModalOpen(true);
    };

    const handleClosePreviewModal = () => {
        setIsPreviewModalOpen(false);
        setPreviewDocumentUrl(null);
    };

    const handleFileDownload = (filename: string) => {
        alert(`Downloading file: ${filename}`);
    };

    const handleFileDelete = (filename: string) => {
        alert(`Deleting file: ${filename}`);
        setEntryTransactions(prevTransactions =>
            prevTransactions.filter(transaction => transaction.transactionDescription !== filename)
        );
    };

    const toggleUserList = async () => {
        const newState = !isUserListOpen;
        setIsUserListOpen(newState);
        
        if (newState && id) {
            // Fetch assigned users and all users when modal opens
            setLoadingAssignments(true);
            setLoadingUsers(true);
            
            try {
                // Fetch assigned staff for this account
                const assignments = await getStaffAssignmentsByAccount(id);
                if (assignments && Array.isArray(assignments)) {
                    const mapped = assignments.map((assignment: any) => {
                        const user = assignment.user || assignment;
                        return {
                            id: assignment.id || user.id,
                            userId: user.id || assignment.userId,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            avatarUrl: user.avatarUrl,
                            name: user.firstName && user.lastName 
                                ? `${user.firstName} ${user.lastName}` 
                                : user.email || 'Unknown User',
                            avatar: user.avatarUrl || `https://placehold.co/40x40/FF7F50/FFFFFF?text=${(user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}`
                        };
                    });
                    setAssignedUsers(mapped);
                }
                
                // Fetch all users from the system
                const usersData = await getUsers();
                if (usersData && Array.isArray(usersData)) {
                    setAllUsers(usersData);
                }
            } catch (error) {
                console.error('Failed to load users:', error);
            } finally {
                setLoadingAssignments(false);
                setLoadingUsers(false);
            }
        }
    };

    const assignUser = async (user: any) => {
        if (!id) {
            toast.error('Account ID is missing');
            return;
        }
        
        const userId = user.id;
        if (!userId) {
            toast.error('User ID is missing');
            return;
        }

        // Check if already assigned
        if (assignedUsers.some((assigned) => assigned.userId === userId || assigned.id === userId)) {
            toast.error('User is already assigned to this account');
            return;
        }

        setLoadingUsers(true);
        try {
            const result = await assignStaffToAccount(userId, id);
            if (result) {
                // Add to assigned users list
                const newAssigned = {
                    id: result.id || userId,
                    userId: userId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    avatarUrl: user.avatarUrl,
                    name: user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : user.email || 'Unknown User',
                    avatar: user.avatarUrl || `https://placehold.co/40x40/FF7F50/FFFFFF?text=${(user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}`
                };
                setAssignedUsers([...assignedUsers, newAssigned]);
            }
        } catch (error) {
            console.error('Failed to assign user:', error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const unassignUser = async (assignmentId: string) => {
        if (!id) {
            toast.error('Account ID is missing');
            return;
        }

        if (!assignmentId) {
            toast.error('Assignment ID is missing');
            return;
        }

        setLoadingAssignments(true);
        try {
            const result = await unassignStaffFromAccount(assignmentId, id);
            if (result) {
                // Remove from assigned users list
                setAssignedUsers(assignedUsers.filter((user) => user.id !== assignmentId));
                // Optionally refresh the assignments list
                const assignments = await getStaffAssignmentsByAccount(id);
                if (assignments && Array.isArray(assignments)) {
                    const mapped = assignments.map((assignment: any) => {
                        const user = assignment.user || assignment;
                        return {
                            id: assignment.id || user.id,
                            userId: user.id || assignment.userId,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            avatarUrl: user.avatarUrl,
                            name: user.firstName && user.lastName 
                                ? `${user.firstName} ${user.lastName}` 
                                : user.email || 'Unknown User',
                            avatar: user.avatarUrl || `https://placehold.co/40x40/FF7F50/FFFFFF?text=${(user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}`
                        };
                    });
                    setAssignedUsers(mapped);
                }
            }
        } catch (error) {
            console.error('Failed to unassign user:', error);
        } finally {
            setLoadingAssignments(false);
        }
    };

    const toggleQueryModal = () => {
        setIsQueryModalOpen(!isQueryModalOpen);
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-100 ">
            <div className="hidden md:block fixed h-full w-64 z-40">
                <Sidebar />
            </div>
<div className="flex-1  mt-16 md:mt-0 relative z-0">
        <div className = "md:ml-64 "><Navbar /></div>
        

            <div className="flex-1 md:ml-64 overflow-auto mt-16 md:mt-0 relative z-0">
                <div className="bg-gray-100 min-h-full p-4 md:p-6">
                    <div className="bg-white rounded-md shadow-md p-4 md:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-800 focus:outline-none" aria-label="Go back">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L6.414 8H17a1 1 0 110 2H6.414l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <h1 className="text-gray-700 text-xl font-semibold">{accountHeader || 'Account'}</h1>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="flex -space-x-2">
                                    {assignedUsers.map((user) => {
                                        const firstName = user.firstName || '';
                                        const email = user.email || '';
                                        const initial = (firstName?.[0] || email?.[0] || 'U').toUpperCase();
                                        const avatarUrl = user.avatarUrl || user.avatar || `https://placehold.co/40x40/FF7F50/FFFFFF?text=${initial}`;
                                        const userName = user.name || `${firstName} ${user.lastName || ''}`.trim() || email || 'User';
                                        return (
                                            <div key={user.id || user.userId} className="relative w-8 h-8 rounded-full shadow overflow-hidden bg-gray-200">
                                                <Image src={avatarUrl} alt={userName} fill className="rounded-full object-cover" />
                                                <button
                                                    onClick={() => unassignUser(user.id || '')}
                                                    disabled={loadingAssignments}
                                                    className="absolute top-0 right-0 -mt-1 -mr-1 bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center text-gray-500 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500"
                                                >
                                                    <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        );
                                    })}
                                    <button
                                        onClick={toggleUserList}
                                        className="relative w-8 h-8 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <PlusIcon className="h-5 w-5" />
                                    </button>
                                </div>
                                {activeTab === "Entry" && (
                                    <div className="relative">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".xlsx,.xls,.csv,.pdf"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <button
                                            onClick={handleUploadButtonClick}
                                            disabled={isUploading}
                                            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline-orange active:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <div className="flex items-center">
                                                <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                                                <span>{isUploading ? "Uploading..." : "Upload"}</span>
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

                        {/* {activeTab === "Analysis" && (
                            <div className="flex justify-end mb-4">
                                <div className="relative">
                                    <button
                                        onClick={handleUploadAnalysisClick}
                                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline-orange active:bg-orange-700"
                                    >
                                        Analyze
                                    </button>
                                    {isAnalysisDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10">
                                            <button
                                                onClick={() => handleAnalyzeOptionClick("CMF")}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                            >
                                                CMF
                                            </button>
                                            <button
                                                onClick={() => handleAnalyzeOptionClick("ST Loan")}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                            >
                                                Short Term Loan
                                            </button>
                                            <button
                                                onClick={() => handleAnalyzeOptionClick("LT Loan")}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                            >
                                                Long Term Loan
                                            </button>
                                            <button
                                                onClick={() => handleAnalyzeOptionClick("Interest")}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                            >
                                                Interest Analysis
                                            </button>
                                            <button
                                                onClick={() => handleAnalyzeOptionClick("Debit")}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                            >
                                                Debit Interest
                                            </button>
                                            <button
                                                onClick={() => handleAnalyzeOptionClick("Credit")}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                            >
                                                Credit Interest
                                            </button>
                                            <button
                                                onClick={() => handleAnalyzeOptionClick("Collateral")}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                            >
                                                Cash Collateral
                                            </button>
                                            <button
                                                onClick={() => handleAnalyzeOptionClick("Fees")}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                            >
                                                Fees
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )} */}

                        <AccountInformation initialData={initialInfoState} />

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
                                    onClick={() => handleTabChange("Classified Statement")}
                                    className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                                        activeTab === "Classified Statement"
                                            ? "border-b-2 border-orange-500 text-orange-500"
                                            : "text-gray-500 hover:text-orange-500"
                                        } focus:outline-none`}
                                >
                                    Classified Statement
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
                                <button
                                    onClick={() => handleTabChange("Transactions")}
                                    className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                                        activeTab === "Transactions"
                                            ? "border-b-2 border-orange-500 text-orange-500"
                                            : "text-gray-500 hover:text-orange-500"
                                        } focus:outline-none`}
                                >
                                    Transactions
                                </button>
                                {/* <button
                                    onClick={() => handleTabChange("Analysis")}
                                    className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                                        activeTab === "Analysis"
                                            ? "border-b-2 border-orange-500 text-orange-500"
                                            : "text-gray-500 hover:text-orange-500"
                                        } focus:outline-none`}
                                >
                                    Analysis
                                </button>
                                <button
                                    onClick={() => handleTabChange("Summary")}
                                    className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                                        activeTab === "Summary"
                                            ? "border-b-2 border-orange-500 text-orange-500"
                                            : "text-gray-500 hover:text-orange-500"
                                        } focus:outline-none`}
                                >
                                    Summary
                                </button> */}
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
                        {(activeTab === "Query" || activeTab === "Bank Statement" || activeTab === "Classified Statement" || activeTab === "Cash Book" || activeTab === "Trans Matched") && (
                            <div className="overflow-y-auto max-h-[600px] gap-4">
                                <TransactionTable headers={headers} data={data} />
                                 <button
                                      
                                        className="bg-orange-500 mt-4 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline-orange active:bg-orange-700"
                                    >
                                        Save Query
                                    </button>
                            </div>
                        )}
                        {activeTab === "Transactions" && id && (
                            <AccountTransactions accountId={id} />
                        )}
  {(activeTab === "Analyze" || activeTab === "Bank Statement" || activeTab === "Classified Statement" || activeTab === "Cash Book" || activeTab === "Trans Matched") && (
                            <div className="overflow-y-auto max-h-[600px]">
                                <TransactionTable headers={headers} data={data} />
                            </div>
                        )}
                          {(activeTab === "Summary" || activeTab === "Bank Statement" || activeTab === "Classified Statement" || activeTab === "Cash Book" || activeTab === "Trans Matched") && (
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
                    <div className="overflow-y-auto max-h-96">
                        {/* Assigned Users Section with Toggle */}
                        <div className="mb-4">
                            <button
                                onClick={() => setShowAssignedUsers(!showAssignedUsers)}
                                className="flex items-center justify-between w-full font-semibold mb-2 text-gray-600 hover:text-gray-800"
                            >
                                <span>Assigned Users ({assignedUsers.length})</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-5 w-5 transition-transform ${showAssignedUsers ? 'rotate-180' : ''}`}
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {showAssignedUsers && (
                                <div>
                                    {loadingAssignments ? (
                                        <p className="text-gray-500 text-sm">Loading assigned users...</p>
                                    ) : assignedUsers.length > 0 ? (
                                        <ul className="space-y-2">
                                            {assignedUsers.map((user) => (
                                                <li key={user.id || user.userId} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                                    <div className="flex items-center text-gray-700">
                                                        <div className="w-8 h-8 rounded-full shadow mr-2 relative overflow-hidden bg-gray-200">
                                                            {(user.avatarUrl || user.avatar) ? (
                                                                <Image 
                                                                    src={(user.avatarUrl || user.avatar) as string} 
                                                                    alt={user.name || 'User'} 
                                                                    fill 
                                                                    className="rounded-full object-cover" 
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                                                                    {(user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span>{user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Unknown User'}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => unassignUser(user.id || '')}
                                                        disabled={loadingAssignments}
                                                        className="bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold py-1 px-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    >
                                                        Unassign
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 text-sm">No users assigned yet.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Unassigned Users Section */}
                        <div className="mt-4">
                            <h3 className="font-semibold mb-2 text-gray-600">Unassigned Users</h3>
                            {loadingUsers ? (
                                <p className="text-gray-500 text-sm">Loading users...</p>
                            ) : (
                                <ul className="space-y-2">
                                    {allUsers
                                        .filter((user) => {
                                            const userId = user.id;
                                            return !assignedUsers.some((assigned) => 
                                                assigned.userId === userId || assigned.id === userId
                                            );
                                        })
                                        .map((user) => {
                                            const userName = user.firstName && user.lastName 
                                                ? `${user.firstName} ${user.lastName}` 
                                                : user.email || 'Unknown User';
                                            const userAvatar = user.avatarUrl || `https://placehold.co/40x40/FF7F50/FFFFFF?text=${(user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}`;
                                            
                                            return (
                                                <li key={user.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                                    <div className="flex items-center text-gray-700">
                                                        <div className="w-8 h-8 rounded-full shadow mr-2 relative overflow-hidden bg-gray-200">
                                                            {user.avatarUrl ? (
                                                                <Image 
                                                                    src={user.avatarUrl} 
                                                                    alt={userName} 
                                                                    fill 
                                                                    className="rounded-full object-cover" 
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                                                                    {(user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span>{userName}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => assignUser(user)}
                                                        disabled={loadingUsers}
                                                        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-1 px-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    >
                                                        Assign
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    {allUsers.filter((user) => {
                                        const userId = user.id;
                                        return !assignedUsers.some((assigned) => 
                                            assigned.userId === userId || assigned.id === userId
                                        );
                                    }).length === 0 && (
                                        <p className="text-gray-500 text-sm">All users are assigned.</p>
                                    )}
                                </ul>
                            )}
                        </div>
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
                            // handleSelectChange = {handleSelectChange}
                            handleSave = {handleSave} /> 
                    </div>
                        )}

            {showTransactionPreview && id && (
                <TransactionPreviewModal
                    isOpen={showTransactionPreview}
                    onClose={handleTransactionPreviewClose}
                    transactions={previewTransactions}
                    accountId={id}
                    onCreateSuccess={handleTransactionCreateSuccess}
                />
            )}
        </div>
         </div>
    );
};

export default AccountDetails;
