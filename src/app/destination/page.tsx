'use client'
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Camera, Star, Users, Clock, ArrowRight, Mountain, Compass, Globe } from 'lucide-react';
import InteractiveMapSection from '@/components/destination/interactive-map-section';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const TravelDestinationPage = () => {
  const [selectedDestination, setSelectedDestination] = useState<Record<string,any>>({});
  const [currentPhotos, setCurrentPhotos] = useState<any[]>([]);
  const [mapInstance, setMapInstance] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [destinations, setDestinations] = useState<Record<string,any>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef(null);
  const router = useRouter()

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch("/api/destination", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ search: 'kathmandu' }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data?.filteredDestinations && Array.isArray(data.filteredDestinations)) {
          setDestinations(data.filteredDestinations.slice(0, 5));
          if (data.filteredDestinations.length > 0) {
            setSelectedDestination(data.filteredDestinations[0]);
          }
        } else {
          setDestinations([]);
        }
      } catch (error) {
        console.error('Error fetching destinations:', error);
        setError('Failed to load destinations');
        setDestinations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  useEffect(() => {
    const fetchDestinationPhotos = async () => {
      if (!selectedDestination?.trip_id) return;
      try {
        const response = await fetch('/api/get-destination-with-photo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ trip_id: selectedDestination.trip_id }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data?.photos && Array.isArray(data.photos)) {
          setCurrentPhotos(data.photos);
        } else {
          setCurrentPhotos([]);
        }
      } catch (error) {
        console.error('Error fetching destination photos:', error);
        setCurrentPhotos([]);
      }
    };

    fetchDestinationPhotos();
  }, [selectedDestination?.trip_id]);

  const currentDestination = selectedDestination;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-travel-primary mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading destinations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-travel-primary text-white rounded-lg hover:bg-travel-primary-dark"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br rounded-4xl">
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
            {destinations && destinations.length > 0 ? destinations.map((dest: Record<string,any>, index) => (
              <button
                key={dest?.trip_id || index}
                onClick={() => setSelectedDestination(dest)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedDestination?.trip_id === dest?.trip_id
                    ? 'bg-gradient-to-r from-travel-primary to-travel-primary-light text-white shadow-lg'
                    : 'bg-travel-secondary bg-opacity-20 backdrop-blur-md text-white hover:bg-opacity-30'
                }`}
              >
                {dest?.name || 'Unknown Destination'}
              </button>
            )) : (
              <p className="text-white">No destinations available</p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-4xl font-bold text-travel-primary">
                  {currentDestination?.name || 'Select a Destination'}
                </h2>
                <div className="flex items-center space-x-2 text-yellow-400">
                  <Star className="h-6 w-6 fill-current" />
                  <span className="text-2xl font-bold text-travel-secondary">
                    {currentDestination?.rating || 'N/A'}
                  </span>
                </div>
              </div>
              
              {currentDestination?.description && (
                <p className="text-travel-secondary text-lg mb-8 leading-relaxed">
                  {currentDestination.description}
                </p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full">
                    <Mountain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-travel-primary text-sm">Difficulty</p>
                    <p className="text-travel-secondary font-semibold">
                      {currentDestination?.difficulty || 'Moderate'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-travel-primary text-sm">Duration</p>
                    <p className="text-travel-secondary font-semibold">
                      {currentDestination?.duration || 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-travel-primary text-sm">Best Time</p>
                    <p className="text-travel-secondary font-semibold">
                      {currentDestination?.bestTime || 'Year Round'}
                    </p>
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
            
            <Button onClick={() => router.push('/dashboard/trips')} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-4xl transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center space-x-2">
              <span>Create Trip</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <InteractiveMapSection />

        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20 shadow-2xl">
          <div className="flex items-center space-x-3 mb-8">
            <Camera className="h-8 w-8 text-travel-primary" />
            <h3 className="text-3xl font-bold text-black">Destination Gallery</h3>
          </div>
          
          {currentPhotos && currentPhotos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPhotos.map((photo: any, index: number) => (
                <div 
                  key={photo?.id || index}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 shadow-xl"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo?.image_url || '/placeholder-image.jpg'}
                    alt={photo?.title || 'Destination photo'}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-lg font-bold mb-2">{photo?.title || 'Beautiful View'}</h4>
                    <div className="w-12 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-white text-lg">No photos available for this destination</p>
            </div>
          )}
        </div>
      </div>

      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedPhoto?.image_url || '/placeholder-image.jpg'}
              alt={selectedPhoto?.title || 'Photo'}
              className="max-w-full max-h-full object-contain rounded-2xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-image.jpg';
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8 rounded-b-2xl">
              <h3 className="text-2xl font-bold text-white">
                {selectedPhoto?.title || 'Beautiful View'}
              </h3>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhoto(null);
              }}
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