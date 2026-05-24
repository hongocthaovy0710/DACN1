import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ActivityCard from "./ActivityCard";

const Itinerary = ({ trip }) => {
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
                {itinerary.activities?.map((activity, i) => (
                  <ActivityCard key={i} activity={activity} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default Itinerary;
