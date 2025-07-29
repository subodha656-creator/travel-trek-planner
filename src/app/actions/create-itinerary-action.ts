'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache";


export async function submitItinerary(prevState: any , formData: FormData){
  const supabase = await createClient();
     const destination = formData.get("destination") as string
  const date = formData.get("date") as string
 const {
    data: { user },
  } = await supabase.auth.getUser()

  if(!user){
    throw Error("User not logged in");
  }

  if(!destination){
    throw Error("Destination is required")
  }

  if(!date){
    throw Error("Date is required")
  }

  const { count, error:countError } = await supabase
  .from('trips')
  .select('*', { count: 'exact', head: true })

  if(count && count>0){
    throw Error("First Trip already exists")
  }

  const tripData = {
    user_id: user.id,
    title: "",
    start_date: date,
    end_date: date,
    destination: destination?.trim(),
    is_archived: false,
    // destination_coordinates: `(${data.longitude},${data.latitude})`,
  }

  const { data: trip, error } = await supabase
    .from('trips')
    .insert(tripData)
    .select()
    .single()

  if(error){
   throw Error(error.message)
  }


   revalidatePath('/dashboard/trips')
    return {
      success: true,
      id: trip?.id
    }
}