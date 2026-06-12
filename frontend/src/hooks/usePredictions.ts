"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PredictResponse, PredictionHistory } from "@/types";

export function usePredictions(limit = 20) {
  return useQuery({
    queryKey: ["predictions", limit],
    queryFn: async () => {
      const res = await api.get<PredictionHistory[]>(`/predictions/history?limit=${limit}`);
      return res.data;
    },
  });
}

export function usePrediction(id: string) {
  return useQuery({
    queryKey: ["prediction", id],
    queryFn: async () => {
      const res = await api.get<PredictionHistory>(`/predictions/history/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useDeletePrediction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/predictions/history/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predictions"] });
    },
  });
}

export function usePredict() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File): Promise<PredictResponse> => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post<PredictResponse>("/predictions/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predictions"] });
    },
  });
}
