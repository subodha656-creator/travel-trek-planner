"use client";

import { useActionState, useState } from "react";
import { LucideSearch, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DestinationDropdown from "../trip/destinations-list-dropdown";
import { submitItinerary } from "@/app/actions/create-itinerary-action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const initialState = {
  success: false,
  message: "",
};

export default function TripPlannerForm() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDestinations, setShowDestinations] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const router = useRouter();
  
  const submitData = async (
    prevState: { success: boolean; message: string },
    formData: FormData
  ) => {
    try {
      const { success } = await submitItinerary(prevState, formData);
      if (success) {
        router.push("/dashboard/trips");
      } else {
        router.push("/dashboard/trips");
      }
      return { success, message: success ? "Success" : "Failed" };
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      return { success: false, message: "An error occurred" };
    }
  };

  const [state, formAction, isPending] = useActionState(
    submitData,
    initialState
  );

  return (
    <div className="absolute left-1/2 rounded-3xl -bottom-28 transform -translate-x-1/2 w-full max-w-[1120px] h-[208px] px-4">
      <div className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6">
        <form action={formAction} className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            
            {/* Destination Input */}
            <div className="md:col-span-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose a destination
              </label>
              <div className="relative">
                <Input
                  type="text"
                  name="destination"
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDestinations(true);
                  }}
                  value={searchQuery}
                  placeholder="Search destinations..."
                  className="w-full h-12 px-4 pr-10 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-travel-primary-light focus:border-travel-primary-light text-gray-900"
                />
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <DestinationDropdown
                  showDestinations={showDestinations}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  setShowDestinations={setShowDestinations}
                  setLatitude={setLatitude as () => void}
                  setLongitude={setLongitude as () => void}
                />
              </div>
            </div>

            {/* Date Input */}
            <div className="md:col-span-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose a date
              </label>
              <Input
                type="date"
                name="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full h-12 px-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-travel-primary-light focus:border-travel-primary-light text-gray-900"
              />
            </div>

            <input type="hidden" name="latitude" value={latitude} />
            <input type="hidden" name="longitude" value={longitude} />

            <div className="md:col-span-2">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 bg-travel-primary hover:bg-travel-primary-light text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <LucideSearch className="w-4 h-4" />
                {isPending ? "Searching..." : "Search"}
              </Button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}