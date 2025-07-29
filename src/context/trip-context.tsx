'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { calculateTotalDays } from '@/lib/helpers/trip-total-days';

export type MapLocation = {
  id: number;
  name: string;
  day_number: number;
  time: string;
  type: string;
  notes: string;
  collaborator: string;
  lat?: number;
  lng?: number;
  title: string;
  trip_id: string;
  order: number;
};

type Collaborator = {
  id: number;
  name: string;
  avatar: string;
  color: string;
};

type Trip = {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  totalDays: number;
  latitude: number;
  longitude: number;
  days: number,
};

type TripContextType = {
  selectedTrip: Trip;
  collaborators: Collaborator[];
  activities: MapLocation[];
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  getDayActivities: (day: number) => MapLocation[];
  refreshActivities: () => void;
  loading: boolean;
  setRefreshTrip: React.Dispatch<React.SetStateAction<any>>;
};

const TripContext = createContext<TripContextType | undefined>(undefined);

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within TripProvider');
  }
  return context;
};

export const TripProvider = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [refreshTrip, setRefreshTrip] = useState([]);

  const [selectedTrip, setSelectedTrip] = useState<Trip>({
    id: '',
    title: '',
    destination: '',
    start_date: '',
    end_date: '',
    totalDays: 0,
    latitude: 0,
    longitude: 0,
    days: 0,
  });

  const [activities, setActivities] = useState<MapLocation[]>([]);
  const [selectedDay, setSelectedDay] = useState(1);

   const [isAddingLocation, setIsAddingLocation] = useState(false);

  const [newLocation, setNewLocation] = useState({
    name: "",
    day: 1,
    type: "attraction",
    time: "",
    notes: "",
    date: "",
    collaborator: "",
  });

  const openAddLocationModal = () => setIsAddingLocation(true);
  const closeAddLocationModal = () => setIsAddingLocation(false);

//   const handleAddLocation = async (tripId: string) => {
//     if (!newLocation.name.trim()) return;

//     const response = await fetch("/api/add-activity", {
//       method: "POST",
//       body: JSON.stringify({ ...newLocation, trip_id: tripId }),
//     });

//     const { error } = await response.json();
//     if (error) {
//       toast.error(error.message);
//       return;
//     }

//     closeAddLocationModal();
//     setNewLocation({
//       name: "",
//       day: 1,
//       type: "attraction",
//       time: "",
//       notes: "",
//       date: "",
//       collaborator: "",
//     });

//     // Optional: refresh activities
//     fetchActivities(tripId);
//   };

  const fetchActivities = async (tripId: string) => {
    const res = await fetch(`/api/day-schedule?id=${tripId}`);
    const { result } = await res.json();
    setActivities(result);
  };

  const collaborators: Collaborator[] = [
    {
      id: 1,
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      color: '#3B82F6',
    },
    {
      id: 2,
      name: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=32&h=32&fit=crop&crop=face',
      color: '#10B981',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=32&h=32&fit=crop&crop=face',
      color: '#F59E0B',
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
      color: '#EF4444',
    },
  ];

  const fetchTripData = async () => {
    setLoading(true);
    const response = await fetch(`/api/selected-trip?id=${params.trip_id}`);
    try{
        const { error, result } = await response.json();

        setSelectedTrip({...result, days: calculateTotalDays(result)});
        setLoading(false);
    }
    catch(error: any){
      toast.error(error.message);
      router.push('/dashboard/trips')
      return;
    }
  };

  const refreshActivities = async () => {
    const response = await fetch(`/api/day-schedule?id=${params.trip_id}`);
    const { result } = await response.json();
    setActivities(result);
  };

  const getDayActivities = (day: number) => {
    return activities
      .filter((act) => act.day_number === day)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  useEffect(() => {
    fetchTripData();
    refreshActivities();
  }, [refreshTrip]);




  return (
    <TripContext.Provider
      value={{
        selectedTrip,
        collaborators,
        activities,
        selectedDay,
        setSelectedDay,
        getDayActivities,
        refreshActivities,
        loading,
        setRefreshTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};
