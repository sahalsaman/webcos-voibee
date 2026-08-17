import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { ok, fail, handleError } from "@/lib/api";
import { travelerRegisterSchema } from "@/lib/validations";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body?.role === "partner") {
      return fail("Partner accounts are invite-only. Please contact admin.", 403);
    }

    const data = travelerRegisterSchema.parse(body);
    await connectDB();
    const passwordHash = await bcrypt.hash(data.password, 10);
    const existing = await User.findOne({ email: data.email }).select("+password role");
    if (existing?.password || (existing && existing.role !== "traveler")) {
      return fail("An account with this email already exists", 409);
    }
    const user = existing
      ? await User.findByIdAndUpdate(existing._id, { $set: { name: data.name, mobile: data.mobile, password: passwordHash } }, { returnDocument: "after" })
      : await User.create({ name: data.name, email: data.email, mobile: data.mobile, password: passwordHash, role: "traveler" });
    return ok({ id: String(user._id), role: "traveler" }, 201);
  } catch (err) {
    return handleError(err);
  }
}
