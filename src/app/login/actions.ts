'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

interface LoginState {
  message: string | null;
  error: boolean;
}

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return {
      error: true,
      message: error.message
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}




interface SignupState {
  message: string;
  error: boolean;
}

export async function signup(prevState: SignupState, formData: FormData): Promise<SignupState> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    return {
      error: true,
      message: 'Passwords do not match'
    }
  }

  if (password.length < 6) {
    return {
      error: true,
      message: 'Password must be at least 6 characters long'
    }
  }

  const data = {
    email,
    password,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return {
      error: true,
      message: error.message
    }
  }

  return {
    error: false,
    message: 'Account created successfully! Please check your email to verify your account.'
  }
}