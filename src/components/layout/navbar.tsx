'use client'
import React, { useState, useEffect } from 'react';
import { Menu, X, HelpCircle } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

const Navbar = ({user}: {user: any}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsSticky(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`bg-white transition-all duration-300 ease-in-out ${
      isSticky 
        ? 'fixed top-0 left-0 right-0 z-50 shadow-lg backdrop-blur-sm bg-white/95' 
        : 'relative'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href={"/"} className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-travel-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="text-xl font-bold text-travel-primary drop-shadow-md">Travel
                  <span className="text-travel-secondary drop-shadow-md">Trek</span>
                </span>
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/" className="text-gray-600 hover:text-travel-primary-light px-3 py-2 text-sm font-medium transition-colors">
                Home
              </Link>
              
              <Link href="/faq" className="text-gray-600 hover:text-travel-primary-light px-3 py-2 text-sm font-medium transition-colors">
                Faqs
              </Link>
               {
              user && (
                <>
                <Link href="/dashboard/trips" className="text-gray-600  hover:text-travel-primary-light px-3 py-2 text-sm font-medium transition-colors">
                  My Trips
                </Link>

                <Link href="/dashboard/collaboration" className="text-gray-600  hover:text-travel-primary-light px-3 py-2 text-sm font-medium transition-colors">
                  Collaboration
                </Link>
                </>
              )
            } 
         
            </div>
          </div>

          {/* Right side - Explore Destinations */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/destination" className="flex items-center space-x-2 text-black bg-white rounded-3xl border-[1px] border-[outset]/60 focus:shadow-inner/50 hover:text-white hover:bg-travel-secondary-light px-3 py-2 text-sm font-medium transition-colors">
              <span>Explore Destinations</span>
              <HelpCircle className="w-4 h-4" />
            </Link>
           
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-travel-primary-light"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
            <Link href="/" className="text-gray-900 hover:travel-primary-light block px-3 py-2 text-base font-medium">
              Home
            </Link>
            {/* <Link href="#" className="text-gray-600 hover:travel-primary-light block px-3 py-2 text-base font-medium">
              Partners
            </Link> */}
            <Link href="/faq" className="text-gray-600 hover:travel-primary-light block px-3 py-2 text-base font-medium">
              FAQ
            </Link>
             {
              user && (
                <>
                <Link href="/dashboard/trips" className="text-gray-600 hover:travel-primary-light block px-3 py-2 text-base font-medium">
                  My Trips
                </Link>
                <Link href="/dashboard/collaboration" className="text-gray-600 hover:travel-primary-light block px-3 py-2 text-base font-medium">
                  Collaboration
                </Link>
                </>
              )
            }
            {/* <Link href="#" className="text-gray-600 hover:travel-primary-light block px-3 py-2 text-base font-medium">
              Coupons and Promos
            </Link> */}
            <Button className="flex items-center mt-6 space-x-2 text-black bg-white rounded-3xl border-[1px] border-[outset]/60 focus:shadow-inner/50 hover:text-white hover:bg-travel-secondary-light w-full text-left px-3 py-2 text-base font-medium">
              <span>Explore Destinations</span>
              <HelpCircle className="w-4 h-4" />
            </Button>
           
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;