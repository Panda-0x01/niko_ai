"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UserIcon, LeafIcon, LogOutIcon } from "@/components/icons";
import { formatDate } from "@/lib/utils";
import type { UpdateProfileInput } from "@/types";

const schema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
});

type FormData = z.infer<typeof schema>;

export function SettingsPage() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (user) {
      reset({ full_name: user.full_name });
    }
  }, [user, reset]);

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async (data: UpdateProfileInput) => {
      const res = await api.patch("/users/me", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], data);
      toast({ title: "Profile updated", description: "Your changes have been saved." });
      reset({ full_name: data.full_name });
    },
    onError: () => {
      toast({ title: "Update failed", description: "Could not save changes.", variant: "destructive" });
    },
  });

  const onSubmit = (data: FormData) => {
    updateProfile({ full_name: data.full_name });
  };

  const initials = user?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "U";

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account and preferences.</p>
      </motion.div>

      {/* Profile section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-2xl border border-gray-100 p-6 mb-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user?.profile_image ?? undefined} />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{user?.full_name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Member since {user?.created_at ? formatDate(user.created_at) : "—"}
            </p>
          </div>
        </div>

        <Separator className="mb-6" />

        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-gray-400" />
          Profile Information
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              placeholder="Your full name"
              {...register("full_name")}
              className={errors.full_name ? "border-red-400" : ""}
            />
            {errors.full_name && <p className="text-xs text-red-500">{errors.full_name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              value={user?.email ?? ""}
              disabled
              className="bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400">Email cannot be changed.</p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              disabled={isPending || !isDirty}
              className="gap-2"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
            {isDirty && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => reset({ full_name: user?.full_name ?? "" })}
              >
                Discard
              </Button>
            )}
          </div>
        </form>
      </motion.div>

      {/* App info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-100 p-6 mb-6"
      >
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <LeafIcon className="w-4 h-4 text-gray-400" />
          About Niko AI
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-gray-500">Version</span>
            <span className="text-gray-900 font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-gray-500">AI Model</span>
            <span className="text-gray-900 font-medium">YOLOv8 Classification</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-gray-500">Disease Classes</span>
            <span className="text-gray-900 font-medium">38</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-500">Supported Crops</span>
            <span className="text-gray-900 font-medium">14</span>
          </div>
        </div>
      </motion.div>

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl border border-gray-100 p-6"
      >
        <h3 className="text-base font-semibold text-gray-900 mb-4">Account Actions</h3>
        <Button
          variant="outline"
          className="gap-2 text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200"
          onClick={() => logout()}
        >
          <LogOutIcon className="w-4 h-4" />
          Sign Out
        </Button>
      </motion.div>
    </div>
  );
}
