import { createClient } from "@/lib/supabase/server"
import { NextRequest } from "next/server";



 
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  
 const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');    
  
  if (!id) {
    return Response.json({ error: 'Id is required' }, { status: 400 });
  }
  
  const { data: result, error } = await supabase
    .from('trip_days')
    .select('*')
    .eq('trip_id', id)
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }


 

 
  return Response.json({ result });
}