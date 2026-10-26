"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, Loader2, MessageCircle, Phone, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { travelerRegisterSchema, type TravelerRegisterInput } from "@/lib/validations";
import { appConfig } from "@/app/app,config";

type Country = { name: string; phoneCode: string; flag: string };

function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [mobileNumber, setMobileNumber] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [otp, setOtp] = useState("");
  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm<TravelerRegisterInput>({ resolver: zodResolver(travelerRegisterSchema) });

  useEffect(() => {
    fetch("/api/countries/phone-codes").then((response) => response.ok ? response.json() : null)
      .then((payload) => { if (payload?.success && Array.isArray(payload.data)) setCountries(payload.data); }).catch(() => undefined);
  }, []);
  useEffect(() => { setValue("mobile", `${countryCode}${mobileNumber}`, { shouldValidate: false }); }, [countryCode, mobileNumber, setValue]);

  async function sendOtp() {
    const mobile = `${countryCode}${mobileNumber}`;
    if (!/^[1-9]\d{6,14}$/.test(mobile.replace(/\D/g, ""))) return toast.error("Enter a valid mobile number.");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/phone/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mobile, purpose: "register" }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Could not send the WhatsApp code");
      setStep("otp");
      toast.success(data.data?.testMode ? "Test mode: use OTP 654321." : "A six-digit code was sent to your WhatsApp.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not send the WhatsApp code"); }
    finally { setLoading(false); }
  }

  async function beginRegistration() {
    const valid = await new Promise<boolean>((resolve) => void handleSubmit(() => resolve(true), () => resolve(false))());
    if (valid) await sendOtp();
  }

  async function completeRegistration() {
    if (!/^\d{6}$/.test(otp)) return toast.error("Enter the 6-digit WhatsApp code.");
    setLoading(true);
    try {
      const values = getValues();
      const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: values.name, mobile: values.mobile, otp, role: "vendor_traveler" }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Registration failed");
      const session = await signIn("credentials", { mobile: values.mobile, otp, redirect: false });
      if (session?.error) throw new Error("Your account was created, but we could not sign you in. Please log in with your phone number.");
      toast.success("Account created. Happy travels!");
      router.push("/"); router.refresh();
    } catch (error) { toast.error(error instanceof Error ? error.message : "Registration failed"); setLoading(false); }
  }

  const options = countries.length ? countries : [{ name: "India", phoneCode: "+91", flag: "🇮🇳" }];
  return <div className="mobile-login-screen -mx-4 -my-12 min-h-screen bg-[#fffaf0] px-5 py-6 sm:mx-0 sm:my-0 sm:min-h-0 sm:bg-transparent sm:p-0"><div className="mx-auto w-full max-w-md"><div className="flex items-center justify-between sm:hidden"><Link href="/" aria-label="Back to home" className="flex size-11 items-center justify-center rounded-2xl border border-border/80 bg-white text-primary shadow-sm"><ArrowLeft className="size-5" /></Link><Image src={appConfig.appLogoWithName} alt={appConfig.appNameCap} width={154} height={60} sizes="128px" unoptimized className="h-9 w-auto object-contain" priority /><span className="size-11" /></div><div className="mt-10 text-center sm:mt-0 sm:text-left"><div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 sm:hidden">{step === "details" ? <UserRound className="size-6" /> : <MessageCircle className="size-6" />}</div><h1 className="text-3xl font-extrabold tracking-tight">{step === "details" ? "Create your account" : "Verify your number"}</h1><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground sm:mx-0">{step === "details" ? "Start with your name and mobile number." : `Enter the code sent to ${countryCode} ${mobileNumber}.`}</p></div>{step === "details" ? <form onSubmit={(event) => { event.preventDefault(); void beginRegistration(); }} className="mt-8 space-y-5 rounded-[28px] bg-white p-5 shadow-[0_16px_50px_rgba(9,47,89,0.10)] sm:mt-6 sm:rounded-none sm:bg-transparent sm:p-0 sm:shadow-none"><div className="space-y-1.5"><Label htmlFor="name" className="font-semibold">Full name <span className="text-destructive">*</span></Label><div className="relative"><UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="name" placeholder="Your name" className="h-13 rounded-2xl border-border bg-[#fffdf8] pl-11" {...register("name")} /></div>{errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}</div><div className="space-y-1.5"><Label htmlFor="mobile" className="font-semibold">Mobile number <span className="text-destructive">*</span></Label><div className="flex h-13 items-center rounded-2xl border border-border bg-[#fffdf8] px-3 focus-within:ring-2 focus-within:ring-primary"><Phone className="mr-2 size-4 shrink-0 text-muted-foreground" /><select aria-label="Country calling code" value={countryCode} onChange={(event) => setCountryCode(event.target.value)} className="mr-2 max-w-34 shrink-0 border-r border-border bg-transparent py-2 pr-2 text-sm font-semibold outline-none">{options.map((country) => <option key={`${country.phoneCode}-${country.name}`} value={country.phoneCode}>{country.flag} {country.phoneCode}</option>)}</select><input id="mobile" type="tel" inputMode="numeric" maxLength={15} value={mobileNumber} onChange={(event) => setMobileNumber(event.target.value.replace(/\D/g, "").slice(0, 15))} placeholder="Mobile number" className="min-w-0 flex-1 bg-transparent outline-none" /><input type="hidden" {...register("mobile")} /></div>{errors.mobile ? <p className="text-xs text-destructive">{errors.mobile.message}</p> : null}</div><Button type="submit" size="lg" className="h-13 w-full rounded-2xl text-base font-bold" disabled={loading}>{loading ? <Loader2 className="size-4 animate-spin" /> : <MessageCircle className="size-4" />}Continue with WhatsApp</Button></form> : <div className="mt-8 space-y-5 rounded-[28px] bg-white p-5 shadow-[0_16px_50px_rgba(9,47,89,0.10)] sm:mt-6 sm:rounded-none sm:bg-transparent sm:p-0 sm:shadow-none"><div className="space-y-1.5"><Label htmlFor="otp" className="font-semibold">WhatsApp verification code <span className="text-destructive">*</span></Label><Input id="otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Enter 6-digit code" className="h-13 rounded-2xl border-border bg-[#fffdf8] text-center text-lg tracking-[0.45em]" disabled={loading} /></div><Button type="button" size="lg" className="h-13 w-full rounded-2xl text-base font-bold" disabled={loading} onClick={() => void completeRegistration()}>{loading ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}Verify & continue</Button><div className="flex justify-between text-sm"><button type="button" className="font-bold text-primary hover:underline" onClick={() => { setStep("details"); setOtp(""); }}>Edit number</button><button type="button" className="font-bold text-primary hover:underline" disabled={loading} onClick={() => void sendOtp()}>Resend code</button></div></div>}<p className="mt-7 text-center text-sm text-muted-foreground">Already have an account? <Link href="/login" className="font-bold text-primary hover:underline">Log in</Link></p></div></div>;
}

export default function RegisterPage() { return <Suspense fallback={null}><RegisterForm /></Suspense>; }
