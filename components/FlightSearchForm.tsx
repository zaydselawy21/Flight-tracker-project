
import React, { useState } from 'react';
import { SearchParams } from '../types';

interface FlightSearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

const FlightSearchForm: React.FC<FlightSearchFormProps> = ({ onSearch, isLoading }) => {
  const [origin, setOrigin] = useState('San Francisco');
  const [destination, setDestination] = useState('Tokyo');
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !departureDate) {
      alert('Please fill in Origin, Destination, and Departure Date.');
      return;
    }
    onSearch({ origin, destination, departureDate, returnDate });
  };
  
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
      <div className="lg:col-span-1">
        <label htmlFor="origin" className="block text-sm font-medium text-slate-300 mb-1">Origin</label>
        <input
          type="text"
          id="origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
          placeholder="e.g., San Francisco"
          required
        />
      </div>
      <div className="lg:col-span-1">
        <label htmlFor="destination" className="block text-sm font-medium text-slate-300 mb-1">Destination</label>
        <input
          type="text"
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
          placeholder="e.g., Tokyo"
          required
        />
      </div>
      <div className="lg:col-span-1">
        <label htmlFor="departureDate" className="block text-sm font-medium text-slate-300 mb-1">Depart</label>
        <input
          type="date"
          id="departureDate"
          value={departureDate}
          min={today}
          onChange={(e) => setDepartureDate(e.target.value)}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
          required
        />
      </div>
      <div className="lg:col-span-1">
        <label htmlFor="returnDate" className="block text-sm font-medium text-slate-300 mb-1">Return</label>
        <input
          type="date"
          id="returnDate"
          value={returnDate}
          min={departureDate || today}
          onChange={(e) => setReturnDate(e.target.value)}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
          placeholder="One-way"
        />
      </div>
      <div className="lg:col-span-1">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex items-center justify-center disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Search'}
        </button>
      </div>
    </form>
  );
};

export default FlightSearchForm;
