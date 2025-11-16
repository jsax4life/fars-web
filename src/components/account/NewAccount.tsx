"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/components/utility/Sidebar";
import Link from "next/link";
import RateAdjustmentForm from "./RateAdjustment";
import { useBanks } from "@/hooks/useBank";
import { useBankAccounts } from "@/hooks/useBankAccount";
import { useClients } from "@/hooks/useClient";
import { useRates, type RateSummary } from "@/hooks/useRates";
import { toast } from "sonner";
import Navbar from "../nav/Navbar";

interface FormData {
  accountNumber: string;
  accountName: string;
  accountType: string;
  currency: string;
  bankId: string;
  clientId: string;
  rateId?: string;
}

interface Bank {
  id: string;
  name: string;
  [key: string]: any;
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

const NewAccount = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getBanks } = useBanks();
  const { createBankAccount } = useBankAccounts();
  const { getClients } = useClients();
  const { getRatesByClientId } = useRates();
  const [banks, setBanks] = useState<Bank[]>([]);
  const [rates, setRates] = useState<RateSummary[]>([]);
  const [loadingRates, setLoadingRates] = useState(false);
  const [loadingClientName, setLoadingClientName] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientId, setClientId] = useState('');
  const [clientName, setClientName] = useState('');

  const [formData, setFormData] = useState<FormData>({
    accountNumber: '',
    accountName: '',
    accountType: 'SAVINGS',
    currency: 'NGN',
    bankId: '',
    clientId: '',
    rateId: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [modalFormData, setModalFormData] = useState<ModalFormData>({
    fromDate: "",
    toDate: "",
    localCheques: "",
    intraStateCheques: "",
    upCountryCheques: "",
    setAsPrevailingDays: false,
    setParametersAsPrevailing: false,
    camfFrequency: "",
    camfOnShortfall: "",
    camfCoverRate: "",
    camfOCRate: "",
    turnoverLimit: "",
    currencyDescription: "",
    rate: "",
    retChgRate: "",
    retChgLimit: "",
    overdraftLimit: "",
    drRate: "",
    exRate: "",
    exChargeType: "",
    creditInterestRate: "",
    whtRate: "",
  });

  const handleModalChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;

    if (type === "checkbox") {
      const checked = (event.target as HTMLInputElement).checked;
      setModalFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setModalFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSave = () => {
    console.log("Modal data:", modalFormData);
    setShowModal(false);
  };

  // Initialize from URL params and fetch client name
  useEffect(() => {
    let isCancelled = false;
    const initializeClient = async () => {
      const id = searchParams.get('clientId') || '';
      const name = searchParams.get('clientName') || '';
      
      if (!id) {
        toast.error('Client ID is required. Please create account from Client Management page.');
        router.push('/Clients');
        return;
      }

      setClientId(id);
      setFormData(prev => ({ ...prev, clientId: id }));

      // If name is provided in URL, use it
      if (name) {
        const decodedName = decodeURIComponent(name);
        setClientName(decodedName);
      } else {
        // Otherwise, fetch client by ID to get the name
        setLoadingClientName(true);
        try {
          const clients = await getClients();
          if (!isCancelled && Array.isArray(clients)) {
            const client = clients.find((c: any) => c.id === id);
            if (client) {
              const name = client.companyName || 
                [client.firstName, client.lastName].filter(Boolean).join(' ') || 
                'Unknown Client';
              setClientName(name);
            } else {
              setClientName('Client Name Not Found');
            }
          }
        } catch (error) {
          console.error('Failed to fetch client:', error);
          if (!isCancelled) {
            setClientName('Client Name Not Found');
          }
        } finally {
          if (!isCancelled) {
            setLoadingClientName(false);
          }
        }
      }
    };

    initializeClient();
    return () => { isCancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, router]);

  // Fetch rates for the client
  useEffect(() => {
    let isCancelled = false;
    const fetchRates = async () => {
      if (!clientId) return;
      setLoadingRates(true);
      try {
        const data = await getRatesByClientId(clientId);
        if (!isCancelled && Array.isArray(data)) {
          setRates(data);
        }
      } catch (error) {
        console.error('Failed to fetch rates:', error);
        if (!isCancelled) setRates([]);
      } finally {
        if (!isCancelled) setLoadingRates(false);
      }
    };
    fetchRates();
    return () => { isCancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setIsLoading(true);
        const banksData = await getBanks();
        if (banksData && Array.isArray(banksData)) {
          setBanks(banksData);
        }
      } catch (error) {
        console.error('Failed to fetch banks:', error);
        toast.error('Failed to fetch banks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.accountNumber.trim()) {
      toast.error('Account number is required');
      return;
    }
    if (!formData.accountName.trim()) {
      toast.error('Account name is required');
      return;
    }
    if (!formData.bankId) {
      toast.error('Bank is required');
      return;
    }
    if (!formData.clientId || !clientId) {
      toast.error('Client ID is required. Please create account from Client Management page.');
      router.push('/Clients');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        bankId: formData.bankId,
        accountNumber: formData.accountNumber.trim(),
        accountName: formData.accountName.trim(),
        accountType: formData.accountType,
        currency: formData.currency,
        clientId: formData.clientId,
        ...(formData.rateId && { rateId: formData.rateId }),
      };

      const response = await createBankAccount(payload);
      if (response) {
        router.push('/BankAccounts');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="hidden md:block w-64 bg-gray-200 fixed top-0 left-0 h-full overflow-y-auto">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 bg-white shadow-md rounded-lg overflow-y-auto md:ml-64">
        <div className="mb-4">
          <Navbar />
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Create Account
            </h2>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading banks...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="accountNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="accountName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Account Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="accountName"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="accountType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Account Type
                  </label>
                  <select
                    id="accountType"
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  >
                    <option value="SAVINGS">Savings</option>
                    <option value="CURRENT">Current</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="currency"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  >
                    <option value="NGN">NGN</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="bankId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="bankId"
                    name="bankId"
                    value={formData.bankId}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  >
                    <option value="">Select Bank</option>
                    {banks.map((bank) => (
                      <option key={bank.id} value={bank.id}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="clientName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Client Name
                  </label>
                  <input
                    type="text"
                    id="clientName"
                    name="clientName"
                    value={loadingClientName ? 'Loading client name...' : (clientName || 'Client Name Not Found')}
                    readOnly
                    disabled
                    className="mt-1 block w-full border border-gray-300 text-gray-500 bg-gray-100 rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm cursor-not-allowed"
                  />
                </div>

                <div>
                  <label
                    htmlFor="rateId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Rate (Optional)
                  </label>
                  <select
                    id="rateId"
                    name="rateId"
                    value={formData.rateId || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  >
                    <option value="">Select Rate (Optional)</option>
                    {loadingRates ? (
                      <option value="" disabled>Loading rates...</option>
                    ) : rates.length > 0 ? (
                      rates.map((rate) => {
                        const drRate = rate.drRates && rate.drRates.length > 0 
                          ? rate.drRates[0].rate 
                          : rate.debitRate || '-';
                        const displayText = `${rate.code} - ${rate.currency || 'NGN'} (DR: ${drRate})`;
                        return (
                          <option key={rate.id} value={rate.id}>
                            {displayText}
                          </option>
                        );
                      })
                    ) : (
                      <option value="" disabled>No rates available</option>
                    )}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-6">
            <Link
              href="/Clients"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 overflow-y-auto z-50">
          <RateAdjustmentForm
            setShowModal={setShowModal}
            modalFormData={modalFormData}
            handleModalChange={handleModalChange}
            handleSave={handleSave}
          />
        </div>
      )}
    </div>
  );
};

export default NewAccount;