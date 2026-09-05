import type { BookingConfirmation } from "@/lib/booking-confirmation";
import { buildMultiPagePdf, pdfLine as line } from "@/lib/simple-pdf";

function money(value: number) {
  return `INR ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value)}`;
}

function date(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function wrapText(value: string, limit = 86) {
  const words = value.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const lines: string[] = [];
  let current = "";
  words.forEach((word) => {
    if (`${current} ${word}`.trim().length > limit && current) {
      lines.push(current);
      current = word;
    } else current = `${current} ${word}`.trim();
  });
  if (current) lines.push(current);
  return lines;
}

function itineraryPages(booking: BookingConfirmation) {
  if (!booking.trip.itinerary?.length) return [];
  const pages: string[][] = [];
  let commands: string[] = [];
  let y = 0;

  const startPage = () => {
    if (commands.length) pages.push(commands);
    commands = [
      "0.02 0.55 0.42 rg 0 774 595 68 re f",
      line("VOIBEE HOLIDAYS", 42, 810, 11, true, "1 1 1"),
      line(`ITINERARY - ${booking.trip.title}`, 42, 788, 16, true, "1 1 1"),
    ];
    y = 742;
  };
  const ensureSpace = (height = 24) => { if (y - height < 62) startPage(); };
  const add = (text: string, options: { size?: number; bold?: boolean; color?: string; indent?: number; gap?: number; limit?: number } = {}) => {
    const { size = 9, bold = false, color = "0.15 0.18 0.24", indent = 0, gap = 14, limit = 86 - Math.round(indent / 5) } = options;
    const wrapped = wrapText(text, limit);
    wrapped.forEach((textLine) => {
      ensureSpace(gap);
      commands.push(line(textLine, 42 + indent, y, size, bold, color));
      y -= gap;
    });
  };

  startPage();
  booking.trip.itinerary.forEach((day, index) => {
    ensureSpace(90);
    if (index > 0) y -= 8;
    commands.push("0.93 0.97 0.96 rg 42 " + (y - 10) + " 511 30 re f");
    commands.push(line(`DAY ${day.day || index + 1}: ${day.title}`, 54, y, 12, true, "0.02 0.45 0.36"));
    y -= 34;
    if (day.description) add(day.description, { gap: 14 });

    const transports = day.transports ?? [];
    if (transports.length) {
      add("TRANSPORT", { size: 9, bold: true, color: "0.02 0.45 0.36", gap: 16 });
      transports.forEach((item) => {
        add(`- ${item.title}`, { bold: true, indent: 8 });
        if (item.description) add(item.description, { indent: 18, color: "0.35 0.39 0.45" });
      });
    }

    const hotels = day.hotels ?? [];
    if (hotels.length) {
      add("HOTEL", { size: 9, bold: true, color: "0.02 0.45 0.36", gap: 16 });
      hotels.forEach((hotel) => {
        add(`- ${hotel.name}`, { bold: true, indent: 8 });
        if (hotel.description) add(hotel.description, { indent: 18, color: "0.35 0.39 0.45" });
      });
    }

    if (day.meals?.length) add(`MEALS: ${day.meals.map((meal) => meal.charAt(0).toUpperCase() + meal.slice(1)).join(", ")}`, { bold: true, color: "0.02 0.45 0.36" });

    const sightseeing = day.sightseeing ?? [];
    if (sightseeing.length) {
      add("SIGHTSEEING", { size: 9, bold: true, color: "0.02 0.45 0.36", gap: 16 });
      sightseeing.forEach((place) => {
        add(`- ${place.name}`, { bold: true, indent: 8 });
        if (place.description) add(place.description, { indent: 18, color: "0.35 0.39 0.45" });
      });
    }
  });
  if (commands.length) pages.push(commands);
  return pages;
}

export function createBookingConfirmationPdf(booking: BookingConfirmation, contactNumber: string) {
  const itinerary = itineraryPages(booking);
  const pageCount = 1 + itinerary.length;
  const confirmationPage: string[] = [
    "0.02 0.55 0.42 rg 0 700 595 142 re f",
    line("VOIBEE HOLIDAYS", 42, 797, 13, true, "1 1 1"),
    line("BOOKING DETAILS", 42, 757, 26, true, "1 1 1"),
    line(`Booking ID: ${booking.bookingNumber}`, 42, 730, 12, true, "0.9 1 0.97"),
    line("TRIP DETAILS", 42, 666, 12, true, "0.02 0.45 0.36"),
    line(booking.trip.title, 42, 642, 18, true),
    line(`Destination: ${booking.trip.destination}, ${booking.trip.country}`, 42, 616),
    line(`Travel dates: ${date(booking.travelStartDate)} - ${date(booking.travelEndDate)}`, 42, 596),
    line(`Departure: ${booking.travelerDetails.departureCity || booking.trip.pickupLocation || "Joining Direct"}`, 42, 576),
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
    line(`${booking.paymentStatus === "paid" ? "Amount paid" : "Booking total"}: ${money(booking.totalAmount)}`, 42, 317, 15, true),
    line(`Payment status: ${booking.paymentStatus.toUpperCase()}`, 42, 292, 10, true, "0.02 0.55 0.42"),
    "0.96 0.98 0.98 rg 42 184 511 76 re f",
    line("NEED HELP?", 58, 235, 11, true, "0.02 0.45 0.36"),
    line(`Voibee contact: ${contactNumber}`, 58, 213),
    line("Email: support@voibee.com", 58, 194),
    line(booking.trip.itinerary?.length ? "Your detailed itinerary continues on the following page." : "Thank you for booking with Voibee. We look forward to your journey!", 42, 132, 10, false, "0.35 0.39 0.45"),
    line("This is a computer-generated booking document.", 42, 82, 8, false, "0.5 0.53 0.58"),
    line(`Page 1 of ${pageCount}`, 500, 82, 8, false, "0.5 0.53 0.58"),
  ];

  itinerary.forEach((commands, index) => commands.push(
    line(`Page ${index + 2} of ${pageCount}`, 500, 36, 8, false, "0.5 0.53 0.58"),
  ));
  return buildMultiPagePdf([confirmationPage, ...itinerary]);
}
