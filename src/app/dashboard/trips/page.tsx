"use client";
import React, { useState, useEffect, useCallback } from "react";

import {
  Plus,
  Edit3,
  Trash2,
  Calendar,
  MapPin,
  User,
  Settings,
  Search,
  Save,
  Upload,
  GripVertical,
  Heart,
  Share2,
  Filter,
  Globe,
  Clock,
  Camera,
  ListIcon,
} from "lucide-react";
import { submitFullTrip } from "@/app/actions/create-full-trip-action";
import { toast } from "sonner";
import DestinationDropdown from "@/components/trip/destinations-list-dropdown";
import { getTripsData } from "@/app/actions/get-all-trips-action";
import CreateTripForm from "@/components/trip/trip-form";
import TripCard from "@/components/trip/trip-card";
import { Trip } from "@/lib/types";
import EditTripView, { TripPhoto } from "@/components/trip/edit-trip-form";
import { deleteTrip } from "@/app/actions/delete-trip-action";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TravelPlanner = () => {
  const [currentView, setCurrentView] = useState("trips");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
  });
  const [showDestinations, setShowDestinations] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  const [newTrip, setNewTrip] = useState({
    title: "",
    destination: "",
    start_date: "",
    end_date: "",
    notes: "",
    image: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentView("trips");
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateTrip = async (formData: FormData) => {
    setLoading(true);
    try {
      await submitFullTrip(formData);
      toast.success("Trip created successfully!");
      setIsCreating(false);
      const { trips } = await getTripsData();
      setAllTrips(trips || []);
      setLoading(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (id: number) => {
    try {
      await deleteTrip(id);
      toast.success("Trip deleted successfully!");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const handleEditTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setCurrentView("edit");
  };

  const [allTrips, setAllTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const { trips } = await getTripsData();
        setAllTrips(trips || []);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch trips");
        setAllTrips([]);
      }
    };

    loadTrips();
  }, []);

  useEffect(() => {
    const filtered = allTrips.filter((trip) => {
      const matchesSearch =
        trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.destination.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "upcoming" && new Date(trip.start_date) > new Date()) ||
        (filterBy === "past" && new Date(trip.end_date) < new Date());
      return matchesSearch && matchesFilter;
    });

    setTrips(filtered);
  }, [allTrips, searchTerm, filterBy]);

  const signOut = async () => {
    await fetch("/api/users/logout", {
      method: "GET",
    });
    router.push("/login");
  };

  // Fixed client-side upload function
const handlePhotoUpload = async (files: File[], tripId: string): Promise<TripPhoto[]> => {
  const uploadedPhotos: TripPhoto[] = [];
  
  try {
    // Upload each file separately
    for (const file of files) {
      const formData = new FormData();
      formData.append("trip_id", tripId);
      formData.append("image", file);
      
      const response = await fetch("/api/upload-photos", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        // Convert API response to TripPhoto format
        const tripPhoto: TripPhoto = {
          id: result.id || `uploaded-${Date.now()}-${Math.random()}`,
          url: result.image_url,
          name: file.name,
          size: file.size,
          uploadedAt: new Date(),
          isUploading: false
        };
        
        uploadedPhotos.push(tripPhoto);
        console.log(`Successfully uploaded: ${file.name}`);
      } else {
        console.error(`Failed to upload ${file.name}:`, result.error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    
    if (uploadedPhotos.length > 0) {
      toast.success(`${uploadedPhotos.length} photo${uploadedPhotos.length > 1 ? 's' : ''} uploaded successfully!`);
    }
    
    return uploadedPhotos;
    
  } catch (error) {
    console.error('Upload error:', error);
    toast.error("Failed to upload photos");
    return [];
  }
};

  const handlePhotoDelete = async (photoId: string, tripId: string) => {
    const response = await fetch("/api/delete-photo?photo_id=" + photoId + "&trip_id=" + tripId, {
      method: "DELETE",
    });
    if (response.ok) {
      toast.success("Photo deleted successfully!");
    } else {
      toast.error("Failed to delete photo!");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 mt-8 mb-6 rounded-4xl">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === "trips" && !isCreating && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-travel-secondary">
                  My Trips
                </h2>
                <p className="text-travel-secondary-light mt-1">
                  Plan and organize your perfect adventures
                </p>
              </div>

              <div className="flex justify-center items-center gap-4">
                <Button
                  onClick={() => setIsCreating(true)}
                  className="bg-gradient-to-r from-travel-primary to-travel-primary-light text-white px-6 py-3 rounded-xl font-semibold  transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Create New Trip
                </Button>

                <Button
                  onClick={async () => await signOut()}
                  className="bg-travel-secondary text-white hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Logout
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Select
                  value={filterBy}
                  onValueChange={(value) => setFilterBy(value)}
                >
                  <SelectTrigger>
                    <SelectValue
                      className="text-travel-primary"
                      placeholder="All Trips"
                    />
                  </SelectTrigger>
                  <SelectContent className="text-travel-primary">
                    <SelectItem value="all">All Trips</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="past">Past Trips</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <Button
                  onClick={() => setViewType("grid")}
                  className={`p-2 rounded-md ${
                    viewType === "grid"
                      ? "bg-travel-primary text-travel-secondary hover:bg-travel-primary-light hover:text-travel-secondary"
                      : "bg-white text-black hover:bg-gray-300 hover:text-white"
                  }`}
                >
                  <GripVertical className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => setViewType("list")}
                  className={`p-2 rounded-md ${
                    viewType === "list"
                      ? "bg-travel-primary text-travel-secondary hover:bg-travel-primary-light hover:text-travel-secondary"
                      : "bg-white text-black hover:bg-gray-300 hover:text-white"
                  }`}
                >
                  <ListIcon className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div
              className={` gap-8 ${
                viewType === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "w-full flex flex-col"
              }`}
            >
              {trips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onEdit={handleEditTrip}
                  onDelete={handleDeleteTrip}
                  viewType={viewType}
                />
              ))}

              {trips.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No trips found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Start planning your next adventure!
                  </p>
                  <Button
                    onClick={() => setIsCreating(true)}
                    className="bg-gradient-to-r from-travel-primary to-travel-primary-light text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    Create Your First Trip
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {isCreating && (
          <CreateTripForm
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showDestinations={showDestinations}
            setShowDestinations={setShowDestinations}
            setIsCreating={setIsCreating}
            handleCreateTrip={handleCreateTrip}
            loading={loading}
          />
        )}
        {currentView === "edit" && selectedTrip && (
          <EditTripView
            selectedTrip={selectedTrip}
            setCurrentView={setCurrentView}
            onPhotoUpload={handlePhotoUpload}
            onPhotoDelete={handlePhotoDelete}
          />
        )}
      </main>
    </div>
  );
};

export default TravelPlanner;
