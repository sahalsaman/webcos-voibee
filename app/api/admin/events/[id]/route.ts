import { connectDB } from "@/lib/db";
import { ok, fail, handleError, requireApiRole } from "@/lib/api";
import { eventSchema } from "@/lib/validations";
import "@/models";
import Event from "@/models/Event";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Ctx) {
  try {
    await requireApiRole(["admin"]);
    const { id } = await params;
    const data = eventSchema.partial().parse(await request.json());
    await connectDB();

    const update = {
      ...data,
      ...(data.countryCode ? { countryCode: data.countryCode.toUpperCase() } : {}),
      ...(Object.prototype.hasOwnProperty.call(data, "endDate") ? { endDate: data.endDate || null } : {}),
    };
    const event = await Event.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!event) return fail("Event not found", 404);
    return ok(event);
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(_request: Request, { params }: Ctx) {
  try {
    await requireApiRole(["admin"]);
    const { id } = await params;
    await connectDB();
    const res = await Event.findByIdAndDelete(id);
    if (!res) return fail("Event not found", 404);
    return ok({ deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
