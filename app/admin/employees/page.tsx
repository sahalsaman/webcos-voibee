import Link from "next/link";
import { Plus, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmployeeRowActions } from "@/components/admin/employee-row-actions";
import { listAdminEmployees } from "@/lib/dashboard";
import { formatDate, formatINR } from "@/lib/utils";
import type { EmployeeDTO } from "@/types";

export default async function AdminEmployeesPage() {
  const employees = (await listAdminEmployees()) as EmployeeDTO[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Employees</h1>
          <p className="text-muted-foreground">Manage internal team members</p>
        </div>
        <Button asChild variant="gradient"><Link href="/admin/employees/new"><Plus className="size-4" /> New Employee</Link></Button>
      </div>

      {employees.length ? (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-4 font-medium">Employee</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Salary</th>
                  <th className="p-4 font-medium">Joined</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee._id} className="border-b border-border/50 hover:bg-secondary/40">
                    <td className="p-4"><p className="font-medium">{employee.name}</p><p className="text-xs text-muted-foreground">{employee.email} · {employee.mobile || "no mobile"}</p></td>
                    <td className="p-4"><p>{employee.designation}</p><p className="text-xs text-muted-foreground">{employee.department}</p></td>
                    <td className="p-4 font-medium">{formatINR(employee.salary)}</td>
                    <td className="p-4 text-muted-foreground">{employee.joinedAt ? formatDate(employee.joinedAt) : "-"}</td>
                    <td className="p-4"><StatusBadge status={employee.status} /></td>
                    <td className="p-4"><EmployeeRowActions id={employee._id} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <EmptyState icon={UsersRound} title="No employees yet" description="Add employees to track team, salary and status." action={<Button asChild variant="gradient"><Link href="/admin/employees/new"><Plus className="size-4" /> New Employee</Link></Button>} />
      )}
    </div>
  );
}
