export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  carrierCode: string;
  origin: {
    code: string;
    city: string;
    time: string;
  };
  destination: {
    code: string;
    city: string;
    time: string;
  };
  duration: string;
  stops: number;
  price: number;
  bookingUrl: string;
  departureDate: string;
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  tripType: 'one-way' | 'round-trip';
  adults: number;
  children: number;
}

export interface GroundingSource {
  uri: string;
  title: string;
}