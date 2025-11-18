"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AccountTransaction, TransactionsResponse, useTransactions } from "@/hooks/useTransactions";
import { useClassifications } from "@/hooks/useClassification";
import { FiMoreVertical, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import Modal from "@/components/utility/Modal";

interface AccountTransactionsProps {
  accountId: string;
}

interface Classification {
  id: string;
  code: string;
  label: string;
  category: string;
}

const AccountTransactions: React.FC<AccountTransactionsProps> = ({ accountId }) => {
  const { getAccountTransactions, getTransactionById, updateTransaction, deleteTransaction } = useTransactions();
  const { getClassifications } = useClassifications();
  const [transactions, setTransactions] = useState<AccountTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [meta, setMeta] = useState<TransactionsResponse["meta"] | null>(null);
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<AccountTransaction | null>(null);
  const [loadingTransaction, setLoadingTransaction] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const actionButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  
  // Form state for update
  const [updateFormData, setUpdateFormData] = useState<Partial<AccountTransaction>>({});

  useEffect(() => {
    if (accountId) {
      loadTransactions();
      loadClassifications();
    }
  }, [accountId, page]);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        openActionMenuId &&
        actionMenuRef.current &&
        !actionMenuRef.current.contains(target) &&
        !Object.values(actionButtonRefs.current).some(
          (ref) => ref && ref && ref.contains(target)
        )
      ) {
        setOpenActionMenuId(null);
      }
    };

    if (openActionMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [openActionMenuId]);

  const loadTransactions = async () => {
    if (!accountId) return;
    
    setLoading(true);
    try {
      const response = await getAccountTransactions(accountId, {
        page,
        limit,
      });
      if (response) {
        setTransactions(response.data);
        setMeta(response.meta);
      }
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadClassifications = async () => {
    try {
      const data = await getClassifications();
      if (Array.isArray(data)) {
        setClassifications(data);
      }
    } catch (error) {
      console.error("Failed to load classifications:", error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getClassificationLabel = (classificationId: string) => {
    const classification = classifications.find((c) => c.id === classificationId);
    return classification ? `${classification.code} - ${classification.label}` : "N/A";
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (meta?.pages || 1)) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleActionMenu = (transactionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newId = openActionMenuId === transactionId ? null : transactionId;
    setOpenActionMenuId(newId);
  };

  const getPopupPosition = (transactionId: string) => {
    const button = actionButtonRefs.current[transactionId];
    if (!button) return { top: 0, left: 0 };

    const rect = button.getBoundingClientRect();
    return {
      top: rect.bottom + 4,
      left: rect.left,
      position: 'fixed' as const,
    };
  };

  const handleViewTransaction = async (transactionId: string) => {
    setLoadingTransaction(true);
    setOpenActionMenuId(null);
    try {
      const transaction = await getTransactionById(transactionId);
      if (transaction) {
        setSelectedTransaction(transaction);
        setShowViewModal(true);
      }
    } catch (error) {
      console.error("Failed to load transaction:", error);
    } finally {
      setLoadingTransaction(false);
    }
  };

  const handleOpenUpdateModal = async (transactionId: string) => {
    setLoadingTransaction(true);
    setOpenActionMenuId(null);
    try {
      const transaction = await getTransactionById(transactionId);
      if (transaction) {
        setSelectedTransaction(transaction);
        setUpdateFormData({
          description: transaction.description,
          transactionDate: transaction.transactionDate.split('T')[0],
          valueDate: transaction.valueDate.split('T')[0],
          amount: transaction.amount,
          type: transaction.type,
          tellerNo: transaction.tellerNo,
          chequeNo: transaction.chequeNo,
          reference: transaction.reference,
          classificationId: transaction.classificationId,
          isReversal: transaction.isReversal,
        });
        setShowUpdateModal(true);
      }
    } catch (error) {
      console.error("Failed to load transaction:", error);
    } finally {
      setLoadingTransaction(false);
    }
  };

  const handleUpdateSubmit = async () => {
    if (!selectedTransaction) return;

    setIsUpdating(true);
    try {
      const updated = await updateTransaction(selectedTransaction.id, updateFormData);
      if (updated) {
        // Refresh transactions list
        await loadTransactions();
        setShowUpdateModal(false);
        setSelectedTransaction(null);
        setUpdateFormData({});
      }
    } catch (error) {
      console.error("Failed to update transaction:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = (transactionId: string) => {
    setDeletingTransactionId(transactionId);
    setShowDeleteConfirm(true);
    setOpenActionMenuId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTransactionId) return;

    setIsDeleting(true);
    try {
      const success = await deleteTransaction(deletingTransactionId);
      if (success) {
        // Refresh transactions list
        await loadTransactions();
        setShowDeleteConfirm(false);
        setDeletingTransactionId(null);
      }
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading transactions...</div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">No transactions found</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">
          Account Transactions
        </h3>
        {meta && (
          <div className="text-sm text-gray-500">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, meta.total)} of {meta.total} transactions
          </div>
        )}
      </div>

      <div className="overflow-x-auto relative z-0">
        <div className="max-h-[calc(100vh-400px)] overflow-y-auto relative z-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teller No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cheque No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Classification
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reversal
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(transaction.transactionDate)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(transaction.valueDate)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate" title={transaction.description}>
                    {transaction.description}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        transaction.type === "CREDIT"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                    {formatCurrency(transaction.balance)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {transaction.tellerNo || "N/A"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {transaction.chequeNo || "N/A"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {transaction.reference || "N/A"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {transaction.classificationId
                      ? getClassificationLabel(transaction.classificationId)
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {transaction.isReversal ? (
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-800">
                        Yes
                      </span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm relative">
                    <button
                      type="button"
                      ref={(el) => {
                        if (transaction.id) actionButtonRefs.current[transaction.id] = el;
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleActionMenu(transaction.id, e);
                      }}
                      className="inline-flex items-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                      title="Actions"
                    >
                      <FiMoreVertical className="h-5 w-5" />
                    </button>
                    {openActionMenuId === transaction.id && typeof window !== 'undefined' && createPortal(
                      <div
                        ref={actionMenuRef}
                        onClick={(e) => e.stopPropagation()}
                        className="fixed z-[99999] mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                        style={getPopupPosition(transaction.id)}
                      >
                        <div className="py-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleViewTransaction(transaction.id);
                            }}
                            disabled={loadingTransaction}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left disabled:opacity-50"
                          >
                            <FiEye className="h-4 w-4" />
                            View
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleOpenUpdateModal(transaction.id);
                            }}
                            disabled={loadingTransaction}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left disabled:opacity-50"
                          >
                            <FiEdit className="h-4 w-4" />
                            Update
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteClick(transaction.id);
                            }}
                            disabled={loadingTransaction}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left disabled:opacity-50"
                          >
                            <FiTrash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>,
                      document.body
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {meta && meta.pages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === meta.pages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{page}</span> of{" "}
                <span className="font-medium">{meta.pages}</span>
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                {Array.from({ length: Math.min(5, meta.pages) }, (_, i) => {
                  let pageNum;
                  if (meta.pages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= meta.pages - 2) {
                    pageNum = meta.pages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        pageNum === page
                          ? "z-10 bg-orange-500 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                          : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === meta.pages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* View Transaction Modal */}
      {showViewModal && selectedTransaction && (
        <Modal isOpen={showViewModal} onClose={() => {
          setShowViewModal(false);
          setSelectedTransaction(null);
        }}>
          <div className="w-full max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Transaction Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Transaction Date</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedTransaction.transactionDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Value Date</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedTransaction.valueDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="mt-1">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      selectedTransaction.type === "CREDIT"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {selectedTransaction.type}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <p className="mt-1 text-sm text-gray-900 font-medium">{formatCurrency(selectedTransaction.amount)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Balance</label>
                  <p className="mt-1 text-sm text-gray-900 font-medium">{formatCurrency(selectedTransaction.balance)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Is Reversal</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedTransaction.isReversal ? "Yes" : "No"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Teller No</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedTransaction.tellerNo || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cheque No</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedTransaction.chequeNo || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reference</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedTransaction.reference || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Classification</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedTransaction.classificationId
                      ? getClassificationLabel(selectedTransaction.classificationId)
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="mt-1 text-sm text-gray-900">{selectedTransaction.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created At</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDateTime(selectedTransaction.createdAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Updated At</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDateTime(selectedTransaction.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Update Transaction Modal */}
      {showUpdateModal && selectedTransaction && (
        <Modal isOpen={showUpdateModal} onClose={() => {
          setShowUpdateModal(false);
          setSelectedTransaction(null);
          setUpdateFormData({});
        }}>
          <div className="w-full max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Update Transaction</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Date</label>
                  <input
                    type="date"
                    value={updateFormData.transactionDate || ''}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, transactionDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value Date</label>
                  <input
                    type="date"
                    value={updateFormData.valueDate || ''}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, valueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={updateFormData.type || ''}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, type: e.target.value as "CREDIT" | "DEBIT" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="CREDIT">CREDIT</option>
                    <option value="DEBIT">DEBIT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={updateFormData.amount || ''}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teller No</label>
                  <input
                    type="number"
                    value={updateFormData.tellerNo || ''}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, tellerNo: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cheque No</label>
                  <input
                    type="number"
                    value={updateFormData.chequeNo || ''}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, chequeNo: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                  <input
                    type="text"
                    value={updateFormData.reference || ''}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, reference: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Classification</label>
                  <select
                    value={updateFormData.classificationId || ''}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, classificationId: e.target.value || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Classification</option>
                    {classifications.map((classification) => (
                      <option key={classification.id} value={classification.id}>
                        {classification.code} - {classification.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={updateFormData.description || ''}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isReversal"
                  checked={updateFormData.isReversal || false}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, isReversal: e.target.checked })}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="isReversal" className="ml-2 block text-sm text-gray-700">
                  Is Reversal
                </label>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedTransaction(null);
                    setUpdateFormData({});
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSubmit}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? "Updating..." : "Update Transaction"}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <Modal isOpen={showDeleteConfirm} onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingTransactionId(null);
        }}>
          <div className="w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Delete Transaction</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this transaction? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletingTransactionId(null);
                }}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AccountTransactions;

