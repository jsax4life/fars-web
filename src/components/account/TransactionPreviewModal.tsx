"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/utility/Modal";
import { TransactionPreview, TransactionCreatePayload, useTransactions } from "@/hooks/useTransactions";
import { useClassifications } from "@/hooks/useClassification";
import { FiX, FiEdit2, FiSave } from "react-icons/fi";

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
  const { getClassifications } = useClassifications();
  const { createTransactions } = useTransactions();

  useEffect(() => {
    setTransactions(initialTransactions);
  }, [initialTransactions]);

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

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleSave = (index: number) => {
    setEditingIndex(null);
  };

  const handleFieldChange = (
    index: number,
    field: keyof TransactionPreview,
    value: any
  ) => {
    const updated = [...transactions];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setTransactions(updated);
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-7xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-4 pb-4 border-b">
          <h2 className="text-xl font-semibold text-gray-700">
            Transaction Preview ({transactions.length} transactions)
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-auto mb-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Row
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trans Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Debit
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credit
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teller No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cheque No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Classification
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction, index) => (
                  <tr
                    key={index}
                    className={editingIndex === index ? "bg-yellow-50" : ""}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {String(transaction.rowIndex)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {editingIndex === index ? (
                        <input
                          type="date"
                          value={transaction.transactionDate}
                          onChange={(e) =>
                            handleFieldChange(index, "transactionDate", e.target.value)
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <span className="text-gray-900">
                          {formatDate(transaction.transactionDate)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {editingIndex === index ? (
                        <input
                          type="date"
                          value={transaction.valueDate}
                          onChange={(e) =>
                            handleFieldChange(index, "valueDate", e.target.value)
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <span className="text-gray-900">
                          {formatDate(transaction.valueDate)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {editingIndex === index ? (
                        <input
                          type="text"
                          value={transaction.description}
                          onChange={(e) =>
                            handleFieldChange(index, "description", e.target.value)
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <span className="text-gray-900">{transaction.description}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {editingIndex === index ? (
                        <input
                          type="number"
                          step="0.01"
                          value={transaction.debit}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "debit",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <span className="text-gray-900">
                          {formatCurrency(transaction.debit)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {editingIndex === index ? (
                        <input
                          type="number"
                          step="0.01"
                          value={transaction.credit}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "credit",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <span className="text-gray-900">
                          {formatCurrency(transaction.credit)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {editingIndex === index ? (
                        <select
                          value={transaction.type}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "type",
                              e.target.value as "CREDIT" | "DEBIT"
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="CREDIT">CREDIT</option>
                          <option value="DEBIT">DEBIT</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            transaction.type === "CREDIT"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(transaction.balance)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {editingIndex === index ? (
                        <input
                          type="number"
                          value={transaction.tellerNo || ""}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "tellerNo",
                              e.target.value ? parseInt(e.target.value) : undefined
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <span className="text-gray-900">
                          {transaction.tellerNo || "N/A"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {editingIndex === index ? (
                        <input
                          type="number"
                          value={transaction.chequeNo || ""}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "chequeNo",
                              e.target.value ? parseInt(e.target.value) : undefined
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <span className="text-gray-900">
                          {transaction.chequeNo || "N/A"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {editingIndex === index ? (
                        <select
                          value={transaction.classificationId || ""}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "classificationId",
                              e.target.value || undefined
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                            onClick={() => handleEdit(index)}
                            className="text-xs text-blue-600 hover:text-blue-800 mt-1 text-left"
                            title="Click Edit to change classification"
                          >
                            Change
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {editingIndex === index ? (
                        <button
                          onClick={() => handleSave(index)}
                          className="text-green-600 hover:text-green-800 focus:outline-none"
                          title="Save"
                        >
                          <FiSave className="h-5 w-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(index)}
                          className="text-blue-600 hover:text-blue-800 focus:outline-none"
                          title="Edit"
                        >
                          <FiEdit2 className="h-5 w-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

