import { appConfig } from "@/app/app,config";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919000000001";
const WHATSAPP_TEXT = `Hi ${appConfig.appName}, I want to enquire about a package.`;

export function WhatsAppEnquiry() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-[#0085d8] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0085d8] focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:right-6"
      aria-label="Enquire on WhatsApp"
    >
      <MessageCircle className="size-5" />
      <span className="hidden sm:inline">Enquire now</span>
    </a>
  );
}
