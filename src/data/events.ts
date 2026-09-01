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
  address?: string;
  about?: string;
  highlights?: string[];
  source?: string;
  doorsOpen?: string;
  ageLimit?: string;
};

export const picks: EventItem[] = [
  {
    id: "shalom",
    address: "Šv. Mikalojaus g. 8, Vilnius 01133",
    about: "A festival highlight: a chamber programme of Jewish liturgical and classical music performed under the vaults of St. Catherine’s church, with a short introduction to each piece before it is played.",
    highlights: ["Chamber ensemble + cantor", "~90 min, no intermission", "Free seating, arrive 20 min early"],
    source: "festivalis.lt",
    doorsOpen: "18:30",
    ageLimit: "All ages",
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
    address: "Vitebsko g. 21, Vilnius 03209",
    about: "Smala’s late room turned over to a single long techno set, with a slower dub-leaning opening and a hard close until sunrise. Small capacity, no photos on the floor.",
    highlights: ["Resident + guest, 6 h set", "Cash-free bar", "No photos on the dancefloor"],
    source: "ra.co",
    doorsOpen: "23:00",
    ageLimit: "18+",
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
    address: "Švitrigailos g. 29, Vilnius 03228",
    about: "Garbanotas bring their autumn tour to Loftas: a psychedelic-leaning set built around the new record, played in a standing room of about a thousand people.",
    highlights: ["Support act at 20:00", "Standing only", "Merch table by the entrance"],
    source: "bilietai.lt",
    doorsOpen: "19:00",
    ageLimit: "16+",
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
    address: "Pylimo g. 17, Vilnius 01141",
    about: "Opening night of a group show on soft technology and the body — textile, sound and video works by seven Baltic artists. The artists are present for the first two hours.",
    highlights: ["Free entry all evening", "Curator tour at 18:00", "Drinks in the atrium"],
    source: "mo.lt",
    doorsOpen: "17:00",
    ageLimit: "All ages",
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
    address: "Vokiėčių g., Vilnius 01130",
    about: "A weekend street market along Vokiėčių: regional wine growers, cheese and bread producers, plus a dozen kitchens cooking on the street until the evening.",
    highlights: ["~40 producers", "Free entry, pay per stall", "Best before 14:00"],
    source: "vilnius-events.lt",
    doorsOpen: "12:00",
    ageLimit: "All ages",
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

export function getEvent(id: string): EventItem | undefined {
  return allEvents.find((e) => e.id === id);
}
