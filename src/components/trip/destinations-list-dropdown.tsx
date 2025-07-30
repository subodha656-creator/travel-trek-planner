    'use client';

    import { ArrowRight, Globe } from 'lucide-react';
    import React, { useEffect, useState } from 'react';

    type Destination = {
    name: string;
    region: string;
    category: string;
    latitude: number;
    longitude: number;
    address: string;
    };

    interface DestinationDropdownProps {
    showDestinations: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    setShowDestinations: (show: boolean) => void;
    setLatitude: (latitude: number) => void;
    setLongitude: (longitude: number) => void;
    }

    const DestinationDropdown: React.FC<DestinationDropdownProps> = ({
    showDestinations,
    searchQuery,
    setSearchQuery,
    setShowDestinations,
    setLatitude,
    setLongitude,
    }) => {
        if (!showDestinations) return [];

    const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);

    useEffect(() => {
        const getDestinations = async () => {
        const response = await fetch("../api/destination", {
            method: "POST",
            body: JSON.stringify({
            search: searchQuery,
            }),
        });
        const { filteredDestinations } = await response.json();
        setFilteredDestinations(filteredDestinations);
        };
        if (searchQuery != "") {
        getDestinations();
        }
    }, [searchQuery]);
    return (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
        {!searchQuery && (
            <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Popular Destinations
            </h3>
            </div>
        )}

        {filteredDestinations && filteredDestinations.length > 0 ? (
            filteredDestinations.map((destination, index) => (
            <button
                key={index}
                onClick={() => {
                setSearchQuery(destination.name);
                setLatitude(destination.latitude);
                setLongitude(destination.longitude);
                setShowDestinations(false);
                }}
                className="w-full px-4 py-3 hover:bg-blue-50 text-left flex items-center space-x-3 transition-colors group"
            >
                <div className="flex-1">
                <div className="font-medium text-gray-900 group-hover:text-blue-600">
                    {destination.name}
                </div>
                <div className="text-sm text-gray-500">
                    {"Trip Data"} • {destination.address}
                </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all" />
            </button>
            ))
        ) : searchQuery ? (
            <div className="px-4 py-6 text-center text-gray-500">
            <Globe className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No destinations found for "{searchQuery}"</p>
            <p className="text-sm mt-1">
                Try searching for a destination name or region
            </p>
            </div>
        ) : null}

        {!searchQuery && (
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                <span>Explore all destinations</span>
                <ArrowRight className="w-4 h-4" />
            </button>
            </div>
        )}
        </div>
    );
    };

    export default DestinationDropdown;
