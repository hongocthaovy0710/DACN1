import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "@/services/firebaseConfig";
import { Skeleton } from "@/components/ui/skeleton";
import MyTripCard from "@/components/shared/MyTripCard";

const MyTrips = () => {
  const [userTrips, setUserTrips] = useState([]);
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
        const allTrips = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUserTrips(allTrips);
      })
      .catch((error) => {
        console.log("Error fetching userTrips", error);
      });
  }, [navigate]);

  return (
    <div className="max-padd-container py-20 xl:py-28">
      <h1 className="text-3xl font-bold mb-8">My Trips</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {userTrips?.length > 0
          ? userTrips?.map((trip, index) => (
              <MyTripCard key={trip?.id || index} trip={trip} />
            ))
          : [1, 2, 3, 4].map((index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-72 w-full rounded-xl bg-white" />
              </div>
            ))}
      </div>
    </div>
  );
};

export default MyTrips;
