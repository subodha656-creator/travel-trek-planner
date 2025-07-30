'use server';

import { createClient } from "@/lib/supabase/server";

export async function getTripsData() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not logged in");
  }

  const { data: collaboratedTrips, error: collabError } = await supabase
    .from('trip_collaborators')
    .select("*")
    .eq('user_id', user.id);

  if (collabError) {
    throw new Error(collabError.message);
  }

  const responses = await Promise.all(
    collaboratedTrips?.map(async (trip) => {
      const { data, error } = await supabase
        .from('trips')
        .select("*")
        .eq('id', trip.trip_id)
        .single();

      if (error) {
        console.error(`Error fetching trip ${trip.trip_id}:`, error.message);
        return null;
      }

      return { ...data, isCollaborated: true };
    }) || []
  );

  const tripsData = responses.filter(Boolean); 

  const { data: ownedTrips, error } = await supabase
    .from('trips')
    .select("*")
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }

  const finalTrips = [...tripsData, ...(ownedTrips || [])];

  return {
    success: true,
    trips: finalTrips,
  };
}
