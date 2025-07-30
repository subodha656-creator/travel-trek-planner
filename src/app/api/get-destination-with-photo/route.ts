import { destinations } from "@/lib/destinations/places";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient()

  const {trip_id} = await request.json();
  const {data: destination } = await supabase.from('destinations').select('*').eq('trip_id', trip_id);

  const {data: photos} = await supabase.from('trip_images').select('*').eq('trip_id', trip_id);
  
  return Response.json({ destination, photos })
}

