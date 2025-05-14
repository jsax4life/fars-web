"use client";

import React, { useState } from "react";
import Sidebar from "@/components/utility/Sidebar";
import AccountInformation from "./AccountInformation";
import TransactionTable from "@/components/account/Table/TransactionTable";
import QueryForm from "@/components/account/Table/QueryForm";
import { Transaction } from "@/types/Transaction";
import { EyeIcon, ArrowDownTrayIcon, TrashIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import Modal from "@/components/utility/Modal"; // Assuming you have a Modal component

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
      case "Cash Back":
        return {
          headers: ["No.", "Class", "Trans Date", "Transaction Description", "Teller No.", "Cheque No.", "Debit", "Credit", "Balance", "Remarks"],
          data: cashBookTransactions,
        };
      case "Trans Matched":
        return {
          headers: ["No.", "Src", "Class", "Trans Date", "Transaction Description", "Teller No.", "Cheque", "Debit", "Credit", "Balance"],
          data: transMatchedTransactions,
        };
      default: // "Entry"
        return {
          headers: ["S/N", "Date", "Account Name", "Account Number", "Account Type", "Symbol", "Bank Name", "Bank Address"],
          data: entryTransactions.map(t => ({ ...t, date: t.entryDate })), // Map entryDate to a generic 'date' for the table
        };
    }
  };

  const { headers, data } = getTableDataAndHeaders();

  // Dummy functions for button actions.  Replace with your actual logic.
  const handleFileUpload = () => {
    alert("File upload functionality not implemented yet.");
    // Implement your file upload logic here
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

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
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
              {activeTab === "Entry" && (
                <button

                  onClick={handleFileUpload}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline-orange active:bg-orange-700" // Added classes
                >
                  <div className="flex items-center">
                    <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                    <span>Upload</span>
                  </div>
                </button>
              )}
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
                  onClick={() => handleTabChange("Cash Back")}
                  className={`py-2 px-3 md:px-4 -mb-px font-semibold text-sm ${
                    activeTab === "Cash Back"
                      ? "border-b-2 border-orange-500 text-orange-500"
                      : "text-gray-500 hover:text-orange-500"
                  } focus:outline-none`}
                >
                  Cash Back
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

                  <h2 className="text-lg font-semibold text-gray-700 mb-2">PDF</h2>
                  <div className="bg-white rounded-md shadow-sm mb-3 border border-gray-200">
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

                  <h2 className="text-lg font-semibold text-gray-700 mb-2">CSV</h2>
                  <div className="bg-white rounded-md shadow-sm border border-gray-200">
                    {entryTransactions.slice(0, 2).map((transaction, index) => (
                      <div
                        key={`csv-${index}`}
                        className={`flex items-center py-3 px-4 ${
                          index < 1 ? 'border-b border-gray-200' : ''
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
                </div>
              </>
            )}
            {activeTab !== "Query" && (activeTab === "Bank Statement" || activeTab === "Reconstructed Statement" || activeTab === "Cash Back" || activeTab === "Trans Matched") && (
              <TransactionTable headers={headers} data={data} />
            )}

            {activeTab === "Query" && (
              <QueryForm />
            )}
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
    </div>
  );
};

export default AccountDetails;