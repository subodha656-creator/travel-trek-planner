import { destinations } from "@/lib/destinations/places";
import { parseCoordinates } from "@/lib/helpers/parse-coordinates";
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";



 
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  
 const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');    
  
  if (!id) {
    return Response.json({ error: 'Trip ID is required' }, { status: 400 });
  }
  
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    redirect('/dashboard/trips')
  }

  if(data?.length === 0) {
    redirect('/dashboard/trips')
  }

  const result = {
    ...data, 
    latitude: parseCoordinates(data.destination_coordinates).latitude,
    longitude: parseCoordinates(data.destination_coordinates).longitude,
  }
 
  return Response.json({ result });
}