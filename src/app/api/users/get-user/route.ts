import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const {data: {user}, error} = await supabase.auth.getUser()

  const {data: profile} = await supabase.from('profiles').select('*').eq('user_id', user?.id)
 
   
  if(error){
   throw Error(error.message)
  }
  return Response.json({ currentUser: {...profile?.[0], ...user, email: user?.email}});
}
