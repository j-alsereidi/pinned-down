export async function fetchCountries() {
  const response = await fetch("/api/countries");
  if (!response.ok) {
    throw new Error("Failed to fetch countries from the server.");
  }

  const payload = await response.json();
  return Array.isArray(payload.countries) ? payload.countries : [];
}

export function filterCountries(countries, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  return countries
    .filter((country) => {
      const haystack = [country.name, country.officialName, country.code, country.capital]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    })
    .slice(0, 12);
}

export function getCountryByCode(countries, code) {
  return countries.find((country) => country.code === code) ?? null;
}
