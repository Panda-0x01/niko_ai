"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login, register, logout, getMe } from "@/lib/auth";
import type { LoginInput, RegisterInput } from "@/types";
import { isAuthenticated } from "@/lib/auth";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: isAuthenticated(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => login(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], data.user);
      router.push("/dashboard");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterInput) => register(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], data.user);
      router.push("/dashboard");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      router.push("/");
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutate,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    isLoginPending: loginMutation.isPending,
    isRegisterPending: registerMutation.isPending,
  };
}
