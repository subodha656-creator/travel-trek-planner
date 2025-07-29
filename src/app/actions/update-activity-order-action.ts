'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache";


export async function updateActivityOrderAction(activityId: number, new_order: string){
  const supabase = await createClient();
    

  const { data: trip, error } = await supabase
    .from('trip_days')
    .update({ order: new_order })
    .eq('id', activityId)
    .select()
    .single()

  if(error){
   throw Error(error.message)
  }
  revalidatePath('/dashboard/trips/' + trip.trip_id);
  revalidatePath('/dashboard/trips');
  



  return { success: true };
}   
