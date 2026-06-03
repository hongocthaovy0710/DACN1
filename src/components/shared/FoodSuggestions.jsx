import { useMemo } from "react";
import { Coffee, ExternalLink, MapPin, Star } from "lucide-react";
import { getTripDestination } from "@/utils/tripHelpers";

const FOOD_BY_CITY = {
  "da nang": [
    {
      id: "breakfast",
      meal: "Breakfast",
      name: "Mì Quảng Bà Mua",
      cuisine: "Mì Quảng",
      area: "Hải Châu",
      dish: "Mì quảng gà hoặc mì quảng tôm thịt",
      rating: 4.4,
      note: "Good local breakfast before starting the city itinerary.",
    },
    {
      id: "lunch",
      meal: "Lunch",
      name: "Bánh Tráng Cuốn Thịt Heo Trần",
      cuisine: "Central Vietnamese",
      area: "Lê Duẩn / Hải Châu",
      dish: "Pork rice paper rolls",
      rating: 4.3,
      note: "A practical lunch option for first-time visitors in Da Nang.",
    },
    {
      id: "dinner",
      meal: "Dinner",
      name: "Hải Sản Bé Mặn",
      cuisine: "Seafood",
      area: "Võ Nguyên Giáp",
      dish: "Grilled seafood and hotpot",
      rating: 4.2,
      note: "Best for dinner after beach or Han River activities.",
    },
    {
      id: "coffee-1",
      meal: "Coffee",
      name: "Cộng Cà Phê Bạch Đằng",
      cuisine: "Coffee",
      area: "Bạch Đằng riverside",
      dish: "Coconut coffee",
      rating: 4.3,
      note: "Good drink stop near Han River.",
    },
    {
      id: "dessert-1",
      meal: "Dessert",
      name: "Chè Xuân Trang",
      cuisine: "Dessert",
      area: "Hải Châu",
      dish: "Vietnamese sweet soup",
      rating: 4.2,
      note: "Easy local dessert option after dinner.",
    },
    {
      id: "snack-1",
      meal: "Snack",
      name: "Bánh Xèo Bà Dưỡng",
      cuisine: "Street food",
      area: "Hải Châu",
      dish: "Bánh xèo and nem lụi",
      rating: 4.3,
      note: "Good for a casual late afternoon meal.",
    },
  ],
  seoul: [
    {
      id: "breakfast",
      meal: "Breakfast",
      name: "Isaac Toast Myeongdong",
      cuisine: "Korean toast",
      area: "Myeongdong",
      dish: "Ham cheese toast",
      rating: 4.4,
      note: "Quick breakfast before shopping or palace visits.",
    },
    {
      id: "lunch",
      meal: "Lunch",
      name: "Myeongdong Kyoja",
      cuisine: "Korean noodles",
      area: "Myeongdong",
      dish: "Kalguksu and mandu",
      rating: 4.5,
      note: "Reliable lunch spot with iconic Seoul comfort food.",
    },
    {
      id: "dinner",
      meal: "Dinner",
      name: "Maple Tree House Itaewon",
      cuisine: "Korean BBQ",
      area: "Itaewon",
      dish: "Korean BBQ set",
      rating: 4.4,
      note: "Good dinner choice for groups or couples.",
    },
    {
      id: "coffee-1",
      meal: "Coffee",
      name: "Cafe Onion Anguk",
      cuisine: "Cafe",
      area: "Anguk",
      dish: "Pastry and coffee",
      rating: 4.4,
      note: "Nice break near Bukchon and palace areas.",
    },
    {
      id: "dessert-1",
      meal: "Dessert",
      name: "Sulbing Myeongdong",
      cuisine: "Dessert",
      area: "Myeongdong",
      dish: "Bingsu",
      rating: 4.2,
      note: "Easy dessert stop after shopping.",
    },
    {
      id: "snack-1",
      meal: "Snack",
      name: "Gwangjang Market",
      cuisine: "Market food",
      area: "Jongno",
      dish: "Bindaetteok and kimbap",
      rating: 4.4,
      note: "Best when you want many food stalls in one place.",
    },
  ],
  tokyo: [
    {
      id: "breakfast",
      meal: "Breakfast",
      name: "Tsukiji Outer Market",
      cuisine: "Japanese seafood",
      area: "Tsukiji",
      dish: "Sushi breakfast or tamagoyaki",
      rating: 4.5,
      note: "Best if the morning plan is near Ginza or Tokyo Station.",
    },
    {
      id: "lunch",
      meal: "Lunch",
      name: "Ichiran Shibuya",
      cuisine: "Ramen",
      area: "Shibuya",
      dish: "Tonkotsu ramen",
      rating: 4.3,
      note: "Easy solo-friendly lunch with predictable quality.",
    },
    {
      id: "dinner",
      meal: "Dinner",
      name: "Torikizoku Shinjuku",
      cuisine: "Yakitori",
      area: "Shinjuku",
      dish: "Yakitori skewers",
      rating: 4.1,
      note: "Casual dinner after a full sightseeing day.",
    },
    {
      id: "coffee-1",
      meal: "Coffee",
      name: "Blue Bottle Coffee Shibuya",
      cuisine: "Cafe",
      area: "Shibuya",
      dish: "Pour-over coffee",
      rating: 4.3,
      note: "Good break around Shibuya.",
    },
    {
      id: "dessert-1",
      meal: "Dessert",
      name: "A Happy Pancake Omotesando",
      cuisine: "Dessert",
      area: "Omotesando",
      dish: "Souffle pancakes",
      rating: 4.4,
      note: "Sweet stop for a slower afternoon.",
    },
    {
      id: "snack-1",
      meal: "Snack",
      name: "Ameya-Yokocho Market",
      cuisine: "Street food",
      area: "Ueno",
      dish: "Street snacks",
      rating: 4.2,
      note: "Good casual snack area with many choices.",
    },
  ],
};

const getCityFood = (destination) => {
  const city = String(destination || "").toLowerCase();
  const key = Object.keys(FOOD_BY_CITY).find((name) => city.includes(name));

  return key ? FOOD_BY_CITY[key] : null;
};

const buildFoodSuggestions = (destination, budget) => {
  const city = destination || "your destination";
  const budgetText = String(budget || "").toLowerCase();
  const priceLevel = budgetText.includes("luxury")
    ? "$$$"
    : budgetText.includes("budget")
      ? "$"
      : "$$";
  const cityFoods = getCityFood(destination);

  const suggestions = cityFoods || [
    {
      id: "breakfast",
      meal: "Breakfast",
      name: `Best rated local breakfast in ${city}`,
      cuisine: "Local breakfast",
      area: "Near your first activity",
      dish: "Signature local breakfast",
      rating: 4.3,
      note: "Use the map link to choose the nearest high-rated option.",
    },
    {
      id: "lunch",
      meal: "Lunch",
      name: `Popular lunch restaurant in ${city}`,
      cuisine: "Casual dining",
      area: "Central area",
      dish: "Local lunch set",
      rating: 4.2,
      note: "Useful around midday when you want something close and quick.",
    },
    {
      id: "dinner",
      meal: "Dinner",
      name: `Recommended dinner spot in ${city}`,
      cuisine: "Dinner restaurant",
      area: "Nightlife or riverside area",
      dish: "Popular dinner menu",
      rating: 4.3,
      note: "Best saved for the end of the day after sightseeing.",
    },
  ];

  return suggestions.map((item) => ({
    ...item,
    priceLevel,
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(`${item.name} ${item.area || ""} ${city}`),
  }));
};

const FoodSuggestions = ({ trip }) => {
  const destination = getTripDestination(trip);
  const suggestions = useMemo(
    () => buildFoodSuggestions(destination, trip?.userSelection?.budget),
    [destination, trip?.userSelection?.budget],
  );

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h4 className="text-gray-900 flex items-center gap-2">
          <Coffee className="h-4 w-4 text-orange-600" />
          Food Suggestions
        </h4>
        <span className="text-xs text-gray-500">{suggestions.length} places</span>
      </div>

      <div className="max-h-[34rem] space-y-3 overflow-y-auto pr-1">
        {suggestions.map((item) => (
          <div key={item.id} className="rounded-xl border border-gray-100 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wide text-orange-600">
                  {item.meal}
                </span>
                <h5 className="mt-1">{item.name}</h5>
              </div>
              <span className="rounded-full bg-gray-50 px-2 py-1 text-xs font-bold text-gray-700">
                {item.priceLevel}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {item.area || item.cuisine}
              </span>
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {item.rating}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-700">
              <b>Try:</b> {item.dish}
            </p>
            <p className="mt-2 text-sm">{item.note}</p>
            <a
              href={item.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              <ExternalLink className="h-4 w-4" />
              Open map
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FoodSuggestions;
