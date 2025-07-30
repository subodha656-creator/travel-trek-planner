import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { tripId } = await req.json();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("trip_collaborators")
    .select("*")
    .eq("trip_id", tripId);

  if (error) {
    throw Error(error.message);
  }

  const collaboratorIds = data?.map((collaborator) => collaborator.user_id) || [];

  const result = await Promise.all(
    collaboratorIds.map(async (id) => {
      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select("email, full_name, avatar_url") 
        .eq("user_id", id)
        .single();

      if (profileError) {
        return { user_id: id, email: null, name: null };
      }

      return {
        id: id,
        email: userProfile?.email,
        name: userProfile?.full_name,
        avatar_url: userProfile?.avatar_url,
      };
    })
  );

  return Response.json({ data: result, currentUser: user });
}
