export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
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
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
}

export interface GroundingSource {
  uri: string;
  title: string;
}
