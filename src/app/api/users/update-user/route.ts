import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const email = formData.get('email') as string;
    const fullName = formData.get('fullName') as string;
    const avatar = formData.get('avatar') as File | null;

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    let avatarUrl = null;

    if (avatar && avatar.size > 0) {
      if (!avatar.type.startsWith('image/')) {
        return Response.json(
          { error: "Invalid file type. Please upload an image." }, 
          { status: 400 }
        );
      }

      if (avatar.size > 5 * 1024 * 1024) {
        return Response.json(
          { error: "File too large. Maximum size is 5MB." }, 
          { status: 400 }
        );
      }

      const fileExt = avatar.name.split('.').pop();
      const filePath = `avatar/${user.id}/${Date.now()}.${fileExt}`;

      const arrayBuffer = await avatar.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const { error: uploadError } = await supabase.storage
        .from('travelplanner')
        .upload(filePath, avatar);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return Response.json(
          { error: 'Image upload failed: ' + uploadError.message }, 
          { status: 500 }
        );
      }

      const { data: urlData } = supabase.storage
        .from('travelplanner')
        .getPublicUrl(filePath);
      
      avatarUrl = urlData.publicUrl;
    }

    const updateData: any = {
      email,
      full_name: fullName,
      user_id: user.id,
      updated_at: new Date().toISOString()
    };

    if (avatarUrl) {
      updateData.avatar_url = avatarUrl;
    }

    const { data, error: profileError } = await supabase
      .from("profiles")
      .upsert([updateData], {
        onConflict: 'user_id'
      })
      .select();

    if (profileError) {
      console.error('Profile error:', profileError);
      return Response.json(
        { error: 'Profile update failed: ' + profileError.message }, 
        { status: 500 }
      );
    }

    return Response.json({ 
      success: "Profile updated successfully",
      data: data[0]
    });

  } catch (error) {
    console.error('API error:', error);
    return Response.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}