

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, LockKeyhole, Loader2, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { travelerRegisterSchema, type TravelerRegisterInput } from "@/lib/validations";
import { appConfig } from "@/app/app,config";

function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TravelerRegisterInput>({
    resolver: zodResolver(travelerRegisterSchema),
  });

  async function onSubmit(values: TravelerRegisterInput) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, role: "vendor_traveler" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Registration failed");

      await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      toast.success("Account created. Happy travels!");
      router.push("/traveler");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <div className="mobile-login-screen -mx-4 -my-12 min-h-screen bg-[#fffaf0] px-5 py-6 sm:mx-0 sm:my-0 sm:min-h-0 sm:bg-transparent sm:p-0">
      <div className="mx-auto w-full max-w-md">
        <div className="flex items-center justify-between sm:hidden">
          <Link href="/" aria-label="Back to home" className="flex size-11 items-center justify-center rounded-2xl border border-border/80 bg-white text-primary shadow-sm">
            <ArrowLeft className="size-5" />
          </Link>
          <Image src={appConfig.appLogoWithName} alt={appConfig.appNameCap} width={154} height={60} sizes="128px" unoptimized className="h-9 w-auto object-contain" priority />
          <span className="size-11" aria-hidden="true" />
        </div>

        <div className="mt-10 text-center sm:mt-0 sm:text-left">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 sm:hidden">
            <UserRound className="size-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-2xl sm:font-bold">Create your account</h1>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground sm:mx-0 sm:mt-1">
            Join {appConfig.appNameCap} and start planning your next unforgettable trip.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5 rounded-[28px] bg-white p-5 shadow-[0_16px_50px_rgba(9,47,89,0.10)] sm:mt-6 sm:space-y-4 sm:rounded-none sm:bg-transparent sm:p-0 sm:shadow-none">
          <Field label="Full name" error={errors.name?.message} icon={UserRound} htmlFor="name">
            <Input id="name" placeholder="Your name" required className="h-13 rounded-2xl border-border bg-[#fffdf8] pl-11 shadow-none focus-visible:ring-primary" {...register("name")} />
          </Field>

          <Field label="Mobile number" error={errors.mobile?.message} icon={Phone} htmlFor="mobile">
            <Input id="mobile" type="tel" inputMode="numeric" placeholder="10-digit mobile number" maxLength={10} required className="h-13 rounded-2xl border-border bg-[#fffdf8] pl-11 shadow-none focus-visible:ring-primary" {...register("mobile")} />
          </Field>

          <Field label="Email address" error={errors.email?.message} icon={Mail} htmlFor="email">
            <Input id="email" type="email" placeholder="you@email.com" required className="h-13 rounded-2xl border-border bg-[#fffdf8] pl-11 shadow-none focus-visible:ring-primary" {...register("email")} />
          </Field>

          <Field label="Password" error={errors.password?.message} icon={LockKeyhole} htmlFor="password">
            <Input id="password" type="password" placeholder="At least 6 characters" minLength={6} required className="h-13 rounded-2xl border-border bg-[#fffdf8] pl-11 shadow-none focus-visible:ring-primary" {...register("password")} />
          </Field>

          <Button type="submit" variant="default" size="lg" className="h-13 w-full rounded-2xl text-base font-bold shadow-lg shadow-primary/20" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {loading ? "Creating your account..." : "Create account"}
          </Button>

          <p className="flex items-center justify-center gap-1.5 pt-1 text-xs text-muted-foreground sm:hidden">
            <ShieldCheck className="size-3.5 text-primary" /> Your information stays secure with us
          </p>
        </form>

        <p className="mt-4 rounded-2xl bg-secondary/60 p-3 text-xs leading-5 text-muted-foreground sm:rounded-lg">
          Want to sell trips with Voibee? Please contact the admin team for a partner invite.
        </p>

        <p className="mt-7 text-center text-sm text-muted-foreground sm:mt-6">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-primary hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, error, icon: Icon, htmlFor, children }: { label: string; error?: string; icon: typeof Mail; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="font-semibold text-foreground">{label} <span className="text-destructive">*</span></Label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        {children}
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
