import { TripHeaderCardProps } from "@/components/tripItem/trip-header-card";

export const calculateTotalDays = (selectedTrip: TripHeaderCardProps['selectedTrip']) => {
   return Math.floor((new Date(selectedTrip.end_date).getTime() - new Date(selectedTrip.start_date).getTime()) / (1000 * 60 * 60 * 24));
}