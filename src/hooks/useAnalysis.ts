import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import Endpoints from "@/lib/endpoints";

export interface AnalysisTypeResponse {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useAnalysis = () => {
  const api = useApi();

  const getAnalysisTypes = useCallback(
    async (): Promise<AnalysisTypeResponse[]> => {
      const response = await api.get(
        `${Endpoints.getAnalysisTypes}?isActive=true`
      );

      if (Array.isArray(response)) {
        return response as AnalysisTypeResponse[];
      }

      if (response && Array.isArray((response as any).data)) {
        return (response as any).data as AnalysisTypeResponse[];
      }

      return [];
    },
    [api]
  );

  return {
    getAnalysisTypes,
  };
};


