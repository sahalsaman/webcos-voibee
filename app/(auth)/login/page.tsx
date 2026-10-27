"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Loader2, Mail, MessageCircle, ShieldCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { appConfig } from "@/app/app,config";

function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [countries, setCountries] = useState<Array<{ name: string; phoneCode: string; flag: string }>>([]);

  useEffect(() => {
    fetch("/api/countries/phone-codes")
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => { if (payload?.success && Array.isArray(payload.data)) setCountries(payload.data); })
      .catch(() => undefined);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setLoading(true);
    const res = await signIn("credentials", { ...values, redirect: false });
    if (res?.error) {
      toast.error("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }
    toast.success("Welcome back!");
    router.push("/");
    router.refresh();
  }

  async function requestOtp() {
    const localMobile = mobile.replace(/\D/g, "");
    const fullMobile = `${countryCode}${localMobile}`;
    if (!/^[1-9]\d{6,14}$/.test(fullMobile.replace(/\D/g, ""))) {
      toast.error("Enter a valid mobile number.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/phone/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: fullMobile, purpose: "login" }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Could not send the WhatsApp code");
      setMobile(localMobile);
      setOtpSent(true);
      toast.success(result.data?.testMode ? "Test mode: use OTP 654321." : "A six-digit code was sent to your WhatsApp.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send the WhatsApp code");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    if (!/^\d{6}$/.test(otp)) {
      toast.error("Enter the 6-digit code from WhatsApp.");
      return;
    }
    setLoading(true);
    const res = await signIn("credentials", { mobile: `${countryCode}${mobile}`, otp, redirect: false });
    if (res?.error) {
      toast.error("That code is invalid or has expired. Request a new code and try again.");
      setLoading(false);
      return;
    }
    toast.success("Welcome back!");
    router.push("/");
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
            width={154}
            height={60}
            sizes="128px"
            unoptimized
            className="h-9 w-auto object-contain"
            priority
          />
          <span className="size-11" aria-hidden="true" />
        </div>

        <div className="mt-10 text-center sm:mt-0 sm:text-left">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 sm:hidden">
            <LockKeyhole className="size-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-2xl sm:font-bold">Login</h1>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground sm:mx-0 sm:mt-1">
            Welcome back to Voibee. Sign in to continue planning your next unforgettable trip.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 border-b border-border sm:mt-7">
          <button type="button" onClick={() => { setMethod("phone"); setOtpSent(false); setOtp(""); }} className={`flex items-center justify-center gap-2 border-b-2 px-3 py-3 text-sm font-bold transition-colors ${method === "phone" ? "border-accent text-foreground" : "border-transparent text-muted-foreground"}`}>
            <Smartphone className="size-4" /> Phone
          </button>
          <button type="button" onClick={() => setMethod("email")} className={`flex items-center justify-center gap-2 border-b-2 px-3 py-3 text-sm font-bold transition-colors ${method === "email" ? "border-accent text-foreground" : "border-transparent text-muted-foreground"}`}>
            <Mail className="size-4" /> Email
          </button>
        </div>

        {method === "phone" ? (
          <div className="mt-8 space-y-5 rounded-[28px] bg-white p-5 shadow-[0_16px_50px_rgba(9,47,89,0.10)] sm:mt-6 sm:space-y-4 sm:rounded-none sm:bg-transparent sm:p-0 sm:shadow-none">
            <div className="space-y-1.5">
              <Label htmlFor="mobile" className="font-semibold text-foreground">Mobile number <span className="text-destructive">*</span></Label>
              <div className="flex h-13 items-center rounded-2xl border border-border bg-[#fffdf8] px-3 shadow-none focus-within:ring-2 focus-within:ring-primary">
                <select aria-label="Country calling code" value={countryCode} onChange={(event) => { setCountryCode(event.target.value); setOtpSent(false); }} disabled={loading || otpSent} className="mr-2 max-w-36 shrink-0 border-r border-border bg-transparent py-2 pr-3 text-sm font-semibold outline-none">
                  {(countries.length ? countries : [{ name: "India", phoneCode: "+91", flag: "🇮🇳" }]).map((country) => <option key={`${country.phoneCode}-${country.name}`} value={country.phoneCode}>{country.flag} {country.phoneCode}</option>)}
                </select>
                <input id="mobile" type="tel" inputMode="numeric" autoComplete="tel" maxLength={15} value={mobile} onChange={(event) => { setMobile(event.target.value.replace(/\D/g, "").slice(0, 15)); setOtpSent(false); }} placeholder="Mobile number" className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground" disabled={loading || otpSent} />
              </div>
            </div>
            {otpSent ? <div className="space-y-1.5"><Label htmlFor="otp" className="font-semibold text-foreground">WhatsApp verification code <span className="text-destructive">*</span></Label><Input id="otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Enter 6-digit code" className="h-13 rounded-2xl border-border bg-[#fffdf8] text-center text-lg tracking-[0.45em] shadow-none focus-visible:ring-primary" disabled={loading} /></div> : <p className="flex items-center gap-2 text-xs leading-5 text-muted-foreground"><MessageCircle className="size-4 shrink-0 text-[#25D366]" /> We’ll send a one-time code to this number on WhatsApp.</p>}
            <Button type="button" variant="default" size="lg" className="h-13 w-full rounded-2xl text-base font-bold shadow-lg shadow-primary/20" disabled={loading} onClick={() => void (otpSent ? verifyOtp() : requestOtp())}>{loading ? <Loader2 className="size-4 animate-spin" /> : <MessageCircle className="size-4" />}{otpSent ? "Verify & continue" : "Continue with WhatsApp"}</Button>
            {otpSent ? <button type="button" disabled={loading} onClick={() => void requestOtp()} className="block w-full text-center text-sm font-bold text-primary hover:underline">Resend code</button> : null}
          </div>
        ) : <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5 rounded-[28px] bg-white p-5 shadow-[0_16px_50px_rgba(9,47,89,0.10)] sm:mt-6 sm:space-y-4 sm:rounded-none sm:bg-transparent sm:p-0 sm:shadow-none">
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
            <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" required className="h-13 rounded-2xl border-border bg-[#fffdf8] pl-11 pr-11 shadow-none focus-visible:ring-primary" {...register("password")} />
            <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground transition-colors hover:text-foreground" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
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
        </form>}

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
