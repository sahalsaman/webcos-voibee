"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  travelerRegisterSchema,
  partnerRegisterSchema,
  type PartnerRegisterInput,
} from "@/lib/validations";
import { PARTNER_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [role, setRole] = useState<"traveler" | "partner">(
    params.get("role") === "partner" ? "partner" : "traveler",
  );
  const [loading, setLoading] = useState(false);

  const schema = role === "partner" ? partnerRegisterSchema : travelerRegisterSchema;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PartnerRegisterInput>({
    resolver: zodResolver(schema) as unknown as Resolver<PartnerRegisterInput>,
  });

  function switchRole(r: "traveler" | "partner") {
    setRole(r);
    reset();
  }

  async function onSubmit(values: PartnerRegisterInput) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, role }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Registration failed");
      }

      await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      toast.success(
        role === "partner"
          ? "Partner account created! Pending admin approval."
          : "Account created. Happy travels! 🎒",
      );
      router.push(role === "partner" ? "/partner" : "/traveler");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Create your account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Join Tripnox as a traveler or a reselling partner.
      </p>

      {/* Role tabs */}
      <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl border border-border p-1">
        {([
          { key: "traveler", label: "Traveler", icon: User },
          { key: "partner", label: "Partner", icon: Briefcase },
        ] as const).map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => switchRole(r.key)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition",
              role === r.key
                ? "bg-brand-gradient text-white shadow"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <r.icon className="size-4" /> {r.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <Field label="Full name" error={errors.name?.message}>
          <Input placeholder="Your name" {...register("name")} />
        </Field>

        {role === "partner" ? (
          <>
            <Field label="Business name" error={errors.businessName?.message}>
              <Input placeholder="e.g. Cheruvadi Travels" {...register("businessName")} />
            </Field>
            <Field label="Partner type">
              <Select {...register("partnerType")}>
                {PARTNER_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            </Field>
          </>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          <Field label="Mobile" error={errors.mobile?.message}>
            <Input placeholder="10-digit" maxLength={10} {...register("mobile")} />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <Input type="email" placeholder="you@email.com" {...register("email")} />
          </Field>
        </div>

        <Field label="Password" error={errors.password?.message}>
          <Input type="password" placeholder="Min 6 characters" {...register("password")} />
        </Field>

        <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {role === "partner" ? "Become a Partner" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
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
