import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const photoId = searchParams.get("photo_id");
  const tripId = searchParams.get("trip_id");
  
  const supabase = await createClient();

  if (!photoId) {
    return new Response(JSON.stringify({ error: "Missing photo_id" }), { status: 400 });
  }

  if (!tripId) {
    return new Response(JSON.stringify({ error: "Missing trip_id" }), { status: 400 });
  }

  try {
    const { data: imageData, error: fetchError } = await supabase
      .from("trip_images")
      .select("image_url")
      .eq("id", photoId)
      .eq("trip_id", tripId) 
      .single();

    if (fetchError) {
      console.error("Error fetching image data:", fetchError);
      return new Response(JSON.stringify({ error: "Photo not found" }), { status: 404 });
    }

    if (!imageData) {
      return new Response(JSON.stringify({ error: "Photo not found" }), { status: 404 });
    }

    const urlParts = imageData.image_url.split('/');
    const bucketIndex = urlParts.findIndex((part: any) => part === 'public') + 1;
    const filePath = urlParts.slice(bucketIndex).join('/');

    const { error: storageError } = await supabase.storage
      .from('travelplanner') 
      .remove([filePath]);

    if (storageError) {
      console.error("Error deleting from storage:", storageError);
    
    }

    const { error: dbError } = await supabase
      .from("trip_images")
      .delete()
      .eq("id", photoId)
      .eq("trip_id", tripId); 

    if (dbError) {
      console.error("Error deleting from database:", dbError);
      return new Response(JSON.stringify({ error: "Failed to delete photo" }), { status: 500 });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Photo deleted successfully" 
    }), { status: 200 });

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}