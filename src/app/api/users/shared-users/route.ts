import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { tripId } = await req.json();
  const supabase = await createClient();

  const {data: {user}} = await supabase.auth.getUser()
    const { data, error } = await supabase
    .from('trip_collaborators')
    .select("*")
    .eq('trip_id', tripId)

    const collaboratorId = data?.map((collaborator) => collaborator.user_id)

    const { data: allUsers } = await supabaseAdmin.auth.admin.listUsers();

  const matchingUsers = allUsers.users.filter(u => collaboratorId?.includes(u.id));

    console.log(matchingUsers)
   
  if(error){
   throw Error(error.message)
  }
  return Response.json({ data: matchingUsers , currentUser: user});
}
