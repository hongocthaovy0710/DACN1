import { useEffect, useMemo, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { Car, CheckCircle2, Clock, MapPin, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/services/firebaseConfig";
import {
  calculateDistanceKm,
  formatUsd,
  getCoordinates,
  getNowDateTimeInput,
  getTripDestination,
  getTripTravelerCount,
} from "@/utils/tripHelpers";

const VEHICLE_OPTIONS = [
  { type: "Motorbike", seats: 1, basePrice: 2.5, pricePerKm: 0.45 },
  { type: "Car 4 seats", seats: 4, basePrice: 4, pricePerKm: 0.75 },
  { type: "Car 7 seats", seats: 7, basePrice: 6, pricePerKm: 0.95 },
  { type: "Airport transfer", seats: 4, basePrice: 10, pricePerKm: 0.7 },
];

const PROVIDERS = [
  { name: "Kakao T", multiplier: 1, eta: "5-10 min", rating: 4.8 },
  { name: "Uber Taxi", multiplier: 1.12, eta: "8-12 min", rating: 4.7 },
  { name: "Airport Van", multiplier: 1.25, eta: "10-15 min", rating: 4.6 },
];

const TransportBooking = ({ trip, tripId, onTripUpdate, readOnly = false }) => {
  const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;
  const destination = getTripDestination(trip);
  const travelerCount = getTripTravelerCount(trip);
  const bookings = trip?.transportBookings || [];
  const bookedHotel = trip?.bookedHotel;
  const dropoffCoordinates = getCoordinates(bookedHotel);
  const nowDateTime = getNowDateTimeInput();
  const [form, setForm] = useState({
    pickupText: "",
    pickupPlace: null,
    pickupTime: "",
    vehicleType: "Car 4 seats",
    providerName: "Kakao T",
    paymentStatus: "pay_later",
  });
  const [pickupSuggestions, setPickupSuggestions] = useState([]);

  const selectedVehicle = useMemo(
    () => VEHICLE_OPTIONS.find((vehicle) => vehicle.type === form.vehicleType),
    [form.vehicleType],
  );
  const selectedProvider = useMemo(
    () => PROVIDERS.find((provider) => provider.name === form.providerName),
    [form.providerName],
  );
  const pickupCoordinates = getCoordinates(form.pickupPlace);
  const distanceKm = calculateDistanceKm(pickupCoordinates, dropoffCoordinates);

  const estimatedPrice = useMemo(() => {
    const distance = Number(distanceKm || 0);
    const basePrice = selectedVehicle.basePrice + selectedVehicle.pricePerKm * distance;

    return Number((basePrice * selectedProvider.multiplier).toFixed(2));
  }, [distanceKm, selectedProvider.multiplier, selectedVehicle]);

  useEffect(() => {
    if (
      readOnly ||
      form.pickupPlace ||
      !form.pickupText ||
      form.pickupText.length < 3
    ) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
            form.pickupText,
          )}&limit=5&apiKey=${GEOAPIFY_KEY}`,
        );
        const data = await res.json();
        setPickupSuggestions(data.features || []);
      } catch (error) {
        console.log("Pickup autocomplete error:", error);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [GEOAPIFY_KEY, form.pickupPlace, form.pickupText, readOnly]);

  const handleChange = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleBooking = async () => {
    if (!bookedHotel) {
      return toast.error("Please select a hotel before booking transport.");
    }

    if (!form.pickupPlace || !form.pickupTime) {
      return toast.error("Please select pickup place and time.");
    }

    if (form.pickupTime < nowDateTime) {
      return toast.error("Pickup time cannot be in the past.");
    }

    if (!distanceKm) {
      return toast.error("Distance is missing. Please select pickup from suggestions.");
    }

    const newBooking = {
      id: Date.now().toString(),
      pickup: form.pickupText,
      pickupPlace: form.pickupPlace,
      dropoff: bookedHotel.hotelName,
      dropoffAddress: bookedHotel.hotelAddress,
      dropoffCoordinates,
      pickupTime: form.pickupTime,
      vehicleType: form.vehicleType,
      providerName: form.providerName,
      providerEta: selectedProvider.eta,
      providerRating: selectedProvider.rating,
      distanceKm,
      estimatedPrice,
      paymentStatus: form.paymentStatus,
      paymentLabel: form.paymentStatus === "paid" ? "Paid now" : "Pay later",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const nextBookings = [...bookings, newBooking];

    await updateDoc(doc(db, "trips-ai", tripId), {
      transportBookings: nextBookings,
    });

    onTripUpdate({ ...trip, transportBookings: nextBookings });
    setForm({
      pickupText: "",
      pickupPlace: null,
      pickupTime: "",
      vehicleType: "Car 4 seats",
      providerName: "Kakao T",
      paymentStatus: "pay_later",
    });
    setPickupSuggestions([]);
    toast.success("Ride request sent. Waiting for admin confirmation!");
  };

  const getStatusMeta = (status) => {
    if (status === "confirmed") {
      return {
        label: "confirmed",
        className: "bg-emerald-50 text-emerald-700",
      };
    }

    if (status === "rejected") {
      return {
        label: "rejected",
        className: "bg-red-50 text-red-700",
      };
    }

    return {
      label: "pending admin",
      className: "bg-amber-50 text-amber-700",
    };
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h4 className="text-gray-900 flex items-center gap-2">
          <Car className="h-4 w-4 text-indigo-600" />
          Transport Booking
        </h4>
        <span className="text-xs text-gray-500">{travelerCount} traveler(s)</span>
      </div>

      {!bookedHotel && !readOnly && (
        <p className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
          Please book/select a hotel first. The hotel address will become the
          ride dropoff.
        </p>
      )}

      {!readOnly && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="relative text-sm">
              <span className="text-gray-700 font-medium">Pickup</span>
              <Search className="absolute left-3 top-10 h-4 w-4 text-gray-400" />
              <input
                value={form.pickupText}
                onChange={(e) => {
                  handleChange("pickupText", e.target.value);
                  handleChange("pickupPlace", null);
                  setPickupSuggestions([]);
                }}
                placeholder="Search airport, station..."
                className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 p-3 pl-9"
              />
              {pickupSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                  {pickupSuggestions.map((place) => (
                    <button
                      key={place.properties.place_id}
                      type="button"
                      onClick={() => {
                        setForm((current) => ({
                          ...current,
                          pickupText: place.properties.formatted,
                          pickupPlace: place,
                        }));
                        setPickupSuggestions([]);
                      }}
                      className="block w-full p-3 text-left text-sm hover:bg-gray-50"
                    >
                      {place.properties.formatted}
                    </button>
                  ))}
                </div>
              )}
            </label>

            <label className="text-sm">
              <span className="text-gray-700 font-medium">Dropoff</span>
              <input
                value={
                  bookedHotel
                    ? `${bookedHotel.hotelName} - ${bookedHotel.hotelAddress || ""}`
                    : destination
                }
                readOnly
                className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-100 p-3"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <label className="text-sm">
              <span className="text-gray-700 font-medium">Time</span>
              <input
                type="datetime-local"
                min={nowDateTime}
                value={form.pickupTime}
                onChange={(e) => handleChange("pickupTime", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 p-3"
              />
            </label>

            <label className="text-sm">
              <span className="text-gray-700 font-medium">Vehicle</span>
              <select
                value={form.vehicleType}
                onChange={(e) => handleChange("vehicleType", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 p-3"
              >
                {VEHICLE_OPTIONS.map((vehicle) => (
                  <option key={vehicle.type} value={vehicle.type}>
                    {vehicle.type}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <span className="text-gray-700 font-medium">Provider</span>
              <select
                value={form.providerName}
                onChange={(e) => handleChange("providerName", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 p-3"
              >
                {PROVIDERS.map((provider) => (
                  <option key={provider.name} value={provider.name}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <span className="text-gray-700 font-medium">Distance</span>
              <input
                value={distanceKm ? `${distanceKm} km` : "Select pickup"}
                readOnly
                className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-100 p-3"
              />
            </label>

            <label className="text-sm">
              <span className="text-gray-700 font-medium">Payment</span>
              <select
                value={form.paymentStatus}
                onChange={(e) => handleChange("paymentStatus", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 p-3"
              >
                <option value="pay_later">Pay later</option>
                <option value="paid">Pay now</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PROVIDERS.map((provider) => {
              const providerPrice = Number(
                (
                  (selectedVehicle.basePrice +
                    selectedVehicle.pricePerKm * Number(distanceKm || 0)) *
                  provider.multiplier
                ).toFixed(2),
              );

              return (
                <button
                  key={provider.name}
                  type="button"
                  onClick={() => handleChange("providerName", provider.name)}
                  className={`rounded-xl border p-3 text-left ${
                    form.providerName === provider.name
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-100 bg-white"
                  }`}
                >
                  <h5>{provider.name}</h5>
                  <p>{provider.eta} - {provider.rating} rating</p>
                  <p className="mt-1 font-bold text-indigo-700">
                    {distanceKm ? formatUsd(providerPrice) : "Choose pickup"}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl bg-indigo-50 p-3">
            <p className="font-semibold text-indigo-700">
              Estimated price: {formatUsd(estimatedPrice)}
            </p>
            <button
              onClick={handleBooking}
              disabled={!bookedHotel || !form.pickupPlace || !distanceKm}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Book ride
            </button>
          </div>
        </div>
      )}

      <div className="mt-5 space-y-3">
        {bookings.length > 0 ? (
          bookings.map((booking) => {
            const statusMeta = getStatusMeta(booking.status);

            return (
              <div key={booking.id} className="rounded-xl border border-gray-100 p-3">
                <div className="flex items-center justify-between gap-3">
                  <h5>{booking.vehicleType}</h5>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${statusMeta.className}`}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {statusMeta.label}
                  </span>
                </div>
                <p className="mt-2 font-medium text-gray-700">
                  {booking.providerName} - ETA {booking.providerEta}
                </p>
                <p className="mt-1 font-medium text-gray-700">
                  Payment: {booking.paymentLabel || "Pay later"}
                </p>
                <p className="mt-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {booking.pickup} to {booking.dropoff}
                </p>
                <p className="mt-1 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {booking.pickupTime} - {booking.distanceKm} km -{" "}
                  {formatUsd(booking.estimatedPrice)}
                </p>
              </div>
            );
          })
        ) : (
          <p className="rounded-xl bg-gray-50 p-3 text-sm">
            No transport booking yet.
          </p>
        )}
      </div>
    </section>
  );
};

export default TransportBooking;
