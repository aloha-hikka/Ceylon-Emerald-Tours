
export interface TourHighlight {
  title: string;
  description: string;
  /** Key into the icon map in components/IconByName.tsx */
  iconName: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  /** Plain text; **double asterisks** render as bold. */
  description: string;
}

export interface TourInfo {
  vehicle: string;
  /** Multi-day tours only. */
  accommodation?: string;
  /** Multi-day tours only. */
  maxAltitude?: string;
  departure: string;
  bestSeason: string;
  tourType: string;
  groupSize: string;
  language: string;
  fitnessLevel: string;
}

/** How a day tour travels. Tours without a vehicleType only show under the "All" filter. */
export type VehicleType = "tuk-tuk" | "jeep";

export const VEHICLE_LABELS: Record<VehicleType, string> = { "tuk-tuk": "Tuk Tuk", jeep: "Jeep" };

/**
 * A vehicle that carries a limited number of guests. When a group is bigger than one vehicle
 * holds, another vehicle is added automatically (see src/lib/pricing.ts). There is no upper limit.
 */
export interface VehicleRule {
  /** Guests per vehicle. */
  capacity: number;
  singular: string;
  plural: string;
}

/**
 * - "per-person":  price x guests. A vehicle rule (optional) only works out how many vehicles to send.
 * - "per-vehicle": price x vehicles. The price is for one whole vehicle, however full it is.
 */
export type PricingModel = "per-person" | "per-vehicle";

interface TourPricingBase {
  /** Smallest group we accept. Defaults to 1. */
  minTravellers?: number;
  /** Small line above the price on cards and booking boxes, e.g. "Per person, minimum 2 people". */
  caption: string;
  /** Short unit used in sentences, e.g. "per person" or "per jeep". */
  unit: string;
}

/** Optional on a tour. Tours without it are priced per adult, from 1 adult up. */
export type TourPricing =
  | (TourPricingBase & { model: "per-person"; vehicle?: VehicleRule })
  | (TourPricingBase & { model: "per-vehicle"; vehicle: VehicleRule });

/** A TourPricing with every default filled in. Always use getTourPricing(), never read tour.pricing directly. */
export interface ResolvedPricing {
  model: PricingModel;
  minTravellers: number;
  vehicle: VehicleRule | null;
  caption: string;
  unit: string;
  /** Label for the headcount field: "Adults" for classic tours, "Guests" otherwise. */
  travellerLabel: string;
}

export interface Tour {
  id: string;
  type: "multi-day" | "day-tour";
  title: string;
  duration: string;
  /** USD. Per adult unless `pricing` says otherwise (see getTourPricing). */
  price: number;
  /** Crossed-out price. Set it equal to `price` when there is no discount: nothing is crossed out. */
  originalPrice: number;
  discountBadge: string;
  image: string;
  gallery: string[];
  /** Paragraphs separated by a blank line; **double asterisks** render as bold. */
  overview: string;
  highlights: TourHighlight[];
  /** Always empty for day tours. */
  itinerary: ItineraryDay[];
  tourInfo: TourInfo;
  included: string[];
  excluded: string[];
  faqs: { question: string; answer: string }[];
  /** Search text for the embedded Google map. */
  mapQuery: string;
  /** Day tours only. Drives the vehicle filter on the Packages page. */
  vehicleType?: VehicleType;
  /** Vehicle-based or minimum-group pricing. See TourPricing. */
  pricing?: TourPricing;
  /** Places visited. Shown as a "Places you'll visit" section on the tour page. */
  places?: string[];
}

const cover = (slug: string) => `/images/tours/${slug}/cover.jpg`;
const photos = (slug: string, n = 5) =>
  Array.from({ length: n }, (_, i) => `/images/tours/${slug}/${i + 1}.jpg`);

const MULTI_DAY_INCLUDED: string[] = [
  "Professional Guide",
  "Tour Planning",
  "Pick-up or Drop-off service from and to Airport (in our own vehicle)",
  "Transportation to and from",
  "Fuel, parking fees, and road taxes",
  "Water Bottles",
];

const DAY_TOUR_INCLUDED: string[] = [
  "Professional Guide",
  "Tour Planning",
  "Pick-up or Drop-off service (in our own vehicle)",
  "Transportation to and from",
  "Fuel, parking fees, and road taxes",
  "Water Bottles",
];

const EXCLUDED: string[] = [
  "International Airfare",
  "Optional activities not listed in the itinerary",
  "Entry Place Tickets",
  "Food Expenses",
  "Visa Charges",
  "Hotel Expenses",
  "Your travel and medical insurance",
  "Personal Expenses such as shopping, bar bills, hot shower, telephone, laundry, titbits etc",
  "Food and accommodations",
  "Services not mentioned or not promised by the agent/agency",
  "Emergency expenses",
];

// The same four questions appear on every tour page in the source files.
const FAQS: { question: string; answer: string }[] = [
  {
    question: "What is the best time of year to take this tour?",
    answer: "This tour package is suitable for travel throughout the year. However, the best time to visit the central and cultural parts of the country is typically during the dry season, from December to April and from July to September.",
  },
  {
    question: "What should I pack for this trip?",
    answer: "We recommend packing light, breathable clothing, comfortable walking shoes for the hikes and site visits, a hat and sunscreen for sun protection, and a light jacket or sweater for the cooler climate in Nuwara Eliya.",
  },
  {
    question: "Can this itinerary be customized?",
    answer: "Absolutely! We understand that every traveler has unique interests. We’re happy to work with you to customize the itinerary to fit your specific needs.",
  },
  {
    question: "How do I get a visa for Sri Lanka?",
    answer: "Most travelers require a visa to enter Sri Lanka. You can apply for an Electronic Travel Authorization (ETA) online, which is the most convenient and quickest method. For specific country requirements and the latest information, please check the official Sri Lanka Department of Immigration and Emigration website.",
  },
];

/** Vehicles. Capacity is guests per vehicle: a bigger group gets an extra vehicle automatically. */
const TUK_TUK: VehicleRule = { capacity: 3, singular: "tuk tuk", plural: "tuk tuks" };
const JEEP: VehicleRule = { capacity: 7, singular: "jeep", plural: "jeeps" };

/** Shared by both Bandarawela & Ella day tours (tuk tuk and jeep). Guests choose 5 per day. */
const BANDARAWELA_ELLA_PLACES: string[] = [
  "Little Adam's Peak",
  "Nine Arch Bridge",
  "Rawana Falls",
  "Rawana Cave",
  "Asapuwa Temple",
  "Dowa Rock Temple",
  "Ranpuhulan Wala",
  "View Point Demodara",
  "Demodara Black Bridge",
  "Halpe Tea Factory",
  "Demodara Railway Station (Loop)",
];

const FLEXIBLE_DURATION = "Flexible, 5 places a day";

/** FAQ list for the two Bandarawela & Ella tours: two tour-specific answers, then the site-wide FAQs. */
const bandarawelaEllaFaqs = (priceAnswer: string): { question: string; answer: string }[] => [
  {
    question: "How many places can we visit in a day?",
    answer:
      "Up to five places per day, chosen from our list of eleven. There is no strict end time, so you can take your time at each stop and tell your driver where you would like to go next.",
  },
  { question: "How is the price worked out?", answer: priceAnswer },
  ...FAQS,
];
export const tours: Tour[] = [

  {
    id: "4-day-cultural-wildlife",
    type: "multi-day",
    title: "4-Day Sri Lanka’s Cultural & Wildlife Highlights Tour",
    duration: "4 Days",
    price: 300,
    originalPrice: 350,
    discountBadge: "Limited Offer",
    image: "/images/gallery/temple-of-the-tooth.jpg",
    gallery: [
    "/images/gallery/cover.jpg",
    "/images/gallery/cover2.jpg",
    "/images/gallery/beach.jpg",
    "/images/gallery/pidurangala-rock.jpg",
    "/images/gallery/beach2.jpg"
  ],
    mapQuery: "Sigiriya Rock Fortress, Sri Lanka",
    overview: "4-Day Journey Through Sri Lanka’s Soul\n\nDiscover the essence of Sri Lanka on this thoughtfully crafted 4-day adventure — a perfect fusion of ancient heritage, breathtaking scenery, and authentic cultural encounters. Tailored for travelers short on time yet eager to experience the island’s highlights, this journey takes you from the vibrant rhythm of Colombo to the storied heart of the Cultural Triangle. Explore UNESCO World Heritage treasures such as the majestic Sigiriya Rock Fortress and the tranquil Dambulla Cave Temple, each echoing centuries of history and artistry.\n\nVenture into the wild at Minneriya National Park, where a thrilling jeep safari awaits amidst the famous “Elephant Gathering.” Continue to the hill city of Kandy, the spiritual heart of the nation, to visit the revered Temple of the Tooth Relic and witness the grace of traditional Kandyan dance. Your adventure concludes with a scenic drive through misty hills and emerald tea plantations, where you’ll uncover the secrets behind world-renowned Ceylon tea.\n\nMore than just a tour, this is an intimate exploration — a journey that captures the island’s heart and leaves you with unforgettable memories of Sri Lanka’s timeless charm.",
    highlights: [
      {
        title: "Sigiriya Rock Fortress",
        description: "Ascend the awe-inspiring Lion Rock, a 5th-century masterpiece of ancient engineering. Take in sweeping jungle views and admire the vivid frescoes of the “Heavenly Maidens.”",
        iconName: "mountain",
      },
      {
        title: "Dambulla Cave Temple",
        description: "Step into a sacred sanctuary of art and devotion — five magnificent caves adorned with golden Buddha statues and ancient murals.",
        iconName: "landmark",
      },
      {
        title: "Minneriya National Park",
        description: "Embark on an unforgettable jeep safari through the wilds of Minneriya, where herds of elephants gather during the world-famous “Elephant Gathering.”",
        iconName: "binoculars",
      },
      {
        title: "Kandy Temple of the Sacred Tooth Relic",
        description: "Experience the spiritual heart of Sri Lanka at this revered temple, home to a sacred relic of the Buddha and centuries of devotion.",
        iconName: "landmark",
      },
      {
        title: "Pinnawala Elephant Orphanage",
        description: "Observe rescued elephants up close as they bathe and roam in a nurturing environment along the Maha Oya River.",
        iconName: "paw",
      },
      {
        title: "Nuwara Eliya",
        description: "Escape to the cool, misty hills of “Little England,” surrounded by tea plantations and colonial charm. Learn the art of crafting Ceylon tea from leaf to cup.",
        iconName: "coffee",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Journey to Sigiriya (The Cultural Triangle)",
        description: "Upon your arrival at Bandaranaike International Airport (BIA), your professional chauffeur-guide will provide a warm welcome. You will then be transferred to the heart of Sri Lanka's Cultural Triangle. On the way, you'll make a stop at the **Dambulla Cave Temple**, a UNESCO World Heritage site. You will explore the magnificent complex of five caves adorned with beautiful murals and statues of the Buddha. Afterwards, you will check into your hotel near Sigiriya. The rest of the afternoon is free for you to relax and prepare for the next day's adventures. Overnight stay in Sigiriya.",
      },
      {
        day: 2,
        title: "Sigiriya, Minneriya Safari & Kandy",
        description: "Rise early for a breathtaking experience: climbing the iconic **Sigiriya Rock Fortress**. This ancient citadel, built by King Kassapa in the 5th century, is a marvel of ancient urban planning. In the afternoon, get ready for a wildlife adventure with a thrilling jeep safari at **Minneriya National Park**. You'll have the chance to see large herds of elephants and various birds and other wildlife. After the safari, you'll travel to Kandy. Overnight stay in Kandy.",
      },
      {
        day: 3,
        title: "Kandy & Nuwara Eliya",
        description: "After breakfast, you will delve into the cultural heart of Sri Lanka. Your day begins with a visit to the revered Temple of the Sacred Tooth Relic, which houses a tooth relic of the Buddha and is one of the most sacred sites for Buddhists. You'll then enjoy a captivating Kandy Cultural Show, a spectacle of traditional dances and drumming. In the afternoon, we will take a scenic drive to the hill station of Nuwara Eliya. Along the way, you'll visit a lush tea plantation and factory, where you will learn about the tea-making process and enjoy a fresh cup of Ceylon tea. Overnight stay in Nuwara Eliya.",
      },
      {
        day: 4,
        title: "Nuwara Eliya & Departure",
        description: "After a relaxed breakfast, you'll have some time to soak in the charming atmosphere of Nuwara Eliya, often called \"Little England.\" We will then begin our journey back to Colombo. On the way, we will make a stop at the Pinnawala Elephant Orphanage, a government-run facility for abandoned or injured elephants, offering a unique opportunity to see these gentle giants up close. Our tour concludes with a comfortable transfer to Bandaranaike International Airport (BIA) for your departure, leaving you with cherished memories of your incredible Sri Lankan journey.",
      },
    ],
    tourInfo: {
      vehicle: "Private Vehicle",
      accommodation: "You Can Choose",
      maxAltitude: "2,000 meters",
      departure: "Bandaranaike Intl Airport (BIA), Colombo",
      bestSeason: "Dec – Mar, Jul – Sep",
      tourType: "Private Guided Tour",
      groupSize: "No Limit",
      language: "English",
      fitnessLevel: "Easy to Moderate",
    },
    included: MULTI_DAY_INCLUDED,
    excluded: EXCLUDED,
    faqs: FAQS,
  },

  /* ------------------------------------------------------------------ */
  // SOURCE: 7day-tour.html
  {
    id: "7-day-cultural-natural-wonders",
    type: "multi-day",
    title: "7-Day Sri Lanka Cultural & Natural Wonders Tour",
    duration: "7 Days",
    price: 450,
    originalPrice: 550,
    discountBadge: "Limited Offer",
    image: "/images/gallery/hill-train.jpg",
    gallery: [
    "/images/gallery/cover.jpg",
    "/images/gallery/cover2.jpg",
    "/images/gallery/beach.jpg",
    "/images/gallery/pidurangala-rock.jpg",
    "/images/gallery/beach2.jpg"
  ],
    mapQuery: "Ella, Sri Lanka",
    overview: "Embark on an unforgettable 7-day escape across Sri Lanka, exploring the island’s most remarkable landscapes and cultural treasures. This all-inclusive tour is crafted to showcase the true diversity of the country—from the sacred heritage of Kandy and the lush emerald tea fields of Ella, to the exhilarating wildlife encounters in Yala and the timeless colonial charm of Galle Fort. Each day brings a perfect balance of adventure, discovery, and relaxation. Guided by an experienced local expert, you’ll gain meaningful insights and enjoy a smooth, well-planned journey filled with memories to last a lifetime.",
    highlights: [
      {
        title: "Cultural Triangle Exploration",
        description: "Explore the sacred Temple of the Tooth Relic in Kandy, the iconic Sigiriya Rock Fortress, and the historic Dambulla Cave Temple.",
        iconName: "landmark",
      },
      {
        title: "Scenic Train Ride",
        description: "Enjoy one of the world’s most scenic train rides as you travel from Nuwara Eliya to Ella through rolling green tea plantations.",
        iconName: "train",
      },
      {
        title: "Hill Country Charm",
        description: "Hike to Ella Rock or Little Adam’s Peak, and catch stunning views at the famous Nine Arch Bridge in Ella.",
        iconName: "mountain",
      },
      {
        title: "Wildlife Safari",
        description: "Experience an exciting jeep safari in Yala National Park, known for its leopards, elephants, and rich wildlife.",
        iconName: "binoculars",
      },
      {
        title: "Coastal Discovery",
        description: "Discover the UNESCO-listed Galle Fort and unwind on the beautiful beaches along Sri Lanka’s south coast.",
        iconName: "palmtree",
      },
      {
        title: "Tea Country Experience",
        description: "Visit a tea factory and plantation to see how the world-famous Ceylon tea is crafted from leaf to cup.",
        iconName: "coffee",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Colombo & Transfer to Kandy",
        description: "Upon arrival at Bandaranaike International Airport (CMB), you will be warmly welcomed by your professional chauffeur-guide. From here, your journey begins with a beautiful scenic drive toward the hill capital of **Kandy**. Along the way, enjoy a stop at the **Pinnawala Elephant Orphanage**, a renowned sanctuary that cares for rescued and orphaned elephants—an inspiring introduction to Sri Lanka’s wildlife heritage. Once you reach Kandy, you’ll visit the sacred **Temple of the Sacred Tooth Relic**, one of the most important cultural and spiritual landmarks in the country. As evening falls, immerse yourself in the vibrant rhythms of a traditional **Kandy cultural dance show**. After a day enriched with history and culture, relax and unwind with an overnight stay in Kandy.",
      },
      {
        day: 2,
        title: "Kandy to Sigiriya & Dambulla",
        description: "After breakfast, we make our way to Sri Lanka’s iconic Cultural Triangle. Our first visit is to the impressive **Dambulla Cave Temple**, a historic complex of five beautifully preserved caves adorned with ancient Buddhist murals and statues. We then continue to the legendary **Sigiriya Rock Fortress**, where you’ll climb approximately 1,200 steps to reach the summit and enjoy breathtaking panoramic views of the ancient kingdom. Overnight stay near Sigiriya.",
      },
      {
        day: 3,
        title: "Dambulla to Nuwara Eliya",
        description: "Today, we journey into the cool hill country of **Nuwara Eliya**, often referred to as “Little England” for its charming colonial ambiance. The scenic drive is a treat in itself, offering breathtaking views of lush tea plantations and cascading waterfalls. During the visit, you’ll explore a local **tea factory and plantation** to learn how world-famous Ceylon tea is produced—and enjoy a freshly brewed cup. You will also have time to admire the serene beauty of **Gregory Lake**. Overnight stay in Nuwara Eliya.",
      },
      {
        day: 4,
        title: "Scenic Train Ride & Exploring Ella",
        description: "This morning, we board the renowned scenic train from **Nanu Oya** (near Nuwara Eliya) to **Ella**, celebrated as one of the most breathtaking train journeys in the world. Upon reaching Ella, you’ll have time to explore the charming hill town or simply relax and take in the views. In the afternoon, enjoy a short and easy hike to **Little Adam’s Peak**, where stunning sunset panoramas await. Overnight stay in Ella.",
      },
      {
        day: 5,
        title: "Ella's Wonders & Journey to Yala",
        description: "After breakfast, we begin the day with visits to the iconic **Nine Arch Bridge** and the picturesque **Ravana Falls**. After exploring the beauty of Ella, we head south toward the wildlife-rich region of **Yala**. In the afternoon, enjoy an exciting jeep safari in **Yala National Park**, where you may encounter leopards, elephants, crocodiles, and a wide variety of exotic bird species. Overnight stay near Yala National Park.",
      },
      {
        day: 6,
        title: "Yala to Galle & Southern Beaches",
        description: "Today, we make our way along the beautiful southern coastline toward the historic city of **Galle**. Here, you’ll explore the captivating **Galle Fort**, a UNESCO World Heritage Site known for its charming streets, colonial architecture, and iconic **Galle Lighthouse**. Take your time walking along the fortified ramparts and discovering boutique shops and cozy cafés within the fort’s walls. Afterward, we continue to the serene coastal town of **Bentota**, where you can unwind on pristine beaches and enjoy a relaxing atmosphere by the ocean. Overnight stay in Bentota.",
      },
      {
        day: 7,
        title: "Departure from Bentota to Colombo",
        description: "Enjoy a relaxing final morning on the golden shores of **Bentota**. Depending on your departure time, you’ll have the chance to enjoy water sports, take a peaceful beach stroll, or pick up some last-minute souvenirs. Afterwards, we’ll begin the drive to **Bandaranaike International Airport (CMB)** in Colombo for your departure, bringing your unforgettable journey through Sri Lanka to a close.",
      },
    ],
    tourInfo: {
      vehicle: "Private Vehicle",
      accommodation: "You Can Choose",
      maxAltitude: "2,000 meters",
      departure: "Bandaranaike Intl Airport (BIA), Colombo",
      bestSeason: "Dec – Mar, Jul – Sep",
      tourType: "Private Guided Tour",
      groupSize: "No Limit",
      language: "English",
      fitnessLevel: "Easy to Moderate",
    },
    included: MULTI_DAY_INCLUDED,
    excluded: EXCLUDED,
    faqs: FAQS,
  },

  /* ------------------------------------------------------------------ */
  // SOURCE: 9day-tour.html, except the itinerary, which comes from 14day-tour.html. The two files had their itineraries swapped; each tour here gets the itinerary whose length matches its day count.
  {
    id: "9-day-grand-tour",
    type: "multi-day",
    title: "9-Day Sri Lanka Grand Tour: Cultural Triangle, Hill Country & Southern Beaches",
    duration: "9 Days",
    price: 550,
    originalPrice: 650,
    discountBadge: "Limited Offer",
    image: "/images/gallery/sigiriya.jpg",
    gallery: [
    "/images/gallery/cover.jpg",
    "/images/gallery/cover2.jpg",
    "/images/gallery/beach.jpg",
    "/images/gallery/pidurangala-rock.jpg",
    "/images/gallery/beach2.jpg"
  ],
    mapQuery: "Yala National Park, Sri Lanka",
    overview: "This immersive 9-day journey through Sri Lanka takes you across some of the island’s most remarkable destinations. Your adventure begins in the ancient cities of the **Cultural Triangle**, continues into the mist-filled highlands of **Nuwara Eliya** and the scenic tea country, and concludes along the sun-kissed shores of the **South Coast**. Guided by an experienced professional, you’ll enjoy a perfect blend of cultural exploration, wildlife encounters, scenic train rides, and relaxing beachfront moments. Thoughtfully crafted for comfort and discovery, this tour delivers an unforgettable experience of Sri Lanka’s rich heritage and natural beauty.",
    highlights: [
      {
        title: "Cultural Triangle Exploration",
        description: "Discover ancient wonders at the Sigiriya Rock Fortress, Dambulla Cave Temple, and the Temple of the Sacred Tooth Relic in Kandy.",
        iconName: "landmark",
      },
      {
        title: "Tea Country Charm",
        description: "Experience the cool climate of Nuwara Eliya, explore a tea plantation, and enjoy a world-famous scenic train journey through the misty mountains.",
        iconName: "coffee",
      },
      {
        title: "Natural Beauty in Ella",
        description: "Hike to Little Adam's Peak and witness the stunning architecture and scenery around the Nine Arch Bridge.",
        iconName: "leaf",
      },
      {
        title: "Thrilling Safari",
        description: "Embark on a private jeep safari in Yala National Park, renowned as one of the best places to spot leopards, elephants, and other incredible wildlife.",
        iconName: "binoculars",
      },
      {
        title: "Coastal Relaxation",
        description: "Stroll through the historic Galle Fort, a UNESCO World Heritage site, and unwind on the beautiful beaches of Bentota.",
        iconName: "palmtree",
      },
      {
        title: "Pinnawala Elephant Orphanage",
        description: "Visit the Pinnawala Elephant Orphanage to observe the care provided to orphaned and injured elephants.",
        iconName: "paw",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Transfer to Negombo",
        description: "Upon landing at **Bandaranaike International Airport (CMB)**, you’ll be warmly welcomed by your professional chauffeur-guide. We then take a short drive to the coastal town of **Negombo**, where you can relax and settle in after your long journey. Spend the rest of the day at leisure — wander through the fishing village or enjoy time by the beach. Overnight stay in Negombo.",
      },
      {
        day: 2,
        title: "Ancient City of Anuradhapura",
        description: "Explore **Anuradhapura**, the sacred city and UNESCO World Heritage Site known for its timeless stupas and royal ruins.",
      },
      {
        day: 3,
        title: "Dambulla to Nuwara Eliya",
        description: "Today, we travel into the misty central highlands toward **Nuwara Eliya**, often called “Little England” for its cool weather and colonial charm. The scenic drive winds past lush tea plantations and cascading waterfalls. During the journey, we’ll visit a traditional **tea factory and plantation** to learn how Ceylon tea is made — and enjoy a freshly brewed cup. Overnight stay in Nuwara Eliya.",
      },
      {
        day: 4,
        title: "Scenic Train Ride & Exploring Ella",
        description: "Prepare for one of Sri Lanka’s most iconic experiences — the picturesque train ride from **Nanu Oya** to **Ella**. This world-famous route takes you through emerald tea fields, tunnels, and rolling mountain scenery. Upon arrival in Ella, a laid-back hill-country town, you’ll have time to relax or explore at your own pace. Overnight stay in Ella.",
      },
      {
        day: 5,
        title: "Ella's Natural Wonders",
        description: "Today is dedicated to discovering the natural beauty of **Ella**. After breakfast, you may take a rewarding hike to **Little Adam’s Peak** for sweeping views, or choose a more challenging trek to **Ella Rock**. Later, we’ll visit the iconic **Nine Arch Bridge**, a stunning example of colonial-era engineering and a favorite photography spot. Overnight stay in Ella.",
      },
      {
        day: 6,
        title: "Ella to Yala National Park",
        description: "After a relaxed morning, we journey south to **Yala National Park**, one of Sri Lanka’s premier wildlife reserves. In the afternoon, embark on a thrilling private jeep safari where you may encounter leopards, elephants, sloth bears, water buffalo, and vibrant birdlife. Overnight stay near Yala National Park.",
      },
      {
        day: 7,
        title: "Yala to Galle",
        description: "We continue along the southern coastline to the historic city of **Galle**. Here, you’ll explore the magnificent **Galle Fort**, a UNESCO World Heritage site built by the Portuguese and expanded by the Dutch. Walk through its charming streets, visit the iconic lighthouse, and enjoy the blend of colonial architecture and local culture. Overnight stay in Galle.",
      },
      {
        day: 8,
        title: "Galle & Southern Beaches",
        description: "Today is dedicated to relaxation along the southern shores. We travel to the golden beaches of **Bentota**, where you can unwind, enjoy water activities, or simply soak up the sunshine. You’ll also have the optional opportunity to take a scenic boat safari along the **Madu River**, exploring mangrove forests and small islands. Overnight stay in Bentota.",
      },
      {
        day: 9,
        title: "Departure from Bentota to Colombo",
        description: "Savor your final morning in Sri Lanka before we begin the drive back to **Colombo**. Depending on your flight time, you may enjoy a brief city tour or some last-minute souvenir shopping. Your chauffeur-guide will then transfer you to **Bandaranaike International Airport (CMB)**, marking the end of your unforgettable Sri Lankan journey.",
      },
    ],
    tourInfo: {
      vehicle: "Private Vehicle",
      accommodation: "You Can Choose",
      maxAltitude: "2,000 meters",
      departure: "Bandaranaike Intl Airport (BIA), Colombo",
      bestSeason: "Dec – Mar, Jul – Sep",
      tourType: "Private Guided Tour",
      groupSize: "No Limit",
      language: "English",
      fitnessLevel: "Easy to Moderate",
    },
    included: MULTI_DAY_INCLUDED,
    excluded: EXCLUDED,
    faqs: FAQS,
  },

  /* ------------------------------------------------------------------ */
  // SOURCE: 14day-tour.html, except the itinerary, which comes from 9day-tour.html. The two files had their itineraries swapped; each tour here gets the itinerary whose length matches its day count.
  {
    id: "14-day-ultimate-escape",
    type: "multi-day",
    title: "14-Day Ultimate Sri Lanka: Culture, Nature, Wildlife & Beach Escape",
    duration: "14 Days",
    price: 900,
    originalPrice: 1000,
    discountBadge: "Limited Offer",
    image: "/images/gallery/yala-leopard.jpg",
    gallery: [
    "/images/gallery/cover.jpg",
    "/images/gallery/cover2.jpg",
    "/images/gallery/beach.jpg",
    "/images/gallery/pidurangala-rock.jpg",
    "/images/gallery/beach2.jpg"
  ],
    mapQuery: "Sri Lanka",
    overview: "This unforgettable 14-day journey offers the most complete and immersive experience of Sri Lanka, designed to showcase the island’s extraordinary diversity. From ancient capitals and sacred temples to mist-covered mountains, lush tea plantations, vibrant wildlife, and golden beaches, this tour captures it all. Your adventure begins in bustling **Colombo** before heading to the sacred city of **Anuradhapura**, a UNESCO World Heritage Site known for its timeless stupas and royal ruins. You’ll then explore the iconic sites of the **Cultural Triangle**, including rock fortresses and historic cave temples, gaining insight into Sri Lanka’s ancient civilizations.\n\nNext, enjoy a breathtaking scenic train ride through the emerald highlands of the tea country, leading you to the refreshing hill-country paradise of **Ella** for hikes, views, and relaxation. Your wildlife encounters continue with exciting safaris in both **Yala National Park** and **Udawalawe National Park**, renowned for leopard and elephant sightings. The journey then carries you to the southern coastline, where you’ll explore the historic charm of **Galle** and unwind on the sun-kissed beaches of **Mirissa**.\n\nThroughout the trip, your professional guide will enrich the experience with expert knowledge, ensuring seamless travel and exceptional comfort. This carefully curated itinerary promises a truly remarkable Sri Lankan odyssey, filled with culture, nature, adventure, and relaxation.",
    highlights: [
      {
        title: "Ancient City of Anuradhapura",
        description: "Explore the expansive ruins, sacred monuments, and centuries-old heritage sites of Anuradhapura, one of Sri Lanka’s most significant ancient capitals.",
        iconName: "landmark",
      },
      {
        title: "Cultural Triangle",
        description: "Climb the majestic Sigiriya Rock Fortress and uncover the timeless beauty of the Dambulla Cave Temple, both iconic UNESCO World Heritage sites.",
        iconName: "mountain",
      },
      {
        title: "Kandy Experience",
        description: "Visit the revered Temple of the Sacred Tooth Relic and enjoy an evening of traditional artistry with a captivating Kandyan cultural show.",
        iconName: "landmark",
      },
      {
        title: "Tea Country Journey",
        description: "Take a scenic train ride through lush highlands, wander through emerald tea estates, and tour a working tea factory to learn about Ceylon tea craftsmanship.",
        iconName: "leaf",
      },
      {
        title: "Ella’s Charm",
        description: "Hike to the panoramic summit of Little Adam’s Peak, marvel at the historic Nine Arch Bridge, and soak in Ella’s breathtaking viewpoints.",
        iconName: "train",
      },
      {
        title: "Wildlife Safaris",
        description: "Embark on exciting jeep safaris in both Yala National Park and Udawalawe National Park, famous for leopards, elephants, and diverse wildlife encounters.",
        iconName: "binoculars",
      },
      {
        title: "Southern Coast Exploration",
        description: "Walk through the colonial streets of Galle Fort and unwind on the pristine golden beaches of Mirissa.",
        iconName: "palmtree",
      },
      {
        title: "Whale Watching Adventure",
        description: "Enjoy the opportunity to set out from Mirissa on a thrilling whale watching excursion, where you may spot blue whales, dolphins, and other marine life.",
        iconName: "fish",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Colombo & Transfer to Kandy",
        description: "Upon arriving at **Bandaranaike International Airport (CMB)**, you’ll be warmly welcomed by your private chauffeur-guide. Your journey begins with a scenic drive toward the cultural hill capital of **Kandy**. Along the way, we’ll stop at the **Pinnawala Elephant Orphanage**, a remarkable sanctuary dedicated to caring for orphaned and injured elephants. In the evening, enjoy a lively Kandyan Cultural Dance performance before visiting the revered **Temple of the Sacred Tooth Relic**, one of Buddhism’s most important pilgrimage sites. Overnight stay in Kandy.",
      },
      {
        day: 2,
        title: "Kandy to Sigiriya & Dambulla",
        description: "After breakfast, we head into the heart of the Cultural Triangle. Our first stop is the historic **Dambulla Cave Temple**, adorned with ancient murals and Buddha statues. We then proceed to the legendary **Sigiriya Rock Fortress**, where you’ll climb to the summit to admire its famous frescoes and breathtaking panoramic views. Overnight stay near Sigiriya.",
      },
      {
        day: 3,
        title: "Journey to the Cultural Triangle & Sigiriya",
        description: "Today we journey toward the heart of the Cultural Triangle. After checking into your hotel near **Sigiriya**, we visit the iconic **Sigiriya Rock Fortress**, often called “Lion’s Rock.” Climb to the summit to see the world-famous frescoes and take in breathtaking panoramic views. Overnight stay near Sigiriya.",
      },
      {
        day: 4,
        title: "Dambulla Cave Temple & Matale",
        description: "After a relaxed morning, we visit the remarkable **Dambulla Cave Temple**, renowned for its ancient cave murals and Buddha statues. We then continue to **Matale** to explore a fragrant spice garden and learn about Sri Lanka’s rich spice heritage. By evening, we arrive in **Kandy**. Overnight stay in Kandy.",
      },
      {
        day: 5,
        title: "Kandy City & Temple of the Tooth",
        description: "Today is dedicated to exploring the scenic city of **Kandy**. We visit the sacred **Temple of the Sacred Tooth Relic**, one of the most important pilgrimage sites in Buddhism. Later, enjoy some free time for shopping or a peaceful stroll around **Kandy Lake**. In the evening, experience the energy of a traditional Kandyan Cultural Dance Show. Overnight stay in Kandy.",
      },
      {
        day: 6,
        title: "Nuwara Eliya & Tea Country",
        description: "We head into the mist-covered hills of **Nuwara Eliya**, often referred to as “Little England” for its cool climate and colonial charm. Visit a functioning **tea factory and plantation** to learn the full journey of Ceylon tea — from leaf to cup. Overnight stay in Nuwara Eliya.",
      },
      {
        day: 7,
        title: "Scenic Train to Ella & Hiking",
        description: "This morning, we transfer to the railway station for one of the world’s most scenic train journeys from **Nanu Oya** to **Ella**. The route winds through rolling tea fields, deep valleys, and waterfalls. Upon arriving in Ella, you can take a refreshing hike to **Little Adam’s Peak** for a stunning sunset view. Overnight stay in Ella.",
      },
      {
        day: 8,
        title: "Exploring Ella & Transfer to Udawalawe",
        description: "After breakfast, we visit the iconic **Nine Arch Bridge**, an engineering marvel hidden among lush tea plantations — perfect for photographs and a tranquil walk. Later, we travel south to the wildlife-rich region of **Udawalawe**. Overnight stay near Udawalawe.",
      },
      {
        day: 9,
        title: "Udawalawe Safari & Journey to Yala",
        description: "Begin the day with an exciting jeep safari in **Udawalawe National Park**, famous for its large herds of wild elephants. Afterward, we continue to **Yala**, home to the highest density of leopards in Sri Lanka. Overnight stay near **Yala National Park**.",
      },
      {
        day: 10,
        title: "Yala National Park Safari",
        description: "Today is dedicated to wildlife exploration in **Yala National Park**. Enjoy both morning and afternoon safari sessions, increasing your chances of spotting leopards, elephants, sloth bears, crocodiles, and vibrant bird species. Overnight stay near Yala National Park.",
      },
      {
        day: 11,
        title: "Coastal Drive to Mirissa",
        description: "After breakfast, we travel along the beautiful southern coastline to **Mirissa**, a tropical beach paradise. Spend your day relaxing on soft golden sand, swimming, or soaking in the coastal scenery. Overnight stay in Mirissa.",
      },
      {
        day: 12,
        title: "Whale Watching & Beach Relaxation",
        description: "Early in the morning, you may embark on an unforgettable whale-watching excursion from **Mirissa**, one of the top locations in the world to spot blue whales, sperm whales, and dolphins. The remainder of the day is free for beach leisure or water activities. Overnight stay in Mirissa.",
      },
      {
        day: 13,
        title: "Historic Galle Fort & Bentota",
        description: "Today we visit the historic **Galle Fort**, a UNESCO World Heritage site rich in colonial architecture and coastal charm. Wander along its ancient ramparts and discover boutique shops, museums, and cafés. Later, we continue to **Bentota** for a final evening by the beach. Overnight stay in Bentota.",
      },
      {
        day: 14,
        title: "Departure from Colombo",
        description: "Enjoy your final morning by the Indian Ocean before we depart for **Colombo**. Depending on your flight schedule, you may have time for a short city tour or some last-minute shopping. Your chauffeur-guide will then transfer you to **Bandaranaike International Airport (CMB)** for your departure.",
      },
    ],
    tourInfo: {
      vehicle: "Private Vehicle",
      accommodation: "You Can Choose",
      maxAltitude: "2,000 meters",
      departure: "Bandaranaike Intl Airport (BIA), Colombo",
      bestSeason: "Dec – Mar, Jul – Sep",
      tourType: "Private Guided Tour",
      groupSize: "No Limit",
      language: "English",
      fitnessLevel: "Easy to Moderate",
    },
    included: MULTI_DAY_INCLUDED,
    excluded: EXCLUDED,
    faqs: FAQS,
  },

  /* ------------------------------------------------------------------ */
  // SOURCE: galle-tour.html
  {
    id: "galle-one-day",
    type: "day-tour",
    title: "Discover the Historic Dutch Fort & Southern Coast In One Day",
    duration: "1 Day",
    price: 150,
    originalPrice: 160,
    discountBadge: "Limited Offer",
    image: "/images/card-custom.webp",
    gallery: [
    "/images/galle-1.avif",
    "/images/galle-1.jpg",
    "/images/galle-3.jpg",
    "/images/galle-4.jpg",
    "/images/galle-5.jpg"
  ],
    mapQuery: "Galle Fort, Sri Lanka",
    overview: "Discover the captivating blend of history, culture, and natural beauty on a full-day private tour to Galle along Sri Lanka’s southern coast. Departing from Colombo, this journey is designed for travelers seeking an immersive and unforgettable experience in just one day. Your adventure begins with a scenic drive along the Southern Expressway, arriving at the iconic Galle Fort, a UNESCO World Heritage site. Stroll along its charming cobblestone streets, admire the striking Dutch colonial architecture, and explore the ancient ramparts that provide breathtaking views of the Indian Ocean. The day continues with a tranquil boat safari on the Madu River, navigating through lush mangroves and small islands brimming with wildlife. You’ll also visit a turtle hatchery to learn about vital conservation efforts and encounter the fascinating stilt fishermen practicing their traditional craft. Perfectly balancing history, wildlife, and culture, this tour promises a rich and varied single-day escape to the serene southern coast of Sri Lanka.",
    highlights: [
      {
        title: "Galle Fort Exploration",
        description: "Enjoy a guided stroll through the historic, UNESCO-listed Dutch Fort, renowned for its remarkably preserved colonial architecture.",
        iconName: "building",
      },
      {
        title: "Madu River Boat Safari",
        description: "Glide through tranquil mangroves and tiny islands, spotting exotic birds, playful monkeys, and occasional crocodiles along the way.",
        iconName: "ship",
      },
      {
        title: "Sea Turtle Hatchery",
        description: "Discover local conservation efforts and get a close-up look at newly hatched baby turtles.",
        iconName: "egg",
      },
      {
        title: "Stilt Fishermen",
        description: "Pause for photos and witness the fascinating traditional fishing technique practiced on stilts.",
        iconName: "fish",
      },
      {
        title: "Hikkaduwa Glass-Bottom Boat Ride (Optional)",
        description: "Experience the vibrant coral reefs and colorful marine life from the comfort of a dry boat, perfect for underwater sightseeing without diving in.",
        iconName: "ship",
      },
    ],
    itinerary: [],
    tourInfo: {
      vehicle: "Private Vehicle",
      departure: "Your hotel or chosen pickup location",
      bestSeason: "Dec – Mar, Jul – Sep",
      tourType: "Private Guided Tour",
      groupSize: "No Limit",
      language: "English",
      fitnessLevel: "Easy to Moderate",
    },
    included: DAY_TOUR_INCLUDED,
    excluded: EXCLUDED,
    faqs: FAQS,
  },

  /* ------------------------------------------------------------------ */
  // SOURCE: colombo-tour.html
  {
    id: "colombo-one-day",
    type: "day-tour",
    title: "One Day Colombo City Explore Tour-History, & Modernity",
    duration: "1 Day",
    price: 150,
    originalPrice: 160,
    discountBadge: "Limited Offer",
    image: "/images/colombo.avif",
    gallery: [
    "/images/colombo-1.jpg",
    "/images/colombo-2.jpg",
    "/images/colombo-3.jpg",
    "/images/colombo-4.jpg",
    "/images/colombo-5.jpg"
  ],
    mapQuery: "Colombo Fort, Sri Lanka",
    overview: "Discover where colonial history, living temples, busy bazaars and modern landmarks meet on a full-day private tour of Colombo. Visit Gangaramaya Temple and the red-and-white Jami Ul-Alfar Mosque, dive into the vibrant chaos of Pettah Market, step into Independence Memorial Hall, stroll along Galle Face Green and finish with sweeping 360° views from the Lotus Tower.",
    highlights: [
      {
        title: "Gangaramaya Temple",
        description: "Explore one of Colombo’s most iconic Buddhist temples, known for its eclectic blend of modern and traditional architectural styles.",
        iconName: "landmark",
      },
      {
        title: "Jami Ul-Alfar Mosque (Red Mosque)",
        description: "Admire the striking red-and-white façade of this historic mosque, a true architectural gem nestled in the lively Pettah district.",
        iconName: "landmark",
      },
      {
        title: "Pettah Market",
        description: "Dive into the vibrant chaos of Colombo’s busiest marketplace, where stalls overflow with spices, textiles, gadgets, and everyday essentials.",
        iconName: "shopping-bag",
      },
      {
        title: "Independence Memorial Hall",
        description: "Step into a landmark that honors Sri Lanka’s freedom from British rule, set within a beautifully designed ceremonial hall.",
        iconName: "landmark",
      },
      {
        title: "Galle Face Green",
        description: "Enjoy a relaxed walk along Colombo’s famous seaside promenade, ideal for unwinding, people-watching, or catching a breathtaking sunset.",
        iconName: "palmtree",
      },
      {
        title: "Lotus Tower",
        description: "Take in sweeping 360° views of the city from the observation deck of Colombo’s tallest and most iconic modern structure.",
        iconName: "radio-tower",
      },
    ],
    itinerary: [],
    tourInfo: {
      vehicle: "Private Vehicle",
      departure: "Your hotel or chosen pickup location",
      bestSeason: "Dec – Mar, Jul – Sep",
      tourType: "Private Guided Tour",
      groupSize: "No Limit",
      language: "English",
      fitnessLevel: "Easy to Moderate",
    },
    included: DAY_TOUR_INCLUDED,
    excluded: EXCLUDED,
    faqs: FAQS,
  },

  /* ------------------------------------------------------------------ */
  // SOURCE: ella-tour.html
  {
    id: "ella-one-day",
    type: "day-tour",
    title: "Ella’s Best in One Day: Little Adam’s Peak, Nine Arch Bridge",
    duration: "1 Day",
    price: 150,
    originalPrice: 160,
    discountBadge: "Limited Offer",
    image: "/images/card-day.webp",
    gallery: [
    "/images/gallery/nine-arches.jpg",
    "/images/gallery/ravana-falls.jpg",
    "/images/ella-1.jpg",
    "/images/ella-2.jpg",
    "/images/gallery/hill-train.jpg"
  ],
    mapQuery: "Nine Arches Bridge, Ella, Sri Lanka",
    overview: "Discover Ella’s breathtaking landscapes and signature attractions in one unforgettable, adventure-filled day. This expertly curated tour is ideal for travelers short on time but eager to experience the heart of Sri Lanka’s hill country. Begin your journey with a stunning sunrise trek up Little Adam’s Peak, taking in panoramic views as the morning light transforms the mountains. Continue to the iconic Nine Arch Bridge, a remarkable feat of colonial-era engineering surrounded by vibrant green tea fields. Your final stop is the dramatic Ravana Falls, where you can enjoy the refreshing spray and marvel at the power of nature. With a knowledgeable guide managing every detail and sharing local stories along the way, this tour guarantees a smooth, enriching, and memorable Ella experience.",
    highlights: [
      {
        title: "Sunrise Hike to Little Adam’s Peak",
        description: "Enjoy a gentle yet rewarding climb that opens up to sweeping vistas of Ella Gap and the misty valleys below as the sun rises.",
        iconName: "footprints",
      },
      {
        title: "Nine Arch Bridge",
        description: "Experience this renowned colonial-era railway bridge framed by lush tea gardens—an unforgettable sight, especially when a train glides across it.",
        iconName: "train",
      },
      {
        title: "Ravana Falls",
        description: "Take in the powerful rush of this spectacular waterfall and uncover the fascinating folklore tied to its history.",
        iconName: "waves",
      },
      {
        title: "Tea Plantation Walk",
        description: "Wander through vibrant tea estates that shape the charm of Ella, gaining a closer look at the region’s signature hill country scenery.",
        iconName: "leaf",
      },
    ],
    itinerary: [],
    tourInfo: {
      vehicle: "Private Vehicle",
      departure: "Your hotel or chosen pickup location",
      bestSeason: "Dec – Mar, Jul – Sep",
      tourType: "Private Guided Tour",
      groupSize: "No Limit",
      language: "English",
      fitnessLevel: "Easy to Moderate",
    },
    included: DAY_TOUR_INCLUDED,
    excluded: EXCLUDED,
    faqs: FAQS,
  },

  /* ------------------------------------------------------------------ */
  // SOURCE: polonnaruwa-tour.html
  {
    id: "polonnaruwa-day-tour",
    type: "day-tour",
    title: "One Day Polonnaruwa Ancient City Tour",
    duration: "1 Day",
    price: 150,
    originalPrice: 160,
    discountBadge: "Limited Offer",
    image: "/images/gallery/polonnaruwa.jpg",
    gallery: [
    "/images/polonnaruwa-1.jpg",
    "/images/polonnaruwa-2.jpg",
    "/images/polonnaruwa-3.jpg",
    "/images/polonnaruwa-4.jpg",
    "/images/polonnaruwa-5.jpg"
  ],
    mapQuery: "Polonnaruwa Ancient City, Sri Lanka",
    overview: "Travel back through centuries on our exclusive 1-day Polonnaruwa tour, a journey into one of Sri Lanka’s most iconic UNESCO World Heritage sites and its former royal capital. Carefully crafted for history enthusiasts and curious explorers alike, this tour reveals the grandeur of an ancient kingdom through its magnificent ruins, intricate stone carvings, and sacred temples. Wander through the remarkably preserved royal complex, encounter age-old monuments, and marvel at the artistic mastery etched into stone. With an experienced guide sharing captivating legends and historical insights, you’ll gain a deeper appreciation of this celebrated archaeological treasure—all in one seamless, enriching day.",
    highlights: [
      {
        title: "Polonnaruwa Vatadage",
        description: "Discover the finely detailed stonework and elegant circular design of this ancient shrine, known for its beautifully preserved craftsmanship.",
        iconName: "landmark",
      },
      {
        title: "Gal Vihara",
        description: "Experience the awe of viewing four serene Buddha statues carved from a single granite rock—an iconic showcase of classic Sinhalese artistry.",
        iconName: "sparkles",
      },
      {
        title: "The Royal Palace",
        description: "Wander through the remnants of King Parakramabahu’s once-towering seven-story palace and imagine the scale and splendor of the old kingdom.",
        iconName: "castle",
      },
      {
        title: "The Sacred Quadrangle",
        description: "Explore this dense cluster of historic structures, home to some of the most important religious and architectural treasures in Polonnaruwa.",
        iconName: "landmark",
      },
      {
        title: "Lankathilaka Image House",
        description: "Stand before the impressive brick walls of this towering image house and its striking, headless Buddha statue.",
        iconName: "building",
      },
      {
        title: "Optional Cycling Tour",
        description: "Enjoy the freedom to roam the vast archaeological park by bicycle—an easy, scenic, and popular way to experience the ancient city at your own pace.",
        iconName: "bike",
      },
    ],
    itinerary: [],
    tourInfo: {
      vehicle: "Private Vehicle",
      departure: "Your hotel or chosen pickup location",
      bestSeason: "Dec – Mar, Jul – Sep",
      tourType: "Private Guided Tour",
      groupSize: "No Limit",
      language: "English",
      fitnessLevel: "Easy to Moderate",
    },
    included: DAY_TOUR_INCLUDED,
    excluded: EXCLUDED,
    faqs: FAQS,
  },

  /* ------------------------------------------------------------------ */
  // NEW: Bandarawela & Ella Tuk Tuk Day Tour. $25 per person, minimum 2 people.
  // One tuk tuk takes up to 3 guests; a bigger group gets extra tuk tuks automatically. Price stays per person.
  {
    id: "bandarawela-ella-tuk-tuk-day-tour",
    type: "day-tour",
    title: "Bandarawela & Ella Tuk Tuk Day Tour",
    duration: FLEXIBLE_DURATION,
    price: 25,
    originalPrice: 25,
    discountBadge: "New",
    vehicleType: "tuk-tuk",
    pricing: {
      model: "per-person",
      minTravellers: 2,
      vehicle: TUK_TUK,
      caption: "Per person, minimum 2 people",
      unit: "per person",
    },
    places: BANDARAWELA_ELLA_PLACES,
    image: "/images/Ella-tuktuk.jpg",
    gallery: [
    "/images/gallery/nine-arches.jpg",
    "/images/gallery/ravana-falls.jpg",
    "/images/ella-1.jpg",
    "/images/ella-2.jpg",
    "/images/gallery/hill-train.jpg"
  ],
    mapQuery: "Ella, Sri Lanka",
    overview:
      "Explore Bandarawela and Ella by tuk tuk on a flexible private day tour for $25 per person. Visit up to 5 places a day, with no strict end time.\n\nChoose five stops from our list of eleven favourites around Bandarawela, Ella and Demodara, from Little Adam's Peak and the Nine Arch Bridge to Rawana Falls, Dowa Rock Temple, Halpe Tea Factory and the Demodara Railway Station loop.\n\nA minimum of 2 people is needed. Each tuk tuk takes up to 3 guests, so for bigger groups we add tuk tuks automatically and you still pay $25 per person. We ask for your pickup location when you book.",
    highlights: [
      {
        title: "Open-air tuk tuk ride",
        description: "Travel the hill-country roads between Bandarawela and Ella in a classic Sri Lankan tuk tuk, with the views all around you.",
        iconName: "compass",
      },
      {
        title: "Pick any 5 places a day",
        description: "Choose five stops from our list of eleven, from Little Adam's Peak to the Demodara Railway Station loop.",
        iconName: "footprints",
      },
      {
        title: "No strict end time",
        description: "Linger at a viewpoint, wait for a train or stop for tea. The day finishes when you are ready.",
        iconName: "sunrise",
      },
      {
        title: "Groups of any size",
        description: "Up to 3 guests per tuk tuk. Travelling with 4 or more? We add tuk tuks automatically at the same $25 per person.",
        iconName: "sparkles",
      },
    ],
    itinerary: [],
    tourInfo: {
      vehicle: "Tuk Tuk",
      departure: "Your hotel or chosen pickup location",
      bestSeason: "Dec – Mar, Jul – Sep",
      tourType: "Private Tuk Tuk Tour",
      groupSize: "From 2 people, up to 3 per tuk tuk",
      language: "English",
      fitnessLevel: "Easy to Moderate",
    },
    included: DAY_TOUR_INCLUDED,
    excluded: EXCLUDED,
    faqs: bandarawelaEllaFaqs(
      `The price is $25 per person, with a minimum of 2 people. A tuk tuk takes up to ${TUK_TUK.capacity} guests, so 4 to 6 guests travel in 2 tuk tuks, 7 to 9 in 3, and so on. We add the tuk tuks automatically and you still pay $25 per person. We confirm the final price with you before anything is charged. Nothing is paid online.`
    ),
  },

  /* ------------------------------------------------------------------ */
  // NEW: Scenic Highlands Jeep Safari Tour. $70 per jeep, for a group or family.
  // One jeep takes up to 7 guests; a bigger group gets an extra jeep automatically (and a second $70).
  {
    id: "scenic-highlands-jeep-safari-tour",
    type: "day-tour",
    title: "Scenic Highlands Jeep Safari Tour",
    duration: FLEXIBLE_DURATION,
    price: 70,
    originalPrice: 70,
    discountBadge: "New",
    vehicleType: "jeep",
    pricing: {
      model: "per-vehicle",
      vehicle: JEEP,
      caption: "Per jeep, for 6 to 7 guests",
      unit: "per jeep",
    },
    places: BANDARAWELA_ELLA_PLACES,
    image: "/images/Ella-jeep.jpg",
    gallery: [
    "/images/gallery/nine-arches.jpg",
    "/images/gallery/ravana-falls.jpg",
    "/images/ella-1.jpg",
    "/images/ella-2.jpg",
    "/images/gallery/hill-train.jpg"
  ],
    mapQuery: "Ella, Sri Lanka",
    overview:
      "Private jeep tour of the highlands around Bandarawela and Ella for $70 per jeep, ideal for groups of 6 to 7. Visit up to 5 places a day, no strict end time.\n\nChoose five stops from our list of eleven favourites, from Little Adam's Peak and the Nine Arch Bridge to Rawana Falls, Dowa Rock Temple, Halpe Tea Factory and the Demodara Railway Station loop.\n\nThe whole jeep is yours. A jeep takes up to 7 guests, so for a bigger group we add another jeep automatically. We ask for your pickup location when you book.",
    highlights: [
      {
        title: "Private jeep for your group",
        description: "One jeep for a family or group of 6 to 7, so everyone travels together through the highlands.",
        iconName: "mountain",
      },
      {
        title: "$70 per jeep",
        description: "One simple price for the whole jeep. Bigger group? We add another jeep automatically: 8 to 14 guests travel in 2 jeeps.",
        iconName: "sparkles",
      },
      {
        title: "Pick any 5 places a day",
        description: "Choose five stops from our list of eleven, from Little Adam's Peak to the Demodara Railway Station loop.",
        iconName: "compass",
      },
      {
        title: "No strict end time",
        description: "Take your time at each stop. The day finishes when your group is ready.",
        iconName: "sunrise",
      },
    ],
    itinerary: [],
    tourInfo: {
      vehicle: "Jeep",
      departure: "Your hotel or chosen pickup location",
      bestSeason: "Dec – Mar, Jul – Sep",
      tourType: "Private Jeep Tour",
      groupSize: "Up to 7 per jeep",
      language: "English",
      fitnessLevel: "Easy to Moderate",
    },
    included: DAY_TOUR_INCLUDED,
    excluded: EXCLUDED,
    faqs: bandarawelaEllaFaqs(
      `The price is $70 per jeep, however many of you travel in it, and a jeep takes up to ${JEEP.capacity} guests. A group of 8 to 14 guests needs 2 jeeps ($140), 15 to 21 guests need 3 jeeps ($210), and so on. We add the jeeps automatically. We confirm the final price with you before anything is charged. Nothing is paid online.`
    ),
  },
];

export const multiDayTours = tours.filter((t) => t.type === "multi-day");
export const dayTours = tours.filter((t) => t.type === "day-tour");

export const FEATURED_TOUR_IDS = [
  "bandarawela-ella-tuk-tuk-day-tour", "scenic-highlands-jeep-safari-tour",
  "7-day-cultural-natural-wonders", "ella-one-day", "9-day-grand-tour", "galle-one-day",
] as const;

export const featuredTours: Tour[] = FEATURED_TOUR_IDS.flatMap((id) => {
  const tour = getTourBySlug(id);
  return tour ? [tour] : [];
});

const DEFAULT_PRICING: ResolvedPricing = {
  model: "per-person",
  minTravellers: 1,
  vehicle: null,
  caption: "From, per adult",
  unit: "per adult",
  travellerLabel: "Adults",
};

/** Pricing with defaults applied. Tours that do not set `pricing` keep the classic per-adult behaviour. */
export function getTourPricing(tour: Pick<Tour, "pricing">): ResolvedPricing {
  const p = tour.pricing;
  if (!p) return DEFAULT_PRICING;
  return {
    model: p.model,
    minTravellers: p.minTravellers ?? 1,
    vehicle: p.vehicle ?? null,
    caption: p.caption,
    unit: p.unit,
    travellerLabel: "Guests",
  };
}

/** True when the crossed-out price should be shown. */
export function hasDiscount(tour: Pick<Tour, "price" | "originalPrice">): boolean {
  return tour.originalPrice > tour.price;
}

export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find((t) => t.id === slug);
}

export function isDayTour(tour: Pick<Tour, "type">): boolean {
  return tour.type === "day-tour";
}

export function formatUSD(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

/** Removes the **bold** markers used in overview and itinerary text. */
export function stripMarkup(text: string): string {
  return text.replace(/\*\*/g, "");
}

/**
 * A short blurb for cards and page metadata: the first overview paragraph that reads like a
 * sentence (the 4-day overview opens with a one-line subtitle, which is skipped).
 */
export function getTourSummary(tour: Pick<Tour, "overview">, maxLength = 220): string {
  const paragraphs = stripMarkup(tour.overview).split(/\n{2,}/);
  const first = paragraphs.find((p) => p.length > 60) ?? paragraphs[0] ?? "";
  if (first.length <= maxLength) return first;
  const cut = first.slice(0, maxLength);
  return `${cut.slice(0, cut.lastIndexOf(" "))}...`;
}
