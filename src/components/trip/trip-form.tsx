'use client'

import { Plus, Save } from 'lucide-react'
import DestinationDropdown from './destinations-list-dropdown'
import { Button } from '../ui/button'
import { useState } from 'react'
import { MapContainer } from 'react-leaflet/MapContainer'
import { Marker, TileLayer, useMapEvents } from 'react-leaflet'
import { Input } from '../ui/input'

type CreateTripFormProps = {
  searchQuery: string
  setSearchQuery: (value: string) => void
  showDestinations: boolean
  setShowDestinations: (value: boolean) => void
  handleCreateTrip: (formData: FormData) => void
  setIsCreating: (value: boolean) => void
  loading: boolean
}

const LocationPicker = ({ setLatitude, setLongitude }: { setLatitude: (lat: number) => void, setLongitude: (lng: number) => void }) => {
  useMapEvents({
    click(e) {
      setLatitude(e.latlng.lat)
      setLongitude(e.latlng.lng)
    },
  })
  return null
}

const CreateTripForm = ({
  searchQuery,
  setSearchQuery,
  showDestinations,
  setShowDestinations,
  handleCreateTrip,
  setIsCreating,
  loading,
}: CreateTripFormProps) => {
    const [latitude, setLatitude] = useState(27.7172 )
    const [longitude, setLongitude] = useState(85.324)
  return (
    <div className="max-w-2xl mx-auto">
      <div className=" bg-transparent rounded-2lg shadow-lg p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-travel-primary-light rounded-lg">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2lg font-bold text-gray-900">Create New Trip</h2>
        </div>

        <form action={handleCreateTrip} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Trip Title
              </label>
              <Input
                type="text"
                name="title"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                placeholder="My Amazing Adventure"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Destination
              </label>
              <Input
                type="text"
                name="destination"
                required
               
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
              />
             
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date
              </label>
              <Input
                type="date"
                name="startDate"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Date
              </label>
              <Input
                type="date"
                name="endDate"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Destination
            </label>
            <Input
              type="text"
              name="destination"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowDestinations(true)
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
            />
            <DestinationDropdown
              showDestinations={showDestinations}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setShowDestinations={setShowDestinations}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Location on Map
            </label>
            <div className="h-96 w-full rounded-lg overflow-hidden border">
                
              <MapContainer
                center={[latitude, longitude]}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full rounded-2lg z-0"
              >
               <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
                <LocationPicker setLatitude={setLatitude} setLongitude={setLongitude} />
                <Marker position={[latitude, longitude]} />
              </MapContainer>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Latitude: <span className="font-medium">{latitude.toFixed(5)}</span>, Longitude:{' '}
              <span className="font-medium">{longitude.toFixed(5)}</span>
            </div>
            <Input type="hidden" name="latitude" value={latitude} />
            <Input type="hidden" name="longitude" value={longitude} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Upload Trip Image (Optional)
            </label>
            <Input
              type="file"
              name="image"
              accept="image/*"
              className="w-full border h-[50px] border-gray-200 rounded-lg px-4 py-2 text-gray-700 bg-white file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none"
              placeholder="Add any special notes about your trip..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
                isLoading={loading}
              type="submit"
              className="flex-1 bg-gradient-to-r from-travel-primary to-travel-primary-light text-white px-6 py-3 rounded-lg font-semibold hover:from-travel-primary-light hover:to-travel-primary transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Create Trip
            </Button>
            <Button
              type="button"
              onClick={() => setIsCreating(false)}
              className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTripForm
