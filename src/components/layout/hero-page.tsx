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
import TripPlannerForm from "./mega-search-box";



const Hero = () => {
  const [selectedDate, setSelectedDate] = useState("");

  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDestinations, setShowDestinations] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const router = useRouter();
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);


  return (
    <div className="relative min-h-[800px] border-b-[2px] border-[outset]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(0, 40, 146, 0.4) 100%), url('/assets/himalaya2.png')`,
        }}
      >
        {/* <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 rounded-4xl"></div> */}
      </div>

      <div className="relative z-10 max-w-7xl mb-[168px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center h-full pt-[230px]">
        {/* <div className="mb-4 flex justify-center items-center">
          <div className="inline-flex items-center space-x-2 bg-gray-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="font-medium">Trusted</span>
            <span className="text-gray-300">·</span>
            <span>Smart Travel Planning Platform</span>
          </div>
        </div> */}

        <div className="text-center w-full mb-8">
          <h1 className="text-4xl max-w-6xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Plan your perfect{" "}
            <br/>
            <span className="font-secondary italic bg-clip-text bg-gradient-to-r text-white">
              adventure
            </span>
            {"   "}
            <span className="text-white"></span>
          </h1>
          <p className="text-xl text-white font-medium text-center">
            Less planning more trips are ready for you
          </p>
        </div>
        <Button className="bg-travel-primary rounded-[90px] p-6 hover:bg-travel-primary-light w-[265px] shadow-[0_0_0_6px_rgba(255,255,255,0.4)]">Start now</Button>
      </div>
     <TripPlannerForm />
    </div>
  );
};

export default Hero;
