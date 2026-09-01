import shalom from "@/assets/event-shalom.jpg";
import club from "@/assets/event-club.jpg";
import art from "@/assets/event-art.jpg";
import food from "@/assets/event-food.jpg";
import live from "@/assets/event-live.jpg";

export type EventItem = {
  id: string;
  title: string;
  category: string;
  day: string;
  time: string;
  venue: string;
  city?: string;
  price: string;
  image: string;
  reason?: string;
  match?: number;
};

export const picks: EventItem[] = [
  {
    id: "shalom",
    title: "Išgelbėjimo ragas · Vilnius Shalom Festival",
    category: "Festivals",
    day: "Thu 17 Sep",
    time: "19:00",
    venue: "Šv. Kotrynos bažnyčia",
    price: "from €18",
    image: shalom,
    reason: "You like festivals and live classical — this one is the week's standout.",
    match: 96,
  },
  {
    id: "club",
    title: "Smala Nights: Ø Room",
    category: "Clubs",
    day: "Fri 18 Sep",
    time: "23:30",
    venue: "Smala, Vitebsko g. 21",
    price: "€12",
    image: club,
    reason: "Late techno close to you, and you went to two club nights this month.",
    match: 91,
  },
  {
    id: "live",
    title: "Garbanotas · Autumn Tour",
    category: "Live music",
    day: "Sat 19 Sep",
    time: "20:00",
    venue: "Loftas",
    price: "from €25",
    image: live,
    reason: "Indie shows you saved before are usually this size of room.",
    match: 88,
  },
];

export const allEvents: EventItem[] = [
  ...picks,
  {
    id: "art",
    title: "Soft Machines — group show opening",
    category: "Art",
    day: "Sun 20 Sep",
    time: "17:00",
    venue: "MO Museum",
    price: "Free",
    image: art,
  },
  {
    id: "food",
    title: "Old Town Wine & Food Market",
    category: "Food",
    day: "Sun 20 Sep",
    time: "12:00",
    venue: "Vokiečių g.",
    price: "Free entry",
    image: food,
  },
];

export const categories = [
  "All",
  "Festivals",
  "Clubs",
  "Live music",
  "Art",
  "Food",
];
