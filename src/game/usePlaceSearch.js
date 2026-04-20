import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "./googleMaps.js";
import { normalizeGooglePlaceDetails } from "./placeDetails.js";

export function usePlaceSearch(selectedCountry, query) {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const autocompleteServiceRef = useRef(null);
  const placesServiceRef = useRef(null);
  const sessionTokenRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadServices() {
      try {
        const google = await loadGoogleMaps();
        if (cancelled) {
          return;
        }

        autocompleteServiceRef.current =
          autocompleteServiceRef.current ?? new google.maps.places.AutocompleteService();
        placesServiceRef.current =
          placesServiceRef.current ?? new google.maps.places.PlacesService(document.createElement("div"));
        sessionTokenRef.current =
          sessionTokenRef.current ?? new google.maps.places.AutocompleteSessionToken();
      } catch (serviceError) {
        if (!cancelled) {
          setError(serviceError.message || "Google Places failed to initialize.");
        }
      }
    }

    loadServices();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedCountry?.code || !query.trim() || !autocompleteServiceRef.current) {
      setPredictions([]);
      setLoading(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setLoading(true);
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: selectedCountry.code.toLowerCase() },
          sessionToken: sessionTokenRef.current,
        },
        (results, status) => {
          setLoading(false);
          if (status !== window.google.maps.places.PlacesServiceStatus.OK || !results) {
            setPredictions([]);
            return;
          }

          setPredictions(
            results.slice(0, 8).map((prediction) => ({
              id: prediction.place_id,
              placeId: prediction.place_id,
              name: prediction.structured_formatting?.main_text ?? prediction.description,
              primaryText: prediction.structured_formatting?.main_text ?? prediction.description,
              secondaryText: prediction.structured_formatting?.secondary_text ?? "",
              description: prediction.description,
            })),
          );
        },
      );
    }, 220);

    return () => window.clearTimeout(timer);
  }, [query, selectedCountry?.code]);

  const selectPrediction = async (prediction, overrideCountry = selectedCountry) => {
    if (!placesServiceRef.current) {
      throw new Error("Google Places is not ready yet.");
    }

    setLoading(true);
    setError("");

    const place = await new Promise((resolve, reject) => {
      placesServiceRef.current.getDetails(
        {
          placeId: prediction.placeId,
          fields: [
            "name",
            "formatted_address",
            "geometry",
            "photos",
            "types",
            "address_components",
            "user_ratings_total",
          ],
          sessionToken: sessionTokenRef.current,
        },
        (result, status) => {
          if (status !== window.google.maps.places.PlacesServiceStatus.OK || !result) {
            reject(new Error("Could not retrieve Google place details."));
            return;
          }

          resolve(result);
        },
      );
    });

    setLoading(false);
    sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
    setPredictions([]);
    return normalizeGooglePlaceDetails(place, overrideCountry);
  };

  return {
    predictions,
    loading,
    error,
    selectPrediction,
  };
}
