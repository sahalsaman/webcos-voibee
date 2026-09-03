"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function DestinationSwitcher({ india, global, hasIndia = true, className }: { india: React.ReactNode; global: React.ReactNode; hasIndia?: boolean; className?: string }) {
  const [active, setActive] = useState<"india" | "global">(hasIndia ? "india" : "global");

  if (!hasIndia) return <div className={className}>{global}</div>;

  return <div className={cn("space-y-8", className)}>
    <div className="mx-auto grid w-full max-w-sm grid-cols-2 rounded-full bg-card p-1.5 shadow-[0_12px_32px_rgba(15,23,42,0.10)] ring-1 ring-border/50" role="tablist" aria-label="Destination region">
      <SwitchButton active={active === "india"} onClick={() => setActive("india")} controls="india-destinations">India</SwitchButton>
      <SwitchButton active={active === "global"} onClick={() => setActive("global")} controls="global-destinations">Global Escapes</SwitchButton>
    </div>
    <div id="india-destinations" role="tabpanel" hidden={active !== "india"}>{india}</div>
    <div id="global-destinations" role="tabpanel" hidden={active !== "global"}>{global}</div>
  </div>;
}

function SwitchButton({ active, controls, onClick, children }: { active: boolean; controls: string; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" role="tab" aria-selected={active} aria-controls={controls} onClick={onClick} className={cn("min-h-11 rounded-full px-3 text-sm font-bold transition-all duration-300 sm:min-h-12 sm:text-base", active ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "text-muted-foreground hover:text-foreground")}>{children}</button>;
}
