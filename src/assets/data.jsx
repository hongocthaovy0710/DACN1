import { DollarSign } from "lucide-react";

export const BUDGET_OPTIONS = [
  {
    id: "Budget",
    label: "Budget Friendly",
    icon: <DollarSign className="w-4 h-4" />,
  },
  {
    id: "Moderate",
    label: "Moderate",
    icon: (
      <div className="flex">
        <DollarSign className="w-4 h-4" />
        <DollarSign className="w-4 h-4" />
      </div>
    ),
  },
  {
    id: "Luxury",
    label: "Luxury",
    icon: (
      <div className="flex">
        <DollarSign className="w-4 h-4" />
        <DollarSign className="w-4 h-4" />
        <DollarSign className="w-4 h-4" />
      </div>
    ),
  },
];

export const TRAVELER_OPTIONS = [
  {
    id: "Solo",
    title: "Solo Traveler",
    icon: "🧳",
    desc: "Exploring at your own pace",
  },
  {
    id: "Couple",
    title: "Couple",
    icon: "💑",
    desc: "Romantic getaways",
  },
  {
    id: "Family",
    title: "Family",
    icon: "👨‍👩‍👧‍👦",
    desc: "Kid-friendly activities",
  },
  {
    id: "Friends",
    title: "Group/Friends",
    icon: "🥳",
    desc: "Thrill-seekers group",
  },
];
