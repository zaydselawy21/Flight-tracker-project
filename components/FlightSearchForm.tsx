import React, { useState } from 'react';
import { SearchParams } from '../types';
import { TranslationKey } from '../locales';

interface FlightSearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
  t: (key: TranslationKey) => string;
}

const FlightSearchForm: React.FC<FlightSearchFormProps> = ({ onSearch, isLoading, t }) => {
  const [origin, setOrigin] = useState('San Francisco');
  const [destination, setDestination] = useState('Tokyo');
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState('');
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !departureDate) {
      alert('Please fill in Origin, Destination, and Departure Date.');
      return;
    }
    const finalReturnDate = tripType === 'one-way' ? '' : returnDate;
    onSearch({ origin, destination, departureDate, returnDate: finalReturnDate, tripType, adults, children });
  };
  
  const today = new Date().toISOString().split('T')[0];

  const handleDepartureDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDepartureDate = e.target.value;
    setDepartureDate(newDepartureDate);
    if (returnDate && newDepartureDate > returnDate) {
        setReturnDate(''); // Clear return date if it's before the new departure date
    }
  };

  const handleTripTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTripType = e.target.value as 'one-way' | 'round-trip';
    setTripType(newTripType);
    if (newTripType === 'one-way') {
      setReturnDate('');
    }
  };

  const commonInputClasses = "w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Trip Type */}
      <div className="flex items-center gap-x-6 gap-y-2 flex-wrap">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="tripType" value="one-way" checked={tripType === 'one-way'} onChange={handleTripTypeChange} className="form-radio bg-slate-700 border-slate-500 text-cyan-500 focus:ring-cyan-500"/>
          <span className="text-sm font-medium text-slate-300">{t('oneWay')}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="tripType" value="round-trip" checked={tripType === 'round-trip'} onChange={handleTripTypeChange} className="form-radio bg-slate-700 border-slate-500 text-cyan-500 focus:ring-cyan-500"/>
          <span className="text-sm font-medium text-slate-300">{t('roundTrip')}</span>
        </label>
      </div>

      {/* Main fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="origin" className="block text-sm font-medium text-slate-300 mb-1">{t('origin')}</label>
          <input type="text" id="origin" value={origin} onChange={(e) => setOrigin(e.target.value)} className={commonInputClasses} placeholder={t('originPlaceholder')} required/>
        </div>
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-slate-300 mb-1">{t('destination')}</label>
          <input type="text" id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} className={commonInputClasses} placeholder={t('destinationPlaceholder')} required/>
        </div>
        <div>
          <label htmlFor="departureDate" className="block text-sm font-medium text-slate-300 mb-1">{t('depart')}</label>
          <input type="date" id="departureDate" value={departureDate} min={today} onChange={handleDepartureDateChange} className={commonInputClasses} required/>
        </div>
        <div>
          <label htmlFor="returnDate" className="block text-sm font-medium text-slate-300 mb-1">{t('return')}</label>
          <input type="date" id="returnDate" value={returnDate} min={departureDate || today} disabled={!departureDate || tripType === 'one-way'} onChange={(e) => setReturnDate(e.target.value)} className={`${commonInputClasses} disabled:opacity-50`} required={tripType === 'round-trip'}/>
        </div>
      </div>
      
      {/* Passengers & Submit */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label htmlFor="adults" className="block text-sm font-medium text-slate-300 mb-1">{t('adults')}</label>
          <input type="number" id="adults" value={adults} onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value, 10) || 1))} min="1" className={commonInputClasses} />
        </div>
        <div>
          <label htmlFor="children" className="block text-sm font-medium text-slate-300 mb-1">{t('children')}</label>
          <input type="number" id="children" value={children} onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value, 10) || 0))} min="0" className={commonInputClasses} />
        </div>
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
          ) : t('search')}
        </button>
      </div>
    </form>
  );
};

export default FlightSearchForm;