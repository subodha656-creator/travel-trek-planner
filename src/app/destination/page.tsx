'use client'
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Camera, Star, Users, Clock, ArrowRight, Mountain, Compass, Globe } from 'lucide-react';
import InteractiveMapSection from '@/components/destination/interactive-map-section';

const TravelDestinationPage = () => {
  const [selectedDestination, setSelectedDestination] = useState<string>('nepal');
  const [mapInstance, setMapInstance] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const mapRef = useRef(null);

  const destinations = {
    nepal: {
      name: 'Nepal Himalayas',
      coordinates: [28.3949, 84.1240],
      description: 'Experience the majestic Himalayas with breathtaking mountain views and rich cultural heritage.',
      difficulty: 'Challenging',
      duration: '14-21 days',
      bestTime: 'Oct-Dec, Mar-May',
      rating: 4.9,
      reviews: 1247,
      photos: [
        { id: 1, url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800', title: 'Everest Base Camp' },
        { id: 2, url: 'https://images.unsplash.com/photo-1605538883669-825200433431?w=800', title: 'Annapurna Circuit' },
        { id: 3, url: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800', title: 'Kathmandu Valley' },
        { id: 4, url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=800', title: 'Sherpa Village' },
        { id: 5, url: 'https://images.unsplash.com/photo-1605026110219-cfb74545047b?w=800', title: 'Prayer Flags' },
        { id: 6, url: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800', title: 'Mountain Sunrise' }
      ]
    },
    patagonia: {
      name: 'Patagonia',
      coordinates: [-50.0343, -73.0115],
      description: 'Discover the wild landscapes of Patagonia with glaciers, peaks, and pristine wilderness.',
      difficulty: 'Moderate to Hard',
      duration: '10-16 days',
      bestTime: 'Nov-Mar',
      rating: 4.8,
      reviews: 892,
      photos: [
        { id: 1, url: 'https://images.unsplash.com/photo-1552832230-592ce5042d9d?w=800', title: 'Torres del Paine' },
        { id: 2, url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=800', title: 'Glacier Hiking' },
        { id: 3, url: 'https://images.unsplash.com/photo-1586276393630-c9cf28c48c88?w=800', title: 'Fitz Roy' },
        { id: 4, url: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800', title: 'Perito Moreno' },
        { id: 5, url: 'https://images.unsplash.com/photo-1605538883669-825200433431?w=800', title: 'Wildlife' },
        { id: 6, url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800', title: 'Camping' }
      ]
    },
    kilimanjaro: {
      name: 'Mount Kilimanjaro',
      coordinates: [-3.0674, 37.3556],
      description: 'Conquer Africa\'s highest peak through diverse ecosystems from rainforest to arctic summit.',
      difficulty: 'Challenging',
      duration: '6-9 days',
      bestTime: 'Jun-Oct, Dec-Mar',
      rating: 4.7,
      reviews: 2156,
      photos: [
        { id: 1, url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', title: 'Uhuru Peak' },
        { id: 2, url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=800', title: 'Machame Route' },
        { id: 3, url: 'https://images.unsplash.com/photo-1586276393630-c9cf28c48c88?w=800', title: 'Barranco Wall' },
        { id: 4, url: 'https://images.unsplash.com/photo-1605538883669-825200433431?w=800', title: 'Safari Views' },
        { id: 5, url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800', title: 'Sunrise Summit' },
        { id: 6, url: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800', title: 'Glaciers' }
      ]
    },
    alps: {
      name: 'European Alps',
      coordinates: [46.5197, 10.4017],
      description: 'Trek through iconic Alpine landscapes with charming villages and spectacular mountain vistas.',
      difficulty: 'Easy to Moderate',
      duration: '7-14 days',
      bestTime: 'Jun-Sep',
      rating: 4.6,
      reviews: 1834,
      photos: [
        { id: 1, url: 'https://images.unsplash.com/photo-1551524164-6cf1ac833fb5?w=800', title: 'Matterhorn' },
        { id: 2, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', title: 'Mont Blanc' },
        { id: 3, url: 'https://images.unsplash.com/photo-1586276393630-c9cf28c48c88?w=800', title: 'Swiss Villages' },
        { id: 4, url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=800', title: 'Alpine Lakes' },
        { id: 5, url: 'https://images.unsplash.com/photo-1605538883669-825200433431?w=800', title: 'Mountain Huts' },
        { id: 6, url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800', title: 'Wildflowers' }
      ]
    }
  };



  const currentDestination = destinations[selectedDestination];

  return (
    <div className="min-h-screen bg-gradient-to-br rounded-4xl ">
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 rounded-4xl bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: 'url("/assets/himalaya.jpg")',
          }}
        >
          <div className="absolute inset-0 rounded-4xl bg-black/20 bg-opacity-40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6 space-x-2">
            <Mountain className="h-8 w-8 text-travel-primary" />
            <h1 className="lg:text-6xl md:text-4xl sm:text-2xl text-xl font-bold bg-gradient-to-r from-travel-primary to-travel-primary-light bg-clip-text text-transparent">
              Trek Destinations
            </h1>
            <Compass className="h-8 w-8 text-travel-primary" />
          </div>
          <p className="text-xl text-white font-semibold mb-8 leading-relaxed">
            Discover breathtaking trekking destinations around the world. From the mighty Himalayas to the pristine wilderness of Patagonia.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(destinations).map(([key, dest]) => (
              <button
                key={key}
                onClick={() => setSelectedDestination(key)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedDestination === key
                    ? 'bg-gradient-to-r from-travel-primary to-travel-primary-light text-white shadow-lg'
                    : 'bg-travel-secondary bg-opacity-20 backdrop-blur-md text-white hover:bg-opacity-30'
                }`}
              >
                {dest.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-4xl font-bold text-travel-primary">{currentDestination.name}</h2>
                <div className="flex items-center space-x-2 text-yellow-400">
                  <Star className="h-6 w-6 fill-current" />
                  <span className="text-2xl font-bold text-travel-secondary">{currentDestination.rating}</span>
                  <span className="text-gray-300">({currentDestination.reviews} reviews)</span>
                </div>
              </div>
              
              <p className="text-travel-secondary text-lg mb-8 leading-relaxed">
                {currentDestination.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full">
                    <Mountain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-travel-primary text-sm">Difficulty</p>
                    <p className="text-travel-secondary font-semibold">{currentDestination.difficulty}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-travel-primary text-sm">Duration</p>
                    <p className="text-travel-secondary font-semibold">{currentDestination.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-travel-primary text-sm">Best Time</p>
                    <p className="text-travel-secondary font-semibold">{currentDestination.bestTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-4xl p-6 text-white shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <Users className="h-8 w-8" />
                <span className="text-2xl font-bold">2.5K+</span>
              </div>
              <p className="text-emerald-100">Adventurers Joined</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-4xl p-6 text-white shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <Camera className="h-8 w-8" />
                <span className="text-2xl font-bold">10K+</span>
              </div>
              <p className="text-purple-100">Photos Captured</p>
            </div>
            
            <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-4xl transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center space-x-2">
              <span>Book Adventure</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>


        <InteractiveMapSection
    selectedDestination={selectedDestination}
    setSelectedDestination={setSelectedDestination}
  />

        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20 shadow-2xl">
          <div className="flex items-center space-x-3 mb-8">
            <Camera className="h-8 w-8 text-cyan-400" />
            <h3 className="text-3xl font-bold text-white">Destination Gallery</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentDestination.photos.map((photo) => (
              <div 
                key={photo.id}
                className="group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 shadow-xl"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="text-lg font-bold mb-2">{photo.title}</h4>
                  <div className="w-12 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              className="max-w-full max-h-full object-contain rounded-2xl"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8 rounded-b-2xl">
              <h3 className="text-2xl font-bold text-white">{selectedPhoto.title}</h3>
            </div>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-md text-white p-2 rounded-full hover:bg-opacity-30 transition-all duration-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelDestinationPage;