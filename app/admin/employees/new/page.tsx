import { EmployeeForm } from "@/components/admin/employee-form";

export default function NewEmployeePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Employee</h1>
        <p className="text-muted-foreground">Add an internal team member</p>
      </div>
      <EmployeeForm />
    </div>
  );
}
