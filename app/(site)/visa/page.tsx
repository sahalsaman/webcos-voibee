import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, FileCheck2, Globe2, MessageCircle, PlaneTakeoff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Visa Assistance",
  description: "Get guided tourist visa assistance for popular international destinations with Voibee.",
};

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919000000001";
const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Voibee, I need visa assistance.")}`;

const POPULAR_VISAS = [
  { country: "Dubai / UAE", time: "3-5 working days", note: "Tourist visa support for short holidays and family trips." },
  { country: "Singapore", time: "5-7 working days", note: "Document checklist and application coordination." },
  { country: "Thailand", time: "4-7 working days", note: "Guidance for tourist visa and arrival requirements." },
  { country: "Malaysia", time: "3-6 working days", note: "eVisa support for leisure travelers." },
  { country: "Vietnam", time: "3-5 working days", note: "eVisa assistance with document review." },
  { country: "Sri Lanka", time: "2-4 working days", note: "ETA guidance for quick holiday plans." },
];

const DOCUMENTS = [
  "Passport with required validity",
  "Recent passport-size photo",
  "Travel dates and hotel details",
  "Flight itinerary or booking plan",
  "Bank statement or financial proof where required",
  "Employment, student, or business proof where required",
];

const STEPS = [
  { icon: MessageCircle, title: "Share your travel plan", text: "Tell us destination, travel date, traveler count and passport nationality." },
  { icon: FileCheck2, title: "Get document checklist", text: "We confirm the latest document requirements for your selected destination." },
  { icon: ShieldCheck, title: "Application support", text: "Our team reviews details and coordinates submission guidance." },
  { icon: PlaneTakeoff, title: "Travel ready", text: "Receive updates and prepare for immigration with clear instructions." },
];

export default function VisaPage() {
  return (
    <div>
      <section className="bg-secondary/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <Badge className="mb-5 w-fit" variant="default">
              <Globe2 className="size-3.5" /> Visa assistance
            </Badge>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
               Visa support for your next international trip
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Voibee helps travelers understand requirements, prepare documents and coordinate tourist visa applications for popular holiday destinations.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="gradient">
                <a href={WHATSAPP_HREF} target="_blank" rel="noreferrer">
                  Enquire on WhatsApp <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/trips">Explore trips</Link>
              </Button>
            </div>
          </div>

          <Card className="border-primary/20 bg-card/90">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-6 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileCheck2 className="size-6" />
              </div>
              <h2 className="text-xl font-bold">Common documents</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Final documents depend on destination, nationality and traveler profile.
              </p>
              <ul className="mt-6 space-y-3">
                {DOCUMENTS.map((doc) => (
                  <li key={doc} className="flex gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase text-primary">Popular visas</p>
          <h2 className="mt-2 text-3xl font-bold">Destinations we can guide you on</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_VISAS.map((visa) => (
            <Card key={visa.country}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold">{visa.country}</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                    <Clock3 className="size-3" /> {visa.time}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{visa.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase text-primary">Process</p>
            <h2 className="mt-2 text-3xl font-bold">Simple visa assistance flow</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-4">
            {STEPS.map((step) => (
              <Card key={step.title}>
                <CardContent className="p-6">
                  <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <step.icon className="size-5" />
                  </div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold">Need help with a specific country?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Send your destination and travel month. We will guide you with the next steps and document checklist.
        </p>
        <div className="mt-7">
          <Button asChild size="lg" variant="gradient">
            <a href={WHATSAPP_HREF} target="_blank" rel="noreferrer">
              Start visa enquiry <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
