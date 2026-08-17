import Image from "next/image";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { formatDate, formatINR, serialize } from "@/lib/utils";
import Quotation from "@/models/Quotation";
import type { QuotationDTO } from "@/types";

export default async function CustomerQuotationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  await connectDB();
  const record = await Quotation.findOne({ shareToken: token }).lean();
  if (!record) notFound();
  const quotation = serialize(record) as unknown as QuotationDTO;

  return (
    <main className="min-h-screen bg-secondary/30 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border bg-background shadow-xl">
        <header className="flex flex-wrap items-start justify-between gap-6 border-b border-border p-6 sm:p-8">
          <div><Image src="/voibee-logo-with-name.png" alt="Voibee" width={160} height={57} className="h-auto w-40" /><p className="mt-3 text-sm text-muted-foreground">Explore · Connect · Escape</p></div>
          <div className="text-left sm:text-right"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quotation</p><p className="font-mono font-semibold">{quotation.quotationNumber}</p><p className="mt-2 text-sm text-muted-foreground">Issued {formatDate(quotation.createdAt)}</p><p className="text-sm font-medium">Valid until {formatDate(quotation.validUntil)}</p></div>
        </header>

        <section className="grid gap-6 border-b border-border p-6 sm:grid-cols-2 sm:p-8">
          <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prepared for</p><h1 className="mt-2 text-xl font-bold">{quotation.customerName}</h1><p className="text-sm text-muted-foreground">{quotation.customerPhone}</p>{quotation.customerEmail ? <p className="text-sm text-muted-foreground">{quotation.customerEmail}</p> : null}</div>
          <div className="sm:text-right"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quotation for</p><h2 className="mt-2 text-xl font-bold">{quotation.title}</h2></div>
        </section>

        <section className="p-6 sm:p-8">
          {quotation.customItinerary?.length ? <div className="mb-8"><h3 className="mb-4 text-lg font-bold">Your itinerary</h3><div className="space-y-3">{quotation.customItinerary.map((item) => <div key={item.day} className="grid gap-2 rounded-xl border border-border p-4 sm:grid-cols-[80px_1fr]"><p className="font-semibold text-primary">Day {item.day}</p><div><p className="font-semibold">{item.title}</p>{item.description ? <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{item.description}</p> : null}</div></div>)}</div></div> : null}
          <div className="rounded-xl border border-border bg-secondary/30 p-4"><div className="flex items-center justify-between gap-4"><span className="font-medium">{quotation.title}</span><span className="font-bold">{formatINR(quotation.subtotal)}</span></div></div>
          <div className="ml-auto mt-6 grid max-w-sm gap-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatINR(quotation.subtotal)}</span></div>{quotation.discount > 0 ? <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span>- {formatINR(quotation.discount)}</span></div> : null}{quotation.taxAmount > 0 ? <div className="flex justify-between"><span className="text-muted-foreground">Tax ({quotation.taxRate}%)</span><span>{formatINR(quotation.taxAmount)}</span></div> : null}<div className="flex justify-between border-t border-border pt-3 text-xl font-bold"><span>Total</span><span>{formatINR(quotation.totalAmount)}</span></div></div>
        </section>

        {quotation.notes || quotation.terms ? <section className="grid gap-6 border-t border-border bg-secondary/20 p-6 sm:grid-cols-2 sm:p-8">{quotation.notes ? <div><h3 className="font-semibold">Notes</h3><p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{quotation.notes}</p></div> : null}{quotation.terms ? <div><h3 className="font-semibold">Terms and conditions</h3><p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{quotation.terms}</p></div> : null}</section> : null}
      </div>
    </main>
  );
}
