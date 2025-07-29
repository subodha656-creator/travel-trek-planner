'use client'

import React, { useContext, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { submitActivity } from '@/app/actions/create-activity-action'
import { toast } from 'sonner'
import { useTripContext } from '@/context/trip-context'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase/client'



type AddActivityModalProps = {
  onClose: () => void
}

const AddActivityModal = ({
  onClose,
}: AddActivityModalProps) => {

  const [loading, setLoading] = useState(false)

  const {selectedTrip, setRefreshTrip} = useTripContext()
  const router = useRouter()

  const [newLocation, setNewLocation] = useState({
    name: "",
    day: 1,
    type: "attraction",
    time: "",
    notes: "",
    date: "",
    collaborator: "",
  });


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const activityData = {
      ...newLocation,
      id: selectedTrip?.id,
      date: new Date(`${newLocation.date}`
      ) 
    }
    try{
      const {data:orderData} = await supabase.from('trip_days').select('order').eq('day_number', newLocation.day);
  const orderLatest = orderData && orderData.sort((a, b) => b.order - a.order)[0];


    const tripDaysData = {
    trip_id: selectedTrip?.id,
    day_number: newLocation?.day,
    date: new Date(newLocation?.date),
    title: newLocation?.name,
    notes: newLocation?.notes,
    time: newLocation?.time,
    order: orderLatest ? orderLatest.order + 1 : 0,
  }

  const { data: trip, error } = await supabase
    .from('trip_days')
    .insert(tripDaysData)
    .select()
    .single()

      if(error){
   throw Error(error.message)
  }

  setRefreshTrip((prev:any) => [...prev, trip])

        toast.success('Activity added successfully')
        router.refresh()
        onClose()

    } catch (error: any) {
      toast.error(error.message)
      setLoading(false)
    }
    setLoading(false)
  }
 
  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-75 flex items-center justify-center p-4 z-2000">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 drop-shadow-sm">Add New Activity</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Activity name"
            name="name"
            value={newLocation.name}
            onChange={(e) =>
              setNewLocation({ ...newLocation, name: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              value={newLocation.day}
              name='day_number'
              onChange={(e) =>
                setNewLocation({
                  ...newLocation,
                  day: parseInt(e.target.value),
                })
              }
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            >
              {Array.from({ length: selectedTrip?.days }, (_, i) => i + 1).map(
                (day) => (
                  <option key={day} value={day}>
                    Day {day}
                  </option>
                )
              )}
            </select>
            <Input
              type="time"
              value={newLocation.time}
              onChange={(e) =>
                setNewLocation({ ...newLocation, time: e.target.value })
              }
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>

          <select
            value={newLocation.type}
            name="type"
            onChange={(e) =>
              setNewLocation({ ...newLocation, type: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
          >
            <option value="attraction">Attraction</option>
            <option value="restaurant">Restaurant</option>
            <option value="hotel">Hotel</option>
            <option value="museum">Museum</option>
            <option value="shopping">Shopping</option>
            <option value="activity">Activity</option>
          </select>



          <textarea
            placeholder="Notes (optional)"
            name="notes"
            value={newLocation.notes}
            onChange={(e) =>
              setNewLocation({ ...newLocation, notes: e.target.value })
            }
            rows={2}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none"
          />

          <Input
            type="date"
            value={newLocation.date}
            onChange={(e) =>
              setNewLocation({ ...newLocation, date: e.target.value })
            }
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
          />

          <div className="flex gap-3 pt-2">
            <Button
            isLoading={loading}
            type='submit'
              className="flex-1 px-4 py-2 bg-travel-primary text-white rounded-lg font-medium hover:bg-travel-primary-light transition-colors"
            >
              Add Activity
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddActivityModal
