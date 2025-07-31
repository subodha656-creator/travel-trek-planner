'use client'

import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import { useTripContext } from '@/context/trip-context'

const MapContainer = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.MapContainer })), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.TileLayer })), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.Marker })), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.Popup })), { ssr: false })
const MapClickHandler = dynamic(() => import('./map-click-handler'), { ssr: false })

const roadLayer =
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

const satelliteLayer =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

type MapWithToggleProps = {
  center?: [number, number]
  zoom?: number
  popupText?: string
}

const MapWithToggle = ({
  center = [27.7172, 85.324],
  zoom = 13,
  popupText = 'Trip location',
}: MapWithToggleProps) => {
  const [viewType, setViewType] = useState<'road' | 'satellite'>('road')
  const [isClient, setIsClient] = useState(false)

  const {selectedTrip} = useTripContext();
  useEffect(() => {
    setIsClient(true)
    
    if (typeof window !== 'undefined') {
      const L = require('leaflet')
      
      delete (L.Icon.Default.prototype as any)._getIconUrl;
     L.Icon.Default.mergeOptions({
           iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
           iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
           shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
         });
    }
  }, [])

  if (!isClient) {
    return (
      <div className="relative h-[500px] w-full rounded-2xl overflow-hidden backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl shadow-black/10 flex items-center justify-center">
        <div className="text-gray-600">Loading map...</div>
      </div>
    )
  }

  return (
    <div className="relative h-[500px] w-full rounded-2xl overflow-hidden backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl shadow-black/10 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/30 before:to-white/10 before:-z-10">
      <Button
        onClick={() =>
          setViewType(viewType === 'road' ? 'satellite' : 'road')
        }
        className="absolute z-[1000] top-4 left-4 px-4 py-2 backdrop-blur-xl bg-white/20 text-gray-800 hover:bg-white/30 rounded-lg shadow-lg border border-white/30 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl drop-shadow-sm"
      >
        {viewType === 'road' ? 'Switch to Satellite' : 'Switch to Road'}
      </Button>

      <div className="absolute inset-2 rounded-xl overflow-hidden border border-white/20 shadow-inner">
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={true}
          className="h-full w-full z-0"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap or Esri'
            url={viewType === 'road' ? roadLayer : satelliteLayer}
          />
           <MapClickHandler onClick={(coords) => {
        // setClickedCoords(coords);
      }} />
          <Marker position={[selectedTrip.latitude, selectedTrip.longitude]}>
            <Popup>
              <div className="backdrop-blur-sm bg-white/90 p-2 rounded-lg border border-white/50 shadow-lg">
                <span className="text-gray-800 font-medium drop-shadow-sm">
                  {popupText}
                </span>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  )
}

export default MapWithToggle