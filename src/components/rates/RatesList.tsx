"use client";

import React, { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/utility/Sidebar";
import Navbar from "@/components/nav/Navbar";
import { useRates, type RateSummary } from "@/hooks/useRates";
import Link from "next/link";
import { FiX, FiUpload, FiEye, FiDownload, FiEdit, FiTrash2, FiMoreVertical } from "react-icons/fi";

const RatesList = () => {
  const { getRates, deleteRate, uploadRateDocument, getAllContractDocuments, getDocumentById, updateRateDocument, deleteRateDocument } = useRates();
  const [activeTab, setActiveTab] = useState<'rates' | 'documents'>('rates');
  const [rates, setRates] = useState<RateSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null);
  
  // Document upload state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [selectedRateIds, setSelectedRateIds] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Document management state
  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  
  // Document edit state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editSelectedRateIds, setEditSelectedRateIds] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loadingDocumentDetails, setLoadingDocumentDetails] = useState(false);
  
  // Document action menu state
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [showDeleteDocumentConfirm, setShowDeleteDocumentConfirm] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const actionButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await getRates();
        if (!cancelled && Array.isArray(res)) setRates(res);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (activeTab === 'documents') {
      let cancelled = false;
      const loadDocuments = async () => {
        setLoadingDocuments(true);
        try {
          const res = await getAllContractDocuments();
          if (!cancelled && Array.isArray(res)) setDocuments(res);
        } finally {
          if (!cancelled) setLoadingDocuments(false);
        }
      };
      loadDocuments();
      return () => { cancelled = true; };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setOpenActionMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const minimalRate = (r?: { rate: number; effectiveFrom: string; effectiveTo: string }[] ) => {
    if (!r || r.length === 0) return { rate: '-', from: '-', to: '-' };
    const it = r[0];
    return { rate: it.rate, from: it.effectiveFrom, to: it.effectiveTo };
  };

  const handleDelete = async () => {
    if (!selectedRateId) return;
    setShowDeleteConfirm(false);
    setLoading(true);
    try {
      const res = await deleteRate(selectedRateId);
      if (res) {
        // Remove the deleted rate from the list
        setRates(rates.filter(rate => rate.id !== selectedRateId));
        // Reload rates to ensure consistency
        const updatedRates = await getRates();
        if (updatedRates) setRates(updatedRates);
      }
    } finally {
      setLoading(false);
      setSelectedRateId(null);
    }
  };

  const openDeleteConfirm = (rateId: string) => {
    setSelectedRateId(rateId);
    setShowDeleteConfirm(true);
  };

  const openUploadModal = () => {
    setShowUploadModal(true);
    setUploadTitle("");
    setUploadFile(null);
    setSelectedRateIds([]);
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setUploadTitle("");
    setUploadFile(null);
    setSelectedRateIds([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleRateToggle = (rateId: string) => {
    setSelectedRateIds((prev) =>
      prev.includes(rateId)
        ? prev.filter((id) => id !== rateId)
        : [...prev, rateId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRateIds.length === rates.length) {
      setSelectedRateIds([]);
    } else {
      setSelectedRateIds(rates.map((rate) => rate.id));
    }
  };

  const handleUploadDocument = async () => {
    if (!uploadTitle.trim()) {
      alert("Please enter a document title");
      return;
    }
    if (!uploadFile) {
      alert("Please select a file to upload");
      return;
    }
    if (selectedRateIds.length === 0) {
      alert("Please select at least one rate");
      return;
    }

    setIsUploading(true);
    try {
      await uploadRateDocument(uploadTitle, uploadFile, selectedRateIds);
      closeUploadModal();
      // Reload documents if on documents tab
      if (activeTab === 'documents') {
        const res = await getAllContractDocuments();
        if (Array.isArray(res)) setDocuments(res);
      }
    } catch (error) {
      console.error("Error uploading document:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const openEditModal = async (doc: any) => {
    setEditingDocument(doc);
    setEditTitle(doc.title || "");
    setEditFile(null);
    setLoadingDocumentDetails(true);
    setShowEditModal(true);
    
    // Fetch document details including rates
    try {
      const documentDetails = await getDocumentById(doc.id);
      if (documentDetails) {
        // Update the editing document with full details
        setEditingDocument(documentDetails);
        setEditTitle(documentDetails.title || doc.title || "");
        
        // Pre-populate selected rate IDs from the rates array
        if (documentDetails.rates && Array.isArray(documentDetails.rates)) {
          const rateIds = documentDetails.rates.map((rate: any) => rate.id);
          setEditSelectedRateIds(rateIds);
        } else {
          setEditSelectedRateIds([]);
        }
      } else {
        setEditSelectedRateIds([]);
      }
    } catch (error) {
      console.error("Error fetching document details:", error);
      setEditSelectedRateIds([]);
    } finally {
      setLoadingDocumentDetails(false);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingDocument(null);
    setEditTitle("");
    setEditFile(null);
    setEditSelectedRateIds([]);
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setEditFile(e.target.files[0]);
    }
  };

  const handleEditRateToggle = (rateId: string) => {
    setEditSelectedRateIds((prev) =>
      prev.includes(rateId)
        ? prev.filter((id) => id !== rateId)
        : [...prev, rateId]
    );
  };

  const handleSelectAllEdit = () => {
    if (editSelectedRateIds.length === rates.length) {
      setEditSelectedRateIds([]);
    } else {
      setEditSelectedRateIds(rates.map((rate) => rate.id));
    }
  };

  const handleUpdateDocument = async () => {
    if (!editingDocument) return;
    if (!editTitle.trim()) {
      alert("Please enter a document title");
      return;
    }
    if (editSelectedRateIds.length === 0) {
      alert("Please select at least one rate");
      return;
    }

    setIsUpdating(true);
    try {
      await updateRateDocument(editingDocument.id, editTitle, editFile, editSelectedRateIds);
      closeEditModal();
      // Reload documents
      const res = await getAllContractDocuments();
      if (Array.isArray(res)) setDocuments(res);
    } catch (error) {
      console.error("Error updating document:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleActionMenu = (docId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setOpenActionMenuId(openActionMenuId === docId ? null : docId);
  };

  const handleDeleteDocument = async () => {
    if (!selectedDocumentId) return;
    setShowDeleteDocumentConfirm(false);
    setLoadingDocuments(true);
    try {
      await deleteRateDocument(selectedDocumentId);
      // Reload documents
      const res = await getAllContractDocuments();
      if (Array.isArray(res)) setDocuments(res);
    } catch (error) {
      console.error("Error deleting document:", error);
    } finally {
      setLoadingDocuments(false);
      setSelectedDocumentId(null);
    }
  };

  const openDeleteDocumentConfirm = (docId: string) => {
    setSelectedDocumentId(docId);
    setShowDeleteDocumentConfirm(true);
    setOpenActionMenuId(null);
  };

  const getPopupPosition = (docId: string) => {
    const button = actionButtonRefs.current[docId];
    if (!button) return { top: 0, left: 0 };

    const rect = button.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY,
      left: rect.right + window.scrollX - 130,
    };
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 md:ml-64 md:mt-0">
        <div className="mb-4"><Navbar /></div>
        <main className="p-4 sm:p-6 lg:p-8 pt-32 md:pt-32">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[#363636] text-lg md:text-xl font-semibold">Rate Management</h2>
            {activeTab === 'rates' && (
              <div className="flex gap-3">
                <button
                  onClick={openUploadModal}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiUpload className="mr-2" />
                  Upload Document
                </button>
                <Link
                  href="/Rates/New"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Create Rate
                </Link>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('rates')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'rates'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Rates Management
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'documents'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Document Management
              </button>
            </nav>
          </div>

          {/* Rates Tab Content */}
          {activeTab === 'rates' && (
            <>
              {loading ? (
            <div className="flex items-center justify-center h-40">Loading rates...</div>
          ) : (
            <div className="bg-white rounded-lg w-full shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DR Rate</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective From</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective To</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rates.map((rate) => {
                      const dr = minimalRate(rate.drRates);
                      const clientName = rate.client?.companyName || [rate.client?.firstName, rate.client?.lastName].filter(Boolean).join(' ') || '-';
                      return (
                        <tr key={rate.id}>
                          <td className="px-3 py-3 text-sm text-gray-700">{rate.code}</td>
                          <td className="px-3 py-3 text-sm text-gray-700">{clientName}</td>
                          <td className="px-3 py-3 text-sm text-gray-700">{rate.currency || '-'}</td>
                          <td className="px-3 py-3 text-sm text-gray-700">{dr.rate}</td>
                          <td className="px-3 py-3 text-sm text-gray-700">{dr.from ? new Date(dr.from).toLocaleDateString() : '-'}</td>
                          <td className="px-3 py-3 text-sm text-gray-700">{dr.to ? new Date(dr.to).toLocaleDateString() : '-'}</td>
                          <td className="px-3 py-3 text-right text-sm">
                            <div className="flex items-center justify-end gap-3">
                              <Link href={`/Rates/${rate.id}`} className="text-orange-600 hover:text-orange-700">View</Link>
                              <button
                                onClick={() => openDeleteConfirm(rate.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {rates.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-3 py-6 text-center text-gray-500 text-sm">No rates found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
            </>
          )}

          {/* Documents Tab Content */}
          {activeTab === 'documents' && (
            <div className="bg-white rounded-lg w-full shadow overflow-hidden">
              {loadingDocuments ? (
                <div className="flex items-center justify-center h-40">Loading documents...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
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
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-4 py-3 text-sm relative">
                            <button
                              ref={(el) => {
                                if (doc.id) actionButtonRefs.current[doc.id] = el;
                              }}
                              onClick={(e) => toggleActionMenu(doc.id, e)}
                              className="inline-flex items-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                              title="Actions"
                            >
                              <FiMoreVertical className="h-5 w-5" />
                            </button>
                            {openActionMenuId === doc.id && (
                              <div
                                ref={actionMenuRef}
                                className="fixed z-50 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                                style={getPopupPosition(doc.id)}
                              >
                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      openEditModal(doc);
                                      setOpenActionMenuId(null);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  >
                                    <FiEdit className="h-4 w-4" />
                                    Edit
                                  </button>
                                  {doc.url && (
                                    <>
                                      <button
                                        onClick={() => {
                                          window.open(doc.url, '_blank');
                                          setOpenActionMenuId(null);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      >
                                        <FiEye className="h-4 w-4" />
                                        View
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
                                          setOpenActionMenuId(null);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      >
                                        <FiDownload className="h-4 w-4" />
                                        Download
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() => openDeleteDocumentConfirm(doc.id)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                  >
                                    <FiTrash2 className="h-4 w-4" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                      {documents.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-6 text-center text-gray-500 text-sm">No documents found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Edit Document Modal */}
          {showEditModal && editingDocument && (
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Update Document</h3>
                  <button
                    onClick={closeEditModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  {/* Document Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Document Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Enter document title"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Document File (Optional - leave empty to keep current file)
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="edit-file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500">
                            <span>Upload a new file</span>
                            <input
                              id="edit-file-upload"
                              name="edit-file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleEditFileChange}
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF, DOC, DOCX, XLS, XLSX, TXT up to 10MB</p>
                        {editFile && (
                          <p className="text-sm text-gray-700 mt-2">
                            New file: <span className="font-medium">{editFile.name}</span>
                          </p>
                        )}
                        {!editFile && (
                          <p className="text-sm text-gray-500 mt-2">
                            Current file: <span className="font-medium">{editingDocument.title || editingDocument.code || 'document'}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rate Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Select Rates <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleSelectAllEdit}
                        className="text-sm text-orange-600 hover:text-orange-700"
                      >
                        {editSelectedRateIds.length === rates.length ? "Deselect All" : "Select All"}
                      </button>
                    </div>
                    {loadingDocumentDetails ? (
                      <div className="border border-gray-300 rounded-md p-4 text-center">
                        <p className="text-sm text-gray-500">Loading document details...</p>
                      </div>
                    ) : (
                      <>
                        {editingDocument?.rates && editingDocument.rates.length > 0 && (
                          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-xs font-medium text-blue-800 mb-2">Currently Attached Rates:</p>
                            <div className="flex flex-wrap gap-2">
                              {editingDocument.rates.map((rate: any) => (
                                <span
                                  key={rate.id}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {rate.code}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="border border-gray-300 rounded-md max-h-60 overflow-y-auto">
                          {rates.length === 0 ? (
                            <p className="p-4 text-sm text-gray-500 text-center">No rates available</p>
                          ) : (
                            <div className="divide-y divide-gray-200">
                              {rates.map((rate) => {
                                const clientName = rate.client?.companyName || 
                                  [rate.client?.firstName, rate.client?.lastName].filter(Boolean).join(' ') || 
                                  'Unknown Client';
                                const isCurrentlyAttached = editingDocument?.rates?.some((r: any) => r.id === rate.id);
                                const isSelected = editSelectedRateIds.includes(rate.id);
                                return (
                                  <label
                                    key={rate.id}
                                    className={`flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                                      isCurrentlyAttached ? 'bg-blue-50' : ''
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => handleEditRateToggle(rate.id)}
                                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                    />
                                    <div className="ml-3 flex-1">
                                      <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-gray-900">{rate.code}</p>
                                        {isCurrentlyAttached && (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                            Attached
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-500">{clientName}</p>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        {editSelectedRateIds.length > 0 && (
                          <p className="mt-2 text-sm text-gray-600">
                            {editSelectedRateIds.length} rate{editSelectedRateIds.length !== 1 ? 's' : ''} selected
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={closeEditModal}
                      disabled={isUpdating}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateDocument}
                      disabled={isUpdating || !editTitle.trim() || editSelectedRateIds.length === 0}
                      className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? "Updating..." : "Update Document"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Document Confirmation Modal */}
          {showDeleteDocumentConfirm && (
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Confirm Deletion</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete this document? This action cannot be undone.
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteDocumentConfirm(false);
                      setSelectedDocumentId(null);
                    }}
                    disabled={loadingDocuments}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteDocument}
                    disabled={loadingDocuments}
                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingDocuments ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Confirm Deletion</h3>
                  <p className="text-gray-600 mt-2">
                    Are you sure you want to delete this rate? This action cannot be undone.
                  </p>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setSelectedRateId(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Upload Document Modal */}
          {showUploadModal && (
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Upload Document for Rates</h3>
                  <button
                    onClick={closeUploadModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  {/* Document Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Document Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="Enter document title"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Document File <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500">
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleFileChange}
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF, DOC, DOCX, XLS, XLSX, TXT up to 10MB</p>
                        {uploadFile && (
                          <p className="text-sm text-gray-700 mt-2">
                            Selected: <span className="font-medium">{uploadFile.name}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rate Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Select Rates <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="text-sm text-orange-600 hover:text-orange-700"
                      >
                        {selectedRateIds.length === rates.length ? "Deselect All" : "Select All"}
                      </button>
                    </div>
                    <div className="border border-gray-300 rounded-md max-h-60 overflow-y-auto">
                      {rates.length === 0 ? (
                        <p className="p-4 text-sm text-gray-500 text-center">No rates available</p>
                      ) : (
                        <div className="divide-y divide-gray-200">
                          {rates.map((rate) => {
                            const clientName = rate.client?.companyName || 
                              [rate.client?.firstName, rate.client?.lastName].filter(Boolean).join(' ') || 
                              'Unknown Client';
                            return (
                              <label
                                key={rate.id}
                                className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedRateIds.includes(rate.id)}
                                  onChange={() => handleRateToggle(rate.id)}
                                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                />
                                <div className="ml-3 flex-1">
                                  <p className="text-sm font-medium text-gray-900">{rate.code}</p>
                                  <p className="text-xs text-gray-500">{clientName}</p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    {selectedRateIds.length > 0 && (
                      <p className="mt-2 text-sm text-gray-600">
                        {selectedRateIds.length} rate{selectedRateIds.length !== 1 ? 's' : ''} selected
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={closeUploadModal}
                      disabled={isUploading}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUploadDocument}
                      disabled={isUploading || !uploadTitle.trim() || !uploadFile || selectedRateIds.length === 0}
                      className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? "Uploading..." : "Upload Document"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RatesList;



