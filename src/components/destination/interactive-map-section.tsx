'use client'

import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import { Input } from '../ui/input';
import DestinationDropdown from '../trip/destinations-list-dropdown';
import { useState } from 'react';
import L from 'leaflet';

const InteractiveMapSection = ({
  selectedDestination,
  setSelectedDestination,
}: {
  selectedDestination: string;
  setSelectedDestination: (value: string) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDestinations, setShowDestinations] = useState(false);
  const [latitude, setLatitude] = useState(27.7172); 
  const [longitude, setLongitude] = useState(85.3240);

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
        <Popup>Selected Location</Popup>
      </Marker>
    );
  };

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
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapSection;
