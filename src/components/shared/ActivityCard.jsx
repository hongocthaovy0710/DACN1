import React, { useEffect, useState } from "react";
import { getPlacePhoto } from "@/services/placePhotoApi";

const DEFAULT_ACTIVITY_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80";

const ActivityCard = ({ activity }) => {
  const [placePhoto, setPlacePhoto] = useState(DEFAULT_ACTIVITY_IMAGE);

  useEffect(() => {
    if (!activity?.activityName) return;

    const loadPhoto = async () => {
      const searchText = `${activity?.activityName || ""} ${
        activity?.description || ""
      }`;

      const photoUrl = await getPlacePhoto(searchText);
      console.log("Activity photo URL:", photoUrl);

      setPlacePhoto(photoUrl || activity?.imageUrl || DEFAULT_ACTIVITY_IMAGE);
    };

    loadPhoto();
  }, [activity?.activityName, activity?.description, activity?.imageUrl]);

  return (
    <div className="group relative flex gap-x-5">
      {/* Icon */}
      <div className="relative group-last:after:hidden after:absolute after:top-8 after:bottom-2 after:start-3 after:w-px after:-translate-x-[0.5px] after:bg-gray-200">
        <div className="relative z-10 size-6 bg-green-500 rounded-full flexCenter">
          🕘
        </div>
      </div>

      {/* Right - Content */}
      <div className="grow pb-8 group-last:pb-0">
        <p className="mb-1 font-bold">{activity?.timeRange}</p>

        <p className="pb-1.5 text-xs">
          <b>Travel Time:</b> {activity?.timeToTravel}
        </p>

        {/* Card */}
        <div className="block border border-gray-200 rounded-lg hover:shadow-2xs focus:outline-hidden overflow-hidden bg-white">
          <div className="flex flex-col sm:flex-row overflow-hidden">
            <img
              src={placePhoto || activity?.imageUrl || DEFAULT_ACTIVITY_IMAGE}
              alt={activity?.activityName || "Activity image"}
              className="w-full sm:w-56 h-40 sm:h-36 object-cover flex-shrink-0"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  activity?.imageUrl || DEFAULT_ACTIVITY_IMAGE;
              }}
            />

            <div className="grow p-4">
              <div className="min-h-24 flex flex-col justify-center">
                <h6 className="font-bold">
                  {activity?.activityName}{" "}
                  <span className="text-gray-500">
                    💸 {activity?.ticketPrice}
                  </span>
                </h6>

                <p className="mt-1 text-sm text-gray-600 line-clamp-3">
                  {activity?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
