"use client";
import React, { useState, useEffect } from "react";
import { Menu, X, HelpCircle, LucideGlobe } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

const routes = [
  { name: "Home", href: "/" },
  { name: "Explore", href: "/destination" },
  { name: "Faqs", href: "/faq" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
];

const authRoutes = [
  { name: "Trips", href: "/dashboard/trips" },
  { name: "Collaboration", href: "/dashboard/collaboration" },
];

const Navbar = ({ user }: { user: any }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsSticky(scrollTop > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`bg-white transition-all duration-300 ease-in-out ${
        isSticky
          ? "fixed top-0 left-0 right-0 z-50 shadow-lg backdrop-blur-sm bg-white/95"
          : "relative"
      }`}
    >
      <div className="max-w-[1408px] mx-auto md:px-4 px-8">
        <div className="flex justify-between items-center h-[88px]">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href={"/"} className="flex items item space-x-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Image
                    src="/assets/travel-icon.png"
                    alt="logo"
                    width={32}
                    height={32}
                  />
                </div>
                <span className="text-xl font-bold text-travel-neutral-glass">
                  Travel
                  <span className="">Trek</span>
                </span>
              </Link>
            </div>
          </div>

          <div className="hidden md:block max-w-full">
            <div className="text-travel-neutral2-glass flex justify-between items-center gap-x-12 gap-y-2">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="hover:text-travel-primary-light text-sm font-medium transition-colors"
                >
                  {route.name}
                </Link>
              ))}

              {user &&
                authRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="hover:text-travel-primary-light text-sm font-medium transition-colors"
                  >
                    {route.name}
                  </Link>
                ))}

              <Link
                href="/"
                className="hover:text-travel-primary-light flex justify-center items-center text-sm font-medium transition-colors gap-3"
              >
                <LucideGlobe className="w-5 h-5" />
                <span>English</span>
              </Link>
            </div>
          </div>

          {!user && (
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className="text-travel-neutral-glass border-[2px] border-travel-neutral6-glass rounded-[90px] hover:text-travel-primary-light px-4 py-2 text-sm font-medium transition-colors"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="text-white hover:text-white bg-travel-primary rounded-[90px] hover:bg-travel-primary-light px-4 py-2 text-sm font-medium transition-colors"
              >
                Signup
              </Link>
            </div>
          )}

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

      {isMenuOpen && (
        <div className="md:hidden px-4">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="text-gray-900 hover:text-travel-primary-light block px-3 py-2 text-base font-medium"
              >
                {route.name}
              </Link>
            ))}

            {user &&
              authRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="text-gray-900 hover:text-travel-primary-light block px-3 py-2 text-base font-medium"
                >
                  {route.name}
                </Link>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
