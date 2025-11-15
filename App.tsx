import React, { useState, useCallback } from 'react';
import FlightSearchForm from './components/FlightSearchForm';
import FlightResults from './components/FlightResults';
import { Flight, SearchParams, GroundingSource } from './types';
import { fetchFlights } from './services/geminiService';

const App: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSearch = useCallback(async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setFlights([]);
    setSources([]);

    try {
      const { flights: results, sources: searchSources } = await fetchFlights(params);
      setFlights(results);
      setSources(searchSources);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Sorry, we hit turbulence trying to fetch flights. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <header className="bg-slate-800/50 backdrop-blur-sm p-4 sticky top-0 z-10 border-b border-slate-700">
          <div className="container mx-auto px-4">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 12.5c0 .28-.22.5-.5.5h-3.32a3.49 3.49 0 0 0-3.18-2H13V9.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5V11h-1V9.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5V11H8.5A3.5 3.5 0 0 0 5 14.5V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1.5c0-1.54-.99-2.88-2.37-3.34.1-.1.17-.22.17-.36Z"/>
                          <path d="M2 12.5c0-3.31 2.69-6 6-6s6 2.69 6 6H2Z"/>
                      </svg>
                      <h1 className="text-2xl font-bold text-white tracking-tight">
                          Gemini Flight <span className="text-cyan-400">Tracker</span>
                      </h1>
                  </div>
              </div>
          </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <section className="mb-8 p-6 bg-slate-800/60 rounded-xl shadow-2xl shadow-slate-950/50 border border-slate-700">
            <h2 className="text-xl md:text-2xl font-semibold mb-2 text-cyan-300">Find Your Next Adventure</h2>
            <p className="text-slate-400 mb-6">Enter your travel details below to find real-time flight options powered by AI and Google Search.</p>
            <FlightSearchForm onSearch={handleSearch} isLoading={isLoading} />
          </section>
          
          <FlightResults 
            flights={flights}
            sources={sources}
            isLoading={isLoading} 
            error={error} 
            hasSearched={hasSearched} 
          />
        </div>
      </main>
      <footer className="text-center p-4 mt-8 text-slate-500 text-sm">
        <p>Powered by Google Gemini. Flight data grounded in Google Search.</p>
      </footer>
    </div>
  );
};

export default App;