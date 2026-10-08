"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, LockKeyhole, Loader2, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { appConfig } from "@/app/app,config";

function dashboardPath(role?: string) {
  if (role === "admin" || role === "vendor" || role === "employee" || role === "vendor_employee") return "/admin";
  if (role === "partner" || role === "vendor_partner") return "/partner";
  return "/traveler";
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setLoading(true);
    const res = await signIn("credentials", { ...values, redirect: false });
    if (res?.error) {
      toast.error("Invalid email or password");
      setLoading(false);
      return;
    }
    toast.success("Welcome back!");
    const session = await getSession();
    router.push(callbackUrl || dashboardPath(session?.user?.role));
    router.refresh();
  }

  return (
    <div className="mobile-login-screen -mx-4 -my-12 min-h-screen bg-[#fffaf0] px-5 py-6 sm:mx-0 sm:my-0 sm:min-h-0 sm:bg-transparent sm:p-0">
      <div className="mx-auto w-full max-w-md">
        <div className="flex items-center justify-between sm:hidden">
          <Link
            href="/"
            aria-label="Back to home"
            className="flex size-11 items-center justify-center rounded-2xl border border-border/80 bg-white text-primary shadow-sm"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <Image
            src={appConfig.appLogoWithName}
            alt={appConfig.appNameCap}
            width={126}
            height={48}
            className="h-10 w-auto object-contain"
            priority
          />
          <span className="size-11" aria-hidden="true" />
        </div>

        <div className="mt-10 text-center sm:mt-0 sm:text-left">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 sm:hidden">
            <LockKeyhole className="size-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-2xl sm:font-bold">Welcome back</h1>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground sm:mx-0 sm:mt-1">
            Sign in to continue planning your next unforgettable trip.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5 rounded-[28px] bg-white p-5 shadow-[0_16px_50px_rgba(9,47,89,0.10)] sm:mt-6 sm:space-y-4 sm:rounded-none sm:bg-transparent sm:p-0 sm:shadow-none">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="font-semibold text-foreground">Email address <span className="text-destructive">*</span></Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" type="email" placeholder="you@email.com" required className="h-13 rounded-2xl border-border bg-[#fffdf8] pl-11 shadow-none focus-visible:ring-primary" {...register("email")} />
          </div>
          {errors.email ? (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="font-semibold text-foreground">Password <span className="text-destructive">*</span></Label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="password" type="password" placeholder="Enter your password" required className="h-13 rounded-2xl border-border bg-[#fffdf8] pl-11 shadow-none focus-visible:ring-primary" {...register("password")} />
          </div>
          {errors.password ? (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          ) : null}
        </div>

        <Button type="submit" variant="default" size="lg" className="h-13 w-full rounded-2xl text-base font-bold shadow-lg shadow-primary/20" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {loading ? "Signing you in..." : "Continue"}
        </Button>

          <p className="flex items-center justify-center gap-1.5 pt-1 text-xs text-muted-foreground sm:hidden">
            <ShieldCheck className="size-3.5 text-primary" /> Your information stays secure with us
          </p>
        </form>

        <p className="mt-7 text-center text-sm text-muted-foreground sm:mt-6">
          New to {appConfig.appNameCap}?{" "}
          <Link href="/register" className="font-bold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
