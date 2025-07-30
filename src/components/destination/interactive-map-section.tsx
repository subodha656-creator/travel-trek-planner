'use client'

import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import { Input } from '../ui/input';
import DestinationDropdown from '../trip/destinations-list-dropdown';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const InteractiveMapSection = ({
}: {
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDestinations, setShowDestinations] = useState(false);
  const [latitude, setLatitude] = useState(27.7172); 
  const [longitude, setLongitude] = useState(85.3240);
  const [isClient, setIsClient] = useState(false);

  // Fix Leaflet default markers
  useEffect(() => {
    setIsClient(true);
    
    // Fix for default markers
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setLatitude(lat);
        setLongitude(lng);
      },
    });

    return (
      <Marker position={[latitude, longitude]}>
        <Popup>
          <div className="text-center">
            <h4 className="font-semibold text-gray-800">Selected Location</h4>
            <p className="text-sm text-gray-600">
              Lat: {latitude.toFixed(4)}, Lng: {longitude.toFixed(4)}
            </p>
          </div>
        </Popup>
      </Marker>
    );
  };

  // Custom marker icon (optional)
  const customIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Render loading state for SSR
  if (!isClient) {
    return (
      <div className="mb-16">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-4xl p-8 border border-white border-opacity-20 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MapPin className="h-8 w-8 text-travel-secondary" />
              <h3 className="text-3xl font-bold text-travel-primary">Explore Location</h3>
            </div>

            <div className="w-60 relative">
              <Input
                type="text"
                name="destination"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDestinations(true);
                }}
                value={searchQuery}
                placeholder="Search destinations..."
                className="w-full px-4 py-3 border-[outset]/60 border-[1px] rounded-2xl focus:ring-1 focus:ring-travel-primary-light focus:border-travel-primary-light text-gray-900"
              />
              <MapPin className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              <DestinationDropdown
                showDestinations={showDestinations}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setShowDestinations={setShowDestinations}
                setLatitude={setLatitude}
                setLongitude={setLongitude}
              />
            </div>
          </div>

          <div className="h-96 w-full rounded-2xl overflow-hidden shadow-inner bg-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-travel-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-16">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-4xl p-8 border border-white border-opacity-20 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MapPin className="h-8 w-8 text-travel-secondary" />
            <h3 className="text-3xl font-bold text-travel-primary">Explore Location</h3>
          </div>

          <div className="w-60 relative">
            <Input
              type="text"
              name="destination"
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDestinations(true);
              }}
              value={searchQuery}
              placeholder="Search destinations..."
              className="w-full px-4 py-3 border-[outset]/60 border-[1px] rounded-2xl focus:ring-1 focus:ring-travel-primary-light focus:border-travel-primary-light text-gray-900"
            />
            <MapPin className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            <DestinationDropdown
              showDestinations={showDestinations}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setShowDestinations={setShowDestinations}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
            />
          </div>
        </div>

        <div className="h-96 w-full rounded-2xl overflow-hidden shadow-inner">
          <MapContainer
            center={[latitude, longitude]}
            zoom={13}
            scrollWheelZoom={true}
            className="h-full w-full rounded-2xl z-0"
            key={`${latitude}-${longitude}`} // Force re-render when coordinates change
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
          </MapContainer>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-white/70">
            Click on the map to select a location
          </p>
          <p className="text-xs text-white/50 mt-1">
            Current: {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapSection;