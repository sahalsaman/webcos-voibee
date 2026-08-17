import assert from "node:assert/strict";
import test from "node:test";
import {
  BOOKING_STATUSES,
  PAYMENT_STATUSES,
  isCustomDateTripCategory,
} from "../lib/constants";
import { calculateQuotation } from "../lib/quotation";
import {
  bookingSchema,
  campaignSchema,
  payrollSchema,
  quotationSchema,
  supplierSchema,
  leadSchema,
  visaSchema,
  expenseSchema,
  invoiceSchema,
} from "../lib/validations";

test("quotation totals apply capped discount and tax after discount", () => {
  const result = calculateQuotation(
    [
      { description: "Package", quantity: 2, unitPrice: 10_000 },
      { description: "Transfer", quantity: 1, unitPrice: 2_500 },
    ],
    2_500,
    5,
  );
  assert.deepEqual(result, {
    items: [
      { description: "Package", quantity: 2, unitPrice: 10_000, amount: 20_000 },
      { description: "Transfer", quantity: 1, unitPrice: 2_500, amount: 2_500 },
    ],
    subtotal: 22_500,
    discount: 2_500,
    taxAmount: 1_000,
    totalAmount: 21_000,
  });
  assert.equal(calculateQuotation([{ description: "A", quantity: 1, unitPrice: 100 }], 500, 18).totalAmount, 0);
});

test("quotation and operational forms reject missing mandatory fields", () => {
  assert.equal(quotationSchema.safeParse({}).success, false);
  assert.equal(supplierSchema.safeParse({}).success, false);
  assert.equal(campaignSchema.safeParse({}).success, false);
  assert.equal(payrollSchema.safeParse({}).success, false);
});

test("booking validation accepts fixed and custom date payloads but rejects invalid travelers", () => {
  const base = {
    tripId: "trip-1",
    seats: 2,
    travelerDetails: {
      name: "Test Traveler",
      email: "traveler@example.com",
      mobile: "9876543210",
      travellers: 2,
    },
  };
  assert.equal(bookingSchema.safeParse(base).success, true);
  assert.equal(bookingSchema.safeParse({ ...base, travelStartDate: "2026-10-01", travelEndDate: "2026-10-05" }).success, true);
  assert.equal(bookingSchema.safeParse({ ...base, travelerDetails: { ...base.travelerDetails, mobile: "123" } }).success, false);
});

test("custom-date classification and workflow statuses cover implemented paths", () => {
  assert.equal(isCustomDateTripCategory("Family"), true);
  assert.equal(isCustomDateTripCategory("Holiday Package"), false);
  assert.ok(BOOKING_STATUSES.includes("advanced"));
  assert.ok(PAYMENT_STATUSES.includes("processing"));
  assert.ok(PAYMENT_STATUSES.includes("refunded"));
});

test("LMS campaign attribution and visa tracking enforce mandatory fields", () => {
  const lead = { customerName: "Campaign Lead", phone: "9876543210", source: "Marketing Campaign", status: "new", travelers: 2, budget: 50000 };
  assert.equal(leadSchema.safeParse(lead).success, false);
  assert.equal(leadSchema.safeParse({ ...lead, campaignId: "campaign-1" }).success, true);
  assert.equal(visaSchema.safeParse({ applicantName: "Visa Customer", phone: "9876543210", passportNumber: "P123456", destinationCountry: "UAE", visaType: "Tourist", status: "documents_pending" }).success, true);
  assert.equal(visaSchema.safeParse({ applicantName: "A" }).success, false);
});

test("finance expense and invoice forms validate money and date workflows", () => {
  assert.equal(expenseSchema.safeParse({ title: "Hotel advance", category: "Accommodation", amount: 5000, expenseDate: "2026-09-01", status: "approved" }).success, true);
  assert.equal(expenseSchema.safeParse({ title: "Bad", category: "Ops", amount: 0, expenseDate: "" }).success, false);
  assert.equal(invoiceSchema.safeParse({ customerName: "Test Customer", description: "Tour balance", amount: 15000, issueDate: "2026-09-10", dueDate: "2026-09-20", status: "sent" }).success, true);
  assert.equal(invoiceSchema.safeParse({ customerName: "Test Customer", description: "Tour balance", amount: 15000, issueDate: "2026-09-20", dueDate: "2026-09-10", status: "sent" }).success, false);
});
