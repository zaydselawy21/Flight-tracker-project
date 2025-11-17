import { GoogleGenAI } from "@google/genai";
import { Flight, SearchParams, GroundingSource } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define a type for the grounding chunk structure
interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  }
}

export const fetchFlights = async (params: SearchParams): Promise<{ flights: Flight[], sources: GroundingSource[] }> => {
  const prompt = `
    You are a hyper-accurate, flight booking assistant API. Your core directive is to provide authentic, real, and bookable flight options. User trust is your top priority.

    Search Criteria:
    - Trip Type: ${params.tripType}
    - Origin: ${params.origin}
    - Destination: ${params.destination}
    - Departure Date: ${params.departureDate}
    - Return Date: ${params.tripType === 'round-trip' && params.returnDate ? params.returnDate : 'N/A'}
    - Passengers: ${params.adults} Adults, ${params.children} Children

    Instructions:
    1.  **Search & Verify:** Use your search tool to find real-time flight information for the specified number of passengers. Every piece of data you return (flight number, times, price, etc.) MUST be verifiable from the search results.
    2.  **Generate Options:** Produce a list of 5 to 7 distinct flight options. The price must reflect the total for all passengers.
    3.  **Data Integrity & Formatting:**
        - Provide accurate flight details: airline, flight number, times, duration, stops, and total price in USD for all passengers.
        - **\`carrierCode\` is mandatory and MUST be the 2-letter IATA airline code (e.g., "UA" for United, "DL" for Delta).**
        - **Crucially, you MUST include the 'departureDate' in 'YYYY-MM-DD' format for each flight record.**
        - **'bookingUrl' MUST be a deep link directly to the booking or checkout page for the exact flight found.** This is the most critical instruction. The user must land on a page where they can see the flight details and begin the booking process.
        - **DO NOT provide generic homepages** (e.g., 'delta.com'). The URL should contain query parameters reflecting the search, like origin, destination, and dates.
        - **Verify the link is active.** Do your best to ensure the URL leads to a working page, not a 404 error.
    4.  **RESPONSE FORMAT:** Your response must be ONLY a valid JSON array of flight objects. Do not add any text, titles, explanations, or markdown formatting like \`\`\`json. Your response should start with '[' and end with ']'.

    Example of a good flight object:
    {
      "id": "UA837-20240910-SFO-NRT",
      "airline": "United Airlines",
      "flightNumber": "UA837",
      "carrierCode": "UA",
      "origin": { "code": "SFO", "city": "San Francisco", "time": "11:05" },
      "destination": { "code": "NRT", "city": "Tokyo", "time": "14:20" },
      "duration": "11h 15m",
      "stops": 0,
      "price": 4350.00,
      "bookingUrl": "https://www.united.com/en/us/fsr/choose-flights?f=SFO&t=NRT&d=2024-09-10&p=3",
      "departureDate": "2024-09-10"
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


    let jsonString = response.text.trim();
    if (!jsonString) {
      console.warn("Gemini API returned an empty string.");
      return { flights: [], sources: [] };
    }
    
    // The model might still return the JSON in a markdown block.
    const jsonMatch = jsonString.match(/```(json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[2]) {
        jsonString = jsonMatch[2];
    }
    
    let flightData: Flight[];
    try {
        flightData = JSON.parse(jsonString);
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