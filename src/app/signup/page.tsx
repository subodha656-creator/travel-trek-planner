'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { signup } from '../login/actions';

const initialState = {
  message: "",
  error: false,
}

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, initialState);
  
  return (
    <div
    className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
       

  <div
    className="absolute inset-0 z-0 mb-12"
    style={{
      background: "url('assets/hills3.png')",
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat"
    }}
  ></div>
   <div
    className="absolute inset-0 bg-opacity-40 backdrop-blur z-10"
  ></div>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 relative z-20">
        <h2 className="text-3xl font-bold text-center text-travel-primary mb-6">Join TravelTrek</h2>
        <form className="space-y-5">
          {state.message && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              state.error 
                ? 'bg-red-100 text-red-700 border border-red-200' 
                : 'bg-green-100 text-green-700 border border-green-200'
            }`}>
              {state.message}
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-travel-primary-light"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-travel-primary-light"
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-travel-primary-light"
            />
          </div>
          
          <div>
            <Button
              type='submit'
              formAction={formAction}
              disabled={isPending}
              className="w-full bg-travel-primary text-white py-2 px-4 rounded-lg hover:bg-travel-primary-light transition duration-200 shadow-md disabled:opacity-50"
            >
              {isPending ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </div>
        </form>
        
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Log in</a>
        </p>
      </div>
    </div>
  )
}