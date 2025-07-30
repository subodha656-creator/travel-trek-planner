'use client'

import React from 'react'
import { MapLocation } from './day-schedule'
import { useTripContext } from '@/context/trip-context'

type Collaborator = {
  id: number
  name: string
  full_name: string
  avatar_url: string
  color: string
}



type TeamMembersPanelProps = {
}

const TeamMembersPanel = ({
}: TeamMembersPanelProps) => {
  const {collaborators, activities: mapLocations} = useTripContext();
  return (
    <div className="relative rounded-2xl backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl shadow-black/10 p-4 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/30 before:to-white/10 before:-z-10">
      <h4 className="font-semibold text-gray-900 mb-3 drop-shadow-sm relative z-10">Team Members</h4>
      <div className="space-y-2 relative z-10">
        {collaborators.map((collaborator) => (
          <div
            key={collaborator.id}
            className="flex items-center gap-3 p-3 backdrop-blur-sm bg-white/30 rounded-lg border border-white/20 shadow-md hover:shadow-lg hover:bg-white/40 transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="relative">
              <img
                src={collaborator.avatar_url}
                alt={collaborator.full_name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white/50 shadow-lg"
              />
              <div
                className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white/70 shadow-lg"
                style={{ 
                  backgroundColor: collaborator.color,
                  boxShadow: `0 0 8px ${collaborator.color}40`
                }}
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 drop-shadow-sm">
                {collaborator.full_name}
              </div>
            
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamMembersPanel