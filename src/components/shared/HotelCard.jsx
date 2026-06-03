import { useEffect, useState } from "react";
import { BedDouble, CheckCircle2, CreditCard, ExternalLink, Star } from "lucide-react";
import { toast } from "sonner";
import { getPlacePhoto } from "@/services/placePhotoApi";
import {
  addDaysToDateInput,
  estimateHotelNightlyPrice,
  formatUsd,
  getTodayDateInput,
  getTripDays,
  getTripTravelerCount,
} from "@/utils/tripHelpers";

const DEFAULT_HOTEL_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80";

const ROOM_TYPES = [
  { id: "standard", label: "Standard Room", multiplier: 1, desc: "Basic comfort" },
  { id: "deluxe", label: "Deluxe Room", multiplier: 1.35, desc: "More space" },
  { id: "suite", label: "Suite", multiplier: 1.8, desc: "Premium stay" },
  { id: "family", label: "Family Room", multiplier: 2.1, desc: "Best for groups" },
];

const HotelCard = ({
  hotel,
  trip,
  isBooked = false,
  onBookHotel,
  readOnly = false,
}) => {
  const [placePhoto, setPlacePhoto] = useState(DEFAULT_HOTEL_IMAGE);
  const defaultGuests = getTripTravelerCount(trip);
  const defaultNights = Math.max(1, getTripDays(trip) - 1);
  const today = getTodayDateInput();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    guests: defaultGuests,
    roomType: "standard",
    nights: defaultNights,
    checkIn: "",
    paymentMethod: "Pay at hotel",
    paymentStatus: "pay_later",
  });
  const nightlyPrice = estimateHotelNightlyPrice(
    hotel,
    trip?.userSelection?.budget,
  );
  const selectedRoomType =
    ROOM_TYPES.find((room) => room.id === bookingForm.roomType) || ROOM_TYPES[0];
  const roomNightlyPrice = Number(
    (nightlyPrice * selectedRoomType.multiplier).toFixed(2),
  );
  const checkoutDate = addDaysToDateInput(bookingForm.checkIn, bookingForm.nights);
  const totalPrice =
    roomNightlyPrice * Number(bookingForm.nights || defaultNights);
  const mapsUrl =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(`${hotel?.hotelName}, ${hotel?.hotelAddress}`);

  useEffect(() => {
    if (!hotel?.hotelName) return;

    const loadPhoto = async () => {
      const searchText = `${hotel?.hotelName || ""} ${
        hotel?.hotelAddress || ""
      }`;

      const photoUrl = await getPlacePhoto(searchText);
      console.log("Hotel photo URL:", photoUrl);

      setPlacePhoto(photoUrl || hotel?.imageUrl || DEFAULT_HOTEL_IMAGE);
    };

    loadPhoto();
  }, [hotel?.hotelName, hotel?.hotelAddress, hotel?.imageUrl]);

  const handleBookingChange = (name, value) => {
    setBookingForm((current) => {
      const nextForm = { ...current, [name]: value };

      return nextForm;
    });
  };

  const handleConfirmBooking = () => {
    if (!bookingForm.checkIn) {
      toast.error("Please choose check-in date.");
      return;
    }

    if (bookingForm.checkIn < today) {
      toast.error("Check-in date cannot be in the past.");
      return;
    }

    if (Number(bookingForm.nights || 0) < 1) {
      toast.error("Nights must be at least 1.");
      return;
    }

    onBookHotel?.(hotel, {
      ...bookingForm,
      guests: Number(bookingForm.guests || defaultGuests),
      nights: Number(bookingForm.nights || defaultNights),
      checkOut: checkoutDate,
      roomType: selectedRoomType.id,
      roomTypeLabel: selectedRoomType.label,
      nightlyPrice,
      roomNightlyPrice,
      totalPrice,
      paymentLabel:
        bookingForm.paymentStatus === "paid" ? "Paid online" : "Pay at hotel",
    });
    setShowBookingForm(false);
  };

  return (
    hotel && (
      <div
        className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${
          isBooked ? "border-emerald-300 ring-2 ring-emerald-100" : "border-gray-100"
        }`}
      >
        <div className="h-40 bg-gray-200 relative">
          <img
            src={placePhoto || hotel?.imageUrl || DEFAULT_HOTEL_IMAGE}
            alt={hotel?.hotelName || "Hotel image"}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = hotel?.imageUrl || DEFAULT_HOTEL_IMAGE;
            }}
          />

          <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md shadow-sm text-xs font-bold flex items-center">
            <Star className="w-3 h-3 text-yellow-400 mr-1 fill-yellow-400" />
            {hotel?.rating || "N/A"}
          </div>

          {isBooked && (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-emerald-600 text-white px-2 py-1 rounded-md shadow-sm text-xs font-bold">
              <CheckCircle2 className="h-3 w-3" />
              Booked
            </span>
          )}
        </div>

        <div className="p-5">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1 block">
            Where you'll stay
          </span>

          <h5>{hotel?.hotelName || "Hotel name unavailable"}</h5>

          <p className="text-xs text-gray-500 mt-1 mb-2 line-clamp-1">
            📍 {hotel?.hotelAddress || "Address unavailable"}
          </p>

          <p className="text-sm mt-1 mb-2 line-clamp-3">
            {hotel?.description || "No description available"}
          </p>

          <div className="flexBetween mt-auto pt-3 gap-3">
            <div>
              <h5>{formatUsd(nightlyPrice)}</h5>

              <span className="text-[10px] text-gray-500 font-normal uppercase">
                est per night
              </span>
            </div>

            <div className="flex gap-2">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-sm font-medium hover:bg-gray-50"
              >
                <ExternalLink className="h-4 w-4" />
                Map
              </a>

              {!readOnly && (
                <button
                  onClick={() => setShowBookingForm((current) => !current)}
                  className={`inline-flex h-8 items-center justify-center rounded-lg px-2.5 text-sm font-medium ${
                    isBooked
                      ? "border border-gray-200 bg-white hover:bg-gray-50"
                      : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                  }`}
                >
                  {isBooked ? "Edit" : "Book"}
                </button>
              )}
            </div>
          </div>

          {isBooked && trip?.bookedHotel && !showBookingForm && (
            <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
              <div className="flex items-center gap-2 font-bold">
                <BedDouble className="h-4 w-4" />
                {trip.bookedHotel.roomTypeLabel || "Standard Room"},{" "}
                {trip.bookedHotel.guests} guest(s),{" "}
                {trip.bookedHotel.nights} night(s)
              </div>
              <p className="mt-1 text-emerald-700">
                {formatUsd(trip.bookedHotel.totalPrice)} -{" "}
                {trip.bookedHotel.paymentLabel}
              </p>
            </div>
          )}

          {showBookingForm && !readOnly && (
            <div className="mt-4 space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
              <div className="grid grid-cols-2 gap-2">
                <label className="text-xs font-medium text-gray-700">
                  Guests
                  <input
                    type="number"
                    min={1}
                    value={bookingForm.guests}
                    onChange={(e) => handleBookingChange("guests", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white p-2"
                  />
                </label>
                <label className="text-xs font-medium text-gray-700">
                  Nights
                  <input
                    type="number"
                    min={1}
                    value={bookingForm.nights}
                    onChange={(e) => handleBookingChange("nights", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white p-2"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <label className="text-xs font-medium text-gray-700">
                  Room type
                  <select
                    value={bookingForm.roomType}
                    onChange={(e) => handleBookingChange("roomType", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white p-2"
                  >
                    {ROOM_TYPES.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.label} - {formatUsd(nightlyPrice * room.multiplier)}
                        /night
                      </option>
                    ))}
                  </select>
                </label>
                <p className="text-xs text-gray-500">
                  {selectedRoomType.desc} - {formatUsd(roomNightlyPrice)} per night
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <label className="text-xs font-medium text-gray-700">
                  Check-in
                  <input
                    type="date"
                    min={today}
                    value={bookingForm.checkIn}
                    onChange={(e) => handleBookingChange("checkIn", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white p-2"
                  />
                </label>
                <label className="text-xs font-medium text-gray-700">
                  Check-out
                  <input
                    value={checkoutDate || "Choose check-in"}
                    readOnly
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-100 p-2"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <label className="text-xs font-medium text-gray-700">
                  Payment
                  <select
                    value={bookingForm.paymentStatus}
                    onChange={(e) =>
                      handleBookingChange("paymentStatus", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white p-2"
                  >
                    <option value="pay_later">Pay at hotel</option>
                    <option value="paid">Pay now</option>
                  </select>
                </label>
                <label className="text-xs font-medium text-gray-700">
                  Method
                  <select
                    value={bookingForm.paymentMethod}
                    onChange={(e) =>
                      handleBookingChange("paymentMethod", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white p-2"
                  >
                    <option>Pay at hotel</option>
                    <option>Credit card</option>
                    <option>Debit card</option>
                    <option>Travel wallet</option>
                  </select>
                </label>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-lg bg-white p-3">
                <div>
                  <p className="text-xs text-gray-500">Total hotel price</p>
                  <h5>{formatUsd(totalPrice)}</h5>
                </div>
                <button
                  onClick={handleConfirmBooking}
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-3 text-sm font-medium text-white hover:bg-gray-800"
                >
                  <CreditCard className="h-4 w-4" />
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default HotelCard;
