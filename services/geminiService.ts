import { GoogleGenAI } from "@google/genai";
import { Flight, SearchParams, GroundingSource } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Define a type for the grounding chunk structure
interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  }
}

export const fetchFlights = async (params: SearchParams): Promise<{ flights: Flight[], sources: GroundingSource[] }> => {
  const prompt = `
    You are a flight search API. Your task is to find and return real, bookable flight options based on the following criteria using your search capabilities.
    - Origin: ${params.origin}
    - Destination: ${params.destination}
    - Departure Date: ${params.departureDate}
    - Return Date: ${params.returnDate ? params.returnDate : 'One-way trip'}

    Instructions:
    1.  Use your search tool to find real flight information for the specified route and dates.
    2.  Generate a list of 5 to 7 flight options.
    3.  For each flight, provide the airline, flight number, departure/arrival airports and times, total duration, number of stops, and an estimated price in USD.
    4.  CRITICAL: For each flight, you MUST also provide a 'bookingUrl'. This must be a real, working URL found directly in your search results that corresponds to the specific flight. Do not invent, guess, or fabricate a URL from a template. The link must lead the user to a page where they can see and book the exact flight you have listed. Prioritize the airline's official website, but a direct link to the itinerary on a major booking site like Google Flights is also acceptable if a direct airline link is not found.
    5.  Ensure the origin and destination cities and codes match the user's request.
    6.  VERY IMPORTANT: Respond ONLY with a valid JSON array of flight objects. Do not include markdown formatting, any introductory text, titles, or explanations. The entire response must be the JSON data itself.
    
    The JSON objects in the array must have the following structure:
    {
      "id": "a-unique-identifier",
      "airline": "Airline Name",
      "flightNumber": "FL123",
      "origin": { "code": "SFO", "city": "San Francisco", "time": "08:30" },
      "destination": { "code": "NRT", "city": "Tokyo", "time": "11:45" },
      "duration": "11h 15m",
      "stops": 0,
      "price": 1234.56,
      "bookingUrl": "https://www.google.com/flights#flt=SFO.NRT.2024-10-26..."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    // Extract grounding sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;
    const sources: GroundingSource[] = groundingChunks
      ?.map(chunk => chunk.web)
      .filter((web): web is GroundingSource => !!web?.uri && !!web?.title) ?? [];


    const jsonString = response.text.trim();
    if (!jsonString) {
      console.warn("Gemini API returned an empty string.");
      return { flights: [], sources: [] };
    }
    
    // Attempt to parse the response as JSON. This is less reliable without a schema, so we need robust error handling.
    let flightData: Flight[];
    try {
        // Sometimes the model might wrap the JSON in markdown backticks
        const cleanedJsonString = jsonString.replace(/^```json\n/, '').replace(/\n```$/, '');
        flightData = JSON.parse(cleanedJsonString);
    } catch (parseError) {
        console.error("Failed to parse JSON response from Gemini API:", parseError);
        console.error("Raw response text:", jsonString);
        throw new Error("The flight data returned was in an unexpected format. Please try your search again.");
    }
    
    return { flights: flightData as Flight[], sources };

  } catch (error) {
    console.error("Error fetching flights from Gemini API:", error);
    if (error instanceof Error && error.message.includes("unexpected format")) {
        throw error;
    }
    throw new Error("Failed to fetch real-time flight data. The AI may be experiencing heavy traffic.");
  }
};