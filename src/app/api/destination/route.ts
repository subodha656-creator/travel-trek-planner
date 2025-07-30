import { destinations } from "@/lib/destinations/places";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient()

  const {search} = await request.json();
  const {data: filteredDestinations } = await supabase.from('destinations').select('*').ilike('name', `%${search}%`).ilike('address', `%${search}%`);
  
  //  const filteredDestinations = destinations.filter(dest => 
  //   dest.name.toLowerCase().includes(search.toLowerCase()) ||
  //   dest.region.toLowerCase().includes(search.toLowerCase()) 
  // );
 
  return Response.json({ filteredDestinations })
}

