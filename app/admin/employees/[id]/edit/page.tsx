import { notFound } from "next/navigation";
import { EmployeeForm } from "@/components/admin/employee-form";
import { getAdminEmployeeById } from "@/lib/dashboard";
import type { EmployeeDTO } from "@/types";

export default async function EditEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const employee = (await getAdminEmployeeById(id)) as EmployeeDTO | null;
  if (!employee) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Employee</h1>
        <p className="text-muted-foreground">{employee.name}</p>
      </div>
      <EmployeeForm employee={employee} />
    </div>
  );
}
