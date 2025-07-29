import { destinations } from "@/lib/destinations/places";

export async function POST(request: Request) {
    const {search} = await request.json();
  
   const filteredDestinations = destinations.filter(dest => 
    dest.name.toLowerCase().includes(search.toLowerCase()) ||
    dest.region.toLowerCase().includes(search.toLowerCase()) 
  );
 
  return Response.json({ filteredDestinations })
}

