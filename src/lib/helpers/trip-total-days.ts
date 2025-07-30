
export const calculateTotalDays = (selectedTrip: Record<string,any>) => {
   return Math.floor((new Date(selectedTrip.end_date).getTime() - new Date(selectedTrip.start_date).getTime()) / (1000 * 60 * 60 * 24));
}