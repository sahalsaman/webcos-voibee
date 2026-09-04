"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function DestinationSwitcher({ india, global, hasIndia = true, inline = false, heading, className }: { india: React.ReactNode; global: React.ReactNode; hasIndia?: boolean; inline?: boolean; heading?: string; className?: string }) {
  const [active, setActive] = useState<"india" | "global">(hasIndia ? "india" : "global");

  if (!hasIndia) return <div className={className}>{heading ? <h2 className="mb-7 text-2xl font-bold sm:text-3xl">{heading}</h2> : null}{global}</div>;

  return <div className={cn(inline ? "space-y-7" : "space-y-8", className)}>
    <div className={cn(inline && "flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between")}>
      {inline && heading ? <h2 className="text-2xl font-bold sm:text-3xl">{heading}</h2> : null}
    <div className={cn("grid w-full max-w-[280px] grid-cols-2 rounded-full bg-card p-1 shadow-[0_10px_26px_rgba(15,23,42,0.09)] ring-1 ring-border/50", inline ? "sm:ml-auto" : "mx-auto")} role="tablist" aria-label="Destination region">
      <SwitchButton active={active === "india"} onClick={() => setActive("india")} controls="india-destinations">India</SwitchButton>
      <SwitchButton active={active === "global"} onClick={() => setActive("global")} controls="global-destinations">International</SwitchButton>
    </div>
    </div>
    <div id="india-destinations" role="tabpanel" hidden={active !== "india"}>{india}</div>
    <div id="global-destinations" role="tabpanel" hidden={active !== "global"}>{global}</div>
  </div>;
}

function SwitchButton({ active, controls, onClick, children }: { active: boolean; controls: string; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" role="tab" aria-selected={active} aria-controls={controls} onClick={onClick} className={cn("min-h-9 rounded-full px-2.5 text-xs font-bold transition-all duration-300 sm:min-h-10 sm:text-sm", active ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "text-muted-foreground hover:text-foreground")}>{children}</button>;
}
