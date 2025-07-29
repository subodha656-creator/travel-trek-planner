'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function deleteTrip(id: number){
  const supabase = await createClient();
  
  const {error} = await supabase
    .from('trips')
    .delete()
    .eq('id', id);
    
  if(error){
    throw new Error(error.message);
  }
  
  revalidatePath('/dashboard/trips');
  
  return { success: true };
}
