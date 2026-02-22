"use server";

import { Client } from "@googlemaps/google-maps-services-js";
import { env } from "@/lib/env";

interface AutocompleteSuggestion {
  placePrediction: {
    placeId: string;
    text: {
      text: string;
    };
  };
}

const client = new Client();

export const autocomplete = async (input: string) => {
  if (!input) return [];

  try {
    const res = await fetch(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": env.GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask":
            "suggestions.placePrediction.placeId,suggestions.placePrediction",
        },
        body: JSON.stringify({
          input,
          includedRegionCodes: ["il"],
        }),
      },
    );

    const response = await res.json();

    return (
      response.suggestions.map((item: AutocompleteSuggestion) => {
        return item.placePrediction.text.text;
      }) || []
    );
  } catch (error) {
    console.log(JSON.stringify(error));
    return [];
  }
};

export const geocodeAddress = async (
  address: string,
): Promise<{ lat: number; lng: number } | null> => {
  if (!address) return null;

  try {
    const response = await client.geocode({
      params: {
        address,
        key: env.GOOGLE_MAPS_API_KEY,
        region: "il",
      },
    });

    const result = response.data.results[0];
    if (!result) return null;

    return {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

export const getPlaceDetails = async (placeId: string) => {
  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        fields: ["formatted_address"],
        key: env.GOOGLE_MAPS_API_KEY,
      },
    });

    console.log(response);

    return response.data.result;
  } catch (error) {
    console.error("Erreur lors de la récupération des détails du lieu:", error);
    return null;
  }
};
