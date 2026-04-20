export const LOCATIONS = Object.freeze([
  {
    id: "tokyo-gyoen",
    country: "Japan",
    city: "Tokyo",
    venue: "Shinjuku Gyoen National Garden",
    lat: 35.6852,
    lng: 139.71,
    difficulty: "Medium",
    searchTokens: ["japan", "tokyo", "garden", "shinjuku", "park"],
    previewImage: "/assets/locations/tokyo-gyoen.svg",
    mapViewport: { x: 78, y: 36, scale: 2.25 },
    hotspot: { x: 79, y: 39 },
    hints: [
      { id: "tokyo-1", title: "Transit Grid", text: "Dense rail lines wrap a megacity that never really sleeps." },
      { id: "tokyo-2", title: "Seasonal Signal", text: "Cherry blossom season turns this hiding spot into a tactical crowd shield." },
      { id: "tokyo-3", title: "Garden Intel", text: "The venue is a national garden, not a downtown intersection." },
      { id: "tokyo-4", title: "Pacific Edge", text: "The target country sits on an island chain in East Asia." },
    ],
  },
  {
    id: "kingston-harbour",
    country: "Jamaica",
    city: "Kingston",
    venue: "Harbourfront District",
    lat: 18.0179,
    lng: -76.8099,
    difficulty: "Hard",
    searchTokens: ["jamaica", "kingston", "harbour", "caribbean", "coast"],
    previewImage: "/assets/locations/kingston-harbour.svg",
    mapViewport: { x: 26, y: 47, scale: 2.15 },
    hotspot: { x: 25, y: 48 },
    hints: [
      { id: "kingston-1", title: "Island Drift", text: "This trail runs through warm Caribbean waters instead of a mainland coast." },
      { id: "kingston-2", title: "Harbour Echo", text: "Cargo traffic and harbor views are more useful here than mountain skylines." },
      { id: "kingston-3", title: "Capital Trace", text: "The target country capital is also its largest city." },
      { id: "kingston-4", title: "Reggae Static", text: "The nation is famous for reggae, sprinting legends, and green-gold-black colors." },
    ],
  },
  {
    id: "amman-citadel",
    country: "Jordan",
    city: "Amman",
    venue: "Citadel Overlook",
    lat: 31.9539,
    lng: 35.9106,
    difficulty: "Medium",
    searchTokens: ["jordan", "amman", "citadel", "desert", "historic"],
    previewImage: "/assets/locations/amman-citadel.svg",
    mapViewport: { x: 58, y: 42, scale: 2.05 },
    hotspot: { x: 58, y: 42 },
    hints: [
      { id: "amman-1", title: "Stone Signal", text: "The hider is tucked into a city where ancient ruins look down over the streets." },
      { id: "amman-2", title: "Regional Heat", text: "This country borders Saudi Arabia and sits east of the Mediterranean." },
      { id: "amman-3", title: "Historic Crossing", text: "It is part of the Levant, not the Gulf coast." },
      { id: "amman-4", title: "Desert Crown", text: "Petra and Wadi Rum point to the same national flag." },
    ],
  },
  {
    id: "baku-old-city",
    country: "Azerbaijan",
    city: "Baku",
    venue: "Old City District",
    lat: 40.4093,
    lng: 49.8671,
    difficulty: "Hard",
    searchTokens: ["azerbaijan", "baku", "caspian", "old city", "flame"],
    previewImage: "/assets/locations/baku-old-city.svg",
    mapViewport: { x: 62, y: 35, scale: 2.2 },
    hotspot: { x: 62, y: 37 },
    hints: [
      { id: "baku-1", title: "Sea Without Ocean", text: "The coast here touches an inland sea, not the Atlantic or Pacific." },
      { id: "baku-2", title: "Oil Trail", text: "Energy infrastructure and flame imagery point the recon team east of the Caucasus." },
      { id: "baku-3", title: "Walled Core", text: "The venue is the old walled city inside the capital." },
      { id: "baku-4", title: "Caspian Marker", text: "The target country borders the Caspian Sea." },
    ],
  },
  {
    id: "cape-town-point",
    country: "South Africa",
    city: "Cape Town",
    venue: "Signal Hill Lookout",
    lat: -33.9249,
    lng: 18.4241,
    difficulty: "Medium",
    searchTokens: ["south africa", "cape town", "signal hill", "table mountain", "coast"],
    previewImage: "/assets/locations/cape-town-point.svg",
    mapViewport: { x: 54, y: 76, scale: 2.3 },
    hotspot: { x: 54, y: 73 },
    hints: [
      { id: "capetown-1", title: "Southern Sweep", text: "Your rival went well below the equator for this turn." },
      { id: "capetown-2", title: "Twin Oceans", text: "Atlantic and Indian currents both matter to this country." },
      { id: "capetown-3", title: "Mountain Silhouette", text: "The city skyline is dominated by a famously flat-topped mountain." },
      { id: "capetown-4", title: "Rainbow Trace", text: "The target country has eleven official languages." },
    ],
  },
  {
    id: "sydney-harbour",
    country: "Australia",
    city: "Sydney",
    venue: "Harbour Edge",
    lat: -33.8688,
    lng: 151.2093,
    difficulty: "Easy",
    searchTokens: ["australia", "sydney", "harbour", "opera", "pacific"],
    previewImage: "/assets/locations/sydney-harbour.svg",
    mapViewport: { x: 83, y: 74, scale: 2.15 },
    hotspot: { x: 84, y: 72 },
    hints: [
      { id: "sydney-1", title: "Harbour Arc", text: "A landmark harbor bridge narrows the search grid." },
      { id: "sydney-2", title: "Southern Island-Continent", text: "The target country is also a continent." },
      { id: "sydney-3", title: "Opera Echo", text: "A sail-shaped performing arts icon is nearby." },
      { id: "sydney-4", title: "Pacific Rim", text: "The hider is operating in Oceania." },
    ],
  },
]);

export const COUNTRY_OPTIONS = Object.freeze(
  [...new Set(LOCATIONS.map((location) => location.country))].sort(),
);

export function getLocationById(locationId) {
  return LOCATIONS.find((location) => location.id === locationId) ?? null;
}

export function getCountryLocation(country) {
  return LOCATIONS.find((location) => location.country === country) ?? null;
}

export function searchLocations(query) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return [...LOCATIONS];
  }

  return LOCATIONS.filter((location) => {
    const haystack = [
      location.country,
      location.city,
      location.venue,
      ...location.searchTokens,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
