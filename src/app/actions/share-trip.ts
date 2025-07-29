'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache";


export async function onShareTrip(userId: string, role: 'editor' | 'viewer', tripId: string){
  const supabase = await createClient();


  const { error } = await supabase
    .from('trip_collaborators')
    .insert({
      trip_id: tripId,
      user_id: userId,
      role: role,
      invited_at: new Date(),
    })
    .select()
    .single()

  if(error){
   throw Error("Trip shared already!!")
  }


   revalidatePath('/dashboard/trips/' + tripId)
    return {
      success: true,
    }
}