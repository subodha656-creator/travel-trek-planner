import { supabaseAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('trip_collaborators')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const result = await Promise.all(
    data.map(async (item) => {
      const { data: trip } = await supabase
        .from('trips')
        .select('*')
        .eq('id', item.trip_id)
        .single(); 
      return { trip, collaborator: item };
    })
  );


  return NextResponse.json({ result });
}
