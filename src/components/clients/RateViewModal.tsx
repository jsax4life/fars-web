"use client";

import React, { useEffect, useState } from "react";
import { useRates, type RateSummary } from "@/hooks/useRates";
import { FiX, FiEye, FiDownload, FiLink, FiMinus } from "react-icons/fi";

interface RateViewModalProps {
  rateId: string;
  isOpen: boolean;
  onClose: () => void;
}

const RateViewModal: React.FC<RateViewModalProps> = ({ rateId, isOpen, onClose }) => {
  const { getRateById, getRateDocuments, getAllContractDocuments, assignRateToDocument, unassignRateFromDocument } = useRates();
  const [rate, setRate] = useState<RateSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [availableDocuments, setAvailableDocuments] = useState<any[]>([]);
  const [loadingAvailableDocuments, setLoadingAvailableDocuments] = useState(false);
  const [assigningDocumentId, setAssigningDocumentId] = useState<string | null>(null);

  const loadDocuments = async () => {
    if (!rateId) return;
    setLoadingDocuments(true);
    try {
      // Fetch only documents assigned to this rate
      const docs = await getRateDocuments(rateId);
      if (docs) setDocuments(docs);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const loadAvailableDocuments = async (assignedDocs: any[] = documents) => {
    if (!rateId) return;
    setLoadingAvailableDocuments(true);
    try {
      // Fetch all documents
      const allDocs = await getAllContractDocuments();
      if (allDocs) {
        // Create sets of assigned document IDs and codes for efficient filtering
        const assignedDocIds = new Set(assignedDocs.map(doc => doc.id));
        const assignedDocCodes = new Set(assignedDocs.map(doc => doc.code).filter(Boolean));
        
        // Filter out documents that are already assigned to this rate
        const available = allDocs.filter((doc: any) => {
          // Check if document ID is already in the assigned documents list
          if (assignedDocIds.has(doc.id)) return false;
          
          // Check if document code is already in the assigned documents list
          if (doc.code && assignedDocCodes.has(doc.code)) return false;
          
          // Check if document has rates array containing current rate
          if (doc.rates && Array.isArray(doc.rates)) {
            const isAssigned = doc.rates.some((r: any) => {
              // Check by rate ID
              if (r.id === rateId || r === rateId) return true;
              // Check if rate object has id property matching
              if (typeof r === 'object' && r.id === rateId) return true;
              return false;
            });
            if (isAssigned) return false;
          }
          
          // Check if document has rateId matching current rate
          if (doc.rateId === rateId) return false;
          
          return true;
        });
        setAvailableDocuments(available);
      }
    } catch (error) {
      console.error('Failed to load available documents:', error);
    } finally {
      setLoadingAvailableDocuments(false);
    }
  };

  useEffect(() => {
    if (isOpen && rateId) {
      let cancelled = false;
      const load = async () => {
        setLoading(true);
        try {
          const res = await getRateById(rateId);
          if (!cancelled && res) {
            setRate(res);
            // Load documents for this rate
            const assignedDocs = await getRateDocuments(rateId);
            if (!cancelled) {
              // Always set documents (even if empty array or undefined)
              setDocuments(assignedDocs || []);
              // Always load available documents, even if there are no assigned documents
              await loadAvailableDocuments(assignedDocs || []);
            }
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      };
      load();
      return () => { cancelled = true; };
    } else {
      setRate(null);
      setShowMore(false);
      setDocuments([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, rateId]);

  // Check if a document is assigned to the current rate
  const isDocumentAssigned = (doc: any): boolean => {
    // Check if document has rateId matching current rate
    if (doc.rateId === rateId) return true;
    // Check if document has rates array containing current rate
    if (doc.rates && Array.isArray(doc.rates)) {
      return doc.rates.some((r: any) => r.id === rateId || r === rateId);
    }
    return false;
  };

  const handleAssignRate = async (documentId: string) => {
    if (!rateId) return;
    setAssigningDocumentId(documentId);
    try {
      await assignRateToDocument(documentId, rateId);
      // Reload both assigned and available documents to reflect the change
      const assignedDocs = await getRateDocuments(rateId);
      if (assignedDocs) {
        setDocuments(assignedDocs);
        await loadAvailableDocuments(assignedDocs);
      }
    } catch (error) {
      console.error('Failed to assign rate:', error);
    } finally {
      setAssigningDocumentId(null);
    }
  };

  const handleUnassignRate = async (documentId: string) => {
    if (!rateId) return;
    setAssigningDocumentId(documentId);
    try {
      await unassignRateFromDocument(documentId, rateId);
      // Reload both assigned and available documents to reflect the change
      const assignedDocs = await getRateDocuments(rateId);
      if (assignedDocs) {
        setDocuments(assignedDocs);
        await loadAvailableDocuments(assignedDocs);
      }
    } catch (error) {
      console.error('Failed to unassign rate:', error);
    } finally {
      setAssigningDocumentId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center md:ml-64 z-[9999] p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="text-lg font-bold text-gray-900">Rate Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-40">Loading...</div>
          ) : rate ? (
            <>
              <div className="bg-white rounded-lg w-full shadow p-4 md:p-6 mb-6">
                {/* Overview */}
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm text-gray-700">
                  <div className="flex items-start gap-2"><dt className="min-w-[140px] text-gray-500">Code</dt><dd className="font-medium text-gray-800">{rate.code}</dd></div>
                  <div className="flex items-start gap-2"><dt className="min-w-[140px] text-gray-500">Client</dt><dd className="font-medium text-gray-800">{rate.client?.companyName || [rate.client?.firstName, rate.client?.lastName].filter(Boolean).join(' ') || '-'}</dd></div>
                  <div className="flex items-start gap-2"><dt className="min-w-[140px] text-gray-500">Currency</dt><dd className="font-medium text-gray-800">{rate.currency || '-'}</dd></div>
                  <div className="flex items-start gap-2"><dt className="min-w-[140px] text-gray-500">Rate Type</dt><dd className="font-medium text-gray-800">{rate.rateType || '-'}</dd></div>
                  <div className="flex items-start gap-2"><dt className="min-w-[140px] text-gray-500">Effective From</dt><dd className="font-medium text-gray-800">{rate.effectiveFrom ? new Date(rate.effectiveFrom).toLocaleDateString() : '-'}</dd></div>
                  <div className="flex items-start gap-2"><dt className="min-w-[140px] text-gray-500">Effective To</dt><dd className="font-medium text-gray-800">{rate.effectiveTo ? new Date(rate.effectiveTo).toLocaleDateString() : '-'}</dd></div>
                  <div className="flex items-start gap-2"><dt className="min-w-[140px] text-gray-500">Created</dt><dd className="font-medium text-gray-800">{rate.createdAt ? new Date(rate.createdAt).toLocaleString() : '-'}</dd></div>
                  <div className="flex items-start gap-2"><dt className="min-w-[140px] text-gray-500">Updated</dt><dd className="font-medium text-gray-800">{rate.updatedAt ? new Date(rate.updatedAt).toLocaleString() : '-'}</dd></div>
                </dl>

                <div className="mt-6">
                  <button
                    onClick={() => setShowMore(v => !v)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700"
                  >
                    <span>{showMore ? 'Hide details' : 'Show more details'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showMore ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd"/></svg>
                  </button>
                </div>

                {showMore && (
                  <>
                    {/* Scalars */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700 mt-6">
                      <div><span className="font-medium">CAMF Rate:</span> {rate.camfRate ?? '-'}</div>
                      <div><span className="font-medium">Return Charge Rate:</span> {rate.returnChargeRate ?? '-'}</div>
                      <div><span className="font-medium">Return Charge Limit:</span> {rate.returnChargeLimit ?? '-'}</div>
                      <div><span className="font-medium">COT Covenant Rate:</span> {rate.cotCovenantRate ?? '-'}</div>
                      <div><span className="font-medium">COT Off Cover Rate:</span> {rate.cotOffCoverRate ?? '-'}</div>
                      <div><span className="font-medium">COT OIC Rate:</span> {rate.cotOICRate ?? '-'}</div>
                      <div><span className="font-medium">Turnover Limit:</span> {rate.turnoverLimit ?? '-'}</div>
                      <div><span className="font-medium">COT Covenant Frequency:</span> {rate.cotCovenantFrequency ?? '-'}</div>
                      <div><span className="font-medium">Charge COT On Shortfall:</span> {rate.chargeCOTOnShortfall ? 'Yes' : (rate.chargeCOTOnShortfall === false ? 'No' : '-')}</div>
                      <div><span className="font-medium">Debit Rate:</span> {rate.debitRate ?? '-'}</div>
                      <div><span className="font-medium">Excess Rate:</span> {rate.excessRate ?? '-'}</div>
                      <div><span className="font-medium">Excess Rate Type:</span> {rate.excessRateType ?? '-'}</div>
                      <div><span className="font-medium">VAT Rate:</span> {rate.vatRate ?? '-'}</div>
                      <div><span className="font-medium">WHT Rate:</span> {rate.whtRate ?? '-'}</div>
                    </div>

                    {/* Arrays */}
                    {[
                      { title: 'Debit Rates', data: rate.drRates },
                      { title: 'Loan Interest Rates', data: rate.loanInterestRates },
                      { title: 'LC Commissions', data: rate.lcCommissions },
                      { title: 'Pre-Negotiation Rates', data: rate.preNegotiationRates },
                      { title: 'Post-Negotiation Rates', data: rate.postNegotiationRates },
                      { title: 'Credit Interest Rates', data: rate.creditInterestRates },
                    ].map((section, idx) => (
                      <div key={idx} className="mt-8">
                        <h3 className="font-semibold text-gray-800 mb-3">{section.title}</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective From</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective To</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {(section.data || []).map((r, i) => (
                                <tr key={i}>
                                  <td className="px-3 py-2 text-sm text-gray-700">{r.rate}</td>
                                  <td className="px-3 py-2 text-sm text-gray-700">{new Date(r.effectiveFrom).toLocaleDateString()}</td>
                                  <td className="px-3 py-2 text-sm text-gray-700">{new Date(r.effectiveTo).toLocaleDateString()}</td>
                                </tr>
                              ))}
                              {(!section.data || section.data.length === 0) && (
                                <tr>
                                  <td colSpan={3} className="px-3 py-4 text-center text-gray-500 text-sm">No entries</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* Assigned Documents Section */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4 text-lg">Assigned Documents</h3>
                  {loadingDocuments ? (
                    <div className="text-center text-gray-500 py-4">Loading documents...</div>
                  ) : documents.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {documents.map((doc) => (
                            <tr key={doc.id}>
                              <td className="px-4 py-3 text-sm text-gray-700">{doc.code || '-'}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{doc.title || '-'}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{doc.type || '-'}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : '-'}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex items-center gap-3 flex-wrap">
                                  {doc.url && (
                                    <>
                                      <button
                                        onClick={() => window.open(doc.url, '_blank')}
                                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700"
                                        title="View document"
                                      >
                                        <FiEye className="h-4 w-4" />
                                        <span>View</span>
                                      </button>
                                      <button
                                        onClick={async () => {
                                          try {
                                            const response = await fetch(doc.url);
                                            const blob = await response.blob();
                                            const url = window.URL.createObjectURL(blob);
                                            const link = document.createElement('a');
                                            link.href = url;
                                            link.download = doc.title || doc.code || 'document';
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                            window.URL.revokeObjectURL(url);
                                          } catch (error) {
                                            console.error('Failed to download document:', error);
                                            window.open(doc.url, '_blank');
                                          }
                                        }}
                                        className="inline-flex items-center gap-1 text-green-600 hover:text-green-700"
                                        title="Download document"
                                      >
                                        <FiDownload className="h-4 w-4" />
                                        <span>Download</span>
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() => handleUnassignRate(doc.id)}
                                    disabled={assigningDocumentId === doc.id}
                                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Unassign rate from document"
                                  >
                                    <FiMinus className="h-4 w-4" />
                                    <span>{assigningDocumentId === doc.id ? 'Unassigning...' : 'Unassign'}</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">No documents assigned to this rate.</div>
                  )}
                </div>

                {/* Assign Documents Section */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4 text-lg">Assign New Documents</h3>
                  {loadingAvailableDocuments ? (
                    <div className="text-center text-gray-500 py-4">Loading available documents...</div>
                  ) : availableDocuments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {availableDocuments.map((doc) => (
                            <tr key={doc.id}>
                              <td className="px-4 py-3 text-sm text-gray-700">{doc.code || '-'}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{doc.title || '-'}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{doc.type || '-'}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : '-'}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex items-center gap-3 flex-wrap">
                                  {doc.url && (
                                    <>
                                      <button
                                        onClick={() => window.open(doc.url, '_blank')}
                                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700"
                                        title="View document"
                                      >
                                        <FiEye className="h-4 w-4" />
                                        <span>View</span>
                                      </button>
                                      <button
                                        onClick={async () => {
                                          try {
                                            const response = await fetch(doc.url);
                                            const blob = await response.blob();
                                            const url = window.URL.createObjectURL(blob);
                                            const link = document.createElement('a');
                                            link.href = url;
                                            link.download = doc.title || doc.code || 'document';
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                            window.URL.revokeObjectURL(url);
                                          } catch (error) {
                                            console.error('Failed to download document:', error);
                                            window.open(doc.url, '_blank');
                                          }
                                        }}
                                        className="inline-flex items-center gap-1 text-green-600 hover:text-green-700"
                                        title="Download document"
                                      >
                                        <FiDownload className="h-4 w-4" />
                                        <span>Download</span>
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() => handleAssignRate(doc.id)}
                                    disabled={assigningDocumentId === doc.id}
                                    className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Assign rate to document"
                                  >
                                    <FiLink className="h-4 w-4" />
                                    <span>{assigningDocumentId === doc.id ? 'Assigning...' : 'Assign'}</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">No available documents to assign.</div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">Rate not found.</div>
          )}
        </div>
        <div className="flex justify-end p-6 border-t border-gray-200 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RateViewModal;

