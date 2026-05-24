import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getPlacePhoto } from "@/services/placePhotoApi";

const DEFAULT_HOTEL_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80";

const HotelCard = ({ hotel }) => {
  const [placePhoto, setPlacePhoto] = useState(DEFAULT_HOTEL_IMAGE);

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

  return (
    hotel && (
      <Link
        to={
          "https://www.google.com/maps/search/?api=1&query=" +
          encodeURIComponent(`${hotel?.hotelName}, ${hotel?.hotelAddress}`)
        }
        target="_blank"
      >
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer">
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

            <div className="flexBetween mt-auto pt-3">
              <div>
                <h5>
                  {hotel?.priceRange?.split(" p")[0] ||
                    hotel?.priceRange ||
                    "Price not available"}
                </h5>

                <span className="text-[10px] text-gray-500 font-normal uppercase">
                  est per night
                </span>
              </div>

              <Button variant="destructive">View Deal</Button>
            </div>
          </div>
        </div>
      </Link>
    )
  );
};

export default HotelCard;
