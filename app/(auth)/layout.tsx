import Link from "next/link";
import Image from "next/image";
import { Compass, Quote } from "lucide-react";

const SIDE_IMG =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=70";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden lg:block">
        <Image src={SIDE_IMG} alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-brand-gradient/85 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white/20">
              <Compass className="size-6" />
            </span>
            Tripnox
          </Link>
          <div>
            <Quote className="size-10 opacity-60" />
            <p className="mt-4 max-w-md text-2xl font-semibold leading-snug">
              The marketplace where travelers find their next adventure and
              partners turn passion into profit.
            </p>
            <p className="mt-4 text-white/80">Join thousands already exploring with Tripnox.</p>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 flex items-center gap-2 text-lg font-bold lg:hidden"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-brand-gradient text-white">
              <Compass className="size-5" />
            </span>
            Trip<span className="text-gradient">nox</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
