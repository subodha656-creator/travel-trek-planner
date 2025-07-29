import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tripId = searchParams.get("trip_id");
  const supabase = await createClient()

  if (!tripId) {
    return new Response(JSON.stringify({ error: "Missing trip_id" }), { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("trip_images")
      .select("id, image_url, created_at")
      .eq("trip_id", tripId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database error:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    const photos = data.map(item => ({
      id: item.id,
      url: item.image_url,
      uploadedAt: new Date(item.created_at)
    }));

    return Response.json(photos);
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}