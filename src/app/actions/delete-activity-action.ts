'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache";


export async function deleteActivity(id: number, trip_id: string){
  const supabase = await createClient();
  const {error} = await supabase
    .from('trip_days')
    .delete()
    .eq('id', id).eq('trip_id', trip_id);
    
  if(error){
    throw new Error(error.message);
  }
  
  revalidatePath('/dashboard/trips/' + trip_id);
  revalidatePath('/dashboard/trips');
  return { success: true };
}
