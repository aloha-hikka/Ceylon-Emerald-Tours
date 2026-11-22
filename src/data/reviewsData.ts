export interface Review {
  id: string;
  name: string;
  country: string;
  /** 1 to 5. Only 5 is shown publicly. */
  rating: number;
  text: string;
  /** Optional, ISO date (YYYY-MM-DD). */
  date?: string;
}

export const REVIEWS: Review[] = [
  {
    id: "cet-rv-a53v",
    name: "Roshan D",
    country: "India",
    rating: 5,
    text: "I had a great time with Ceylond Emerald Tours\nThe company arranged a Yala safari tour on a day's notice.\nThe safari driver/guide were amazing and we had an amazing 6-hour safari where we saw a leopard and zebras.",
    date: "2026-11-18",
  },
  {
    id: "sample-2",
    name: "Guest name",
    country: "Country",
    rating: 5,
    text: "Sample review. Replace this with a real guest review about planning the trip over WhatsApp.",
  },
  {
    id: "sample-3",
    name: "Guest name",
    country: "Country",
    rating: 5,
    text: "Sample review. Replace this with a real guest review about an airport transfer or a day tour.",
  },
  {
    id: "sample-4",
    name: "Guest name",
    country: "Country",
    rating: 5,
    text: "Sample review. Replace this with a real guest review about the hill-country train ride or the tea estates.",
  },
  {
    id: "sample-5",
    name: "Guest name",
    country: "Country",
    rating: 5,
    text: "Sample review. Replace this with a real guest review about a safari, a cultural site or the south coast.",
  },
  {
    id: "sample-6",
    name: "Guest name",
    country: "Country",
    rating: 5,
    text: "Sample review. Replace this with a real guest review about a multi-day tour and the people who planned it.",
  },
];

/** Everything the public showcase displays: all 5-star reviews, nothing else. */
export const FIVE_STAR_REVIEWS: Review[] = REVIEWS.filter((r) => r.rating === 5);
