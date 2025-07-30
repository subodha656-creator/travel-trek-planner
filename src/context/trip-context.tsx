'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { calculateTotalDays } from '@/lib/helpers/trip-total-days';
import supabase from '@/lib/supabase/client';

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
  avatar_url: string;
  full_name: string;
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
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
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




const fetchCollaborators = async () => {
  const response = await supabase
    .from('trip_collaborators')
    .select('*')
    .eq('trip_id', params.trip_id);

  if (!response.data) {
    setCollaborators([]);
    return;
  }

  const result = await Promise.all(
    response.data.map(async (collaborator) => {
      const { data: user } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', collaborator.user_id)
        .single();

      return {
        ...collaborator,
        full_name: user?.full_name,
        avatar_url: user?.avatar_url,
      };
    })
  );

  setCollaborators(result);
};


 

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
    fetchCollaborators();
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
