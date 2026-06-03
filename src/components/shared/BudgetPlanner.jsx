import { useMemo, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { Banknote, Save } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/services/firebaseConfig";
import {
  estimateHotelNightlyPrice,
  formatUsd,
  getTripDays,
  getTripTravelerCount,
} from "@/utils/tripHelpers";

const BudgetPlanner = ({ trip, tripId, onTripUpdate, readOnly = false }) => {
  const days = getTripDays(trip);
  const travelers = getTripTravelerCount(trip);
  const savedBudget = trip?.budgetPlan;
  const transportTotal = (trip?.transportBookings || []).reduce(
    (sum, booking) => sum + Number(booking.estimatedPrice || 0),
    0,
  );
  const [totalBudget, setTotalBudget] = useState(savedBudget?.totalBudget || 1200);
  const nights = Math.max(1, days - 1);
  const hotelNightlyPrice = trip?.bookedHotel?.estimatedNightlyPrice ||
    estimateHotelNightlyPrice(trip?.bookedHotel, trip?.userSelection?.budget);
  const hotelTotal = trip?.bookedHotel
    ? Number(trip?.bookedHotel?.totalPrice || hotelNightlyPrice * nights)
    : 0;
  const categories = useMemo(() => {
    const budget = Number(totalBudget || 0);
    const fixedTotal = hotelTotal + transportTotal;
    const remainingBudget = Math.max(0, budget - fixedTotal);
    const activitiesTotal = Number((remainingBudget * 0.35).toFixed(2));
    const foodTotal = Number((remainingBudget * 0.4).toFixed(2));
    const extra = Math.max(
      0,
      Number((budget - fixedTotal - foodTotal - activitiesTotal).toFixed(2)),
    );

    return [
      {
        key: "hotel",
        label: trip?.bookedHotel ? "Hotel booked" : "Hotel not selected",
        amount: hotelTotal,
      },
      { key: "food", label: "Food estimate", amount: foodTotal },
      { key: "transport", label: "Transport booked", amount: transportTotal },
      { key: "activities", label: "Activities estimate", amount: activitiesTotal },
      { key: "extra", label: "Extra remaining", amount: extra },
    ];
  }, [hotelTotal, totalBudget, transportTotal, trip]);

  const plannedTotal = categories.reduce(
    (sum, category) => sum + Number(category.amount || 0),
    0,
  );
  const remaining = Number(totalBudget || 0) - plannedTotal;

  const saveBudget = async () => {
    const nextBudget = {
      totalBudget: Number(totalBudget || 0),
      categories,
      hotelTotal,
      transportTotal,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(doc(db, "trips-ai", tripId), {
      budgetPlan: nextBudget,
    });

    onTripUpdate({ ...trip, budgetPlan: nextBudget });
    toast.success("Budget plan saved!");
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h4 className="text-gray-900 flex items-center gap-2">
          <Banknote className="h-4 w-4 text-emerald-600" />
          Budget Planner
        </h4>
        <span className="text-xs text-gray-500">
          {days} day(s), {travelers} traveler(s)
        </span>
      </div>

      {!readOnly && (
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="number"
            min={0}
            value={totalBudget}
            onChange={(e) => setTotalBudget(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3"
            placeholder="Total budget"
          />
          <button
            onClick={saveBudget}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
          >
            <Save className="h-4 w-4" />
            Save
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="rounded-xl bg-gray-50 p-3">
          <p>Total budget</p>
          <h4>{formatUsd(totalBudget)}</h4>
        </div>
        <div className="rounded-xl bg-gray-50 p-3">
          <p>Planned</p>
          <h4>{formatUsd(plannedTotal)}</h4>
        </div>
        <div className="rounded-xl bg-gray-50 p-3">
          <p>Remaining after plan</p>
          <h4 className={remaining < 0 ? "text-red-600" : "text-emerald-700"}>
            {formatUsd(remaining)}
          </h4>
        </div>
      </div>

      <div className="space-y-3">
        {categories.map((category) => {
          const percent = totalBudget
            ? Math.min(100, Math.round((category.amount / totalBudget) * 100))
            : 0;

          return (
            <div key={category.key}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{category.label}</span>
                <span className="text-gray-500">{formatUsd(category.amount)}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BudgetPlanner;
