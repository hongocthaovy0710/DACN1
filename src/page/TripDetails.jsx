import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Calendar } from "lucide-react";
import Itinerary from "@/components/shared/Itinerary";

const TripDetails = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const navigate = useNavigate();

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

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading trip...</p>
      </div>
    );
  }

  return (
    trip && (
      <div>
        <div className="min-h-screen bg-background">
          <div className="relative h-[22rem] md:h-[28rem] bg-gray-900">
            <img
              src="/private.png"
              alt=""
              className="w-full h-full object-cover opacity-60"
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
                {trip?.userSelection?.destination}
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
                    <Calendar className="h-5 w-5 mr-2 text-indigo-600" /> Your
                    Daily Plan
                  </h2>
                  <Itinerary trip={trip} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default TripDetails;
