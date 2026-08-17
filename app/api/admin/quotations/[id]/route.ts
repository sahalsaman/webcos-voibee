import { connectDB } from "@/lib/db";
import { fail, handleError, ok, requireApiRole } from "@/lib/api";
import { calculateQuotation } from "@/lib/quotation";
import { quotationSchema } from "@/lib/validations";
import "@/models";
import Quotation from "@/models/Quotation";
import Lead from "@/models/Lead";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Ctx) {
  try {
    await requireApiRole(["admin"]);
    const { id } = await params;
    const data = quotationSchema.parse(await request.json());
    const totals = calculateQuotation(data.items, data.discount, data.taxRate);
    await connectDB();
    const current = await Quotation.findById(id).select("lead");
    if (!current) return fail("Quotation not found", 404);
    const quotation = await Quotation.findByIdAndUpdate(
      id,
      {
        ...data,
        ...totals,
        lead: data.leadId || null,
        customer: data.customerId || null,
        trip: data.itineraryId || null,
        customerEmail: data.customerEmail?.toLowerCase() ?? "",
        validUntil: new Date(data.validUntil),
      },
      { new: true, runValidators: true },
    ).lean();
    if (!quotation) return fail("Quotation not found", 404);
    if (current.lead && String(current.lead) !== data.leadId) {
      await Lead.updateOne({ _id: current.lead, quotation: id }, { $set: { quotation: null } });
    }
    if (data.leadId) {
      await Lead.findByIdAndUpdate(data.leadId, { quotation: id, status: data.status === "accepted" ? "won" : data.status === "rejected" ? "lost" : "quoted" });
    }
    return ok(quotation);
  } catch (err) {
    return handleError(err);
  }
}
