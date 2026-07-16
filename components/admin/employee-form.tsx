"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EMPLOYEE_STATUSES } from "@/lib/constants";
import type { EmployeeDTO } from "@/types";

function toDateInput(value?: string) {
  return value ? new Date(value).toISOString().slice(0, 10) : "";
}

export function EmployeeForm({ employee }: { employee?: EmployeeDTO }) {
  const router = useRouter();
  const editing = Boolean(employee);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: employee?.name ?? "",
    email: employee?.email ?? "",
    mobile: employee?.mobile ?? "",
    designation: employee?.designation ?? "",
    department: employee?.department ?? "Operations",
    status: employee?.status ?? "active",
    salary: employee?.salary ?? 0,
    joinedAt: toDateInput(employee?.joinedAt),
    notes: employee?.notes ?? "",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(editing ? `/api/admin/employees/${employee!._id}` : "/api/admin/employees", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, salary: Number(form.salary) || 0 }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Save failed");
      toast.success(editing ? "Employee updated" : "Employee added");
      router.push("/admin/employees");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
          <div>
            <Label className="mb-1.5 block">Name</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} required />
          </div>
          <div>
            <Label className="mb-1.5 block">Email</Label>
            <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
          </div>
          <div>
            <Label className="mb-1.5 block">Mobile</Label>
            <Input value={form.mobile} onChange={(e) => set("mobile", e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5 block">Designation</Label>
            <Input value={form.designation} onChange={(e) => set("designation", e.target.value)} required />
          </div>
          <div>
            <Label className="mb-1.5 block">Department</Label>
            <Input value={form.department} onChange={(e) => set("department", e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5 block">Status</Label>
            <Select value={form.status} onChange={(e) => set("status", e.target.value as typeof form.status)}>
              {EMPLOYEE_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block">Monthly salary</Label>
            <Input type="number" min={0} value={form.salary} onChange={(e) => set("salary", Number(e.target.value))} />
          </div>
          <div>
            <Label className="mb-1.5 block">Joined date</Label>
            <Input type="date" value={form.joinedAt} onChange={(e) => set("joinedAt", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-1.5 block">Notes</Label>
            <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} className="min-h-24" />
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/employees")}>Cancel</Button>
        <Button type="submit" variant="gradient" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {editing ? "Save employee" : "Add employee"}
        </Button>
      </div>
    </form>
  );
}
