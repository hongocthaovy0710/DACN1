import { Route, Routes } from "react-router-dom";
import Header from "./components/shared/Header";
import Home from "./page/Home";
import CreateTrip from "./page/CreateTrip";
import { Toaster } from "sonner";

const App = () => {
  return (
    <>
      <Toaster />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-trip" element={<CreateTrip />} />
      </Routes>
    </>
  );
};
export default App;
