'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache";


export async function submitActivity(formData: {
    id: string,
    name: string,
    day: number,
    date: Date,
    type: string,
    notes: string,
    time: string,
}){
  const supabase = await createClient();




  const {data:orderData} = await supabase.from('trip_days').select('order').eq('day_number', formData.day);
  const orderLatest = orderData && orderData.sort((a, b) => b.order - a.order)[0];


    const tripDaysData = {
    trip_id: formData.id,
    day_number: formData.day,
    date: formData.date,
    title: formData.name,
    notes: formData.notes,
    time: formData.time,
    order: orderLatest ? orderLatest.order + 1 : 0,
  }

  const { data: trip, error } = await supabase
    .from('trip_days')
    .insert(tripDaysData)
    .select()
    .single()

  if(error){
   throw Error(error.message)
  }


   revalidatePath('/dashboard/trips/' + formData.id)
    return {
      success: true,
    }
}