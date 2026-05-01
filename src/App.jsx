import { Route, Routes } from "react-router-dom";
import Header from "./components/shared/Header";
import Home from "./page/Home";

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
};
export default App;
