"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink, defaultInquiryMessage } from "@/lib/whatsapp";
import { useCompare } from "@/components/compare/CompareProvider";
import { cn } from "@/lib/cn";

export function WhatsAppFloat() {
  const pathname = usePathname();
  const { selection } = useCompare();
  const barVisible = selection.length > 0 && pathname !== "/bandingkan";

  return (
    <a
      href={buildWhatsAppLink(defaultInquiryMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi kami via WhatsApp"
      className={cn(
        "fixed right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] shadow-lg transition hover:bg-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
        barVisible ? "bottom-24 sm:bottom-24" : "bottom-6",
      )}
    >
      <MessageCircle className="h-6 w-6" aria-hidden />
    </a>
  );
}
