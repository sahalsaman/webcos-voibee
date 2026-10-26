"use client";

import { signOut } from "next-auth/react";
import { ChevronRight, CircleHelp, LogOut, Mail, Settings, ShieldCheck, UserRound } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type ProfileUser = { name?: string | null; email?: string | null; image?: string | null };

function ProfileRow({ icon: Icon, label, description, onClick, href, danger = false }: {
  icon: typeof UserRound; label: string; description?: string; onClick?: () => void; href?: string; danger?: boolean;
}) {
  const classes = cn("flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-4 text-left shadow-sm ring-1 ring-slate-100 transition-colors hover:bg-slate-50", danger && "text-destructive hover:bg-destructive/5");
  const content = <>
    <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-700", danger && "bg-destructive/10 text-destructive")}><Icon className="size-4.5" /></span>
    <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{label}</span>{description ? <span className="mt-0.5 block truncate text-xs font-normal text-muted-foreground">{description}</span> : null}</span>
    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
  </>;
  if (href) return <a href={href} className={classes}>{content}</a>;
  return <button type="button" onClick={onClick} className={classes}>{content}</button>;
}

export function TravelerProfile({ user }: { user: ProfileUser }) {
  const name = user.name || "Voibee traveler";
  const email = user.email || "No email address added";
  return <section className="mx-auto w-full max-w-md space-y-5">
    <div className="flex flex-col items-center pt-2 text-center">
      <div className="relative"><Avatar src={user.image} name={name} size={80} /><span className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full border-2 border-white bg-primary text-white"><ShieldCheck className="size-3" /></span></div>
      <h1 className="mt-3 text-lg font-bold text-foreground">{name}</h1><p className="text-sm text-muted-foreground">{email}</p>
    </div>
    <div className="space-y-2.5">
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <div className="mb-3 flex items-center gap-2"><span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary"><UserRound className="size-4.5" /></span><h2 className="text-sm font-semibold">Personal information</h2></div>
        <div className="space-y-2 text-sm"><p className="flex items-center gap-2 text-muted-foreground"><Mail className="size-4" /> <span className="truncate">{email}</span></p><p className="text-xs text-muted-foreground">Your account details are protected and used for bookings and travel updates.</p></div>
      </div>
      <ProfileRow icon={Settings} label="Settings" description="Manage preferences and notifications" onClick={() => {}} />
      <ProfileRow icon={CircleHelp} label="Help & support" description="Get help with a booking or your account" href="mailto:support@voibee.com?subject=Voibee%20support%20request" />
      <ProfileRow icon={LogOut} label="Log out" danger onClick={() => signOut({ callbackUrl: "/" })} />
    </div>
  </section>;
}
