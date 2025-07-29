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
            ? "group relative backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden rounded-4xl before:absolute before:inset-0 before:rounded-4xl before:bg-gradient-to-br before:from-white/30 before:to-white/10 before:-z-10 hover:scale-[1.02] cursor-pointer"
            : "flex w-full backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl hover:shadow-3xl overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.01] cursor-pointer before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/30 before:to-white/10 before:-z-10 relative"
        }`}
      >
        <div
          className={`relative z-10 ${
            viewType === "grid" ? "h-48" : "w-1/3 min-w-[240px] h-full"
          }`}
        >
          <div className="relative overflow-hidden rounded-t-4xl">
            <SupabasePublicImage
              path={trip.cover_image_url}
              alt={trip.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {viewType === "grid" && (
            <div className="absolute top-4 right-4 flex gap-2 z-20">
              <Button className="p-2 backdrop-blur-xl bg-white/20 border border-white/30 rounded-full text-white hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110">
                <Heart className="w-4 h-4 drop-shadow-sm" />
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenShareTripPopup(true);
                }}
                className="p-2 backdrop-blur-xl bg-white/20 border border-white/30 rounded-full text-white hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              >
                <Share2 className="w-4 h-4 drop-shadow-sm" />
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
          className={`p-6 flex flex-col justify-between z-10 ${
            viewType === "list" ? "flex-1" : ""
          }`}
        >
          {viewType === "list" && (
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-1 drop-shadow-sm">
                {trip.title}
              </h3>
              <p className="text-gray-600 flex items-center gap-2 mb-2 drop-shadow-sm">
                <MapPin className="w-4 h-4" />
                {trip.destination}
              </p>
              <p className="text-gray-700 text-sm line-clamp-2 drop-shadow-sm">
                {trip.notes}
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-2 text-gray-700 backdrop-blur-sm bg-white/20 px-3 py-1 rounded-lg border border-white/30 shadow-md">
              <Calendar className="w-4 h-4" />
              <span className="text-sm drop-shadow-sm">
                {new Date(trip.start_date).toLocaleDateString()} –{" "}
                {new Date(trip.end_date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 backdrop-blur-sm bg-white/20 px-3 py-1 rounded-lg border border-white/30 shadow-md">
              <Clock className="w-4 h-4" />
              <span className="text-sm drop-shadow-sm">
                {durationInDays} days
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(trip);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 backdrop-blur-sm bg-blue-100/60 text-blue-700 rounded-xl hover:bg-blue-200/60 transition-all duration-300 font-medium border border-blue-200/50 shadow-md hover:shadow-lg hover:scale-105"
            >
              <Edit3 className="w-4 h-4" />
              <span className="drop-shadow-sm">Edit</span>
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(trip.id);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 backdrop-blur-sm bg-red-100/60 text-red-700 rounded-xl hover:bg-red-200/60 transition-all duration-300 font-medium border border-red-200/50 shadow-md hover:shadow-lg hover:scale-105"
            >
              <Trash2 className="w-4 h-4" />
              <span className="drop-shadow-sm">Delete</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TripCard;
