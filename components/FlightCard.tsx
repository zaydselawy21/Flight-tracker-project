import React from 'react';
import { Flight } from '../types';
import { PlaneIcon, ClockIcon } from './icons/Icons';

interface FlightCardProps {
  flight: Flight;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-cyan-500/10 hover:border-cyan-700">
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Airline Info */}
        <div className="md:col-span-3 flex items-center gap-4">
          <div className="bg-slate-700 p-2 rounded-full">
             <PlaneIcon className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <p className="font-semibold text-lg text-white">{flight.airline}</p>
            <p className="text-sm text-slate-400">{flight.flightNumber}</p>
          </div>
        </div>

        {/* Flight Times */}
        <div className="md:col-span-5 flex items-center justify-between md:justify-center gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-white">{flight.origin.time}</p>
            <p className="text-sm text-slate-300">{flight.origin.code}</p>
          </div>
          <div className="flex-grow flex items-center text-slate-500">
              <span className="w-2 h-2 bg-slate-600 rounded-full"></span>
              <div className="flex-grow border-b border-dashed border-slate-600 mx-2"></div>
              <ClockIcon className="w-4 h-4" />
              <div className="flex-grow border-b border-dashed border-slate-600 mx-2"></div>
              <span className="w-2 h-2 bg-slate-600 rounded-full"></span>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{flight.destination.time}</p>
            <p className="text-sm text-slate-300">{flight.destination.code}</p>
          </div>
        </div>
        
        {/* Duration & Stops */}
        <div className="md:col-span-2 text-center md:text-left">
            <p className="font-medium text-slate-200">{flight.duration}</p>
            <p className="text-sm text-cyan-400">{flight.stops === 0 ? 'Direct' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}</p>
        </div>

        {/* Price & CTA */}
        <div className="md:col-span-2 text-center md:text-right">
          <p className="text-2xl font-extrabold text-white">${flight.price.toLocaleString()}</p>
           <a
              href={flight.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block w-full md:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-300 text-center"
              aria-label={`Select flight with ${flight.airline} for $${flight.price}`}
            >
            Select Flight
          </a>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;