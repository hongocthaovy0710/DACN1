import { Route, Routes } from "react-router-dom";
import Header from "./components/shared/Header";
import Home from "./page/Home";
import CreateTrip from "./page/CreateTrip";
import TripDetails from "./page/TripDetails";
import { Toaster } from "sonner";
import MyTrips from "./page/MyTrips";

const App = () => {
  return (
    <>
      <Toaster />
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/trips/:tripId" element={<TripDetails />} />
        <Route path="/my-trips" element={<MyTrips />} />
      </Routes>
    </>
  );
};

export default App;
