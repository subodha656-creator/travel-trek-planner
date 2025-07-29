import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const supabase = await createClient();

    const tripId = formData.get("trip_id") as string;
    const file = formData.get("image") as File;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not logged in" }), 
        { status: 401 }
      );
    }

    if (!tripId || !file) {
      return new Response(
        JSON.stringify({ error: "Missing trip ID or image file" }), 
        { status: 400 }
      );
    }

    const fileExt = file.name.split(".").pop();
    const uniqueFileName = `${user.id}/${tripId}/${randomUUID()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("travelplanner") 
      .upload(uniqueFileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: uploadError.message }), 
        { status: 500 }
      );
    }

    const { data: publicUrlData } = await supabase.storage
      .from("travelplanner") 
      .getPublicUrl(uniqueFileName);

    const imageUrl = publicUrlData?.publicUrl;

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: "Failed to get public URL" }), 
        { status: 500 }
      );
    }

    const { data: dbData, error: dbError } = await supabase
      .from("trip_images")
      .insert({
        trip_id: tripId,
        image_url: imageUrl,
        uploaded_by: user.id,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      await supabase.storage.from("travelplanner").remove([uniqueFileName]);
      
      return new Response(
        JSON.stringify({ error: dbError.message }), 
        { status: 500 }
      );
    }

    return Response.json({ 
      success: true, 
      id: dbData.id,
      image_url: imageUrl,
      file_name: file.name,
      file_size: file.size
    });

  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }), 
      { status: 500 }
    );
  }
}