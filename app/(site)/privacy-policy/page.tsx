import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole, Mail } from "lucide-react";
import { appConfig } from "@/app/app,config";

export const metadata: Metadata = { title: "Privacy Policy", description: "How Voibee collects, uses and protects your information." };

const sections = [
  ["Information we collect", "We collect the information you share when you create an account, send an enquiry or make a booking. This can include your name, email address, mobile number, traveller details and booking preferences. We also receive limited technical information needed to operate and secure the website."],
  ["How we use information", "We use your information to create and manage accounts, respond to enquiries, arrange bookings, process payments, provide customer support and improve our services. We may contact you about your booking or service updates. Marketing messages are sent only where permitted, and you can opt out at any time."],
  ["Who we share information with", "We share only the information needed to deliver your journey with travel suppliers, accommodation providers, transport operators, activity providers and payment partners. We may also disclose information where required by law or to protect our customers, team and services."],
  ["How long we keep information", "We retain information for as long as needed to provide services, meet legal and accounting obligations, resolve disputes and maintain accurate records. When information is no longer needed, we delete or anonymise it where practical."],
  ["Your choices", "You can ask us to update or correct your account information, withdraw marketing consent, or ask questions about the information we hold. Some records must be retained where required for a confirmed booking, payment, legal obligation or dispute."],
  ["Security", "We use reasonable organisational and technical safeguards to protect information. No online system can guarantee absolute security, so please keep your account credentials private and contact us promptly if you suspect unauthorised access."],
] as const;

export default function PrivacyPolicyPage() {
  return <main className="min-h-screen bg-white">
    <section className="border-b border-border bg-secondary/35 px-4 py-14 sm:px-6 sm:py-20"><div className="mx-auto max-w-3xl text-center"><span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-white"><LockKeyhole className="size-6" /></span><p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-primary">Your information</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">Privacy Policy</h1><p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">How Voibee handles the information you share while discovering, enquiring about and booking travel.</p><p className="mt-5 text-xs font-medium text-muted-foreground">Last updated: October 14, 2026</p></div></section>
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16"><div className="rounded-3xl border border-primary/15 bg-primary/5 p-5 text-sm leading-6 text-slate-700"><strong className="text-slate-950">A clear promise:</strong> we collect information to help plan and deliver your travel, not to sell your personal information.</div><div className="mt-10 space-y-10">{sections.map(([title, body], index) => <article key={title}><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{String(index + 1).padStart(2, "0")}</p><h2 className="mt-2 text-xl font-extrabold text-slate-950 sm:text-2xl">{title}</h2><p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{body}</p></article>)}</div><div className="mt-12 rounded-3xl bg-slate-950 p-6 text-white sm:p-8"><Mail className="size-6 text-white/80" /><h2 className="mt-4 text-xl font-extrabold">Questions about privacy?</h2><p className="mt-2 text-sm leading-6 text-white/75">Email us and we will help with your request.</p><a className="mt-5 inline-flex font-bold text-white underline underline-offset-4" href={`mailto:${appConfig.email}`}>{appConfig.email}</a></div><p className="mt-8 text-center text-sm text-muted-foreground">Read our <Link href="/terms-and-conditions" className="font-semibold text-primary hover:underline">Terms &amp; Conditions</Link>.</p></section>
  </main>;
}
