import { doc, updateDoc } from "firebase/firestore";
import { Copy, FileDown, Share2 } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/services/firebaseConfig";
import { createShareId, formatUsd, getTripDestination } from "@/utils/tripHelpers";

const createPrintableHtml = (trip) => {
  const destination = getTripDestination(trip);
  const itinerary = trip?.tripData?.travelPlan?.itinerary || [];
  const hotels = trip?.tripData?.travelPlan?.hotelsOptions || [];
  const transportBookings = trip?.transportBookings || [];
  const foodSuggestions = trip?.foodSuggestions || [];
  const budgetPlan = trip?.budgetPlan;
  const bookedHotel = trip?.bookedHotel;

  return `
    <!doctype html>
    <html>
      <head>
        <title>${destination || "TripBuddy Plan"}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #222; margin: 32px; }
          h1 { margin-bottom: 4px; }
          h2 { margin-top: 28px; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
          .muted { color: #666; }
          .card { border: 1px solid #ddd; border-radius: 8px; padding: 14px; margin: 10px 0; }
          .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
          @media print { button { display: none; } body { margin: 18px; } }
        </style>
      </head>
      <body>
        <button onclick="window.print()">Save as PDF</button>
        <h1>${destination || "TripBuddy Plan"}</h1>
        <p class="muted">${trip?.tripData?.travelPlan?.tripNote || ""}</p>

        <h2>Overview</h2>
        <div class="grid">
          <div class="card">Budget: ${trip?.userSelection?.budget || ""}</div>
          <div class="card">Traveler: ${trip?.userSelection?.traveler || ""}</div>
          <div class="card">Days: ${trip?.userSelection?.noOfDays || ""}</div>
          <div class="card">Total Budget: ${formatUsd(budgetPlan?.totalBudget || 0)}</div>
        </div>

        <h2>Daily Plan</h2>
        ${itinerary
          .map(
            (day) => `
              <div class="card">
                <h3>Day ${day.dayNumber}: ${day.theme || ""}</h3>
                ${(day.activities || [])
                  .map(
                    (activity) => `
                      <p><strong>${activity.timeRange || ""}</strong> - ${activity.activityName || ""}</p>
                      <p class="muted">${activity.description || ""}</p>
                    `,
                  )
                  .join("")}
              </div>
            `,
          )
          .join("")}

        <h2>Hotel Booking</h2>
        ${
          bookedHotel
            ? `
              <div class="card">
                <strong>${bookedHotel.hotelName || ""}</strong>
                <p>${bookedHotel.hotelAddress || ""}</p>
                <p>${bookedHotel.roomTypeLabel || "Standard Room"}, ${bookedHotel.guests || 1} guest(s), ${bookedHotel.nights || 1} night(s)</p>
                <p>${formatUsd(bookedHotel.totalPrice || bookedHotel.estimatedNightlyPrice || 0)} - ${bookedHotel.paymentLabel || "Pay later"}</p>
              </div>
            `
            : hotels
                .map(
                  (hotel) => `
                    <div class="card">
                      <strong>${hotel.hotelName || ""}</strong>
                      <p>${hotel.hotelAddress || ""}</p>
                      <p>${hotel.priceRange || ""} - Rating: ${hotel.rating || ""}</p>
                    </div>
                  `,
                )
                .join("")
        }

        <h2>Transport</h2>
        ${transportBookings
          .map(
            (booking) => `
              <div class="card">
                <strong>${booking.vehicleType}</strong>
                <p>${booking.pickup} to ${booking.dropoff}</p>
                <p>${booking.pickupTime} - ${formatUsd(booking.estimatedPrice)} - ${booking.paymentLabel || "Pay later"}</p>
              </div>
            `,
          )
          .join("")}

        <h2>Food Suggestions</h2>
        ${foodSuggestions
          .map(
            (food) => `
              <div class="card">
                <strong>${food.meal}: ${food.name}</strong>
                <p>${food.cuisine} - ${food.priceLevel} - Rating: ${food.rating}</p>
                <p>${food.note}</p>
              </div>
            `,
          )
          .join("")}
      </body>
    </html>
  `;
};

const TripShareActions = ({ trip, tripId, onTripUpdate }) => {
  const shareUrl = trip?.shareId
    ? `${window.location.origin}/shared-trip/${trip.shareId}`
    : "";

  const enableShare = async () => {
    const shareId = trip?.shareId || createShareId();
    const nextTrip = {
      ...trip,
      shareId,
      shareEnabled: true,
      sharedAt: new Date().toISOString(),
    };

    await updateDoc(doc(db, "trips-ai", tripId), {
      shareId,
      shareEnabled: true,
      sharedAt: nextTrip.sharedAt,
    });

    onTripUpdate(nextTrip);
    await navigator.clipboard.writeText(`${window.location.origin}/shared-trip/${shareId}`);
    toast.success("Share link copied!");
  };

  const copyShareLink = async () => {
    if (!shareUrl) return enableShare();

    await navigator.clipboard.writeText(shareUrl);
    toast.success("Share link copied!");
  };

  const exportPdf = () => {
    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) {
      toast.error("Popup was blocked. Please allow popups to export PDF.");
      return;
    }

    printWindow.document.write(createPrintableHtml(trip));
    printWindow.document.close();
    printWindow.focus();
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h4 className="text-gray-900 flex items-center gap-2 mb-4">
        <Share2 className="h-4 w-4 text-indigo-600" />
        Export & Share
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={exportPdf}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-bold hover:bg-gray-50"
        >
          <FileDown className="h-4 w-4" />
          Export PDF
        </button>
        <button
          onClick={copyShareLink}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-700"
        >
          <Copy className="h-4 w-4" />
          Copy share link
        </button>
      </div>

      {shareUrl && (
        <p className="mt-3 break-all rounded-lg bg-gray-50 p-3 text-xs">
          {shareUrl}
        </p>
      )}
    </section>
  );
};

export default TripShareActions;
