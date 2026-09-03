import art from "@/assets/event-art.jpg";
import club from "@/assets/event-club.jpg";
import food from "@/assets/event-food.jpg";
import live from "@/assets/event-live.jpg";
import shalom from "@/assets/event-shalom.jpg";

/** One event, in the order it is read on screen: identity → when → where → offer → why. */
export type EventItem = {
  id: string;
  title: string;
  category: string;
  day: string;
  time: string;
  doorsOpen: string;
  venue: string;
  city: string;
  address: string;
  price: string;
  image: string;

  ageLimit: string;
  source: string;
  about: string;
  highlights: string[];
  /** Present only for recommended events (the "For you" feed). */
  match?: number;
  reason?: string;
};

/** "Thu 17 Sep · 19:00" — the one date format used everywhere. */
export const formatWhen = (event: EventItem) => `${event.day} · ${event.time}`;

export const isFree = (event: EventItem) => event.price.toLowerCase().startsWith("free");




/** The three recommended events, in match order. */
export const picks: EventItem[] = [
  {
    id: "shalom",
    title: "Išgelbėjimo ragas · Vilnius Shalom Festival",
    category: "Festivals",
    day: "Thu 17 Sep",
    time: "19:00",
    doorsOpen: "18:30",
    venue: "Šv. Kotrynos bažnyčia",
    city: "Vilnius",
    address: "Šv. Mikalojaus g. 8, Vilnius 01133",
    price: "from €18",
    image: shalom,

    ageLimit: "All ages",
    source: "festivalis.lt",
    about:
      "A festival highlight: a chamber programme of Jewish liturgical and classical music performed under the vaults of St. Catherine’s church, with a short introduction to each piece before it is played.",
    highlights: [
      "Chamber ensemble + cantor",
      "~90 min, no intermission",
      "Free seating, arrive 20 min early",
    ],
    match: 96,
    reason: "You like festivals and live classical — this one is the week's standout.",
  },
  {
    id: "club",
    title: "Smala Nights: Ø Room",
    category: "Clubs",
    day: "Fri 18 Sep",
    time: "23:30",
    doorsOpen: "23:00",
    venue: "Smala, Vitebsko g. 21",
    city: "Vilnius",
    address: "Vitebsko g. 21, Vilnius 03209",
    price: "€12",
    image: club,
    ageLimit: "18+",
    source: "ra.co",
    about:
      "Smala’s late room turned over to a single long techno set, with a slower dub-leaning opening and a hard close until sunrise. Small capacity, no photos on the floor.",
    highlights: ["Resident + guest, 6 h set", "Cash-free bar", "No photos on the dancefloor"],
    match: 91,
    reason: "Late techno close to you, and you went to two club nights this month.",
  },
  {
    id: "live",
    title: "Garbanotas · Autumn Tour",
    category: "Live music",
    day: "Sat 19 Sep",
    time: "20:00",
    doorsOpen: "19:00",
    venue: "Loftas",
    city: "Vilnius",
    address: "Švitrigailos g. 29, Vilnius 03228",
    price: "from €25",
    image: live,
    ageLimit: "16+",
    source: "bilietai.lt",
    about:
      "Garbanotas bring their autumn tour to Loftas: a psychedelic-leaning set built around the new record, played in a standing room of about a thousand people.",
    highlights: ["Support act at 20:00", "Standing only", "Merch table by the entrance"],
    match: 88,
    reason: "Indie shows you saved before are usually this size of room.",
  },
];

/** Everything on the calendar: the picks first, then the rest of the week. */
export const allEvents: EventItem[] = [
  ...picks,
  {
    id: "art",
    title: "Soft Machines — group show opening",
    category: "Art",
    day: "Sun 20 Sep",
    time: "17:00",
    doorsOpen: "17:00",
    venue: "MO Museum",
    city: "Vilnius",
    address: "Pylimo g. 17, Vilnius 01141",
    price: "Free",
    image: art,
    ageLimit: "All ages",
    source: "mo.lt",
    about:
      "Opening night of a group show on soft technology and the body — textile, sound and video works by seven Baltic artists. The artists are present for the first two hours.",
    highlights: ["Free entry all evening", "Curator tour at 18:00", "Drinks in the atrium"],
  },
  {
    id: "food",
    title: "Old Town Wine & Food Market",
    category: "Food",
    day: "Sun 20 Sep",
    time: "12:00",
    doorsOpen: "12:00",
    venue: "Vokiečių g.",
    city: "Vilnius",
    address: "Vokiėčių g., Vilnius 01130",
    price: "Free entry",
    image: food,
    ageLimit: "All ages",
    source: "vilnius-events.lt",
    about:
      "A weekend street market along Vokiėčių: regional wine growers, cheese and bread producers, plus a dozen kitchens cooking on the street until the evening.",
    highlights: ["~40 producers", "Free entry, pay per stall", "Best before 14:00"],
  },
];

/** Filter chips on the "All events" tab; "All" means no filter. */
export const categories = ["All", ...new Set(allEvents.map((e) => e.category))];

export const getEvent = (id: string) => allEvents.find((e) => e.id === id);
