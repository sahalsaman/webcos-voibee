import crypto from "crypto";
import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

/** True only when real Razorpay credentials are present. */
export const razorpayConfigured = Boolean(keyId && keySecret);

export const publicKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || keyId || "";

let client: Razorpay | null = null;
export function getRazorpay(): Razorpay | null {
  if (!razorpayConfigured) return null;
  if (!client) client = new Razorpay({ key_id: keyId!, key_secret: keySecret! });
  return client;
}

/** Create an order; amount is in rupees and converted to paise. */
export async function createOrder(amountRupees: number, receipt: string) {
  const rzp = getRazorpay();
  if (!rzp) return null;
  return rzp.orders.create({
    amount: Math.round(amountRupees * 100),
    currency: "INR",
    receipt,
  });
}

/** HMAC-SHA256 verification of the Razorpay checkout response. */
export function verifySignature(orderId: string, paymentId: string, signature: string) {
  if (!keySecret) return false;
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}
