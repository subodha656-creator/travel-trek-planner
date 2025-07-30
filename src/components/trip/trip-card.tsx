"use client";

import SupabasePublicImage from "@/lib/helpers/trip-image";
import { Trip } from "@/lib/types";
import {
  Calendar,
  Clock,
  Edit3,
  Heart,
  MapPin,
  Share2,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import ShareTripPopup, { SharedUser, User } from "./share-list-popup";

type TripCardProps = {
  trip: Trip;
  onEdit: (trip: Trip) => void;
  onDelete: (tripId: number) => void;
  viewType?: "grid" | "list";
};

const TripCard = ({
  trip,
  onEdit,
  onDelete,
  viewType = "list",
}: TripCardProps) => {
  const router = useRouter();

  const durationInDays = Math.ceil(
    (new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const handleClick = () => router.push(`/dashboard/trips/${trip.id}`);

  const [openShareTripPopup, setOpenShareTripPopup] = useState(false);

  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);

  const [currentUser, setCurrentUser] = useState<User>({
    id: "",
    name: "",
    email: "",
  });
  
  const handleSearchUsers = async (query: string): Promise<User[]> => {
    const response = await fetch(`/api/users/search?q=${query}`);
    const { data } = await response.json();
    return data ?? [];
  };

  useEffect(() => {
    const sharedUsers = async () => {
      const response = await fetch("/api/users/shared-users", {
        method: "POST",
        body: JSON.stringify({
          tripId: trip.id,
        }),
      });
      const { data, currentUser } = await response.json();
      setCurrentUser(currentUser);
      setSharedUsers(data);
    };
    sharedUsers();
  }, []);

  return (
    <>
      <ShareTripPopup
        isOpen={openShareTripPopup}
        onClose={() => setOpenShareTripPopup(false)}
        tripId={trip.id.toString()}
        tripTitle={trip.title}
        currentUser={currentUser}
        sharedUsers={sharedUsers}
        onSearchUsers={handleSearchUsers}
      />
      <div
        onClick={handleClick}
        className={`${
          viewType === "grid"
            ? "group h-[400px] relative backdrop-blur-xl bg-transparent border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden rounded-4xl before:absolute before:inset-0 before:rounded-4xl before:bg-gradient-to-br before:from-white/30 before:to-white/10 before:-z-10 hover:scale-[1.02] cursor-pointer"
            : "flex flex-col sm:flex-row w-full backdrop-blur-xl bg-transparent border border-white/30 shadow-2xl hover:shadow-3xl overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.01] cursor-pointer before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/30 before:to-white/10 before:-z-10 relative"
        }`}
      >
        <div
          className={`relative z-10 ${
            viewType === "grid" 
              ? "h-48" 
              : "w-full sm:w-1/3 sm:min-w-[240px] h-48 sm:h-full"
          }`}
        >
          <div className={`relative overflow-hidden ${
            viewType === "grid" ? "rounded-t-4xl" : "rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none"
          }`}>
            <SupabasePublicImage
              path={trip.cover_image_url}
              alt={trip.title}
              className="w-full h-full object-cover"
            />
          </div>

          {viewType === "grid" && (
            <div className="absolute top-4 right-4 flex gap-2 z-20">
              <Button className="p-2 backdrop-blur-xl bg-white/90 text-black border border-white/30 rounded-full  hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110">
                <Heart className="w-4 h-4 drop-shadow-sm" />
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenShareTripPopup(true);
                }}
                className="p-2 backdrop-blur-xl bg-white/90 border border-white/30 rounded-full text-black hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              >
                <Share2 className="w-4 h-4 drop-shadow-sm" />
              </Button>
            </div>
          )}

          {viewType === "list" && (
            <div className="absolute top-3 right-3 flex gap-2 z-20 sm:hidden">
              <Button className="p-1.5 backdrop-blur-xl bg-white/20 border border-white/30 rounded-full text-white hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110">
                <Heart className="w-3.5 h-3.5 drop-shadow-sm" />
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenShareTripPopup(true);
                }}
                className="p-1.5 backdrop-blur-xl bg-white/20 border border-white/30 rounded-full text-white hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              >
                <Share2 className="w-3.5 h-3.5 drop-shadow-sm" />
              </Button>
            </div>
          )}

          {viewType === "grid" && (
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">
                {trip.title}
              </h3>
              <p className="text-white/90 text-sm flex items-center gap-1 drop-shadow-md">
                <MapPin className="w-4 h-4" />
                {trip.destination}
              </p>
            </div>
          )}
        </div>

        <div
          className={`p-4 sm:p-6 flex flex-col justify-between z-10 ${
            viewType === "list" ? "flex-1" : ""
          }`}
        >
          {viewType === "list" && (
            <div className="mb-3 sm:mb-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 pr-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 drop-shadow-sm line-clamp-1">
                    {trip.title}
                  </h3>
                  <p className="text-gray-600 flex items-center gap-2 mb-2 drop-shadow-sm text-sm sm:text-base">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">{trip.destination}</span>
                  </p>
                </div>
                {/* Desktop action buttons */}
                <div className="hidden sm:flex gap-2">
                  <Button className="p-2 backdrop-blur-xl bg-white/20 border border-white/30 rounded-full text-gray-700 hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110">
                    <Heart className="w-4 h-4 drop-shadow-sm" />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenShareTripPopup(true);
                    }}
                    className="p-2 backdrop-blur-xl bg-white/20 border border-white/30 rounded-full text-gray-700 hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                  >
                    <Share2 className="w-4 h-4 drop-shadow-sm" />
                  </Button>
                </div>
              </div>
              <p className="text-gray-700 text-sm line-clamp-2 drop-shadow-sm">
                {trip.notes}
              </p>
            </div>
          )}

          <div className="flex flex-col mt-16 sm:flex-row flex-wrap items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-3">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-gray-700 backdrop-blur-sm bg-transparent px-3 py-1.5 rounded-lg border border-white/30 shadow-md text-xs sm:text-sm">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="drop-shadow-sm whitespace-nowrap">
                  {new Date(trip.start_date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: window.innerWidth < 640 ? '2-digit' : 'numeric'
                  })} –{" "}
                  {new Date(trip.end_date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: window.innerWidth < 640 ? '2-digit' : 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 backdrop-blur-sm bg-white/20 px-3 py-1.5 rounded-lg border border-white/30 shadow-md text-xs sm:text-sm">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="drop-shadow-sm whitespace-nowrap">
                  {durationInDays} days
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(trip);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 backdrop-blur-sm bg-travel-primary-light text-white rounded-xl hover:bg-travel-primary-light/60 transition-all duration-300 font-medium border border-travel-primary-light/50 shadow-md hover:shadow-lg hover:scale-105 text-sm sm:text-base"
            >
              <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="drop-shadow-sm">Edit</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(trip.id);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 backdrop-blur-sm bg-travel-secondary-light text-white rounded-xl hover:bg-travel-secondary-light/60 transition-all duration-300 font-medium border border-travel-secondary-light/50 shadow-md hover:shadow-lg hover:scale-105 text-sm sm:text-base"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="drop-shadow-sm">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TripCard;