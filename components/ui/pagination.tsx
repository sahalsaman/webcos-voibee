import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Build a query string preserving existing params with a new page number. */
function pageHref(base: string, params: Record<string, string>, page: number) {
  const sp = new URLSearchParams(params);
  sp.set("page", String(page));
  return `${base}?${sp.toString()}`;
}

export function Pagination({
  base,
  params,
  page,
  totalPages,
}: {
  base: string;
  params: Record<string, string>;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <nav className="mt-10 flex items-center justify-center gap-1">
      <PagerLink
        href={pageHref(base, params, Math.max(1, page - 1))}
        disabled={page <= 1}
        aria-label="Previous"
      >
        <ChevronLeft className="size-4" />
      </PagerLink>

      {pages.map((p, idx) => {
        const prev = pages[idx - 1];
        const gap = prev && p - prev > 1;
        return (
          <span key={p} className="flex items-center">
            {gap ? <span className="px-2 text-muted-foreground">…</span> : null}
            <Link
              href={pageHref(base, params, p)}
              className={cn(
                "flex size-9 items-center justify-center rounded-md border text-sm font-medium transition-colors",
                p === page
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-secondary",
              )}
            >
              {p}
            </Link>
          </span>
        );
      })}

      <PagerLink
        href={pageHref(base, params, Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        aria-label="Next"
      >
        <ChevronRight className="size-4" />
      </PagerLink>
    </nav>
  );
}

function PagerLink({
  href,
  disabled,
  children,
  ...rest
}: {
  href: string;
  disabled?: boolean;
  children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (disabled) {
    return (
      <span className="flex size-9 cursor-not-allowed items-center justify-center rounded-md border border-border opacity-40">
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="flex size-9 items-center justify-center rounded-md border border-border hover:bg-secondary"
      {...rest}
    >
      {children}
    </Link>
  );
}
