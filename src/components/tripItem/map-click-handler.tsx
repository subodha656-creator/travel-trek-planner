'use client';

import { useMapEvents } from 'react-leaflet';

export default function MapClickHandler({ onClick }: { onClick: (latlng: { lat: number, lng: number }) => void }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onClick({ lat, lng });
    },
  });

  return null; 
}
