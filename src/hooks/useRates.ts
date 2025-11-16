import Endpoints from "@/lib/endpoints";
import { useApi } from "./useApi";
import { toast } from "sonner";

export interface RateSummary {
  id: string;
  clientId: string;
  code: string;
  drRates?: { rate: number; effectiveFrom: string; effectiveTo: string }[];
  loanInterestRates?: { rate: number; effectiveFrom: string; effectiveTo: string }[];
  lcCommissions?: { rate: number; effectiveFrom: string; effectiveTo: string }[];
  preNegotiationRates?: { rate: number; effectiveFrom: string; effectiveTo: string }[];
  postNegotiationRates?: { rate: number; effectiveFrom: string; effectiveTo: string }[];
  creditInterestRates?: { rate: number; effectiveFrom: string; effectiveTo: string }[];
  camfRate?: number | null;
  returnChargeRate?: number;
  returnChargeLimit?: number;
  cotCovenantRate?: number;
  cotOffCoverRate?: number;
  cotOICRate?: number;
  turnoverLimit?: number;
  cotCovenantFrequency?: string;
  chargeCOTOnShortfall?: boolean;
  debitRate?: number;
  excessRate?: number;
  excessRateType?: string;
  vatRate?: number;
  whtRate?: number;
  rateType?: string;
  currency?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  createdAt?: string;
  updatedAt?: string;
  client?: {
    id: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    email?: string;
  };
}

export const useRates = () => {
  const api = useApi();

  const getRates = async (): Promise<RateSummary[] | undefined> => {
    try {
      const res = await api.get(Endpoints.getAllRates);
      if (Array.isArray(res)) return res as RateSummary[];
      return [];
    } catch (error: any) {
      toast.error("Failed to get rates: " + (error?.message || "Unknown error"));
    }
  };

  const getRateById = async (id: string): Promise<RateSummary | undefined> => {
    try {
      const res = await api.get(Endpoints.getRateById.replace(/\/$/, '') + '/' + id);
      if (res) return res as RateSummary;
    } catch (error: any) {
      toast.error("Failed to get rate: " + (error?.message || "Unknown error"));
    }
  };

  const updateRate = async (id: string, payload: Partial<RateSummary>): Promise<RateSummary | undefined> => {
    try {
      const res = await api.patch(Endpoints.getRateById.replace(/\/$/, '') + '/' + id, payload);
      if (res) {
        toast.success(res?.message || 'Rate updated successfully');
        // Some APIs return the updated object; if not, we can merge locally
        return (res as RateSummary) || undefined;
      }
    } catch (error: any) {
      toast.error('Failed to update rate: ' + (error?.message || 'Unknown error'));
    }
  };

  const createRate = async (payload: {
    clientId: string;
    drRates?: { rate: number; effectiveFrom: string; effectiveTo: string }[];
    loanInterestRates?: { rate: number; effectiveFrom: string; effectiveTo: string }[];
    lcCommissions?: { rate: number; effectiveFrom: string; effectiveTo: string }[];
    preNegotiationRates?: { rate: number; effectiveFrom: string; effectiveTo: string }[];
    postNegotiationRates?: { rate: number; effectiveFrom: string; effectiveTo: string }[];
    creditInterestRates?: { rate: number; effectiveFrom: string; effectiveTo: string }[];
    returnChargeRate?: number;
    returnChargeLimit?: number;
    cotCovenantRate?: number;
    cotOffCoverRate?: number;
    cotOICRate?: number;
    turnoverLimit?: number;
    cotCovenantFrequency?: string;
    chargeCOTOnShortfall?: boolean;
    debitRate?: number;
    excessRate?: number;
    excessRateType?: string;
    vatRate?: number;
    whtRate?: number;
    rateType?: string;
    currency?: string;
    effectiveFrom?: string;
    effectiveTo?: string;
  }): Promise<RateSummary | undefined> => {
    try {
      const res = await api.post(Endpoints.createRate, payload);
      if (res) {
        toast.success(res?.message || 'Rate created successfully');
        return res as RateSummary;
      }
    } catch (error: any) {
      toast.error('Failed to create rate: ' + (error?.message || 'Unknown error'));
    }
  };

  const deleteRate = async (id: string): Promise<{ message?: string } | undefined> => {
    try {
      const res = await api.delete(Endpoints.deleteRate.replace(/\/$/, '') + '/' + id);
      if (res) {
        toast.success(res?.message || 'Rate deleted successfully');
        return res;
      }
    } catch (error: any) {
      toast.error('Failed to delete rate: ' + (error?.message || 'Unknown error'));
    }
  };

  const uploadRateDocument = async (title: string, file: File, rateIds: string[]): Promise<any> => {
    try {
      const formData = new FormData();
      
      // Create metadata object and append as JSON string
      const metadata = {
        title: title,
        rateIds: rateIds
      };
      formData.append('metadata', JSON.stringify(metadata));
      
      // Append the file
      formData.append('file', file);

      const res = await api.post(Endpoints.uploadRateDocument, formData);
      if (res) {
        toast.success(res?.message || 'Document uploaded successfully');
        return res;
      }
    } catch (error: any) {
      toast.error('Failed to upload document: ' + (error?.message || 'Unknown error'));
      throw error;
    }
  };

  const getRateDocuments = async (rateId: string): Promise<any[] | undefined> => {
    try {
      const res = await api.get(Endpoints.getRateDocuments.replace(/\/$/, '') + '/' + rateId + '/documents');
      if (Array.isArray(res)) return res;
      return [];
    } catch (error: any) {
      toast.error('Failed to get documents: ' + (error?.message || 'Unknown error'));
    }
  };

  const getAllContractDocuments = async (): Promise<any[] | undefined> => {
    try {
      const res = await api.get(Endpoints.getAllContractDocuments);
      if (Array.isArray(res)) return res;
      return [];
    } catch (error: any) {
      toast.error('Failed to get contract documents: ' + (error?.message || 'Unknown error'));
    }
  };

  const getRatesByClientId = async (clientId: string): Promise<RateSummary[] | undefined> => {
    try {
      const res = await api.get(Endpoints.getRatesByClientId.replace(/\/$/, '') + '/' + clientId);
      if (Array.isArray(res)) return res as RateSummary[];
      return [];
    } catch (error: any) {
      toast.error('Failed to get rates: ' + (error?.message || 'Unknown error'));
    }
  };

  const getDocumentById = async (documentId: string): Promise<any | undefined> => {
    try {
      const res = await api.get(Endpoints.getDocumentById.replace(/\/$/, '') + '/' + documentId);
      if (res) return res;
    } catch (error: any) {
      toast.error('Failed to get document: ' + (error?.message || 'Unknown error'));
    }
  };

  const updateRateDocument = async (documentId: string, title: string, file: File | null, rateIds: string[]): Promise<any> => {
    try {
      const formData = new FormData();
      
      // Create metadata object and append as JSON string
      const metadata = {
        title: title,
        rateIds: rateIds
      };
      formData.append('metadata', JSON.stringify(metadata));
      
      // Append the file only if a new file is provided
      if (file) {
        formData.append('file', file);
      }

      const res = await api.patch(Endpoints.updateRateDocument.replace(/\/$/, '') + '/' + documentId, formData);
      if (res) {
        toast.success(res?.message || 'Document updated successfully');
        return res;
      }
    } catch (error: any) {
      toast.error('Failed to update document: ' + (error?.message || 'Unknown error'));
      throw error;
    }
  };

  const deleteRateDocument = async (documentId: string): Promise<any> => {
    try {
      const res = await api.delete(Endpoints.deleteRateDocument.replace(/\/$/, '') + '/' + documentId);
      if (res) {
        toast.success(res?.message || 'Document deleted successfully');
        return res;
      }
    } catch (error: any) {
      toast.error('Failed to delete document: ' + (error?.message || 'Unknown error'));
      throw error;
    }
  };

  return { getRates, getRateById, updateRate, createRate, deleteRate, uploadRateDocument, getRateDocuments, getAllContractDocuments, getDocumentById, updateRateDocument, deleteRateDocument, getRatesByClientId };
};


