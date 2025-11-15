import React from 'react';
import { Flight, GroundingSource } from '../types';
import FlightCard from './FlightCard';
import LoadingSpinner from './LoadingSpinner';
import { LinkIcon } from './icons/Icons';

interface FlightResultsProps {
  flights: Flight[];
  sources: GroundingSource[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
}

const WelcomeMessage: React.FC = () => (
    <div className="text-center py-16 px-6 bg-slate-800/40 rounded-lg border border-slate-700">
      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-cyan-500 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
      <h3 className="mt-4 text-2xl font-semibold text-white">Ready for Takeoff?</h3>
      <p className="mt-2 text-slate-400">
        Your journey begins here. Use the search form above to find your perfect flight.
      </p>
    </div>
);

const Sources: React.FC<{ sources: GroundingSource[] }> = ({ sources }) => {
  if (sources.length === 0) return null;

  return (
    <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
      <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
        <LinkIcon className="w-4 h-4 text-slate-400" />
        Data Sourced From
      </h4>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
        {sources.map((source, index) => (
          <li key={index} className="truncate">
            <a
              href={source.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
              title={source.title}
            >
              {source.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const FlightResults: React.FC<FlightResultsProps> = ({ flights, sources, isLoading, error, hasSearched }) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-10 px-4 bg-red-900/20 border border-red-700/50 rounded-lg">
        <p className="text-red-300">{error}</p>
      </div>
    );
  }
  
  if (!hasSearched) {
      return <WelcomeMessage />;
  }

  if (flights.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-slate-800/40 rounded-lg border border-slate-700">
        <p className="text-slate-400">No flights found for your search criteria. Try adjusting your dates or destinations.</p>
        <Sources sources={sources} />
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))}
      </div>
      <Sources sources={sources} />
    </div>
  );
};

export default FlightResults;