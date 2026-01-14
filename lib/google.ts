"use server";

import { Client } from "@googlemaps/google-maps-services-js";
import { env } from "@/lib/env";

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
      response.suggestions.map((item: unknown) => {
        return item.placePrediction.text.text;
      }) || []
    );
  } catch (error) {
    console.log(JSON.stringify(error));
    return [];
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
