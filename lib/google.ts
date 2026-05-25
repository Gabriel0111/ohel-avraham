"use server";

import { Client } from "@googlemaps/google-maps-services-js";
import { env } from "@/lib/env";

const client = new Client();

export interface PlaceSuggestion {
  placeId: string;
  text: string;
}

export const autocomplete = async (input: string): Promise<PlaceSuggestion[]> => {
  if (!input) return [];

  try {
    const response = await client.placeAutocomplete({
      params: {
        input,
        key: env.GOOGLE_MAPS_API_KEY,
        components: ["country:il"],
      },
    });

    return response.data.predictions.map((p) => ({
      placeId: p.place_id,
      text: p.description,
    }));
  } catch (error) {
    console.error("Autocomplete error:", error);
    return [];
  }
};

export const getFullPlaceData = async (placeId: string) => {
  const response = await client.placeDetails({
    params: {
      place_id: placeId,
      fields: ["geometry", "formatted_address", "address_components"],
      key: env.GOOGLE_MAPS_API_KEY,
    },
  });

  const result = response.data.result;
  const components = result.address_components ?? [];
  const getComp = (type: string) =>
    components.find((c) => (c.types as string[]).includes(type))?.long_name;

  return {
    lat: result.geometry!.location.lat as number,
    lng: result.geometry!.location.lng as number,
    address: result.formatted_address!,
    neighborhood: getComp("neighborhood") ?? getComp("sublocality_level_1"),
    streetNumber: getComp("street_number"),
  };
};
