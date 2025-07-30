"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import SupabasePublicImage from "@/lib/helpers/trip-image";
import { Trip } from "@/lib/types";
import {
  Calendar,
  Camera,
  Clock,
  MapPin,
  Share2,
  Upload,
  X,
  Plus,
  ImageIcon,
  Trash2,
  Eye,
  Download,
} from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import Image from "next/image";
import ShareTripPopup, { SharedUser, User } from "./share-list-popup";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase/client";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { parseCoordinates } from "@/lib/helpers/parse-coordinates";
import { Input } from "../ui/input";

export type TripPhoto = {
  id: string;
  url: string;
  name: string;
  size: number;
  uploadedAt: Date;
  isUploading?: boolean;
};

type EditTripViewProps = {
  selectedTrip: Trip | null;
  setCurrentView: (view: string) => void;
  onPhotoUpload?: (files: File[], tripId: string) => Promise<TripPhoto[]>; // Fixed return type
  onPhotoDelete?: (photoId: string, tripId: string) => Promise<void>;
  initialPhotos?: TripPhoto[];
};

const EditTripView = ({
  selectedTrip,
  setCurrentView,
  onPhotoUpload,
  onPhotoDelete,
  initialPhotos = [],
}: EditTripViewProps) => {
  const [photos, setPhotos] = useState<TripPhoto[]>(initialPhotos);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<TripPhoto | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [shareTrip, setShareTrip] = useState(false);
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);

  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<User>({
    id: "",
    name: "",
    email: "",
  });

  const [isPublic, setIsPublic] = useState(false);

  if (!selectedTrip) return null;

  const durationInDays =
    selectedTrip.start_date && selectedTrip.end_date
      ? Math.ceil(
          (new Date(selectedTrip.end_date).getTime() -
            new Date(selectedTrip.start_date).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const imageUrl = `https://${
    process.env.NEXT_PUBLIC_PROJECT_ID
  }.supabase.co/storage/v1/object/public/${"travelplanner"}/${
    selectedTrip.cover_image_url
  }`;

  const validateFiles = (files: File[]): File[] => {
    const maxSize = 10 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported image format`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    return validFiles;
  };

  const handleFileUpload = async (files: File[]) => {
    const validFiles = validateFiles(files);
    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      const tempPhotos: TripPhoto[] = validFiles.map((file) => ({
        id: `temp-${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        uploadedAt: new Date(),
        isUploading: true,
      }));

      if (onPhotoUpload && selectedTrip) {
        const uploadedPhotos = await onPhotoUpload(
          validFiles,
          selectedTrip.id.toString()
        );

        setPhotos((prev) => [...prev, ...uploadedPhotos]);
        setPhotos((prev) => [...prev.filter((p) => !p.isUploading)]);

        toast.success(
          `${uploadedPhotos.length} photo${
            uploadedPhotos.length > 1 ? "s" : ""
          } uploaded successfully!`
        );
      } else {
        setTimeout(() => {
          setPhotos((prev) =>
            prev.map((p) => (p.isUploading ? { ...p, isUploading: false } : p))
          );
          toast.success(
            `${validFiles.length} photo${
              validFiles.length > 1 ? "s" : ""
            } uploaded successfully!`
          );
        }, 2000);
      }
    } catch (error) {
      setPhotos((prev) => prev.filter((p) => !p.isUploading));
      toast.error("Failed to upload photos. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (!selectedTrip?.id) return;

    const getPhotosUploaded = async () => {
      try {
        const response = await fetch(
          "/api/get-uploaded-photos?trip_id=" + selectedTrip.id,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const photosData = await response.json();

        if (photosData.error) {
          throw new Error(photosData.error);
        }

        setPhotos(photosData);
      } catch (error) {
        console.error("Failed to fetch photos:", error);
        toast.error("Failed to load photos");
        setPhotos([]);
      }
    };

    getPhotosUploaded();
  }, [selectedTrip?.id]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileUpload(files);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeletePhoto = async (photo: TripPhoto) => {
    try {
      if (onPhotoDelete && selectedTrip) {
        await onPhotoDelete(photo.id, selectedTrip.id.toString());
      }

      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      toast.success("Photo deleted successfully");
    } catch (error) {
      toast.error("Failed to delete photo");
      console.error("Delete error:", error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

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
          tripId: selectedTrip.id,
        }),
      });
      const { data, currentUser } = await response.json();
      setCurrentUser(currentUser);
      setSharedUsers(data);
    };
    sharedUsers();
  }, []);

  useEffect(() => {
    const getIsPublic = async () => {
      const response = await supabase
        .from("destinations")
        .select("*")
        .eq("trip_id", selectedTrip.id);
      if (response?.data != null && response?.data.length > 0) {
        setIsPublic(true);
      } else {
        setIsPublic(false);
      }
    };
    getIsPublic();
  }, [selectedTrip]);

  async function makeTripPublic(checked: boolean) {
    const res = await supabase
      .from("destinations")
      .select("*")
      .eq("trip_id", selectedTrip?.id);
    if (res?.data && res?.data?.length > 0) {
      await supabase
        .from("destinations")
        .delete()
        .eq("trip_id", selectedTrip?.id);
    } else {
      const { latitude, longitude } = parseCoordinates(
        selectedTrip?.destination_coordinates!
      );
      const response = await supabase
        .from("destinations")
        .insert({
          trip_id: selectedTrip?.id,
          name: selectedTrip?.title,
          address: selectedTrip?.destination,
          latitude: latitude,
          longitude: longitude,
        });
      if (response.error) {
        console.error("Error updating is_public:", response.error);
      }
    }

    toast.success("Trip made " + (checked ? "public" : "private"));
    setIsPublic(checked);
  }

  return (
    <>
      <ShareTripPopup
        isOpen={shareTrip}
        onClose={() => setShareTrip(false)}
        tripId={selectedTrip?.id.toString()}
        tripTitle={selectedTrip?.title}
        currentUser={currentUser}
        sharedUsers={sharedUsers}
        onSearchUsers={handleSearchUsers}
      />
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="relative h-64 bg-gradient-to-r"
          >
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative h-full flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-2">
                  {selectedTrip.title}
                </h1>
                <p className="text-xl opacity-90 flex items-center justify-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {selectedTrip.destination}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Camera className="w-6 h-6" />
                      Trip Photos ({photos.length})
                    </h3>
                    {
                      !selectedTrip?.isCollaborated &&  <div className="flex items-center space-x-2">
                      <Switch
                        checked={isPublic}
                        onCheckedChange={(checked) => makeTripPublic(checked)}
                        id="airplane-mode"
                      />
                      <Label htmlFor="airplane-mode">Public mode</Label>
                    </div>
                    }
                  
                  </div>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                      isDragOver
                        ? "border-travel-prtext-travel-primary bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <Input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />

                    <ImageIcon
                      className={`w-12 h-12 mx-auto mb-4 ${
                        isDragOver ? "text-travel-primary" : "text-gray-400"
                      }`}
                    />

                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {isDragOver
                        ? "Drop photos here!"
                        : "Upload Your Trip Photos"}
                    </h4>

                    <p className="text-gray-500 mb-4">
                      Drag and drop images here, or click to browse
                    </p>

                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="bg-travel-primary hover:bg-travel-primary-light text-white"
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Photos
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-gray-400 mt-2">
                      Supports: JPEG, PNG, WebP • Max 10MB per file
                    </p>
                  </div>

                  {/* Photo Grid */}
                  {photos.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {photos.map((photo) => (
                        <div
                          key={photo.id}
                          className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-square"
                        >
                          <Image
                            width={100}
                            height={100}
                            src={photo.url}
                            alt={photo.name ?? "Photo"}
                            className="w-full h-full object-cover"
                          />

                          {photo.isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-b-transparent"></div>
                            </div>
                          )}

                          {!photo.isUploading && (
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => setSelectedPhoto(photo)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeletePhoto(photo)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}

                          
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-900">
                      Trip Details
                    </h4>
                    <p className="text-sm font-bold text-gray-600">
                      {isPublic ? "Public" : "Private"}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-travel-primary" />
                      <span className="text-sm text-gray-600">
                        {new Date(selectedTrip.start_date).toLocaleDateString()}{" "}
                        - {new Date(selectedTrip.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-travel-primary-light" />
                      <span className="text-sm text-gray-600">
                        {durationInDays} days
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Camera className="w-4 h-4 text-travel-primary-light" />
                      <span className="text-sm text-gray-600">
                        {photos.length} photos
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-travel-tertiary/40 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h4>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center gap-3 justify-start"
                    >
                      <Upload className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">
                        Upload More Photos
                      </span>
                    </Button>
                    <Button
                      onClick={() =>
                        router.push("/dashboard/trips/" + selectedTrip?.id)
                      }
                      variant="outline"
                      className="w-full flex items-center gap-3 justify-start"
                    >
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">View on Map</span>
                    </Button>
                    <Button
                      onClick={() => {
                        setShareTrip(true);
                      }}
                      variant="outline"
                      className="w-full flex items-center gap-3 justify-start"
                    >
                      <Share2 className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">Share Trip</span>
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={() => setCurrentView("trips")}
                  className="w-full bg-gradient-to-r from-travel-primary to-travel-primary-light text-white px-4 py-3 rounded-xl font-semibold hover:from-travel-primary-light hover:to-travel-primary transition-all"
                >
                  Back to Trips
                </Button>
              </div>
            </div>
          </div>
        </div>

        {selectedPhoto && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden">
              <div className="absolute top-4 right-4 z-10">
                <Button
                  onClick={() => setSelectedPhoto(null)}
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Image
                width={500}
                height={500}
                src={selectedPhoto.url}
                alt={selectedPhoto.name ?? "Photo"}
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <h3 className="text-white font-medium">{selectedPhoto.name}</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EditTripView;
