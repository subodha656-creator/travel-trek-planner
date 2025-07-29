'use server'

import { createClient } from "@/lib/supabase/server"


export async function getTripsData(){
  const supabase = await createClient();
   
 const {
    data: { user },
  } = await supabase.auth.getUser()

  if(!user){
    throw Error("User not logged in");
  }




  const { data: trips, error } = await supabase
    .from('trips')
    .select("*")
    .eq('user_id', user.id)

  if(error){
   throw Error(error.message)
  }



    return {
      success: true,
      trips: trips
    }
}