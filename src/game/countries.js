export async function fetchCountries() {
  const response = await fetch("/api/countries");
  if (!response.ok) {
    throw new Error("Failed to fetch countries from the server.");
  }

  const payload = await response.json();
  return Array.isArray(payload.countries) ? payload.countries : [];
}

function escapeForRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getCountryMatchRank(country, normalizedQuery) {
  const normalizedName = country.name?.toLowerCase() ?? "";
  const normalizedCode = country.code?.toLowerCase() ?? "";

  if (!normalizedName && !normalizedCode) {
    return Number.POSITIVE_INFINITY;
  }

  if (normalizedCode === normalizedQuery || normalizedName === normalizedQuery) {
    return 0;
  }

  if (normalizedName.startsWith(normalizedQuery)) {
    return 1;
  }

  const wordBoundaryPattern = new RegExp(`\\b${escapeForRegex(normalizedQuery)}`);
  if (wordBoundaryPattern.test(normalizedName)) {
    return 2;
  }

  if (normalizedName.includes(normalizedQuery) || normalizedCode.includes(normalizedQuery)) {
    return 3;
  }

  return Number.POSITIVE_INFINITY;
}

export function filterCountries(countries, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  return countries
    .map((country) => ({
      country,
      rank: getCountryMatchRank(country, normalized),
    }))
    .filter(({ rank }) => Number.isFinite(rank))
    .sort((left, right) => {
      if (left.rank !== right.rank) {
        return left.rank - right.rank;
      }

      return left.country.name.localeCompare(right.country.name);
    })
    .map(({ country }) => country)
    .slice(0, 12);
}

export function getCountryByCode(countries, code) {
  return countries.find((country) => country.code === code) ?? null;
}
