import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ActivityCard from "./ActivityCard";
import { getActivityKey } from "@/utils/tripHelpers";

const Itinerary = ({ trip, onToggleFavorite, onToggleVisited }) => {
  const favoritePlaces = trip?.favoritePlaces || {};
  const visitedPlaces = trip?.visitedPlaces || {};

  return (
    <section>
      <Accordion type="single" collapsible defaultValue={"item-1"}>
        {trip?.tripData?.travelPlan?.itinerary?.map((itinerary, index) => (
          <AccordionItem value={`item-${index + 1}`} key={index}>
            <AccordionTrigger className="flex items-start justify-start text-[16px] font-bold">
              Day: {itinerary.dayNumber}: {itinerary.theme}
            </AccordionTrigger>
            <AccordionContent>
              {/* Timeline */}
              <div className="mt-4">
                {/* Item - Activity */}
                {itinerary.activities?.map((activity, i) => {
                  const activityKey = getActivityKey(
                    itinerary.dayNumber,
                    activity?.activityName,
                  );

                  return (
                    <ActivityCard
                      key={activityKey || i}
                      activity={activity}
                      isFavorite={Boolean(favoritePlaces[activityKey])}
                      isVisited={Boolean(visitedPlaces[activityKey])}
                      onToggleFavorite={() =>
                        onToggleFavorite?.(activityKey, activity, itinerary)
                      }
                      onToggleVisited={() =>
                        onToggleVisited?.(activityKey, activity, itinerary)
                      }
                    />
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default Itinerary;
