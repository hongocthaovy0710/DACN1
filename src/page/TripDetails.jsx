import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Calendar } from "lucide-react";
import Itinerary from "@/components/shared/Itinerary";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import HotelCard from "@/components/shared/HotelCard";
import Autoplay from "embla-carousel-autoplay";
import TripStats from "@/components/shared/TripStats";
import { getPlacePhoto } from "@/services/placePhotoApi";

const TripDetails = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("/private.png");
  const navigate = useNavigate();

  const getDestinationImage = (destination) => {
    const city = destination?.toLowerCase() || "";

    if (city.includes("paris")) {
      return "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1920&q=80";
    }

    if (city.includes("ho chi minh") || city.includes("saigon")) {
      return "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1920&q=80";
    }

    if (city.includes("tokyo")) {
      return "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1920&q=80";
    }

    if (city.includes("seoul")) {
      return "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1920&q=80";
    }

    if (city.includes("london")) {
      return "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1920&q=80";
    }

    if (city.includes("new york")) {
      return "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1920&q=80";
    }

    if (city.includes("bangkok")) {
      return "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1920&q=80";
    }

    if (city.includes("singapore")) {
      return "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1920&q=80";
    }

    if (city.includes("da nang") || city.includes("danang")) {
      return "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1920&q=80";
    }

    return "/private.png";
  };

  useEffect(() => {
    if (!tripId) return;

    const docRef = doc(db, "trips-ai", tripId);

    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setTrip(docSnap.data());
        } else {
          console.log("No such document!");
          navigate("/create-trip");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }, [tripId, navigate]);

  const destination =
    trip?.userSelection?.destination?.label ||
    trip?.userSelection?.destination?.value?.terms?.[0]?.value ||
    trip?.userSelection?.destination?.formatted ||
    trip?.userSelection?.destination?.properties?.formatted ||
    trip?.userSelection?.destination ||
    trip?.tripData?.travelPlan?.location ||
    "";

  useEffect(() => {
    if (!destination) return;

    const fetchPhoto = async () => {
      const url = await getPlacePhoto(destination);
      console.log("Photo URL:", url);

      if (url && url !== "/private.png") {
        setPhotoUrl(url);
      } else {
        setPhotoUrl(getDestinationImage(destination));
      }
    };

    fetchPhoto();
  }, [destination]);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading trip...</p>
      </div>
    );
  }

  const hotels = trip?.tripData?.travelPlan?.hotelsOptions || [];

  return (
    <div>
      <div className="min-h-screen bg-background">
        <div className="relative h-[22rem] md:h-[28rem] bg-gray-900">
          <img
            src={photoUrl}
            alt={destination || "Trip destination"}
            className="w-full h-full object-cover opacity-60"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = getDestinationImage(destination);
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 text-white px-8 pb-10">
            <button
              onClick={() => navigate("/create-trip")}
              className="flex items-center gap-2 mb-4 text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
            >
              <FaArrowLeftLong />
              Plan Another Trip
            </button>

            <h1 className="mb-2 text-4xl font-bold">
              {destination || "Trip Details"}
            </h1>

            <p className="max-w-2xl mb-10 text-gray-300">
              {trip?.tripData?.travelPlan?.tripNote?.split(".")[0]}
            </p>
          </div>
        </div>

        <div className="max-padd-container py-12">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column -> Itineraries */}
            <div className="lg:col-span-2 space-y-6">
              <div className="sm:bg-white rounded-2xl sm:shadow-sm sm:border border-gray-100 sm:p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                  Your Daily Plan
                </h2>

                <Itinerary trip={trip} />
              </div>
            </div>

            {/* Right Column -> Hotels & Trip Summary */}
            <div className="space-y-6">
              <Carousel
                plugins={[
                  Autoplay({
                    delay: 3000,
                  }),
                ]}
              >
                <CarouselContent>
                  {hotels.map((hotel, index) => (
                    <CarouselItem key={index}>
                      <HotelCard hotel={hotel} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              <TripStats trip={trip} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
