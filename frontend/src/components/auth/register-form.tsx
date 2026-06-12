"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { LeafIcon, EyeIcon, EyeOffIcon, CheckCircleIcon } from "@/components/icons";

const schema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

type FormData = z.infer<typeof schema>;

export function RegisterForm() {
  const { register: authRegister, isRegisterPending } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const password = watch("password", "");

  const passwordChecks = [
    { label: "At least 8 characters", passed: password.length >= 8 },
    { label: "Contains a letter", passed: /[a-zA-Z]/.test(password) },
    { label: "Contains a number", passed: /\d/.test(password) },
  ];

  const onSubmit = async (data: FormData) => {
    try {
      await authRegister({ full_name: data.full_name, email: data.email, password: data.password });
      toast({ title: "Account created!", description: "Welcome to Niko AI." });
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ?? "Registration failed. Please try again.";
      toast({ title: "Registration failed", description: message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <LeafIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Niko AI</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Free forever. No credit card required.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                placeholder="John Farmer"
                autoComplete="name"
                {...register("full_name")}
                className={errors.full_name ? "border-red-400 focus-visible:ring-red-400" : ""}
              />
              {errors.full_name && <p className="text-xs text-red-500">{errors.full_name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register("email")}
                className={errors.email ? "border-red-400 focus-visible:ring-red-400" : ""}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  {...register("password")}
                  className={errors.password ? "border-red-400 focus-visible:ring-red-400 pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}

              {password.length > 0 && (
                <div className="space-y-1 pt-1">
                  {passwordChecks.map((check) => (
                    <div key={check.label} className="flex items-center gap-1.5">
                      <CheckCircleIcon className={`w-3.5 h-3.5 ${check.passed ? "text-green-500" : "text-gray-300"}`} />
                      <span className={`text-xs ${check.passed ? "text-green-600" : "text-gray-400"}`}>{check.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <Input
                id="confirm_password"
                type="password"
                placeholder="Repeat your password"
                autoComplete="new-password"
                {...register("confirm_password")}
                className={errors.confirm_password ? "border-red-400 focus-visible:ring-red-400" : ""}
              />
              {errors.confirm_password && <p className="text-xs text-red-500">{errors.confirm_password.message}</p>}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isRegisterPending}>
              {isRegisterPending ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
