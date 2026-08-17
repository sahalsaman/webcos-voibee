"use client";

import { Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";
import type { QuotationDTO } from "@/types";

function shareUrl(token: string) {
  return new URL(`/quotation/${token}`, window.location.origin).toString();
}

function whatsappNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

export function QuotationShareActions({ quotation }: { quotation: QuotationDTO }) {
  function message() {
    return `Hello ${quotation.customerName},\n\nYour quotation ${quotation.quotationNumber} for ${quotation.title} is ready.\nTotal: ${formatINR(quotation.totalAmount)}\nValid until: ${new Date(quotation.validUntil).toLocaleDateString("en-IN")}\n\nView quotation: ${shareUrl(quotation.shareToken)}`;
  }

  function sendWhatsApp() {
    window.open(`https://wa.me/${whatsappNumber(quotation.customerPhone)}?text=${encodeURIComponent(message())}`, "_blank", "noopener,noreferrer");
  }

  function sendEmail() {
    const subject = `Quotation ${quotation.quotationNumber} - ${quotation.title}`;
    window.location.href = `mailto:${quotation.customerEmail || ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message())}`;
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Button type="button" variant="ghost" size="icon" aria-label={`Send ${quotation.quotationNumber} by WhatsApp`} onClick={sendWhatsApp}>
        <MessageCircle className="size-4 text-green-600" />
      </Button>
      <Button type="button" variant="ghost" size="icon" aria-label={`Send ${quotation.quotationNumber} by email`} onClick={sendEmail}>
        <Mail className="size-4 text-blue-600" />
      </Button>
    </div>
  );
}
