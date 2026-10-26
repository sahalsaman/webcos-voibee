import MyBookingsPage from "@/components/traveler/mybookings";

export default function TravelerBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  return <MyBookingsPage searchParams={searchParams} />;
}
