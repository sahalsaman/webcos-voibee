import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { ok, fail, handleError } from "@/lib/api";
import { slugify } from "@/lib/utils";
import {
  travelerRegisterSchema,
  partnerRegisterSchema,
} from "@/lib/validations";
import User from "@/models/User";
import Partner from "@/models/Partner";

async function uniquePartnerSlug(base: string) {
  const root = slugify(base) || "partner";
  let slug = root;
  let i = 1;
  // Cheap collision loop; partner sign-ups are low-volume.
  while (await Partner.exists({ slug })) {
    slug = `${root}-${i++}`;
  }
  return slug;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const role = body?.role === "partner" ? "partner" : "traveler";

    if (role === "partner") {
      const data = partnerRegisterSchema.parse(body); // validate before DB work
      await connectDB();
      if (await User.exists({ email: data.email })) {
        return fail("An account with this email already exists", 409);
      }
      const passwordHash = await bcrypt.hash(data.password, 10);
      const user = await User.create({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        password: passwordHash,
        role: "partner",
        image: data.profileImage || undefined,
      });
      const slug = await uniquePartnerSlug(data.businessName);
      await Partner.create({
        user: user._id,
        businessName: data.businessName,
        slug,
        partnerType: data.partnerType ?? "Travel Agency",
        profileImage: data.profileImage || undefined,
        contactEmail: data.email,
        contactPhone: data.mobile,
        socialLinks: data.socialLinks ?? [],
        status: "pending",
      });
      return ok({ id: String(user._id), role: "partner", slug }, 201);
    }

    const data = travelerRegisterSchema.parse(body);
    await connectDB();
    if (await User.exists({ email: data.email })) {
      return fail("An account with this email already exists", 409);
    }
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await User.create({
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      password: passwordHash,
      role: "traveler",
    });
    return ok({ id: String(user._id), role: "traveler" }, 201);
  } catch (err) {
    return handleError(err);
  }
}
