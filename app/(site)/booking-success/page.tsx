import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, CheckCircle2, Download, Mail, MapPin, Phone, ReceiptText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAuthorizedBookingConfirmation } from "@/lib/booking-confirmation";
import { formatDate, formatINR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Booking Confirmed",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ booking?: string; token?: string }>;
const supportNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919000000001").replace(/\D/g, "");
const supportDisplay = supportNumber.startsWith("91") ? `+91 ${supportNumber.slice(2, 7)} ${supportNumber.slice(7)}` : `+${supportNumber}`;

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return <div><dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt><dd className="mt-1 font-semibold">{value}</dd></div>;
}

export default async function BookingSuccessPage({ searchParams }: { searchParams: SearchParams }) {
  const { booking: reference = "", token } = await searchParams;
  const booking = await getAuthorizedBookingConfirmation(reference, token);
  if (!booking) notFound();
  const paid = booking.paymentStatus === "paid";

  const downloadParams = new URLSearchParams();
  if (token) downloadParams.set("token", token);
  const downloadUrl = `/api/bookings/${encodeURIComponent(booking.bookingNumber)}/confirmation${downloadParams.size ? `?${downloadParams}` : ""}`;
  const tripImage = booking.trip?.images?.[0];

  return (
    <main className={`${paid ? "bg-gradient-to-b from-emerald-50/80" : "bg-gradient-to-b from-blue-50/80"} via-background to-background px-4 py-10 sm:px-6 sm:py-14`}>
      <div className="mx-auto max-w-5xl">
        <section className="overflow-hidden rounded-[30px] border border-emerald-200/70 bg-card shadow-xl shadow-emerald-950/5">
          <div className={`${paid ? "from-emerald-600 to-teal-500" : "from-primary to-blue-500"} bg-gradient-to-r px-6 py-9 text-center text-white sm:px-10`}>
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/35">
              <CheckCircle2 className="size-9" />
            </span>
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-white/85">{paid ? "Payment successful" : "Offline booking received"}</p>
            <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{paid ? "Your trip is confirmed!" : "Your booking request is saved!"}</h1>
            <p className="mx-auto mt-3 max-w-xl text-white/85">{paid ? `Thank you, ${booking.travelerDetails.name}. Keep this confirmation for your journey.` : `Thank you, ${booking.travelerDetails.name}. The Voibee team will contact you to confirm payment and availability.`}</p>
            <div className="mt-5 inline-flex rounded-full bg-white/15 px-4 py-2 font-mono text-sm font-bold ring-1 ring-white/25">
              Booking ID: {booking.bookingNumber}
            </div>
          </div>

          <div className="grid gap-7 p-5 sm:p-8 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="space-y-6">
              <article className="overflow-hidden rounded-2xl border border-border">
                {tripImage ? <div className="relative h-48"><Image src={tripImage} alt={booking.trip.title} fill sizes="(max-width: 1024px) 100vw, 620px" className="object-cover" /></div> : null}
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">Trip details</p>
                  <h2 className="mt-1 text-2xl font-bold">{booking.trip.title}</h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Detail label="Destination" value={<span className="flex items-center gap-2"><MapPin className="size-4 text-primary" />{booking.trip.destination}, {booking.trip.country}</span>} />
                    <Detail label="Travelers" value={<span className="flex items-center gap-2"><Users className="size-4 text-primary" />{booking.seats}</span>} />
                    <Detail label="Travel dates" value={<span className="flex items-center gap-2"><CalendarDays className="size-4 text-primary" />{formatDate(booking.travelStartDate)} - {formatDate(booking.travelEndDate)}</span>} />
                    <Detail label="Pickup location" value={booking.trip.pickupLocation || "To be confirmed"} />
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-border p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Traveler details</p>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Detail label="Name" value={booking.travelerDetails.name} />
                  <Detail label="Mobile" value={booking.travelerDetails.mobile} />
                  <Detail label="Email" value={booking.travelerDetails.email} />
                  <Detail label="Number of travelers" value={booking.travelerDetails.travellers || booking.seats} />
                </dl>
              </article>
            </div>

            <aside className="space-y-5">
              <article className="rounded-2xl border border-border bg-secondary/30 p-5">
                <div className="flex items-center gap-2"><ReceiptText className="size-5 text-primary" /><h2 className="font-bold">Payment summary</h2></div>
                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Price per traveler</dt><dd className="font-semibold">{formatINR(booking.sellingPrice)}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Travelers</dt><dd className="font-semibold">{booking.seats}</dd></div>
                  <div className="flex justify-between gap-3 border-t border-border pt-3 text-base"><dt className="font-bold">{paid ? "Amount paid" : "Amount payable"}</dt><dd className="font-extrabold text-primary">{formatINR(booking.totalAmount)}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Payment status</dt><dd className={`font-bold ${paid ? "text-emerald-600" : "text-amber-600"}`}>{paid ? "Paid" : "Not paid"}</dd></div>
                </dl>
              </article>

              <article className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <h2 className="font-bold">Need help?</h2>
                <p className="mt-1 text-sm text-muted-foreground">The Voibee team is ready to assist with your booking.</p>
                <div className="mt-4 space-y-2 text-sm font-semibold">
                  <a href={`tel:+${supportNumber}`} className="flex items-center gap-2 hover:text-primary"><Phone className="size-4 text-primary" />{supportDisplay}</a>
                  <a href="mailto:support@voibee.com" className="flex items-center gap-2 hover:text-primary"><Mail className="size-4 text-primary" />support@voibee.com</a>
                </div>
              </article>

              <Button asChild variant="gradient" size="lg" className="w-full">
                <a href={downloadUrl} download><Download className="size-4" />Download booking PDF</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full"><Link href={`/packages/${booking.trip.slug}`}>View trip details</Link></Button>
            </aside>
          </div>
        </section>
        <p className="mt-5 text-center text-sm text-muted-foreground">A copy of this confirmation can be downloaded anytime from this page.</p>
      </div>
    </main>
  );
}
