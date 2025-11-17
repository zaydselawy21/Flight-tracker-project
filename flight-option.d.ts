import { Flight } from './types';

/**
 * Defines the structure for a flight option that can be booked.
 * This is an illustrative type and is not directly used in the application's runtime logic,
 * but helps in defining the shape of flight-related data.
 */
export interface BookableFlight extends Flight {
  isBookable: true;
}

/**
 * Defines the signature for a function that handles the booking process for a flight.
 * Typically, this involves redirecting the user to a booking URL.
 */
export type BookFunction = (flight: Flight) => void;
