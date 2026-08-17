"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
        body: JSON.stringify({ ...values, role: "traveler" }),
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
    <div>
      <h1 className="text-2xl font-bold">Create your account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Join {appConfig.appName} as a traveler. Partner accounts are invited by admin.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <Field label="Full name" error={errors.name?.message}>
          <Input placeholder="Your name" required {...register("name")} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Mobile" error={errors.mobile?.message}>
            <Input placeholder="10-digit" maxLength={10} required {...register("mobile")} />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <Input type="email" placeholder="you@email.com" required {...register("email")} />
          </Field>
        </div>

        <Field label="Password" error={errors.password?.message}>
          <Input type="password" placeholder="Min 6 characters" minLength={6} required {...register("password")} />
        </Field>

        <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          Create account
        </Button>
      </form>

      <p className="mt-4 rounded-lg bg-secondary/60 p-3 text-xs text-muted-foreground">
        Want to sell trips with Voibee? Please contact the admin team for a partner invite.
      </p>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label} <span className="text-destructive">*</span></Label>
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
