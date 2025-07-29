export default function HowItWorks(){
    return  <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Travel Trek Works</h2>
            <p className="text-xl text-gray-600">Simple steps to create your perfect itinerary</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-travel-primary to-travel-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Choose Your Destination</h3>
              <p className="text-gray-600">Search and select from thousands of destinations worldwide with detailed information and photos.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-travel-primary to-travel-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Plan Day-by-Day</h3>
              <p className="text-gray-600">Create detailed itineraries with our drag-and-drop interface and interactive mapping tools.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-travel-primary to-travel-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Share & Travel</h3>
              <p className="text-gray-600">Share your itinerary with travel companions and capture memories with our photo integration.</p>
            </div>
          </div>
        </div>
      </section>
}