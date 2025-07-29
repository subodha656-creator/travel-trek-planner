import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q'); 

  if (!query) {
    return Response.json({ error: "Missing query string (q=email)" }, { status: 400 });
  }

  const {data: {user: userMe}} = await supabase.auth.getUser()

  const { data: usersData, error } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const filteredUsers = usersData.users.filter(user => 
    user.email?.toLowerCase().includes(query.toLowerCase()) && user?.id != userMe?.id
  ).slice(0, 10); 

  return Response.json({ data: filteredUsers });
}
