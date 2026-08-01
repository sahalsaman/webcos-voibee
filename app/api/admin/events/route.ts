import { connectDB } from "@/lib/db";
import { ok, handleError, requireApiRole } from "@/lib/api";
import { eventSchema } from "@/lib/validations";
import "@/models";
import Event from "@/models/Event";

export async function GET() {
  try {
    await requireApiRole(["admin"]);
    await connectDB();
    const events = await Event.find({}).sort({ startDate: 1, sortOrder: 1, createdAt: -1 }).lean();
    return ok(events);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(request: Request) {
  try {
    await requireApiRole(["admin"]);
    const data = eventSchema.parse(await request.json());
    await connectDB();
    const event = await Event.create({
      ...data,
      countryCode: data.countryCode.toUpperCase(),
      endDate: data.endDate || null,
    });
    return ok({ id: String(event._id) }, 201);
  } catch (err) {
    return handleError(err);
  }
}
