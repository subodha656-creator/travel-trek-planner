'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTripContext } from '@/context/trip-context';

type TripMapHeaderProps = {
};

const TripMapHeader = ({
}: TripMapHeaderProps) => {
    const {selectedDay, setSelectedDay, selectedTrip} = useTripContext();
  return (
    <div className="p-4 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Trip Map</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filter by day:</span>
          <Select
            value={selectedDay.toString()}
            onValueChange={(value) => setSelectedDay(parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All Days</SelectItem>
              {Array.from({ length: selectedTrip.days }, (_, i) => i + 1).map((day) => (
                <SelectItem key={day} value={day.toString()}>
                  Day {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default TripMapHeader;
