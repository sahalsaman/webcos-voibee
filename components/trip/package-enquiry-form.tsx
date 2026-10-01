"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function PackageEnquiryForm({ packageTitle }: { packageTitle: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = [
      `Package: ${packageTitle}`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      message ? `Message: ${message}` : "",
    ].filter(Boolean).join("\n");
    window.location.href = `mailto:info@voibee.com?subject=${encodeURIComponent(`Enquiry: ${packageTitle}`)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <section className="mt-5 rounded-2xl border border-border bg-white p-5">
      <h2 className="font-extrabold">Send an enquiry</h2>
      <p className="mt-2 text-sm text-muted-foreground">Need help before booking? Our travel team will assist you.</p>
      <form className="mt-4 space-y-3" onSubmit={submit}>
        <Input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" aria-label="Your name" />
        <Input required type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone number" aria-label="Phone number" />
        <Textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="How can we help?" aria-label="Your message" rows={3} />
        <Button type="submit" className="w-full">Send enquiry</Button>
      </form>
    </section>
  );
}
