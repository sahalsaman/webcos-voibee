import { LmsNav } from "@/components/admin/lms-nav";

export default function LmsLayout({ children }: { children: React.ReactNode }) {
  return <div className="space-y-5"><div><h1 className="text-2xl font-bold">Lead Management System</h1></div><LmsNav />{children}</div>;
}
