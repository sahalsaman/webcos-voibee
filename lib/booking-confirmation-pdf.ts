import type { BookingConfirmation } from "@/lib/booking-confirmation";

function ascii(value: unknown) {
  return String(value ?? "").normalize("NFKD").replace(/[^\x20-\x7E]/g, "-");
}

function escapePdf(value: unknown) {
  return ascii(value).replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

function money(value: number) {
  return `INR ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value)}`;
}

function date(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function line(text: string, x: number, y: number, size = 10, bold = false, color = "0.15 0.18 0.24") {
  return `${color} rg BT /${bold ? "F2" : "F1"} ${size} Tf ${x} ${y} Td (${escapePdf(text)}) Tj ET`;
}

export function createBookingConfirmationPdf(booking: BookingConfirmation, contactNumber: string) {
  const commands: string[] = [
    "0.02 0.55 0.42 rg 0 700 595 142 re f",
    line("VOIBEE HOLIDAYS", 42, 797, 13, true, "1 1 1"),
    line("BOOKING CONFIRMED", 42, 757, 26, true, "1 1 1"),
    line(`Booking ID: ${booking.bookingNumber}`, 42, 730, 12, true, "0.9 1 0.97"),
    line("TRIP DETAILS", 42, 666, 12, true, "0.02 0.45 0.36"),
    line(booking.trip.title, 42, 642, 18, true),
    line(`Destination: ${booking.trip.destination}, ${booking.trip.country}`, 42, 616),
    line(`Travel dates: ${date(booking.travelStartDate)} - ${date(booking.travelEndDate)}`, 42, 596),
    line(`Pickup: ${booking.trip.pickupLocation || "To be confirmed"}`, 42, 576),
    "0.88 0.9 0.93 RG 42 552 m 553 552 l S",
    line("TRAVELER DETAILS", 42, 526, 12, true, "0.02 0.45 0.36"),
    line(`Name: ${booking.travelerDetails.name}`, 42, 501),
    line(`Email: ${booking.travelerDetails.email}`, 42, 481),
    line(`Mobile: ${booking.travelerDetails.mobile}`, 42, 461),
    line(`Travelers: ${booking.travelerDetails.travellers || booking.seats}`, 42, 441),
    "0.88 0.9 0.93 RG 42 417 m 553 417 l S",
    line("PAYMENT SUMMARY", 42, 391, 12, true, "0.02 0.45 0.36"),
    line(`Price per traveler: ${money(booking.sellingPrice)}`, 42, 366),
    line(`Number of travelers: ${booking.seats}`, 42, 346),
    line(`Amount paid: ${money(booking.totalAmount)}`, 42, 317, 15, true),
    line(`Payment status: ${booking.paymentStatus.toUpperCase()}`, 42, 292, 10, true, "0.02 0.55 0.42"),
    "0.96 0.98 0.98 rg 42 184 511 76 re f",
    line("NEED HELP?", 58, 235, 11, true, "0.02 0.45 0.36"),
    line(`Voibee contact: ${contactNumber}`, 58, 213),
    line("Email: support@voibee.com", 58, 194),
    line("Thank you for booking with Voibee. We look forward to your journey!", 42, 132, 10, false, "0.35 0.39 0.45"),
    line("This is a computer-generated booking confirmation.", 42, 82, 8, false, "0.5 0.53 0.58"),
    line("Page 1 of 1", 500, 82, 8, false, "0.5 0.53 0.58"),
  ];
  const stream = commands.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n%Voibee\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf, "ascii");
}
