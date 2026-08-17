import { EmployeeSection } from "@/components/admin/employee-section"; import { listAdminEmployees } from "@/lib/dashboard"; import type { EmployeeDTO } from "@/types";
export default async function HrmEmployeesPage(){const employees=await listAdminEmployees() as EmployeeDTO[];return <EmployeeSection employees={employees}/>}
