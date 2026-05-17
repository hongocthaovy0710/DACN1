import { Plane, Plus, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flexBetween absolute top-0 left-0 right-0 w-full z-50 ">
      {/* Logo */}
      <Link to={"/"} className="flex items-center gap-x-2 cursor-pointer">
        <div className="bg-destructive p-1.5 rounded-lg">
          <Plane className="w-6 h-6 text-white" />
        </div>
        <span className="hidden sm:flex font-bold text-xl capitalize">
          TripBuddy
        </span>
      </Link>
      {/* Buttons & Profile */}
      <div className="flex gap-x-4 sm:gap-x-8">
        <Button asChild variant="outline" className="mt-1 bg-transparent">
          <Link to="/create-trip">
            <Plus />
            Create Trip
          </Link>
        </Button>
        <div className="flex mt-1">
          <Button variant="destructive" className="px-5!">
            <User />
            Login
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
