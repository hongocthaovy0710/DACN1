import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Calendar, Share2 } from "lucide-react";
import { db } from "@/services/firebaseConfig";
import BudgetPlanner from "@/components/shared/BudgetPlanner";
import FoodSuggestions from "@/components/shared/FoodSuggestions";
import Itinerary from "@/components/shared/Itinerary";
import TransportBooking from "@/components/shared/TransportBooking";
import TripStats from "@/components/shared/TripStats";
import { getTripDestination } from "@/utils/tripHelpers";

const SharedTrip = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSharedTrip = async () => {
      if (!shareId) return navigate("/");

      const q = query(
        collection(db, "trips-ai"),
        where("shareId", "==", shareId),
        where("shareEnabled", "==", true),
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setLoading(false);
        return;
      }

      const docSnap = querySnapshot.docs[0];
      setTrip({ id: docSnap.id, ...docSnap.data() });
      setLoading(false);
    };

    fetchSharedTrip();
  }, [shareId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flexCenter pt-20">
        <p>Loading shared trip...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flexCenter flex-col gap-3 px-4 text-center">
        <h3>Shared trip not found</h3>
        <p>This link may be disabled or incorrect.</p>
      </div>
    );
  }

  const destination = getTripDestination(trip);

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-padd-container py-10">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
            <Share2 className="h-4 w-4" />
            Shared Trip
          </span>
          <h1 className="mt-4">{destination || "TripBuddy Plan"}</h1>
          <p className="mt-2 max-w-3xl">
            {trip?.tripData?.travelPlan?.tripNote}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="sm:bg-white rounded-2xl sm:shadow-sm sm:border border-gray-100 sm:p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                Daily Plan
              </h2>
              <Itinerary trip={trip} />
            </section>

            <TransportBooking trip={trip} readOnly />
          </div>

          <div className="space-y-6">
            <TripStats trip={trip} />
            <BudgetPlanner trip={trip} readOnly />
            <FoodSuggestions trip={trip} readOnly />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedTrip;
