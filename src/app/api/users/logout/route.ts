import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();

 
  await supabase.auth.signOut()
  return Response.json({ message: "Logged out successfully" }, { status: 200 });
}
