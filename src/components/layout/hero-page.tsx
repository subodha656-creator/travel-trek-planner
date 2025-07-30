"use client";
import React, { useActionState, useEffect, useState } from "react";
import {
  Calendar,
  Users,
  ChevronDown,
  CheckCircle,
  MapPin,
  ArrowRight,
  Globe,
} from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { submitItinerary } from "@/app/actions/create-itinerary-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import DestinationDropdown from "../trip/destinations-list-dropdown";

const initialState = {
  success: false,
  message: "",
};

const Hero = () => {
  const [selectedDate, setSelectedDate] = useState("");

  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDestinations, setShowDestinations] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const router = useRouter()
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

 

  const submitData = async (
    prevState: { success: boolean; message: string; },
    formData: FormData
  ) => {
    try{
      const {success} = await submitItinerary(prevState, formData);
      if(success){
        router.push('/dashboard/trips')
      }
      router.push("/dashboard/trips")

      return {success, message: success ? 'Success' : 'Failed'};
    }
    catch(error){
        toast.error(error instanceof Error ? error.message : 'An error occurred')
        return {success: false, message: 'An error occurred'};
    }
  };

  const [state, formAction, isPending] = useActionState(
    submitData,
    initialState
  );
  return (
    <div className="relative md:min-h-screen min-h-[150vh] bg-gradient-to-b border-b-[2px] border-[outset] from-blue-900/20 to-blue-600/30 rounded-4xl">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-4xl"
        style={{
          backgroundImage: `url('/assets/himalaya.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 rounded-4xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 flex flex-col justify-center items-center">
        <div className="mb-4 flex justify-center items-center">
          <div className="inline-flex items-center space-x-2 bg-gray-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="font-medium">Trusted</span>
            <span className="text-gray-300">·</span>
            <span>Smart Travel Planning Platform</span>
          </div>
        </div>

        {/* Main Heading */}
        <div className=" mb-12 text-center w-full">
          <h1 className="text-5xl max-w-6xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Plan your{" "}
            <span className="text-transparent font-secondary italic bg-clip-text bg-gradient-to-r from-travel-primary to-travel-primary-light">
              Perfect Travel Adventure with ease
            </span>
            {"   "}
            <span className="text-white"></span>
          </h1>
          <p className="text-xl text-white font-medium text-center">
            Improve trip, visit local efficiently for more profit and time for
            you
          </p>
        </div>
      </div>
      <div className="bg-white border-[1px] border-[outset]/60 rounded-4xl shadow-2xl p-6 pt-4 lg:max-w-6xl lg:w-full md:w-[700px] w-80 absolute md:bottom-12 bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2    ">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Start Planning Your Trip!
        </h2>

        <form
          action={formAction}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Where to?
            </label>
            <div className="relative flex justify-between items-center">
              <Input
                type="text"
                name="destination"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDestinations(true);
                }}
                value={searchQuery}
                placeholder="Search destinations..."
                className="w-full px-4 py-3 border-[outset]/60 border-[1px] rounded-2xl focus:ring-1 focus:ring-travel-primary-light focus:border-travel-primary-light text-gray-900"
              />
              <MapPin className="absolute right-3 top-2 w-5 h-5 text-gray-400 pointer-events-none" />
              <DestinationDropdown
                showDestinations={showDestinations}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setShowDestinations={setShowDestinations}
                setLatitude={setLatitude}
                setLongitude={setLongitude}
              />
              
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Choose a date
            </label>
            <div className="relative">
              <Input
                type="date"
                name="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 border-[outset]/60 border-[1px] rounded-2xl focus:ring-1 focus:ring-travel-primary-light focus:border-travel-primary-light text-gray-900"
              />
            </div>
          </div>
              <input type="hidden" name="latitude" value={latitude} />
              <input type="hidden" name="longitude" value={longitude} />

          <div>
            <Button isLoading={isPending} className="w-full bg-travel-primary hover:bg-travel-primary-light text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
              Create Itinerary
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Hero;
