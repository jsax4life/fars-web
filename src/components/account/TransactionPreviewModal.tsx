"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/utility/Modal";
import { TransactionPreview, TransactionCreatePayload, useTransactions } from "@/hooks/useTransactions";
import { useClassifications } from "@/hooks/useClassification";
import { FiEdit2, FiSave, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface TransactionPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: TransactionPreview[];
  accountId: string;
  onCreateSuccess?: () => void;
}

interface Classification {
  id: string;
  code: string;
  label: string;
  category: string;
}

const TransactionPreviewModal: React.FC<TransactionPreviewModalProps> = ({
  isOpen,
  onClose,
  transactions: initialTransactions,
  accountId,
  onCreateSuccess,
}) => {
  const [transactions, setTransactions] = useState<TransactionPreview[]>(initialTransactions);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [loadingClassifications, setLoadingClassifications] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const { getClassifications } = useClassifications();
  const { createTransactions } = useTransactions();

  useEffect(() => {
    setTransactions(initialTransactions);
    setCurrentPage(1); // Reset to first page when transactions change
  }, [initialTransactions]);

  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1); // Reset to first page when modal opens
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      loadClassifications();
    }
  }, [isOpen]);

  const loadClassifications = async () => {
    setLoadingClassifications(true);
    try {
      const data = await getClassifications();
      if (Array.isArray(data)) {
        setClassifications(data);
      }
    } catch (error) {
      console.error("Failed to load classifications:", error);
    } finally {
      setLoadingClassifications(false);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  // Get the actual index in the full transactions array
  const getActualIndex = (pageIndex: number) => {
    return startIndex + pageIndex;
  };

  const handleEdit = (pageIndex: number) => {
    const actualIndex = getActualIndex(pageIndex);
    setEditingIndex(actualIndex);
  };

  const handleSave = (pageIndex: number) => {
    setEditingIndex(null);
  };

  const handleFieldChange = (
    pageIndex: number,
    field: keyof TransactionPreview,
    value: any
  ) => {
    const actualIndex = getActualIndex(pageIndex);
    const updated = [...transactions];
    updated[actualIndex] = {
      ...updated[actualIndex],
      [field]: value,
    };
    setTransactions(updated);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setEditingIndex(null); // Close any open edits when changing pages
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
    setEditingIndex(null); // Close any open edits
  };

  const handleSubmit = async () => {
    if (!accountId) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: TransactionCreatePayload[] = transactions.map((tx) => ({
        ...tx,
      }));

      const result = await createTransactions(accountId, payload);
      if (result) {
        onCreateSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error("Failed to submit transactions:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-GB");
    } catch {
      return dateString;
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      contentClassName="max-w-[95vw] w-full"
    >
      <div className="w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-4 pb-4 border-b">
          <h2 className="text-xl font-semibold text-gray-700">
            Transaction Preview ({transactions.length} transactions)
          </h2>
        </div>

        <div className="flex-1 overflow-auto mb-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Row
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Trans Date
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Value Date
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Debit
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Credit
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Teller No
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Cheque No
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Classification
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedTransactions.map((transaction, pageIndex) => {
                  const actualIndex = getActualIndex(pageIndex);
                  return (
                  <tr
                    key={actualIndex}
                    className={editingIndex === actualIndex ? "bg-yellow-50" : ""}
                  >
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">
                      {String(transaction.rowIndex)}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs">
                      {editingIndex === actualIndex ? (
                        <input
                          type="date"
                          value={transaction.transactionDate}
                          onChange={(e) =>
                            handleFieldChange(pageIndex, "transactionDate", e.target.value)
                          }
                          className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <span className="text-gray-900">
                          {formatDate(transaction.transactionDate)}
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs">
                      {editingIndex === actualIndex ? (
                        <input
                          type="date"
                          value={transaction.valueDate}
                          onChange={(e) =>
                            handleFieldChange(pageIndex, "valueDate", e.target.value)
                          }
                          className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <span className="text-gray-900">
                          {formatDate(transaction.valueDate)}
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-2 text-xs">
                      {editingIndex === actualIndex ? (
                        <input
                          type="text"
                          value={transaction.description}
                          onChange={(e) =>
                            handleFieldChange(pageIndex, "description", e.target.value)
                          }
                          className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <span className="text-gray-900">{transaction.description}</span>
                      )}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs">
                      {editingIndex === actualIndex ? (
                        <input
                          type="number"
                          step="0.01"
                          value={transaction.debit}
                          onChange={(e) =>
                            handleFieldChange(
                              pageIndex,
                              "debit",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <span className="text-gray-900">
                          {formatCurrency(transaction.debit)}
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs">
                      {editingIndex === actualIndex ? (
                        <input
                          type="number"
                          step="0.01"
                          value={transaction.credit}
                          onChange={(e) =>
                            handleFieldChange(
                              pageIndex,
                              "credit",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <span className="text-gray-900">
                          {formatCurrency(transaction.credit)}
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs">
                      {editingIndex === actualIndex ? (
                        <select
                          value={transaction.type}
                          onChange={(e) =>
                            handleFieldChange(
                              pageIndex,
                              "type",
                              e.target.value as "CREDIT" | "DEBIT"
                            )
                          }
                          className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="CREDIT">CREDIT</option>
                          <option value="DEBIT">DEBIT</option>
                        </select>
                      ) : (
                        <span
                          className={`px-1 py-0.5 rounded text-[10px] font-semibold ${
                            transaction.type === "CREDIT"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">
                      {formatCurrency(transaction.balance)}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs">
                      {editingIndex === actualIndex ? (
                        <input
                          type="number"
                          value={transaction.tellerNo || ""}
                          onChange={(e) =>
                            handleFieldChange(
                              pageIndex,
                              "tellerNo",
                              e.target.value ? parseInt(e.target.value) : undefined
                            )
                          }
                          className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <span className="text-gray-900">
                          {transaction.tellerNo || "N/A"}
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs">
                      {editingIndex === actualIndex ? (
                        <input
                          type="number"
                          value={transaction.chequeNo || ""}
                          onChange={(e) =>
                            handleFieldChange(
                              pageIndex,
                              "chequeNo",
                              e.target.value ? parseInt(e.target.value) : undefined
                            )
                          }
                          className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <span className="text-gray-900">
                          {transaction.chequeNo || "N/A"}
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs">
                      {editingIndex === actualIndex ? (
                        <select
                          value={transaction.classificationId || ""}
                          onChange={(e) =>
                            handleFieldChange(
                              pageIndex,
                              "classificationId",
                              e.target.value || undefined
                            )
                          }
                          className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                          disabled={loadingClassifications}
                        >
                          <option value="">Select Classification</option>
                          {classifications.map((classification) => (
                            <option key={classification.id} value={classification.id}>
                              {classification.code} - {classification.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex flex-col">
                          {transaction.classificationId ? (
                            <span className="text-gray-900">
                              {(() => {
                                const classification = classifications.find(
                                  (c) => c.id === transaction.classificationId
                                );
                                return classification
                                  ? `${classification.code} - ${classification.label}`
                                  : "Loading...";
                              })()}
                            </span>
                          ) : (
                            <span className="text-gray-500 italic">No classification</span>
                          )}
                          <button
                            onClick={() => handleEdit(pageIndex)}
                            className="text-[10px] text-blue-600 hover:text-blue-800 mt-0.5 text-left"
                            title="Click Edit to change classification"
                          >
                            Change
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs">
                      {editingIndex === actualIndex ? (
                        <button
                          onClick={() => handleSave(pageIndex)}
                          className="text-green-600 hover:text-green-800 focus:outline-none"
                          title="Save"
                        >
                          <FiSave className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(pageIndex)}
                          className="text-blue-600 hover:text-blue-800 focus:outline-none"
                          title="Edit"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
            <span className="text-xs text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, transactions.length)} of {transactions.length} transactions
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 text-xs text-gray-700 bg-gray-200 hover:bg-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <FiChevronLeft className="h-3 w-3 mr-1" />
              Previous
            </button>
            <span className="text-xs text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 text-xs text-gray-700 bg-gray-200 hover:bg-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              Next
              <FiChevronRight className="h-3 w-3 ml-1" />
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Transactions"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionPreviewModal;

