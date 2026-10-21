"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Download, Share, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const SESSION_SEEN_KEY = "voibee-install-prompt-session-seen";

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function isInstalled() {
  return window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<InstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);

  useEffect(() => {
    // This component can remount during an in-app redirect. Record the first
    // visit for this browser tab before scheduling anything, so navigation
    // never shows an install prompt that was not shown at app launch.
    if (window.sessionStorage.getItem(SESSION_SEEN_KEY)) return;
    window.sessionStorage.setItem(SESSION_SEEN_KEY, "true");
    if (isInstalled()) return;
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as InstallPromptEvent);
      window.setTimeout(() => setShow(true), 1200);
    };
    const onAppInstalled = () => {
      setShow(false);
      setDeferredPrompt(null);
    };
    const appleDevice = isIOS();
    const initialPromptTimer = window.setTimeout(() => {
      setIos(appleDevice);
      setShow(true);
    }, 1200);
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.clearTimeout(initialPromptTimer);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  function close() {
    setShow(false);
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShow(false);
  }

  if (!show) return null;
  return <div className="fixed inset-x-0 bottom-0 z-[80] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:hidden" role="dialog" aria-label="Install Voibee app">
    <div className="mx-auto max-w-md rounded-3xl border border-white/20 bg-slate-950 p-5 text-white shadow-2xl">
      <div className="flex items-start gap-3"><div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient"><Image src="/voibee-logo-white.png" alt="" width={36} height={16} className="h-auto w-9 object-contain" /></div><div className="min-w-0 flex-1"><h2 className="font-extrabold">Add Voibee to your phone</h2><p className="mt-1 text-sm leading-5 text-white/75">Get faster access to your holidays and bookings, right from your home screen.</p></div><button type="button" onClick={close} className="rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white" aria-label="Dismiss install prompt"><X className="size-5" /></button></div>
      {ios ? <div className="mt-4 rounded-2xl bg-white/10 p-3 text-sm leading-5 text-white/85"><span className="inline-flex items-center gap-1 font-bold text-white"><Share className="size-4" /> Tap Share</span>, then choose <strong>Add to Home Screen</strong>.</div> : deferredPrompt ? <Button type="button" variant="gradient" size="lg" className="mt-4 w-full rounded-xl" onClick={install}><Download className="size-4" />Install app</Button> : <div className="mt-4 rounded-2xl bg-white/10 p-3 text-sm leading-5 text-white/85">To install, open this site in Chrome and choose <strong>Install app</strong> from the browser menu.</div>}
    </div>
  </div>;
}
