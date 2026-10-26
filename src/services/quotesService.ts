export interface InspirationQuote {
  id: number;
  text: string;
  source: string;
  theme: string;
}

export const DAILY_INSPIRATIONS: InspirationQuote[] = [
  {
    id: 1,
    text: "Patience and gratitude are the two wings by which the soul elevates above worldly turmoil.",
    source: "Ancient Contemplation",
    theme: "Patience & Serenity"
  },
  {
    id: 2,
    text: "Look at the dawn: each new morning is an invitation to begin anew with a clear heart and renewed purpose.",
    source: "Celestial Wisdom",
    theme: "Renewal"
  },
  {
    id: 3,
    text: "Be like a mountain—firm in conviction, gentle to the valley below, and open to the passing clouds.",
    source: "Nature Reflection",
    theme: "Steadfastness"
  },
  {
    id: 4,
    text: "Time is not measured by the ticking clock alone, but by the presence of mindfulness within each breath.",
    source: "Mindful Living",
    theme: "Mindfulness"
  },
  {
    id: 5,
    text: "In the quiet stillness of dusk, find gratitude for the day that passed and tranquility for the night ahead.",
    source: "Twilight Musings",
    theme: "Peace"
  },
  {
    id: 6,
    text: "Kindness is a silent rhythm that softens the hardest stone and illuminates the longest path.",
    source: "Universal Wisdom",
    theme: "Compassion"
  },
  {
    id: 7,
    text: "Observe the stars in their orbits: everything moves in balanced harmony when anchored in purpose.",
    source: "Cosmic Harmony",
    theme: "Balance"
  }
];

export function getTodayInspiration(): InspirationQuote {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const index = Math.abs(dayOfYear) % DAILY_INSPIRATIONS.length;
  return DAILY_INSPIRATIONS[index];
}
