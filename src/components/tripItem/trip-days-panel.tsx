'use client'

import React from 'react'
import { Button } from '../ui/button'
import { useTripContext } from '@/context/trip-context'



const TripDaysPanel = () => {
  const { selectedDay, setSelectedDay, getDayActivities, selectedTrip} = useTripContext();
  return (
    <div className="relative rounded-2xl backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl shadow-black/10 p-4 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/30 before:to-white/10 before:-z-10">
      <h4 className="font-semibold text-gray-900 mb-3 drop-shadow-sm relative z-10">Trip Days</h4>
      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto relative z-10">
        {Array.from({ length: selectedTrip?.days }, (_, i) => i + 1).map((day) => {
          const dayActivities = getDayActivities(day)
          return (
            <Button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`p-3 rounded-lg text-left transition-all duration-300 relative backdrop-blur-sm border border-white/20 shadow-md hover:shadow-lg hover:scale-[1.02] ${
                selectedDay === day
                  ? 'bg-travel-primary text-white shadow-blue-500/25'
                  : 'bg-white/30 text-gray-700 hover:bg-white/40'
              }`}
            >
              <div className="font-medium drop-shadow-sm">Day {day}</div>
              <div className="text-xs opacity-75 drop-shadow-sm">
                {dayActivities.length} activities
              </div>
              {dayActivities.length > 0 && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50 animate-pulse" />
              )}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default TripDaysPanel