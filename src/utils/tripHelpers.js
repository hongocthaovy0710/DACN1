export const getTripDestination = (trip) =>
  trip?.userSelection?.destination?.label ||
  trip?.userSelection?.destination?.value?.terms?.[0]?.value ||
  trip?.userSelection?.destination?.formatted ||
  trip?.userSelection?.destination?.properties?.formatted ||
  trip?.userSelection?.destination ||
  trip?.tripData?.travelPlan?.location ||
  "";

export const getTripDays = (trip) =>
  Number(trip?.userSelection?.noOfDays || trip?.tripData?.travelPlan?.itinerary?.length || 1);

export const getTripTravelerCount = (trip) => {
  const traveler = String(trip?.userSelection?.traveler || "").toLowerCase();

  if (traveler.includes("family")) return 4;
  if (traveler.includes("couple")) return 2;
  if (traveler.includes("group")) return 5;

  return 1;
};

export const getTodayDateInput = () => new Date().toISOString().slice(0, 10);

export const getNowDateTimeInput = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

  return now.toISOString().slice(0, 16);
};

export const addDaysToDateInput = (dateInput, days) => {
  if (!dateInput) return "";

  const date = new Date(`${dateInput}T00:00:00`);
  date.setDate(date.getDate() + Number(days || 0));

  return date.toISOString().slice(0, 10);
};

export const getActivityKey = (dayNumber, activityName) =>
  `${dayNumber || "day"}-${String(activityName || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;

export const getCoordinates = (value) => {
  const coordinates = value?.coordinates || value?.geometry?.coordinates;

  if (Array.isArray(coordinates)) {
    const [lng, lat] = coordinates;

    return { lat: Number(lat), lng: Number(lng) };
  }

  if (coordinates?.lat && coordinates?.lng) {
    return { lat: Number(coordinates.lat), lng: Number(coordinates.lng) };
  }

  if (coordinates?.latitude && coordinates?.longitude) {
    return {
      lat: Number(coordinates.latitude),
      lng: Number(coordinates.longitude),
    };
  }

  if (value?.lat && value?.lng) {
    return { lat: Number(value.lat), lng: Number(value.lng) };
  }

  return null;
};

export const calculateDistanceKm = (from, to) => {
  if (!from || !to) return 0;

  const earthRadiusKm = 6371;
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return Math.round(earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export const estimateHotelNightlyPrice = (hotel, budget = "Moderate") => {
  const priceText = String(hotel?.priceRange || "").toLowerCase();
  const numericValues = priceText
    .replace(/,/g, "")
    .match(/\d+/g)
    ?.map((value) => Number(value))
    .filter(Boolean);

  if (numericValues?.length) {
    const average =
      numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length;

    if (
      priceText.includes("vnd") ||
      priceText.includes("₫") ||
      priceText.includes("đ") ||
      average > 10000
    ) {
      return Math.round(average / 25000);
    }

    return Math.round(average);
  }

  const level = String(budget).toLowerCase();

  if (level.includes("luxury")) return 120;
  if (level.includes("budget")) return 30;

  return 65;
};

export const estimateActivityCost = (trip) =>
  (trip?.tripData?.travelPlan?.itinerary || []).reduce((sum, day) => {
    const dayTotal = (day.activities || []).reduce((activitySum, activity) => {
      const priceText = String(activity?.ticketPrice || "").toLowerCase();

      if (priceText.includes("free")) return activitySum;

      const values = priceText
        .replace(/,/g, "")
        .match(/\d+/g)
        ?.map((value) => Number(value))
        .filter(Boolean);

      if (!values?.length) return activitySum;

      const average = values.reduce((total, value) => total + value, 0) / values.length;
      const isVnd =
        priceText.includes("vnd") ||
        priceText.includes("₫") ||
        priceText.includes("đ") ||
        average > 10000;

      return activitySum + (isVnd ? average / 25000 : average);
    }, 0);

    return sum + dayTotal;
  }, 0);

export const formatUsd = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

export const createShareId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
