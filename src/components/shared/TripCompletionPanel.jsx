import { doc, updateDoc } from "firebase/firestore";
import { CheckCircle2, Save, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { db } from "@/services/firebaseConfig";

const TripCompletionPanel = ({
  trip,
  tripId,
  onTripUpdate,
  totalActivities,
  visitedCount,
  completionPercent,
}) => {
  const [review, setReview] = useState(trip?.tripReview || "");

  const saveReview = async () => {
    await updateDoc(doc(db, "trips-ai", tripId), {
      tripReview: review,
      tripCompletedAt:
        completionPercent === 100 ? new Date().toISOString() : trip?.tripCompletedAt || null,
    });

    onTripUpdate({
      ...trip,
      tripReview: review,
      tripCompletedAt:
        completionPercent === 100 ? new Date().toISOString() : trip?.tripCompletedAt || null,
    });
    toast.success("Trip note saved!");
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h4 className="text-gray-900 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Trip Progress
        </h4>
        <span className="text-sm font-bold text-emerald-700">
          {completionPercent}%
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${completionPercent}%` }}
        />
      </div>

      <p className="mt-3 text-sm">
        {visitedCount}/{totalActivities} places marked as visited.
      </p>

      <label className="mt-4 block text-sm font-medium text-gray-700">
        Trip reflection
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write what you liked, what to revisit, or memories from this trip..."
          className="mt-2 min-h-28 w-full resize-y rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm"
        />
      </label>

      <button
        onClick={saveReview}
        className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
      >
        <Save className="h-4 w-4" />
        Save reflection
      </button>

      {Object.keys(trip?.favoritePlaces || {}).length > 0 && (
        <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
          <Star className="h-4 w-4 fill-amber-400" />
          {Object.keys(trip.favoritePlaces).length} favorite place(s) saved.
        </p>
      )}
    </section>
  );
};

export default TripCompletionPanel;
