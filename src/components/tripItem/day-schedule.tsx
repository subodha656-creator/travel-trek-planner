'use client'

import React from 'react'
import { Calendar, Trash2, GripVertical } from 'lucide-react'
import { Button } from '../ui/button'
import { deleteActivity } from '@/app/actions/delete-activity-action'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { updateActivityOrderAction } from '@/app/actions/update-activity-order-action'
import { useTripContext } from '@/context/trip-context'

export type MapLocation = {
  id: number
  title: string
  time: string
  type: string
  collaborator?: string
  notes?: string
  day_number: number
  trip_id: string
  order?: number 
}

type DayScheduleProps = {
 
}

const SortableActivityItem = ({
  location,
  getLocationIcon,
}: {
  location: MapLocation
  getLocationIcon: (type: string) => React.ReactNode
}) => {
  const router = useRouter()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: location.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const {setRefreshTrip} = useTripContext()

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 p-3 backdrop-blur-sm bg-white/30 rounded-lg hover:bg-white/40 transition-all duration-300 group border border-white/20 shadow-md hover:shadow-lg hover:scale-[1.01]"
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-center w-6 h-6 cursor-grab active:cursor-grabbing hover:bg-white/30 rounded transition-colors duration-200 flex-shrink-0"
        title="Drag to reorder"
      >
        <GripVertical className="w-4 h-4 text-gray-500 hover:text-gray-700 drop-shadow-sm" />
      </div>

      {/* Activity Icon */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="text-lg drop-shadow-sm">{getLocationIcon(location.type)}</div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="text-sm font-medium text-gray-900 truncate drop-shadow-sm">
            {location.title}
          </div>
          <div className="text-xs text-gray-600 font-mono backdrop-blur-sm bg-white/20 px-2 py-1 rounded border border-white/30 drop-shadow-sm">
            {location.time}
          </div>
        </div>
        <div className="text-xs text-gray-600 mb-1 drop-shadow-sm">
          {location.collaborator}
        </div>
        {location.notes && (
          <div className="text-xs text-gray-700 truncate drop-shadow-sm">
            {location.notes}
          </div>
        )}
      </div>

      <form className="flex-shrink-0">
        <Button
          formAction={async () => {
            const data = await deleteActivity(location?.id, location?.trip_id)
            setRefreshTrip((prev:any) => [...prev, data])
            toast.success('Activity deleted successfully')
          }}
          className="p-1 hover:bg-travel-primary-light text-white backdrop-blur-sm bg-travel-primary rounded opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/20 shadow-sm hover:shadow-md hover:scale-110"
        >
          <Trash2 className="w-3 h-3 text-white drop-shadow-sm" />
        </Button>
      </form>
    </div>
  )
}

const DaySchedule = ({

}: DayScheduleProps) => {
  const router = useRouter()
  const {selectedDay, getDayActivities, setRefreshTrip} = useTripContext()
   const onReorderActivities = (reorderedActivities: MapLocation[]) => {
    router.refresh();
    };
  
    const updateActivityOrder = async (
      activityId: number,
      newOrder: number
    ) => {
     const data = await updateActivityOrderAction(activityId, newOrder.toString())
     setRefreshTrip((prev:any) => [...prev, data])
    };
  const activities = getDayActivities(selectedDay)  
  
  const sortedActivities = [...activities].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order
    }
    return 0
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = sortedActivities.findIndex((item) => item.id === active.id)
      const newIndex = sortedActivities.findIndex((item) => item.id === over?.id)

      const reorderedActivities = arrayMove(sortedActivities, oldIndex, newIndex)
      
      const activitiesWithNewOrder = reorderedActivities.map((activity, index) => ({
        ...activity,
        order: index
      }))

      onReorderActivities(activitiesWithNewOrder)

      if (updateActivityOrder) {
        try {
          await Promise.all(
            activitiesWithNewOrder.map((activity, index) =>
              updateActivityOrder(activity.id, index)
            )
          )
          toast.success('Activity order updated successfully!')
        } catch (error) {
          toast.error('Failed to update activity order')
          console.error('Error updating activity order:', error)
          onReorderActivities(sortedActivities)
        }
      }
    }
  }

 return selectedDay > 0 ?  (
    
    <div className="relative rounded-2xl backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl shadow-black/10 p-4 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/30 before:to-white/10 before:-z-10">
      <h4 className="font-semibold text-gray-900 mb-3 drop-shadow-sm relative z-10">
        Day {selectedDay} Schedule
      </h4>

      <div className="space-y-2 max-h-64 overflow-y-auto relative z-10">
        {sortedActivities.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedActivities.map(activity => activity.id)}
              strategy={verticalListSortingStrategy}
            >
              {sortedActivities.map((location) => (
                <SortableActivityItem
                  key={location.id}
                  location={location}
                  getLocationIcon={()=> "📍"}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center py-6 text-gray-600 backdrop-blur-sm bg-white/20 rounded-lg border border-white/20 shadow-inner">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50 drop-shadow-sm" />
            <p className="text-sm drop-shadow-sm">No activities planned for this day</p>
            <p className="text-xs opacity-75 drop-shadow-sm">Drag activities here or add new ones</p>
          </div>
        )}
      </div>
    </div>
  ) :  <></>
}

export default DaySchedule