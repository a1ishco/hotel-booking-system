import { popularDestinations } from "../data/constants";
import type { Destination } from "../types";


export default function PopularDestinations() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
        Popular destinations
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {popularDestinations.map((destination: Destination) => (
          <div
            key={destination.id}
            className="relative h-64 rounded-xl overflow-hidden cursor-pointer group"
          >
            <img
              src={destination.image}
              alt={destination.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <h3 className="text-xl font-semibold text-white">
                {destination.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
