'use client';

import { Calendar, Clock, MapPin, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { calculateTotalDays } from '@/lib/helpers/trip-total-days';
import { useTripContext } from '@/context/trip-context';
import { useState } from 'react';
import AddActivityModal from './add-location-modal';
import {useRouter} from 'next/navigation';



const TripHeaderCard = () => {
  const { selectedTrip } = useTripContext(); 
  const [addLocationModal, setAddLocationModal] = useState(false);
  const [loading, setLoading] = useState(false);

   const router = useRouter();
  return (
    <>
    {
      addLocationModal && (
        <AddActivityModal onClose={() => setAddLocationModal(false)} />
      )
    }
    <div className="relative p-4 sm:p-6 backdrop-blur-xl bg-white/20 border border-white/30 before:absolute before:inset-0 before:rounded-4xl before:bg-gradient-to-br before:from-white/30 before:to-white/10 before:-z-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-travel-secondary drop-shadow-sm">{selectedTrip.title}</h1>
          <p className="text-travel-secondary-light flex items-center gap-2 mt-1 drop-shadow-sm">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{selectedTrip.destination}</span>
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm text-travel-tertiary drop-shadow-sm">
            <span className="flex items-center gap-1 text-xs sm:text-sm">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden sm:inline">
                {new Date(selectedTrip.start_date).toLocaleDateString()} -{' '}
                {new Date(selectedTrip.end_date).toLocaleDateString()}
              </span>
              <span className="sm:hidden">
                {new Date(selectedTrip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                {new Date(selectedTrip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </span>
            <span className="flex items-center gap-1 text-xs sm:text-sm">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              {calculateTotalDays(selectedTrip)} days
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={()=> setAddLocationModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-travel-primary/90 backdrop-blur-sm text-white rounded-lg hover:bg-travel-primary-light/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl border border-white/20 hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Add Activity
          </Button>
          <Button
            onClick={() => router.back()}
            className="px-4 py-2 backdrop-blur-sm bg-travel-secondary/90 text-white rounded-lg hover:bg-travel-secondary-light/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl border border-white/20 hover:scale-105"
          >
            Back to Trips
          </Button>
        </div>
      </div>
    </div>
    </>
  );
};

export default TripHeaderCard;
