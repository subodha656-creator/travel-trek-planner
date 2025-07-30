import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return Response.json({ error: "Missing query string (q=email)" }, { status: 400 });
  }

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (!user || authError) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: filteredUsers, error: profileError } = await supabase
    .from("profiles")
    .select("user_id, email, full_name, avatar_url")
    .ilike("email", `%${query}%`)
    .neq("user_id", user.id); 


  if (profileError) {
    return Response.json({ error: profileError.message }, { status: 500 });
  }

  return Response.json({ data: filteredUsers });
}
