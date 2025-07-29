import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from './server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // const supabase = createServerClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  //   {
  //     cookies: {
  //       getAll() {
  //         return request.cookies.getAll()
  //       },
  //       setAll(cookiesToSet) {
  //         cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
  //         supabaseResponse = NextResponse.next({
  //           request,
  //         })
  //         cookiesToSet.forEach(({ name, value, options }) =>
  //           supabaseResponse.cookies.set(name, value, options)
  //         )
  //       },
  //     },
  //   }
  // )
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser()
  
  const url = request.nextUrl.clone()
  
  // Define auth-related routes
  const authRoutes = ['/login', '/signup', '/register']
  const isAuthRoute = authRoutes.includes(url.pathname)
  
  if (user && isAuthRoute) {
    url.pathname = '/' 
    return NextResponse.redirect(url)
  }
  
  const protectedRoutes = ['/account', '/dashboard', '/profile'] 
  const isProtectedRoute = protectedRoutes.some(route => url.pathname.startsWith(route))
  
  if (!user && isProtectedRoute) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}