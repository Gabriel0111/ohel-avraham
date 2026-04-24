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

// const client = new Client();

export interface PlaceSuggestion {
  placeId: string;
  text: string;
}

export const autocomplete = async (input: string): Promise<PlaceSuggestion[]> => {
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
            "suggestions.placePrediction.placeId,suggestions.placePrediction.text",
        },
        body: JSON.stringify({
          input,
          includedRegionCodes: ["il"],
        }),
      },
    );

    const response = await res.json();

    return (
      response.suggestions?.map((item: AutocompleteSuggestion) => ({
        placeId: item.placePrediction.placeId,
        text: item.placePrediction.text.text,
      })) || []
    );
  } catch (error) {
    console.log(JSON.stringify(error));
    return [];
  }
};

export const getFullPlaceData = async (placeId: string) => {
  const res = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": env.GOOGLE_MAPS_API_KEY,
        // On demande : Coordonnées, Adresse complète, et les composants détaillés (quartier, numéro)
        "X-Goog-FieldMask": "location,addressComponents,formattedAddress",
      },
    },
  );

  const data = await res.json();

  // Extraction intelligente des composants
  const components = data.addressComponents;
  const getComp = (type: string) =>
    components.find((c: any) => c.types.includes(type))?.longText;

  return {
    lat: data.location.latitude,
    lng: data.location.longitude,
    address: data.formattedAddress,
    neighborhood: getComp("neighborhood") || getComp("sublocality_level_1"), // Le quartier
    streetNumber: getComp("street_number"), // Le numéro de rue
  };
};

export const extractPlaceData = async (googleResponse: any) => {
  const components = googleResponse.addressComponents || [];

  console.log(googleResponse);

  // Fonction utilitaire pour chercher dans les types
  const getComponent = (type: string) =>
    components.find((c: any) => c.types.includes(type))?.longText;

  return {
    address: googleResponse.formattedAddress,
    lat: googleResponse.location.latitude,
    lng: googleResponse.location.longitude,
    // On essaie neighborhood, sinon sublocality (quartier en Israël)
    neighborhood:
      getComponent("neighborhood") || getComponent("sublocality_level_1") || "",
    streetNumber: getComponent("street_number") || "",
    city: getComponent("locality") || "",
  };
};

// export const geocodeAddress = async (
//   address: string,
// ): Promise<{ lat: number; lng: number } | null> => {
//   if (!address) return null;
//
//   try {
//     const response = await client.geocode({
//       params: {
//         address,
//         key: env.GOOGLE_MAPS_API_KEY,
//         region: "il",
//       },
//     });
//
//     const result = response.data.results[0];
//     if (!result) return null;
//
//     return {
//       lat: result.geometry.location.lat,
//       lng: result.geometry.location.lng,
//     };
//   } catch (error) {
//     console.error("Geocoding error:", error);
//     return null;
//   }
// };
//
// export const getPlaceDetails = async (placeId: string) => {
//   try {
//     const response = await client.placeDetails({
//       params: {
//         place_id: placeId,
//         fields: ["formatted_address"],
//         key: env.GOOGLE_MAPS_API_KEY,
//       },
//     });
//
//     console.log(response);
//
//     return response.data.result;
//   } catch (error) {
//     console.error("Erreur lors de la récupération des détails du lieu:", error);
//     return null;
//   }
// };
