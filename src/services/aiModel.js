import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
const chat = ai.chats.create({
  model: "gemini-2.5-flash",
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate a travel plan for Location: New York for 2 days for a couple traveler on economy budget. Return the result strictly as a single JSON object using camelCase keys, the travel plan with trip note and must feature hotelsOptions array, each hotel with hotelName, hotelAddress, priceRange, imageUrl, rating, description, and a coordinates, alongside an itinerary array of daily plans. Each day must include a dayNumber, theme, and an activities array, where each activity contains activityName, description, imageUrl, ticketPrice, timeRange, timeToTravel and coordinates",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: JSON.stringify({
            travelPlan: {
              location: "New York City",
              duration: "2 Days",
              budget: "Economy",
              travelerType: "Couple",
              tripNote:
                "New York is best explored on foot and via the subway ($2.90 per ride). For an economy budget, skip the expensive observation decks like the Empire State Building and instead take the free Staten Island Ferry for views of the Statue of Liberty. Focus on free landmarks and iconic public spaces like Central Park and the High Line. Dining in neighborhoods like Chinatown or getting 'street meat' from Halal carts provides an authentic NYC experience for under $10 per person.",
              hotelsOptions: [
                {
                  hotelName: "Pod 39 Hotel",
                  hotelAddress: "145 East 39th Street, New York, NY 10016",
                  priceRange: "$180 - $250",
                  imageUrl:
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
                  rating: 8.5,
                  description:
                    "A clever, budget-friendly boutique hotel in Midtown. Rooms are compact ('pods') but efficiently designed for couples. Features a great rooftop bar with Empire State Building views.",
                  coordinates: {
                    latitude: 40.74941,
                    longitude: -73.97657,
                  },
                },
                {
                  hotelName: "LIC Hotel",
                  hotelAddress: "44-04 21st St, Long Island City, NY 11101",
                  priceRange: "$150 - $210",
                  imageUrl:
                    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
                  rating: 8.6,
                  description:
                    "Located just one subway stop from Manhattan in Queens, this hotel offers significantly larger rooms for the price. Includes a free breakfast buffet and a terrace with skyline views.",
                  coordinates: {
                    latitude: 40.7516,
                    longitude: -73.9455,
                  },
                },
                {
                  hotelName: "Pod 51 Hotel",
                  hotelAddress: "230 East 51st Street, New York, NY 10022",
                  priceRange: "$160 - $230",
                  imageUrl:
                    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
                  rating: 8.2,
                  description:
                    "One of NYC's original budget-chic hotels. It features a colorful courtyard and a rooftop deck. Ideal for couples who want a central Manhattan location without the high price tag.",
                  coordinates: {
                    latitude: 40.75572,
                    longitude: -73.9691,
                  },
                },
              ],
              itinerary: [
                {
                  dayNumber: 1,
                  theme: "Midtown Landmarks & Central Park Romance",
                  activities: [
                    {
                      activityName: "Grand Central Terminal",
                      description:
                        "Admire the celestial ceiling and the iconic four-faced clock in the Main Concourse of this Beaux-Arts landmark.",
                      imageUrl:
                        "https://images.unsplash.com/photo-1543716627-839b54c40519?auto=format&fit=crop&q=80&w=800",
                      ticketPrice: "$0",
                      timeRange: "09:00 AM - 10:00 AM",
                      timeToTravel: "Arrival",
                      coordinates: {
                        latitude: 40.7527,
                        longitude: -73.9772,
                      },
                    },
                    {
                      activityName: "New York Public Library & Bryant Park",
                      description:
                        "Visit the majestic Rose Main Reading Room and then relax with a coffee in the adjacent Bryant Park, a favorite local oasis.",
                      imageUrl:
                        "https://images.unsplash.com/photo-1580130601254-05fa235abeab?auto=format&fit=crop&q=80&w=800",
                      ticketPrice: "$0",
                      timeRange: "10:30 AM - 12:00 PM",
                      timeToTravel: "10 min walk",
                      coordinates: {
                        latitude: 40.7532,
                        longitude: -73.9822,
                      },
                    },
                    {
                      activityName: "Central Park & Bethesda Terrace",
                      description:
                        "Stroll through the world's most famous park. Highlights include the Bethesda Fountain, Strawberry Fields, and a romantic walk along The Mall.",
                      imageUrl:
                        "https://images.unsplash.com/photo-1534430480872-3498386e7a56?auto=format&fit=crop&q=80&w=800",
                      ticketPrice: "$0",
                      timeRange: "01:30 PM - 04:30 PM",
                      timeToTravel: "15 min subway",
                      coordinates: {
                        latitude: 40.7741,
                        longitude: -73.9711,
                      },
                    },
                    {
                      activityName: "Times Square at Night",
                      description:
                        "Experience the overwhelming neon lights and energy of the 'Center of the Universe'. Perfect for evening photos and people watching.",
                      imageUrl:
                        "https://images.unsplash.com/photo-1534430480872-3498386e7a56?auto=format&fit=crop&q=80&w=800",
                      ticketPrice: "$0",
                      timeRange: "08:00 PM - 09:30 PM",
                      timeToTravel: "20 min walk/subway",
                      coordinates: {
                        latitude: 40.758,
                        longitude: -73.9855,
                      },
                    },
                  ],
                },
                {
                  dayNumber: 2,
                  theme: "Lower Manhattan History & Brooklyn Views",
                  activities: [
                    {
                      activityName: "Staten Island Ferry (Statue Views)",
                      description:
                        "Take the free commuter ferry to see the Statue of Liberty and the Manhattan skyline from the water without paying for a tour boat.",
                      imageUrl:
                        "https://images.unsplash.com/photo-1531233075422-965383506161?auto=format&fit=crop&q=80&w=800",
                      ticketPrice: "$0",
                      timeRange: "09:30 AM - 11:00 AM",
                      timeToTravel: "20 min subway",
                      coordinates: {
                        latitude: 40.7014,
                        longitude: -74.0131,
                      },
                    },
                    {
                      activityName: "9/11 Memorial Pools",
                      description:
                        "A somber and beautiful tribute located at the site of the former World Trade Center. The outdoor reflecting pools are free to visit.",
                      imageUrl:
                        "https://images.unsplash.com/photo-1563823251941-b9989d1e219a?auto=format&fit=crop&q=80&w=800",
                      ticketPrice: "$0",
                      timeRange: "11:30 AM - 01:00 PM",
                      timeToTravel: "10 min walk",
                      coordinates: {
                        latitude: 40.7111,
                        longitude: -74.0131,
                      },
                    },
                    {
                      activityName: "Wall Street & Charging Bull",
                      description:
                        "Explore the historic Financial District, see the New York Stock Exchange, and snap a photo with the famous Charging Bull statue.",
                      imageUrl:
                        "https://images.unsplash.com/photo-1550305080-4e029753bbad?auto=format&fit=crop&q=80&w=800",
                      ticketPrice: "$0",
                      timeRange: "02:30 PM - 03:30 PM",
                      timeToTravel: "10 min walk",
                      coordinates: {
                        latitude: 40.7055,
                        longitude: -74.0134,
                      },
                    },
                    {
                      activityName: "Brooklyn Bridge Walk & DUMBO",
                      description:
                        "Walk across the wooden planks of the Brooklyn Bridge at sunset for stunning views, ending in DUMBO for a pizza at a local shop.",
                      imageUrl:
                        "https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?auto=format&fit=crop&q=80&w=800",
                      ticketPrice: "$0",
                      timeRange: "05:00 PM - 07:30 PM",
                      timeToTravel: "15 min walk",
                      coordinates: {
                        latitude: 40.7061,
                        longitude: -73.9969,
                      },
                    },
                  ],
                },
              ],
            },
          }),
        },
      ],
    },
  ],
});

// Main function to generate the trip
export async function generateTripWithAI(DYNAMIC_PROMPT) {
  try {
    const response = await chat.sendMessage({
      message: DYNAMIC_PROMPT,
    });

    const textResponse = response.text;

    const cleanJson = textResponse.replace(/```json|```/g, "").trim();

    const parsedJson = JSON.parse(cleanJson);

    return parsedJson;
  } catch (error) {
    console.error("Error generating trip.", error);
    throw error;
  }
}
