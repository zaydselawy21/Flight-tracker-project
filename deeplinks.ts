import { Flight, SearchParams } from './types';

const enc = (s: string) => encodeURIComponent(s);

/**
 * Creates a deep link for Flyadeal flight searches.
 * This link pre-fills the search form with the correct flight details.
 * @param flight The flight details.
 * @param params The search parameters including passenger counts.
 * @returns A URL string or null if required data is missing.
 */
function createFlyadealUrl(flight: Flight, params: SearchParams): string | null {
    if (!flight.origin.code || !flight.destination.code || !flight.departureDate) {
        return null;
    }
    
    const urlParams = new URLSearchParams({
        o1: flight.origin.code.toUpperCase(),
        d1: flight.destination.code.toUpperCase(),
        dd1: flight.departureDate,
        adt: params.adults.toString(),
        chd: params.children.toString(),
        inf: '0',
        cc: '',
    });

    if (params.tripType === 'round-trip' && params.returnDate) {
      urlParams.set('dd2', params.returnDate);
    }

    const baseUrl = 'https://www.flyadeal.com/en/select-flight';
    return `${baseUrl}?${urlParams.toString()}`;
}


/**
 * Generates a generic Google Flights search URL.
 * This is the last-resort fallback.
 */
function getGenericGoogleFlightsUrl(params: { originIata: string; destinationIata: string; departDateISO: string; }) {
  const q = `Flights from ${params.originIata} to ${params.destinationIata} on ${params.departDateISO}`;
  return `https://www.google.com/travel/flights?q=${enc(q)}`;
}

/**
 * Generates a specific Google Flights URL that attempts to pre-select the given flight.
 * This is the preferred fallback if the AI-provided URL fails.
 */
function getSpecificGoogleFlightsUrl(flight: Flight): string | null {
  if (!flight.origin.code || !flight.destination.code || !flight.departureDate) {
    return null;
  }
  
  const path = `${flight.origin.code}/${flight.destination.code}/d/${flight.departureDate}`;
  const queryParams = new URLSearchParams();
  queryParams.set('hl', 'en');

  // The `flt` parameter is key for filtering results.
  // Format: flt=CARRIER_CODE.FLIGHT_NUMBER
  if (flight.carrierCode && flight.flightNumber) {
    // Note: Google Flights often combines flight numbers if there are connections.
    // This will work best for direct flights. For multi-leg journeys, it might just filter by the first leg.
    // This is still a massive improvement.
    queryParams.set('flt', `${flight.carrierCode.toUpperCase()}.${flight.flightNumber}`);
  }
  
  return `https://www.google.com/travel/flights/${path}?${queryParams.toString()}`;
}

/**
 * Opens the most relevant booking page for a given flight.
 * This is the "book function" that redirects the user to a booking site.
 * It follows a priority list:
 * 1. Custom-built URL for specific airlines (e.g., Flyadeal).
 * 2. The `bookingUrl` provided by the AI.
 * 3. A self-constructed, specific Google Flights URL.
 * 4. A generic Google Flights search as a final fallback.
 */
export function handleFlightBooking(flight: Flight, params: SearchParams): void {
  // 1. Custom URL generation for specific airlines.
  // This can be expanded for other airlines with predictable URL structures.
  if (flight.airline.toLowerCase().includes('flyadeal') || (flight.carrierCode && flight.carrierCode.toUpperCase() === 'F3')) {
      const flyadealUrl = createFlyadealUrl(flight, params);
      if (flyadealUrl) {
          const openedWindow = window.open(flyadealUrl, "_blank", "noopener,noreferrer");
          if (openedWindow && !openedWindow.closed) {
              return; // Success
          }
      }
  }

  // 2. Try the AI-provided URL first.
  if (flight.bookingUrl && (flight.bookingUrl.startsWith('http://') || flight.bookingUrl.startsWith('https://'))) {
    const openedWindow = window.open(flight.bookingUrl, "_blank", "noopener,noreferrer");
    // If popup wasn't blocked, we're done.
    if (openedWindow && !openedWindow.closed) {
      return;
    }
  }
  
  // 3. Try our specific, constructed Google Flights URL.
  const specificUrl = getSpecificGoogleFlightsUrl(flight);
  if (specificUrl) {
      const openedWindow = window.open(specificUrl, "_blank", "noopener,noreferrer");
      if (openedWindow && !openedWindow.closed) {
        return;
      }
  }

  // 4. Last resort: a generic search.
  const genericUrl = getGenericGoogleFlightsUrl({
      originIata: flight.origin.code,
      destinationIata: flight.destination.code,
      departDateISO: flight.departureDate
  });
  window.open(genericUrl, "_blank", "noopener,noreferrer");
}