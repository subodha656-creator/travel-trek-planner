import { TripProvider } from "@/context/trip-context";


export const dynamic = 'force-dynamic';
export default function ItineraryPage({
    children
}: {
    children: React.ReactNode;
}) {
  return (
    <TripProvider>
     {
        children
     }
    </TripProvider>
  );
}
