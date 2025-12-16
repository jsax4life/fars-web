"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/utility/Sidebar";
import Navbar from "@/components/nav/Navbar";
import { useRates, type RateSummary } from "@/hooks/useRates";
import { useUserAuth } from "@/hooks/useUserAuth";
import { FiEye, FiDownload, FiLink, FiMinus, FiMessageCircle, FiTrash2 } from "react-icons/fi";

const RateDetails = () => {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  const { getRateById, updateRate, getRateDocuments, getAllContractDocuments, assignRateToDocument, unassignRateFromDocument, getRateComments, createRateComment, getRateCommentById, updateRateComment, deleteRateComment } = useRates();
  const { user } = useUserAuth();
  const [rate, setRate] = useState<RateSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});
  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [availableDocuments, setAvailableDocuments] = useState<any[]>([]);
  const [loadingAvailableDocuments, setLoadingAvailableDocuments] = useState(false);
  const [assigningDocumentId, setAssigningDocumentId] = useState<string | null>(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [expandedCommentId, setExpandedCommentId] = useState<string | null>(null);
  const [loadingExpandedComment, setLoadingExpandedComment] = useState(false);
  const [expandedCommentData, setExpandedCommentData] = useState<any | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  const loadDocuments = async () => {
    if (!id) return;
    setLoadingDocuments(true);
    try {
      // Fetch only documents assigned to this rate
      const docs = await getRateDocuments(id);
      if (docs) setDocuments(docs);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const loadAvailableDocuments = async (assignedDocs: any[] = documents) => {
    if (!id) return;
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
              if (r.id === id || r === id) return true;
              // Check if rate object has id property matching
              if (typeof r === 'object' && r.id === id) return true;
              return false;
            });
            if (isAssigned) return false;
          }
          
          // Check if document has rateId matching current rate
          if (doc.rateId === id) return false;
          
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
    let cancelled = false;
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await getRateById(id);
        if (!cancelled && res) {
          setRate(res);
          // Load documents for this rate
          const assignedDocs = await getRateDocuments(id);
          // Always set documents (even if empty array or undefined)
          setDocuments(assignedDocs || []);
          // Always load available documents, even if there are no assigned documents
          await loadAvailableDocuments(assignedDocs || []);
        }
        // Load comment count to show notification badge
        if (!cancelled) {
          const commentsData = await getRateComments(id);
          if (commentsData && Array.isArray(commentsData)) {
            setCommentCount(commentsData.length);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Check if a document is assigned to the current rate
  const isDocumentAssigned = (doc: any): boolean => {
    // Check if document has rateId matching current rate
    if (doc.rateId === id) return true;
    // Check if document has rates array containing current rate
    if (doc.rates && Array.isArray(doc.rates)) {
      return doc.rates.some((r: any) => r.id === id || r === id);
    }
    return false;
  };

  const handleAssignRate = async (documentId: string) => {
    if (!id) return;
    setAssigningDocumentId(documentId);
    try {
      await assignRateToDocument(documentId, id);
      // Reload both assigned and available documents to reflect the change
      const assignedDocs = await getRateDocuments(id);
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
    if (!id) return;
    setAssigningDocumentId(documentId);
    try {
      await unassignRateFromDocument(documentId, id);
      // Reload both assigned and available documents to reflect the change
      const assignedDocs = await getRateDocuments(id);
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

  const startEdit = () => {
    if (!rate) return;
    setForm({
      rateType: rate.rateType || '',
      currency: rate.currency || '',
      effectiveFrom: rate.effectiveFrom ? rate.effectiveFrom.substring(0, 10) : '',
      effectiveTo: rate.effectiveTo ? rate.effectiveTo.substring(0, 10) : '',
      camfRate: rate.camfRate ?? '',
      returnChargeRate: rate.returnChargeRate ?? '',
      returnChargeLimit: rate.returnChargeLimit ?? '',
      cotCovenantRate: rate.cotCovenantRate ?? '',
      cotOffCoverRate: rate.cotOffCoverRate ?? '',
      cotOICRate: rate.cotOICRate ?? '',
      turnoverLimit: rate.turnoverLimit ?? '',
      cotCovenantFrequency: rate.cotCovenantFrequency ?? '',
      chargeCOTOnShortfall: rate.chargeCOTOnShortfall ?? false,
      debitRate: rate.debitRate ?? '',
      excessRate: rate.excessRate ?? '',
      excessRateType: rate.excessRateType ?? '',
      vatRate: rate.vatRate ?? '',
      whtRate: rate.whtRate ?? '',
    });
    setIsEditing(true);
    setShowMore(true);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const saveEdit = async () => {
    if (!rate) return;
    const payload: Record<string, any> = {
      rateType: form.rateType || undefined,
      currency: form.currency || undefined,
      effectiveFrom: form.effectiveFrom ? new Date(form.effectiveFrom).toISOString() : undefined,
      effectiveTo: form.effectiveTo ? new Date(form.effectiveTo).toISOString() : undefined,
      camfRate: form.camfRate === '' ? undefined : Number(form.camfRate),
      returnChargeRate: form.returnChargeRate === '' ? undefined : Number(form.returnChargeRate),
      returnChargeLimit: form.returnChargeLimit === '' ? undefined : Number(form.returnChargeLimit),
      cotCovenantRate: form.cotCovenantRate === '' ? undefined : Number(form.cotCovenantRate),
      cotOffCoverRate: form.cotOffCoverRate === '' ? undefined : Number(form.cotOffCoverRate),
      cotOICRate: form.cotOICRate === '' ? undefined : Number(form.cotOICRate),
      turnoverLimit: form.turnoverLimit === '' ? undefined : Number(form.turnoverLimit),
      cotCovenantFrequency: form.cotCovenantFrequency || undefined,
      chargeCOTOnShortfall: typeof form.chargeCOTOnShortfall === 'boolean' ? form.chargeCOTOnShortfall : undefined,
      debitRate: form.debitRate === '' ? undefined : Number(form.debitRate),
      excessRate: form.excessRate === '' ? undefined : Number(form.excessRate),
      excessRateType: form.excessRateType || undefined,
      vatRate: form.vatRate === '' ? undefined : Number(form.vatRate),
      whtRate: form.whtRate === '' ? undefined : Number(form.whtRate),
    };
    const updated = await updateRate(rate.id, payload);
    if (updated) {
      setRate({ ...rate, ...payload } as RateSummary);
      setIsEditing(false);
    }
  };

  const loadComments = async () => {
    if (!id) return;
    setLoadingComments(true);
    try {
      const commentsData = await getRateComments(id);
      if (commentsData) {
        setComments(commentsData);
        setCommentCount(commentsData.length);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleOpenComments = () => {
    setShowCommentsModal(true);
    loadComments();
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newComment.trim()) return;
    
    setSubmittingComment(true);
    try {
      await createRateComment(id, newComment.trim());
      setNewComment("");
      // Reload comments to show the new one
      await loadComments();
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleStartEdit = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentContent("");
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!id || !editingCommentContent.trim()) return;
    
    try {
      await updateRateComment(id, commentId, editingCommentContent.trim());
      setEditingCommentId(null);
      setEditingCommentContent("");
      // Reload comments to show the updated one
      await loadComments();
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleExpandComment = async (commentId: string) => {
    if (!id) return;
    
    if (expandedCommentId === commentId) {
      // Collapse
      setExpandedCommentId(null);
      setExpandedCommentData(null);
      return;
    }

    setLoadingExpandedComment(true);
    try {
      const commentData = await getRateCommentById(id, commentId);
      if (commentData) {
        setExpandedCommentId(commentId);
        setExpandedCommentData(commentData);
      }
    } catch (error) {
      console.error('Failed to load comment details:', error);
    } finally {
      setLoadingExpandedComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!id) return;
    
    if (!window.confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      return;
    }

    setDeletingCommentId(commentId);
    try {
      const success = await deleteRateComment(id, commentId);
      if (success) {
        // Reload comments to reflect the deletion
        await loadComments();
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    } finally {
      setDeletingCommentId(null);
    }
  };

  // Check if current user is the owner of a comment
  const isCommentOwner = (comment: any): boolean => {
    if (!user) return false;
    
    // Get user ID - the profile API might not return id, so check multiple sources
    let currentUserId: string | undefined;
    
    // Try from user object (might have id property)
    currentUserId = (user as any).id;
    
    // If not found in user object, try localStorage (profile might have stored it)
    if (!currentUserId && typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          currentUserId = parsedUser?.id;
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    // Get comment user ID
    const commentUserId = comment?.userId || comment?.user?.id;
    
    // If we have both IDs, compare them
    if (currentUserId && commentUserId) {
      return String(currentUserId) === String(commentUserId);
    }
    
    // Fallback: If IDs are not available, match by email or username
    // This is a fallback in case the profile API doesn't return the id
    if (user.email && comment.user?.email) {
      return user.email === comment.user.email;
    }
    
    if (user.username && comment.user?.username) {
      return user.username === comment.user.username;
    }
    
    return false;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 md:ml-64 md:mt-0">
        <div className="mb-4"><Navbar /></div>
        <main className="p-4 sm:p-6 lg:p-8 pt-32 md:pt-32">
          <div className="flex items-center gap-3 mb-6">
            <button
              aria-label="Back to Rates"
              onClick={() => router.push('/Rates')}
              className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <h2 className="text-[#363636] text-lg md:text-xl font-semibold">Rate Details</h2>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={handleOpenComments}
                className="relative p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700"
                title="View Comments"
              >
                <FiMessageCircle className="h-5 w-5" />
                {commentCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {commentCount}
                  </span>
                )}
              </button>
              {!isEditing && (
                <button onClick={startEdit} className="px-3 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700">Adjust Rate</button>
              )}
              {isEditing && (
                <>
                  <button onClick={() => setIsEditing(false)} className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700">Cancel</button>
                  <button onClick={saveEdit} className="px-3 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700">Save</button>
                </>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40">Loading...</div>
          ) : rate ? (
            <div className="bg-white rounded-lg w-full shadow p-4 md:p-6">
              {/* Overview - use a definition list for clean alignment */}
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm text-gray-700">
                <div className="flex items-start gap-2"><dt className="min-w-[140px] text-gray-500">Code</dt><dd className="font-medium text-gray-800">{rate.code}</dd></div>
                <div className="flex items-start gap-2"><dt className="min-w-[140px] text-gray-500">Client</dt><dd className="font-medium text-gray-800">{rate.client?.companyName || [rate.client?.firstName, rate.client?.lastName].filter(Boolean).join(' ') || '-'}</dd></div>
                {!isEditing ? (
                  <>
                    <div className="flex items-start gap-2"><dt className="min-w-[140px] text-gray-500">Currency</dt><dd className="font-medium text-gray-800">{rate.currency || '-'}</dd></div>
                    <div className="flex items-start gap-2"><dt className="min-w-[140px] text-gray-500">Rate Type</dt><dd className="font-medium text-gray-800">{rate.rateType || '-'}</dd></div>
                    <div className="flex items-start gap-2"><dt className="min-w-[140px] text-gray-500">Effective From</dt><dd className="font-medium text-gray-800">{rate.effectiveFrom ? new Date(rate.effectiveFrom).toLocaleDateString() : '-'}</dd></div>
                    <div className="flex items-start gap-2"><dt className="min-w-[140px] text-gray-500">Effective To</dt><dd className="font-medium text-gray-800">{rate.effectiveTo ? new Date(rate.effectiveTo).toLocaleDateString() : '-'}</dd></div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <dt className="min-w-[140px] text-gray-500">Currency</dt>
                      <dd>
                        <input name="currency" value={form.currency} onChange={onChange} className="px-2 py-1 border border-gray-300 rounded-md text-sm" />
                      </dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <dt className="min-w-[140px] text-gray-500">Rate Type</dt>
                      <dd>
                        <input name="rateType" value={form.rateType} onChange={onChange} className="px-2 py-1 border border-gray-300 rounded-md text-sm" />
                      </dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <dt className="min-w-[140px] text-gray-500">Effective From</dt>
                      <dd>
                        <input type="date" name="effectiveFrom" value={form.effectiveFrom} onChange={onChange} className="px-2 py-1 border border-gray-300 rounded-md text-sm" />
                      </dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <dt className="min-w-[140px] text-gray-500">Effective To</dt>
                      <dd>
                        <input type="date" name="effectiveTo" value={form.effectiveTo} onChange={onChange} className="px-2 py-1 border border-gray-300 rounded-md text-sm" />
                      </dd>
                    </div>
                  </>
                )}
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
                    {isEditing ? (
                      <>
                        <div><label className="block text-gray-500 text-xs mb-1">CAMF Rate</label><input name="camfRate" value={form.camfRate} onChange={onChange} className="w-full px-2 py-1 border rounded-md" /></div>
                        <div><label className="block text-gray-500 text-xs mb-1">Return Charge Rate</label><input name="returnChargeRate" value={form.returnChargeRate} onChange={onChange} className="w-full px-2 py-1 border rounded-md" /></div>
                        <div><label className="block text-gray-500 text-xs mb-1">Return Charge Limit</label><input name="returnChargeLimit" value={form.returnChargeLimit} onChange={onChange} className="w-full px-2 py-1 border rounded-md" /></div>
                        <div><label className="block text-gray-500 text-xs mb-1">COT Covenant Rate</label><input name="cotCovenantRate" value={form.cotCovenantRate} onChange={onChange} className="w-full px-2 py-1 border rounded-md" /></div>
                        <div><label className="block text-gray-500 text-xs mb-1">COT Off Cover Rate</label><input name="cotOffCoverRate" value={form.cotOffCoverRate} onChange={onChange} className="w-full px-2 py-1 border rounded-md" /></div>
                        <div><label className="block text-gray-500 text-xs mb-1">COT OIC Rate</label><input name="cotOICRate" value={form.cotOICRate} onChange={onChange} className="w-full px-2 py-1 border rounded-md" /></div>
                        <div><label className="block text-gray-500 text-xs mb-1">Turnover Limit</label><input name="turnoverLimit" value={form.turnoverLimit} onChange={onChange} className="w-full px-2 py-1 border rounded-md" /></div>
                        <div><label className="block text-gray-500 text-xs mb-1">COT Covenant Frequency</label><input name="cotCovenantFrequency" value={form.cotCovenantFrequency} onChange={onChange} className="w-full px-2 py-1 border rounded-md" /></div>
                        <div className="flex items-center gap-2 mt-5"><input type="checkbox" name="chargeCOTOnShortfall" checked={!!form.chargeCOTOnShortfall} onChange={onChange} /><span>Charge COT On Shortfall</span></div>
                        <div><label className="block text-gray-500 text-xs mb-1">Debit Rate</label><input name="debitRate" value={form.debitRate} onChange={onChange} className="w-full px-2 py-1 border rounded-md" /></div>
                        <div><label className="block text-gray-500 text-xs mb-1">Excess Rate</label><input name="excessRate" value={form.excessRate} onChange={onChange} className="w-full px-2 py-1 border rounded-md" /></div>
                        <div><label className="block text-gray-500 text-xs mb-1">Excess Rate Type</label><input name="excessRateType" value={form.excessRateType} onChange={onChange} className="w-full px-2 py-1 border rounded-md" /></div>
                        <div><label className="block text-gray-500 text-xs mb-1">VAT Rate</label><input name="vatRate" value={form.vatRate} onChange={onChange} className="w-full px-2 py-1 border rounded-md" /></div>
                        <div><label className="block text-gray-500 text-xs mb-1">WHT Rate</label><input name="whtRate" value={form.whtRate} onChange={onChange} className="w-full px-2 py-1 border rounded-md" /></div>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
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
          ) : (
            <div className="text-center text-gray-500">Rate not found.</div>
          )}
        </main>
      </div>

      {/* Comments Modal */}
      {showCommentsModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
              <button
                onClick={() => {
                  setShowCommentsModal(false);
                  setNewComment("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingComments ? (
                <div className="text-center text-gray-500 py-8">Loading comments...</div>
              ) : comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => {
                    const isOwner = isCommentOwner(comment);
                    console.log('Rendering comment:', comment.id, 'isOwner:', isOwner, 'user:', user);
                    return (
                    <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-start gap-3">
                        <img
                          src={comment.user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            comment.user?.firstName || comment.user?.username || 'User'
                          )}`}
                          alt={comment.user?.firstName || 'User'}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {comment.user?.firstName} {comment.user?.lastName}
                            </span>
                            <span className="text-xs text-gray-500">
                              @{comment.user?.username}
                            </span>
                            <span className="text-xs text-gray-400">
                              • {new Date(comment.createdAt).toLocaleString()}
                            </span>
                            {comment.updatedAt !== comment.createdAt && (
                              <span className="text-xs text-gray-400">
                                • (edited)
                              </span>
                            )}
                          </div>
                          {editingCommentId === comment.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={editingCommentContent}
                                onChange={(e) => setEditingCommentContent(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none text-sm"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleUpdateComment(comment.id)}
                                  disabled={!editingCommentContent.trim()}
                                  className="px-3 py-1 text-xs bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>
                              <div className="flex items-center gap-3 mt-2">
                                {isOwner && (
                                  <>
                                    <button
                                      onClick={() => handleStartEdit(comment)}
                                      className="text-xs text-blue-600 hover:text-blue-700"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteComment(comment.id)}
                                      disabled={deletingCommentId === comment.id}
                                      className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                    >
                                      <FiTrash2 className="h-3 w-3" />
                                      {deletingCommentId === comment.id ? 'Deleting...' : 'Delete'}
                                    </button>
                                  </>
                                )}
                                {comment.content.length > 200 && (
                                  <button
                                    onClick={() => handleExpandComment(comment.id)}
                                    className="text-xs text-blue-600 hover:text-blue-700"
                                  >
                                    {expandedCommentId === comment.id ? 'Show Less' : 'View More'}
                                  </button>
                                )}
                              </div>
                              {expandedCommentId === comment.id && (
                                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                  {loadingExpandedComment ? (
                                    <div className="text-sm text-gray-500">Loading...</div>
                                  ) : expandedCommentData ? (
                                    <div>
                                      <p className="text-gray-700 text-sm whitespace-pre-wrap mb-2">
                                        {expandedCommentData.content}
                                      </p>
                                      <div className="text-xs text-gray-500">
                                        Created: {new Date(expandedCommentData.createdAt).toLocaleString()}
                                        {expandedCommentData.updatedAt !== expandedCommentData.createdAt && (
                                          <span className="ml-2">
                                            • Updated: {new Date(expandedCommentData.updatedAt).toLocaleString()}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">No comments yet. Be the first to comment!</div>
              )}
            </div>

            {/* Add Comment Form */}
            <div className="border-t border-gray-200 p-6">
              <form onSubmit={handleSubmitComment} className="space-y-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCommentsModal(false);
                      setNewComment("");
                    }}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newComment.trim() || submittingComment}
                    className="px-4 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingComment ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RateDetails;


