import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const destinations = [
  {
    id: 1,
    name: 'Europe',
    trips: '849 trips',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop',
    alt: 'European architecture with towers and historic buildings'
  },
  {
    id: 2,
    name: 'Africa wild',
    trips: '1,269 trips',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop',
    alt: 'African wildlife safari scene'
  },
  {
    id: 3,
    name: 'Scandinavia',
    trips: '2,069 trips',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
    alt: 'Scandinavian landscape with mountains and water'
  },
  {
    id: 4,
    name: 'America',
    trips: '3,136 trips',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    alt: 'American landscape with mountains'
  },
  {
    id: 5,
    name: 'Asia',
    trips: '2,847 trips',
    image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=400&h=300&fit=crop',
    alt: 'Asian temple and cultural sites'
  },
  {
    id: 6,
    name: 'Australia',
    trips: '1,534 trips',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    alt: 'Australian outback landscape'
  }
];

export default function PopularDestinations() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(()=> {
    window.addEventListener('resize', () => {
      setItemsPerView(window.innerWidth < 400 ? 1  : 4);
    });
  }, [])

  const maxIndex = Math.max(0, destinations.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    <section className="py-16 max-w-7xl mx-auto md:px-8 px-8 mb-12">
      <div className="mb-12">
        <p className="text-sm font-medium text-travel-neutral2-glass tracking-wide uppercase mb-2">
          3 STEPS FOR THE PERFECT TRIP
        </p>
        <h2 className="text-4xl font-bold text-travel-neutral-glass mb-4">
          Popular Destinations
        </h2>
        <p className="text-travel-neutral2-glass max-w-2xl leading-relaxed">
          Experience the magic of travel with our most popular destinations. From Europe's historic charm to Africa's wild beauty, from Scandinavia's natural wonders to America's diverse landscapes – each carefully planned journey offers authentic cultural experiences, breathtaking scenery, and memories that last a lifetime. Discover why thousands of travelers choose these extraordinary destinations year after year.
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <button
          onClick={nextSlide}
          disabled={currentIndex >= maxIndex}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>

        {/* Carousel Track */}
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {destinations.map((destination) => (
              <div 
                key={destination.id}
                className="flex-shrink-0 px-3"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <div className="group cursor-pointer">
                  {/* Image Container */}
                  <div className="relative overflow-hidden rounded-3xl aspect-[4/3] mb-4">
                    <img
                      src={destination.image}
                      alt={destination.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  {/* Destination Info */}
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {destination.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {destination.trips}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center space-x-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex 
                  ? 'bg-blue-600' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}