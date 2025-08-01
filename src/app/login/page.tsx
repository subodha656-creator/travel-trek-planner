'use client'

import { useActionState } from 'react'
import { login } from './actions'
import { Button } from '@/components/ui/button';
import Image from 'next/image';



const initialState = {
  message: "",
  error: false,
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState);
  
  return (
    <div className="relative min-h-[90vh] mb-8 grid grid-cols-1 md:grid-cols-3 bg-gradient-to-br px-4">

  <Image src="/assets/tent-left.png" width={448} height={100} alt="Background Image" className="col-span-1 inset-0 md:h-[90vh] h-[50vh] object-cover md:w-[448px] w-full z-0 mb-12" />
  <div className='flex flex-col items-center justify-center w-full col-span-2'>
      <div className="relative z-20 max-w-md w-full bg-white rounded-2xl p-8">
        <div className='flex justify-center items-center mb-6 gap-4'>
          <Image src="/assets/travel-icon.png" width={40} height={40} alt="Logo" className="" />
          <span className="text-xl font-bold">TravelTrek</span>
        </div>
        <h2 className="text-3xl font-bold text-center text-travel-neutral-glass mb-8">Sign in</h2>
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
          <div className='mb-8'>
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
          <div className='mb-8'>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-travel-primary-light"
            />
          </div>
          <div className='mb-8'>
            <Button
              type='submit'
              formAction={formAction}
              disabled={isPending}
              className="w-full bg-travel-primary text-white py-2 px-4 rounded-lg hover:bg-travel-primary-light transition duration-200 shadow-md disabled:opacity-50"
            >
              {isPending ? 'Logging in...' : 'Log In'}
            </Button>
          </div>
        </form>
        
       
        
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
        </p>
      </div>
  </div>
    </div>
  )
}