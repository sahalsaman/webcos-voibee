import { connectDB } from "@/lib/db";
import { ok, handleError, requireApiRole } from "@/lib/api";
import { employeeSchema } from "@/lib/validations";
import "@/models";
import Employee from "@/models/Employee";

export async function GET() {
  try {
    await requireApiRole(["admin"]);
    await connectDB();
    const employees = await Employee.find({}).sort({ createdAt: -1 }).lean();
    return ok(employees);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(request: Request) {
  try {
    await requireApiRole(["admin"]);
    const data = employeeSchema.parse(await request.json());
    await connectDB();
    const employee = await Employee.create({ ...data, joinedAt: data.joinedAt ? new Date(data.joinedAt) : undefined });
    return ok({ id: String(employee._id) }, 201);
  } catch (err) {
    return handleError(err);
  }
}
