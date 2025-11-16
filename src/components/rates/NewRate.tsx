"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/utility/Sidebar";
import Navbar from "@/components/nav/Navbar";
import { useRates } from "@/hooks/useRates";
import { useClients } from "@/hooks/useClient";

interface RateArrayItem {
  rate: number;
  effectiveFrom: string;
  effectiveTo: string;
}

interface FormData {
  clientId: string;
  drRates: RateArrayItem[];
  loanInterestRates: RateArrayItem[];
  lcCommissions: RateArrayItem[];
  preNegotiationRates: RateArrayItem[];
  postNegotiationRates: RateArrayItem[];
  creditInterestRates: RateArrayItem[];
  returnChargeRate: number;
  returnChargeLimit: number;
  cotCovenantRate: number;
  cotOffCoverRate: number;
  cotOICRate: number;
  turnoverLimit: number;
  cotCovenantFrequency: string;
  chargeCOTOnShortfall: boolean;
  debitRate: number;
  excessRate: number;
  excessRateType: string;
  vatRate: number;
  whtRate: number;
  rateType: string;
  currency: string;
  effectiveFrom: string;
  effectiveTo: string;
}

interface Client {
  id: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

const NewRate = () => {
  const router = useRouter();
  const { createRate } = useRates();
  const { getClients } = useClients();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    clientId: '',
    drRates: [{ rate: 0, effectiveFrom: '', effectiveTo: '' }],
    loanInterestRates: [{ rate: 0, effectiveFrom: '', effectiveTo: '' }],
    lcCommissions: [{ rate: 0, effectiveFrom: '', effectiveTo: '' }],
    preNegotiationRates: [{ rate: 0, effectiveFrom: '', effectiveTo: '' }],
    postNegotiationRates: [{ rate: 0, effectiveFrom: '', effectiveTo: '' }],
    creditInterestRates: [{ rate: 0, effectiveFrom: '', effectiveTo: '' }],
    returnChargeRate: 0,
    returnChargeLimit: 0,
    cotCovenantRate: 0,
    cotOffCoverRate: 0,
    cotOICRate: 0,
    turnoverLimit: 0,
    cotCovenantFrequency: 'monthly',
    chargeCOTOnShortfall: false,
    debitRate: 0,
    excessRate: 0,
    excessRateType: 'flat',
    vatRate: 0,
    whtRate: 0,
    rateType: 'tiered',
    currency: 'NGN',
    effectiveFrom: '',
    effectiveTo: '',
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const clientsData = await getClients();
        if (clientsData && Array.isArray(clientsData)) {
          setClients(clientsData);
        }
      } catch (error) {
        console.error('Failed to fetch clients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name.includes('.')) {
      // Handle nested rate array fields
      const [arrayName, index, field] = name.split('.');
      const idx = parseInt(index);
      setFormData(prev => {
        const newArray = [...(prev[arrayName as keyof FormData] as RateArrayItem[])];
        newArray[idx] = { ...newArray[idx], [field]: field === 'rate' ? parseFloat(value) || 0 : value };
        return { ...prev, [arrayName]: newArray };
      });
    } else {
      // Exclude fields that end with "Type" or "Frequency" from number parsing
      const isNumericField = (name.includes('Rate') || name.includes('Limit')) && 
                             !name.endsWith('Type') && 
                             !name.endsWith('Frequency');
      setFormData(prev => ({
        ...prev,
        [name]: isNumericField ? (parseFloat(value) || 0) : value,
      }));
    }
  };

  const addRateItem = (arrayName: keyof FormData) => {
    setFormData(prev => {
      const currentArray = prev[arrayName] as RateArrayItem[];
      return {
        ...prev,
        [arrayName]: [...currentArray, { rate: 0, effectiveFrom: '', effectiveTo: '' }],
      };
    });
  };

  const removeRateItem = (arrayName: keyof FormData, index: number) => {
    setFormData(prev => {
      const currentArray = prev[arrayName] as RateArrayItem[];
      if (currentArray.length <= 1) return prev;
      return {
        ...prev,
        [arrayName]: currentArray.filter((_, i) => i !== index),
      };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.clientId) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Filter out empty rate arrays and ensure proper formatting
      const payload: any = {
        clientId: formData.clientId,
        drRates: formData.drRates.filter(r => r.rate > 0 && r.effectiveFrom && r.effectiveTo),
        loanInterestRates: formData.loanInterestRates.filter(r => r.rate > 0 && r.effectiveFrom && r.effectiveTo),
        lcCommissions: formData.lcCommissions.filter(r => r.rate > 0 && r.effectiveFrom && r.effectiveTo),
        preNegotiationRates: formData.preNegotiationRates.filter(r => r.rate > 0 && r.effectiveFrom && r.effectiveTo),
        postNegotiationRates: formData.postNegotiationRates.filter(r => r.rate > 0 && r.effectiveFrom && r.effectiveTo),
        creditInterestRates: formData.creditInterestRates.filter(r => r.rate > 0 && r.effectiveFrom && r.effectiveTo),
        returnChargeRate: formData.returnChargeRate,
        returnChargeLimit: formData.returnChargeLimit,
        cotCovenantRate: formData.cotCovenantRate,
        cotOffCoverRate: formData.cotOffCoverRate,
        cotOICRate: formData.cotOICRate,
        turnoverLimit: formData.turnoverLimit,
        cotCovenantFrequency: formData.cotCovenantFrequency,
        chargeCOTOnShortfall: formData.chargeCOTOnShortfall,
        debitRate: formData.debitRate,
        excessRate: formData.excessRate,
        excessRateType: formData.excessRateType,
        vatRate: formData.vatRate,
        whtRate: formData.whtRate,
        rateType: formData.rateType,
        currency: formData.currency,
        effectiveFrom: formData.effectiveFrom,
        effectiveTo: formData.effectiveTo,
      };

      const response = await createRate(payload);
      if (response) {
        router.push('/Rates');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRateArray = (arrayName: keyof FormData, label: string) => {
    const array = formData[arrayName] as RateArrayItem[];
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
          <button
            type="button"
            onClick={() => addRateItem(arrayName)}
            className="text-sm text-orange-600 hover:text-orange-700"
          >
            + Add {label}
          </button>
        </div>
        {array.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 p-3 bg-gray-50 rounded-md">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Rate</label>
              <input
                type="number"
                step="0.01"
                name={`${String(arrayName)}.${index}.rate`}
                value={item.rate}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Effective From</label>
              <input
                type="date"
                name={`${String(arrayName)}.${index}.effectiveFrom`}
                value={item.effectiveFrom}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Effective To</label>
              <input
                type="date"
                name={`${String(arrayName)}.${index}.effectiveTo`}
                value={item.effectiveTo}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="flex items-end">
              {array.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRateItem(arrayName, index)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
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
            <h2 className="text-[#363636] text-lg md:text-xl font-semibold">Create Rate</h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-40">Loading clients...</div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 md:p-6">
              {/* Basic Information */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-800 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="clientId"
                      value={formData.clientId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select Client</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.companyName || `${client.firstName || ''} ${client.lastName || ''}`.trim() || client.id}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="NGN">NGN</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rate Type
                    </label>
                    <select
                      name="rateType"
                      value={formData.rateType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="tiered">Tiered</option>
                      <option value="flat">Flat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Effective From
                    </label>
                    <input
                      type="date"
                      name="effectiveFrom"
                      value={formData.effectiveFrom}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Effective To
                    </label>
                    <input
                      type="date"
                      name="effectiveTo"
                      value={formData.effectiveTo}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Rate Arrays */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-800 mb-4">Rate Arrays</h3>
                {renderRateArray('drRates', 'DR Rates')}
                {renderRateArray('loanInterestRates', 'Loan Interest Rates')}
                {renderRateArray('lcCommissions', 'LC Commissions')}
                {renderRateArray('preNegotiationRates', 'Pre-Negotiation Rates')}
                {renderRateArray('postNegotiationRates', 'Post-Negotiation Rates')}
                {renderRateArray('creditInterestRates', 'Credit Interest Rates')}
              </div>

              {/* Scalar Rates */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-800 mb-4">Rate Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Charge Rate</label>
                    <input
                      type="number"
                      step="0.01"
                      name="returnChargeRate"
                      value={formData.returnChargeRate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Charge Limit</label>
                    <input
                      type="number"
                      step="0.01"
                      name="returnChargeLimit"
                      value={formData.returnChargeLimit}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">COT Covenant Rate</label>
                    <input
                      type="number"
                      step="0.01"
                      name="cotCovenantRate"
                      value={formData.cotCovenantRate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">COT Off Cover Rate</label>
                    <input
                      type="number"
                      step="0.01"
                      name="cotOffCoverRate"
                      value={formData.cotOffCoverRate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">COT OIC Rate</label>
                    <input
                      type="number"
                      step="0.01"
                      name="cotOICRate"
                      value={formData.cotOICRate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Turnover Limit</label>
                    <input
                      type="number"
                      step="0.01"
                      name="turnoverLimit"
                      value={formData.turnoverLimit}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">COT Covenant Frequency</label>
                    <select
                      name="cotCovenantFrequency"
                      value={formData.cotCovenantFrequency}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Debit Rate</label>
                    <input
                      type="number"
                      step="0.01"
                      name="debitRate"
                      value={formData.debitRate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Excess Rate</label>
                    <input
                      type="number"
                      step="0.01"
                      name="excessRate"
                      value={formData.excessRate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Excess Rate Type</label>
                    <select
                      name="excessRateType"
                      value={formData.excessRateType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="flat">Flat</option>
                      <option value="percentage">Percentage</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">VAT Rate</label>
                    <input
                      type="number"
                      step="0.01"
                      name="vatRate"
                      value={formData.vatRate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WHT Rate</label>
                    <input
                      type="number"
                      step="0.01"
                      name="whtRate"
                      value={formData.whtRate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="chargeCOTOnShortfall"
                      checked={formData.chargeCOTOnShortfall}
                      onChange={handleChange}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Charge COT On Shortfall</label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.push('/Rates')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create Rate'}
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
};

export default NewRate;

