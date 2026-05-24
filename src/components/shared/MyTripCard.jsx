import { getPlacePhoto } from "@/services/placePhotoApi";
import { Banknote, Clock, Users, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DEFAULT_TRIP_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80";

const MyTripCard = ({ trip }) => {
  const [placePhoto, setPlacePhoto] = useState(DEFAULT_TRIP_IMAGE);

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

    const loadPhoto = async () => {
      const photoUrl = await getPlacePhoto(destination);
      console.log("MyTripCard photo URL:", photoUrl);

      setPlacePhoto(photoUrl || DEFAULT_TRIP_IMAGE);
    };

    loadPhoto();
  }, [destination]);

  return (
    <Link
      to={"/trips/" + trip?.id}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 overflow-hidden"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all">
        <div className="h-40 relative">
          <img
            src={placePhoto || DEFAULT_TRIP_IMAGE}
            alt={trip?.userSelection?.destination?.label}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_TRIP_IMAGE;
            }}
          />
        </div>

        <div className="p-5">
          <h4 className="text-lg my-2 line-clamp-1">
            ✈️ {trip?.userSelection?.destination?.label}
          </h4>

          <div className="space-y-3">
            <div className="flexBetween border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2 text-sm">
                <Banknote className="h-4 w-4" />
                <h6>Budget</h6>
              </div>

              <p>
                {trip?.userSelection?.budget ||
                  trip?.tripData?.travelPlan?.budget ||
                  "Budget"}
              </p>
            </div>

            <div className="flexBetween border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <h6>Traveler</h6>
              </div>

              <p>
                {trip?.userSelection?.traveler ||
                  trip?.tripData?.travelPlan?.traveler ||
                  "Traveler"}
              </p>
            </div>

            <div className="flexBetween border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <h6>No of days</h6>
              </div>

              <p>
                {trip?.userSelection?.noOfDays ||
                  trip?.tripData?.travelPlan?.duration ||
                  "No days"}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <h6>Location:</h6>
                <p>{destination || "Location not available"}</p>
              </div>

              <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg leading-relaxed line-clamp-6">
                {trip?.tripData?.travelPlan?.tripNote ||
                  "No trip note available"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MyTripCard;
