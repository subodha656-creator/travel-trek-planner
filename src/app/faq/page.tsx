'use client'


import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button";
import SectionWrapper from "@/components/layout/section-wrapper";
const Faqs = [
  {
    category: "General",
    faqs: [
      {
        question: "What is TravelTrek?",
        answer: "TravelTrek is a collaborative travel planning platform that helps you create, manage, and share trips with friends, guides, and creators."
      },
      {
        question: "Do I need to sign up to use TravelTrek?",
        answer: "Yes, to create or collaborate on trips, you must first sign up and log in. This ensures secure access and personalized trip data."
      },
      {
        question: "Is TravelTrek free to use?",
        answer: "Yes, TravelTrek is currently free to use for individual travelers. Premium features may be added in future updates."
      },
      {
        question: "Can I use TravelTrek on mobile devices?",
        answer: "Absolutely! TravelTrek is fully responsive and works well on both desktop and mobile browsers."
      },
      {
        question: "Is my trip data private?",
        answer: "Yes. By default, your trips are private unless you choose to share them. Only invited collaborators can access shared trips."
      }
    ]
  },
  {
    category: "Trip Planning",
    faqs: [
      {
        question: "How do I create a new trip?",
        answer: "Navigate to Dashboard > Trips and click on 'Create Trip'. Fill in the required details like destination, dates, and budget."
      },
      {
        question: "Can I edit or delete an existing trip?",
        answer: "Yes. Each trip page includes options to edit or delete the trip using features in the trip page."
      },
      {
        question: "How do I manage daily schedules?",
        answer: "You can manage your day-to-day itinerary using the day schedule feature using activites panel."
      },
      {
        question: "How many destinations can I add to a trip?",
        answer: "There is no hard limit. You can add multiple destinations and manage them easily with our destination list and map UI."
      },
      {
        question: "Can I add images to my trips?",
        answer: "Yes. You can upload photos via the trip detail page. They are stored securely using Supabase and accessed using the `upload-photos/` API route."
      }
    ]
  },
  {
    category: "Collaborations",
    faqs: [
      {
        question: "How do I invite someone to collaborate on my trip?",
        answer: "You can invite users by email using the Share feature. It utilizes `trip_collaborators` and `share-trip.ts` backend logic."
      },
      {
        question: "What roles can collaborators have?",
        answer: "Collaborators can be 'admin' or 'viewer'. Admins or viewers both can edit trips."
      },
      {
        question: "How do I manage collaborators?",
        answer: "Visit the collaboration panel inside the trip page to add or remove collaborators."
      },
      {
        question: "Can collaborators upload content too?",
        answer: "Yes, if they have the appropriate role (admin), collaborators can also upload photos and suggest edits."
      },
      {
        question: "Where can I see collaboration requests?",
        answer: "Go to Dashboard > Collaboration. You’ll find pending or active requests pulled from `trip_collaborators` and `profiles` data."
      }
    ]
  },
  {
    category: "Map & Destination",
    faqs: [
      {
        question: "Can I see my trip on a map?",
        answer: "Yes. Our platform includes an interactive map that displays all your trip destinations ."
      },
      {
        question: "How does map interaction work?",
        answer: "You can click on the map to add or change locations. We use Leaflet with a custom handler."
      },
      {
        question: "Are coordinates automatically parsed?",
        answer: "Yes. TravelTrek uses `parse-coordinates.ts` helper to convert coordinate strings into usable map data."
      },
      {
        question: "Can I toggle map views?",
        answer: "Yes. You can switch between static and interactive views using the toggle button."
      },
      {
        question: "What data is shown for each location?",
        answer: "Locations include names, country, coordinates, and any associated user-uploaded photos."
      }
    ]
  },
  {
    category: "Account & Support",
    faqs: [
      {
        question: "How do I update my profile?",
        answer: "Go to your profile settings. The system uses `/api/users/update-user` to update your full name, email, and avatar."
      },
      {
        question: "I forgot my password. How can I reset it?",
        answer: "Click on 'Forgot Password' from the login page. You’ll receive a reset link via email."
      },
      {
        question: "How do I log out?",
        answer: "Use the Logout button in the navbar. It uses Supabase auth and the `/api/users/logout` endpoint."
      },
      {
        question: "Is my data secure?",
        answer: "Yes. We use Supabase's row-level security, token-based auth, and storage rules to protect your data."
      },
      {
        question: "How can I contact support?",
        answer: "You can reach us via the contact form in the app or email our support team at support@traveltrek.app."
      }
    ]
  }
];



export default function FAQSection(){
    const [category, setCategory] = useState<string>("General");

    const categories = Faqs.map((faq) => faq.category);
    const changeCategory = (e: React.MouseEvent<HTMLButtonElement>) => {
        const target = e.target as HTMLButtonElement;
        const category = target.dataset.cat;
        if(category){
            setCategory(category);
        }
    }

    const currentFaqs = Faqs.find(faq => faq.category === category)?.faqs || [];
    return (
      <div className="bg-calm-primary/80">         <SectionWrapper>
      <section className="px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center">
 

  <h3 className="mt-8 text-travel-primary text-3xl mb-10 font-bold text-center max-w-2xl">
    Everything you need to know about our services
  </h3>

  <div className="w-full grid md:grid-cols-4 gap-8 items-center">
    <div className="col-span-1">
      <div className="flex flex-col gap-4 sticky top-24">
        {categories.map((cat, index) => (
          <Button
            key={index}
            data-cat={cat}
            onClick={changeCategory}
            variant="outline"
            className={`${cat === category ? "bg-white text-travel-primary": "bg-travel-secondary text-white"} text-sm rounded-full font-semibold border-black/20 hover:text-white hover:bg-travel-secondary/20 transition`}
          >
            {cat}
          </Button>
        ))}
      </div>
    </div>

    <div className="col-span-1 md:col-span-3">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="item-0"
      >
        {currentFaqs.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-travel-primary font-extrabold">{item.question}</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2 text-balance text-sm text-travel-primary font-thin">
              <p>{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </div>
</section>
</SectionWrapper>
</div>


    );
}