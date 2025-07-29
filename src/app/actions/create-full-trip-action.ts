'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache";

export async function submitFullTrip(formData: FormData) {
  
  const supabase = await createClient()
  const destination = formData.get("destination") as string
  const lat = parseFloat(formData.get('latitude') as string)
  const lng = parseFloat(formData.get('longitude') as string)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not logged in");
  }

  const image = formData.get("image") as File;

  if (!image || !(image instanceof File) || image.size === 0) {
    throw new Error("Image is required");
  }

  const tripData = {
    title: formData.get("title"),
    destination: formData.get("destination"),
    start_date: formData.get("startDate"),
    end_date: formData.get("endDate"),
    description: formData.get("notes"),
    user_id: user?.id,
    destination_coordinates: `(${lng},${lat})`,
  }

  // Validation
  if (!destination || !tripData.title || !tripData.start_date || !tripData.end_date || !lat || !lng) {
    throw new Error("Some fields (*) are required")
  }

  if (isNaN(lat) || isNaN(lng)) {
    throw new Error("Invalid coordinates")
  }

  const startDate = new Date(tripData.start_date as string)
  const endDate = new Date(tripData.end_date as string)
  const now = new Date()
  
  now.setHours(0, 0, 0, 0)
  startDate.setHours(0, 0, 0, 0)
  endDate.setHours(0, 0, 0, 0)

  if (startDate.getTime() < now.getTime()) {
    throw new Error("Start date cannot be in the past")
  }

  if (startDate.getTime() > endDate.getTime()) {
    throw new Error("End date cannot be before start date")
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(image.type)) {
    throw new Error("Only JPEG, PNG, and WebP images are allowed")
  }

  const fileExt = image.name.split('.').pop()
  const filePath = `trips/${user.id}/${Date.now()}.${fileExt}`

  try {
    const { error: uploadError } = await supabase.storage
      .from('travelplanner')
      .upload(filePath, image)

    if (uploadError) {
      throw new Error('Image upload failed: ' + uploadError.message)
    }

    const { data: trip, error: tripError } = await supabase.from('trips')
      .insert({ ...tripData, cover_image_url: filePath })
      .select()
      .single()

    if (tripError) {
      await supabase.storage
        .from('travelplanner')
        .remove([filePath])
      
      throw new Error(tripError.message)
    }

    revalidatePath('/dashboard/trips') 

    return {
      success: true,
      id: trip?.id
    }

  } catch (error) {
    await supabase.storage
      .from('travelplanner')
      .remove([filePath])
    
    throw error
  }
}