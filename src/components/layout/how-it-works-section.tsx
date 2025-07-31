export default function HowItWorks(){
    return  <section id="how-it-works" className="py-32 lg:pt-32 lg:mt-12 mt-52 pb-0 bg-white">
        <div className="max-w-[1408px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-travel-neutral-glass mb-4">How Travel Trek Works</h2>
            <p className="text-xl text-travel-neutral2-glass">Simple steps to create your perfect itinerary</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-travel-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-travel-neutral-glass mb-4">Choose Your Destination</h3>
              <p className="text-travel-neutral2-glass">Search and select from thousands of destinations worldwide with detailed information and photos.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-travel-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-travel-neutral-glass mb-4">Plan Day-by-Day</h3>
              <p className="text-travel-neutral2-glass">Create detailed itineraries with our drag-and-drop interface and interactive mapping tools.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-travel-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-travel-neutral-glass mb-4">Share & Travel</h3>
              <p className="text-travel-neutral2-glass">Share your itinerary with travel companions and capture memories with our photo integration.</p>
            </div>
          </div>
        </div>
      </section>
}