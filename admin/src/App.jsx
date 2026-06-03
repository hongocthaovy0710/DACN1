import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import {
  BedDouble,
  Car,
  Check,
  Clock,
  Compass,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  RefreshCw,
  Search,
  Shield,
  UserRound,
  X,
} from "lucide-react";
import { db } from "@/services/firebaseConfig";

const ADMIN_USER = import.meta.env.VITE_ADMIN_USER || "admin";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "12345";
const SESSION_KEY = "tripbuddy_admin_session";

const formatUsd = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return "No date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const getDestination = (trip) =>
  trip?.userSelection?.destination ||
  trip?.tripData?.travelPlan?.destination ||
  "Unknown trip";

const getTripPlaces = (trip) => {
  const itineraryPlaces = (trip?.tripData?.travelPlan?.itinerary || []).flatMap(
    (day) =>
      (day.activities || []).map((activity) => ({
        id: `${trip.id}-${day.dayNumber}-${activity.activityName}`,
        name: activity.activityName,
        description: activity.description,
        dayNumber: day.dayNumber,
        source: "Itinerary",
      })),
  );

  const favoritePlaces = Object.values(trip?.favoritePlaces || {}).map(
    (place) => ({
      id: `${trip.id}-${place.key}`,
      name: place.activityName,
      description: place.description,
      dayNumber: place.dayNumber,
      source: "Saved place",
    }),
  );

  return [...favoritePlaces, ...itineraryPlaces];
};

const statusText = {
  pending: "Pending review",
  confirmed: "Confirmed",
  rejected: "Declined",
};

function LoginScreen({ onLogin }) {
  const [form, setForm] = useState({ username: "admin", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (form.username === ADMIN_USER && form.password === ADMIN_PASSWORD) {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ username: form.username, loggedInAt: Date.now() }),
      );
      onLogin();
      return;
    }

    setError("The admin username or password is incorrect.");
  };

  return (
    <main className="login-shell">
      <section className="login-visual">
        <div className="visual-topline">
          <span>TripBuddy</span>
          <strong>Operations Portal</strong>
        </div>

        <div className="visual-copy">
          <p>Admin access</p>
          <h1>Review every trip service from one calm workspace.</h1>
        </div>

        <div className="visual-metrics">
          <div>
            <strong>24/7</strong>
            <span>Booking desk</span>
          </div>
          <div>
            <strong>Live</strong>
            <span>Firestore data</span>
          </div>
        </div>
      </section>

      <section className="login-card" aria-label="Admin login">
        <div className="brand-lockup">
          <div className="brand-mark">
            <Shield size={26} />
          </div>
          <div>
            <span>TripBuddy Admin</span>
            <strong>Sign in</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Username
            <input
              value={form.username}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  username: event.target.value,
                }))
              }
              autoComplete="username"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              autoComplete="current-password"
              placeholder="12345"
            />
          </label>

          {error && <div className="error-box">{error}</div>}

          <button className="primary-button" type="submit">
            <Shield size={18} />
            Enter dashboard
          </button>
        </form>
      </section>
    </main>
  );
}

function StatCard({ label, value, icon: Icon, tone }) {
  return (
    <article className={`stat-card ${tone || ""}`}>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
      <span className="stat-icon">
        <Icon size={22} />
      </span>
    </article>
  );
}

function EmptyState({ text }) {
  return <div className="empty-state">{text}</div>;
}

function StatusBadge({ status }) {
  const normalizedStatus = status || "pending";

  return (
    <span className={`status ${normalizedStatus}`}>
      {statusText[normalizedStatus] || normalizedStatus}
    </span>
  );
}

function App() {
  const [isAuthed, setIsAuthed] = useState(() =>
    Boolean(localStorage.getItem(SESSION_KEY)),
  );
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("services");

  const loadTrips = async () => {
    setLoading(true);
    try {
      const tripsQuery = query(collection(db, "trips-ai"), orderBy("id", "desc"));
      const snapshot = await getDocs(tripsQuery);
      setTrips(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    } catch (error) {
      console.log("Admin load trips error:", error);
      const snapshot = await getDocs(collection(db, "trips-ai"));
      setTrips(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthed) {
      loadTrips();
    }
  }, [isAuthed]);

  const filteredTrips = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return trips;

    return trips.filter((trip) => {
      const haystack = [
        trip.userEmail,
        getDestination(trip),
        trip.bookedHotel?.hotelName,
        trip.bookedHotel?.hotelAddress,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [searchText, trips]);

  const hotelBookings = filteredTrips
    .filter((trip) => trip.bookedHotel)
    .map((trip) => ({ trip, booking: trip.bookedHotel }));

  const transportBookings = filteredTrips.flatMap((trip) =>
    (trip.transportBookings || []).map((booking) => ({ trip, booking })),
  );

  const pendingCount =
    hotelBookings.filter(({ booking }) => booking.status === "pending").length +
    transportBookings.filter(({ booking }) => booking.status === "pending")
      .length;

  const allPlaces = filteredTrips.flatMap((trip) =>
    getTripPlaces(trip).map((place) => ({ trip, place })),
  );

  const updateHotelStatus = async (trip, status) => {
    setUpdatingId(`hotel-${trip.id}`);
    const nextHotel = {
      ...trip.bookedHotel,
      status,
      reviewedAt: new Date().toISOString(),
      reviewedBy: ADMIN_USER,
    };

    await updateDoc(doc(db, "trips-ai", trip.id), {
      bookedHotel: nextHotel,
    });

    setTrips((current) =>
      current.map((item) =>
        item.id === trip.id ? { ...item, bookedHotel: nextHotel } : item,
      ),
    );
    setUpdatingId("");
  };

  const updateTransportStatus = async (trip, bookingId, status) => {
    setUpdatingId(`transport-${bookingId}`);
    const nextBookings = (trip.transportBookings || []).map((booking) =>
      booking.id === bookingId
        ? {
            ...booking,
            status,
            reviewedAt: new Date().toISOString(),
            reviewedBy: ADMIN_USER,
          }
        : booking,
    );

    await updateDoc(doc(db, "trips-ai", trip.id), {
      transportBookings: nextBookings,
    });

    setTrips((current) =>
      current.map((item) =>
        item.id === trip.id ? { ...item, transportBookings: nextBookings } : item,
      ),
    );
    setUpdatingId("");
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setIsAuthed(false);
  };

  if (!isAuthed) {
    return <LoginScreen onLogin={() => setIsAuthed(true)} />;
  }

  return (
    <main className="admin-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <Compass size={24} />
          </div>
          <div>
            <strong>TripBuddy</strong>
            <span>Admin Console</span>
          </div>
        </div>

        <nav>
          <button
            className={activeTab === "services" ? "active" : ""}
            onClick={() => setActiveTab("services")}
          >
            <LayoutDashboard size={18} />
            Service Queue
          </button>
          <button
            className={activeTab === "customers" ? "active" : ""}
            onClick={() => setActiveTab("customers")}
          >
            <UserRound size={18} />
            Customers
          </button>
          <button
            className={activeTab === "places" ? "active" : ""}
            onClick={() => setActiveTab("places")}
          >
            <MapPin size={18} />
            Places
          </button>
        </nav>

        <div className="admin-profile">
          <span>AD</span>
          <div>
            <strong>Admin</strong>
            <p>Signed in</p>
          </div>
        </div>

        <button className="logout-button" onClick={logout}>
          <LogOut size={18} />
          Sign out
        </button>
      </aside>

      <section className="content">
        <header className="dashboard-hero">
          <div>
            <p>Operations workspace</p>
            <h1>Admin Dashboard</h1>
            <span>
              {pendingCount} pending request{pendingCount === 1 ? "" : "s"} need
              review
            </span>
          </div>
          <button className="ghost-button" onClick={loadTrips} disabled={loading}>
            <RefreshCw size={18} className={loading ? "spin" : ""} />
            Refresh data
          </button>
        </header>

        <div className="stats-grid">
          <StatCard label="Trips" value={trips.length} icon={Compass} tone="teal" />
          <StatCard label="Pending" value={pendingCount} icon={Clock} tone="amber" />
          <StatCard
            label="Hotel bookings"
            value={hotelBookings.length}
            icon={BedDouble}
            tone="blue"
          />
          <StatCard
            label="Ride bookings"
            value={transportBookings.length}
            icon={Car}
            tone="coral"
          />
        </div>

        <div className="toolbar">
          <Search size={18} />
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search by email, destination, or hotel..."
          />
        </div>

        {activeTab === "services" && (
          <div className="section-stack">
            <section className="section-card">
              <div className="section-title">
                <div>
                  <h2>Hotel Requests</h2>
                  <p>Review stays selected by customers.</p>
                </div>
                <span>{hotelBookings.length} bookings</span>
              </div>

              {hotelBookings.length === 0 ? (
                <EmptyState text="No hotel requests yet." />
              ) : (
                <div className="table-list">
                  {hotelBookings.map(({ trip, booking }) => (
                    <article className="booking-row" key={`hotel-${trip.id}`}>
                      <div className="booking-main">
                        <StatusBadge status={booking.status} />
                        <h3>{booking.hotelName}</h3>
                        <p>{booking.hotelAddress}</p>
                        <p className="customer-line">
                          <Mail size={14} />
                          {trip.userEmail || "No email"} - {getDestination(trip)}
                        </p>
                      </div>
                      <div className="booking-meta">
                        <strong>
                          {formatUsd(
                            booking.totalPrice || booking.estimatedNightlyPrice,
                          )}
                        </strong>
                        <span>
                          {booking.roomTypeLabel || "Standard Room"} -{" "}
                          {booking.guests || 1} guest
                          {(booking.guests || 1) === 1 ? "" : "s"} -{" "}
                          {booking.nights || 1} night
                          {(booking.nights || 1) === 1 ? "" : "s"}
                        </span>
                        <span>Check-in: {booking.checkIn || "No date"}</span>
                      </div>
                      <div className="row-actions">
                        <button
                          className="confirm-button"
                          disabled={updatingId === `hotel-${trip.id}`}
                          onClick={() => updateHotelStatus(trip, "confirmed")}
                        >
                          <Check size={16} />
                          Approve
                        </button>
                        <button
                          className="reject-button"
                          disabled={updatingId === `hotel-${trip.id}`}
                          onClick={() => updateHotelStatus(trip, "rejected")}
                        >
                          <X size={16} />
                          Decline
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="section-card">
              <div className="section-title">
                <div>
                  <h2>Ride Requests</h2>
                  <p>Confirm customer transport bookings.</p>
                </div>
                <span>{transportBookings.length} bookings</span>
              </div>

              {transportBookings.length === 0 ? (
                <EmptyState text="No ride requests yet." />
              ) : (
                <div className="table-list">
                  {transportBookings.map(({ trip, booking }) => (
                    <article
                      className="booking-row"
                      key={`transport-${trip.id}-${booking.id}`}
                    >
                      <div className="booking-main">
                        <StatusBadge status={booking.status} />
                        <h3>{booking.vehicleType}</h3>
                        <p>
                          {booking.pickup} to {booking.dropoff}
                        </p>
                        <p className="customer-line">
                          <Mail size={14} />
                          {trip.userEmail || "No email"} - {getDestination(trip)}
                        </p>
                      </div>
                      <div className="booking-meta">
                        <strong>{formatUsd(booking.estimatedPrice)}</strong>
                        <span>
                          {booking.providerName} - {booking.distanceKm} km
                        </span>
                        <span>{formatDate(booking.pickupTime)}</span>
                      </div>
                      <div className="row-actions">
                        <button
                          className="confirm-button"
                          disabled={updatingId === `transport-${booking.id}`}
                          onClick={() =>
                            updateTransportStatus(trip, booking.id, "confirmed")
                          }
                        >
                          <Check size={16} />
                          Approve
                        </button>
                        <button
                          className="reject-button"
                          disabled={updatingId === `transport-${booking.id}`}
                          onClick={() =>
                            updateTransportStatus(trip, booking.id, "rejected")
                          }
                        >
                          <X size={16} />
                          Decline
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === "customers" && (
          <section className="section-card">
            <div className="section-title">
              <div>
                <h2>Customers</h2>
                <p>Trips created in the TripBuddy user app.</p>
              </div>
              <span>{filteredTrips.length} trips</span>
            </div>

            {filteredTrips.length === 0 ? (
              <EmptyState text="No trips match your search." />
            ) : (
              <div className="customer-grid">
                {filteredTrips.map((trip) => (
                  <article className="customer-card" key={trip.id}>
                    <div className="avatar">
                      {(trip.userEmail || "?").slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <h3>{trip.userEmail || "No email"}</h3>
                      <p>{getDestination(trip)}</p>
                      <div className="pill-row">
                        <span>{trip.userSelection?.noOfDays || "?"} days</span>
                        <span>{trip.userSelection?.traveler || "traveler"}</span>
                        <span>{trip.userSelection?.budget || "budget"}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "places" && (
          <section className="section-card">
            <div className="section-title">
              <div>
                <h2>Customer Places</h2>
                <p>Saved places and itinerary activities across all trips.</p>
              </div>
              <span>{allPlaces.length} places</span>
            </div>

            {allPlaces.length === 0 ? (
              <EmptyState text="No customer places yet." />
            ) : (
              <div className="places-grid">
                {allPlaces.map(({ trip, place }) => (
                  <article className="place-card" key={place.id}>
                    <span>{place.source}</span>
                    <h3>{place.name}</h3>
                    <p>{place.description || "No description"}</p>
                    <footer>
                      <strong>{trip.userEmail || "No email"}</strong>
                      <em>
                        Day {place.dayNumber || "?"} - {getDestination(trip)}
                      </em>
                    </footer>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}

export default App;
