import { connectDB } from "@/lib/db";
import { ok, fail, handleError, requireApiRole } from "@/lib/api";
import { employeeSchema } from "@/lib/validations";
import "@/models";
import Employee from "@/models/Employee";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Ctx) {
  try {
    await requireApiRole(["admin"]);
    const { id } = await params;
    const data = employeeSchema.partial().parse(await request.json());
    await connectDB();
    const update: Record<string, unknown> = { ...data };
    if (data.joinedAt !== undefined) update.joinedAt = data.joinedAt ? new Date(data.joinedAt) : null;
    const employee = await Employee.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!employee) return fail("Employee not found", 404);
    return ok(employee);
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(_request: Request, { params }: Ctx) {
  try {
    await requireApiRole(["admin"]);
    const { id } = await params;
    await connectDB();
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) return fail("Employee not found", 404);
    return ok({ deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
