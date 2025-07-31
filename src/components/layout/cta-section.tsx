import { CheckCircle, CheckCircle2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export default function CTASection() {
  return (
    <>
    <section className="flex justify-center items-center">
      <div className="py-[100px]  max-w-[1408px] lg:pl-[160px] md:pl-[80px] sm:pl-[20px] bg-gradient-to-r w-full">
        <div className="mx-auto text-center gap-12 flex md:flex-row flex-col-reverse px-0 items-center justify-between w-full">
          <div className="flex justify-start items-start flex-col">
            <p className="capitalize text-[12px] mb-4">Take a tour</p>
            <h2 className="text-travel-neutral-glass md:text-3xl text-2xl lg:text-5xl font-bold text-start">Ready To Plan Our Next Adventure</h2>
            <p className="text-start mt-8 mb-8">
              Join thousands of travelers who trust Travel Trek to plan their perfect trips. Start planning for free today!
            </p>

            <ul className="flex justify-start items-start flex-col gap-6 text-travel-neutral2-glass text-sm text-left ">
              <li className="flex justify-center items-center gap-2">
                <CheckCircle2Icon className="w-5 h-5 text-travel-primary" />
                A collaborative travel planning platform</li>
              <li className="flex justify-center items-center gap-2">
                <CheckCircle2Icon className="w-5 h-5 text-travel-primary" />
                TravelTrek is currently free to use for individual travelers.</li>
              <li className="flex justify-center items-center gap-2">
                <CheckCircle2Icon className="w-5 h-5 text-travel-primary" />
                Trips are private unless you choose to share them</li>

                <Button className="mt-5 px-6 py-4 h-12 rounded-[90px] text-base bg-travel-primary">
                  Learn more
                </Button>

            </ul>
          </div>
          <div className="w-full flex justify-end items-start">
            <Image src="/assets/travel.png" width={800} height={622 } alt="" className="w-[800px]"/>
          </div>
          {/* <h2 className="text-4xl font-bold text-white mb-6">
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
          </div> */}
        </div>
      </div>
      </section>
    </>
  );
}
