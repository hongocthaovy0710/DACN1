import { collection, getDocs, query, where } from "firebase/firestore";
import { MapPin, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "@/services/firebaseConfig";

const FavoritePlaces = () => {
  const [places, setPlaces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/");
      return;
    }

    const q = query(
      collection(db, "trips-ai"),
      where("userEmail", "==", user?.email),
    );

    getDocs(q)
      .then((querySnapshot) => {
        const allPlaces = querySnapshot.docs.flatMap((docSnap) => {
          const trip = docSnap.data();

          return Object.values(trip?.favoritePlaces || {}).map((place) => ({
            ...place,
            tripId: docSnap.id,
            tripName:
              place.tripName ||
              trip?.userSelection?.destination ||
              trip?.tripData?.travelPlan?.location ||
              "Trip",
          }));
        });

        setPlaces(allPlaces);
      })
      .catch((error) => {
        console.log("Error loading favorite places", error);
      });
  }, [navigate]);

  return (
    <div className="max-padd-container py-20 xl:py-28">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Favorite Places</h1>
        <p className="mt-2">
          Places you starred from your itineraries and may want to revisit.
        </p>
      </div>

      {places.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center">
          <Star className="mx-auto h-8 w-8 text-amber-400" />
          <h3 className="mt-3">No favorites yet</h3>
          <p className="mt-2">
            Open a trip and tap the star on places you want to save.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {places.map((place) => (
            <Link
              key={`${place.tripId}-${place.key}`}
              to={`/trips/${place.tripId}`}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-amber-600">
                    Day {place.dayNumber}
                  </span>
                  <h4 className="mt-1">{place.activityName}</h4>
                </div>
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              </div>
              <p className="mt-2 line-clamp-3">{place.description}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                {place.tripName}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritePlaces;
