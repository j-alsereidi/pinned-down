function getAddressComponent(place, type) {
  return place.address_components?.find((component) => component.types?.includes(type)) ?? null;
}

export function normalizeGooglePlaceDetails(place, selectedCountry = null) {
  const location = place.geometry?.location;
  if (!location) {
    return null;
  }

  const countryComponent = getAddressComponent(place, "country");
  const localityComponent =
    getAddressComponent(place, "locality") ??
    getAddressComponent(place, "postal_town") ??
    getAddressComponent(place, "administrative_area_level_2") ??
    getAddressComponent(place, "administrative_area_level_1");

  const countryCode = countryComponent?.short_name ?? selectedCountry?.code ?? "";
  if (!countryCode || (selectedCountry?.code && countryCode !== selectedCountry.code)) {
    return null;
  }

  return {
    placeId: place.place_id,
    name: place.name ?? place.formatted_address,
    formattedAddress: place.formatted_address ?? "",
    lat: location.lat(),
    lng: location.lng(),
    city: localityComponent?.long_name ?? selectedCountry?.capital ?? "",
    previewImage: place.photos?.[0]?.getUrl({ maxWidth: 900, maxHeight: 500 }) ?? "",
    types: place.types ?? [],
    countryCode,
    countryName: selectedCountry?.name ?? countryComponent?.long_name ?? "",
  };
}
