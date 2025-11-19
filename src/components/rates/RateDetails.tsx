"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/utility/Sidebar";
import Navbar from "@/components/nav/Navbar";
import { useRates, type RateSummary } from "@/hooks/useRates";
import { FiEye, FiDownload } from "react-icons/fi";

const RateDetails = () => {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  const { getRateById, updateRate, getRateDocuments } = useRates();
  const [rate, setRate] = useState<RateSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});
  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

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
          setLoadingDocuments(true);
          try {
            const docs = await getRateDocuments(id);
            if (!cancelled && docs) setDocuments(docs);
          } catch (error) {
            console.error('Failed to load documents:', error);
          } finally {
            if (!cancelled) setLoadingDocuments(false);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id]);

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
            {!isEditing && (
              <button onClick={startEdit} className="ml-auto px-3 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700">Adjust Rate</button>
            )}
            {isEditing && (
              <div className="ml-auto flex items-center gap-2">
                <button onClick={() => setIsEditing(false)} className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700">Cancel</button>
                <button onClick={saveEdit} className="px-3 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700">Save</button>
              </div>
            )}
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

              {/* Documents Section */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4 text-lg">Documents</h3>
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
                              <div className="flex items-center gap-3">
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
                                          // Fallback: open in new tab
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
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">No documents found for this rate.</div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">Rate not found.</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RateDetails;


