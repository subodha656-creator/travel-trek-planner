"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import Link from "next/link";

export default function CTASection() {
  const router = useRouter();
  return (
    <>
      <section className="py-24 bg-gradient-to-r from-travel-primary to-travel-primary-light rounded-4xl mb-6">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to plan your next adventure?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of travelers who trust Travel Trek to plan their
            perfect trips. Start planning for free today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-white text-travel-primary hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Planning Free
            </Link>
            <Link href={"/"} className="border-2 border-white text-white hover:bg-white hover:text-travel-primary-light px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
