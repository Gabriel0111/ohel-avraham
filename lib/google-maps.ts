// Google Maps API type definitions
declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
    }

    interface MapOptions {
      center?: LatLng;
      zoom?: number;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    namespace places {
      class AutocompleteService {
        getPlacePredictions(
          request: AutocompletionRequest,
          callback: (
            predictions: AutocompletePrediction[] | null,
            status: PlacesServiceStatus,
          ) => void,
        ): void;
      }

      class PlacesService {
        constructor(attrContainer: Map | HTMLDivElement);
        getDetails(
          request: PlaceDetailsRequest,
          callback: (
            place: PlaceResult | null,
            status: PlacesServiceStatus,
          ) => void,
        ): void;
      }

      interface AutocompletionRequest {
        input: string;
        types?: string[];
      }

      interface AutocompletePrediction {
        place_id: string;
        description: string;
        structured_formatting: {
          main_text: string;
          secondary_text: string;
        };
      }

      interface PlaceDetailsRequest {
        placeId: string;
        fields: string[];
      }

      interface PlaceResult {
        place_id?: string;
        name?: string;
        formatted_address?: string;
        geometry?: {
          location: LatLng;
        };
        types?: string[];
      }

      enum PlacesServiceStatus {
        OK = "OK",
        ZERO_RESULTS = "ZERO_RESULTS",
        OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
        REQUEST_DENIED = "REQUEST_DENIED",
        INVALID_REQUEST = "INVALID_REQUEST",
        NOT_FOUND = "NOT_FOUND",
        UNKNOWN_ERROR = "UNKNOWN_ERROR",
      }
    }
  }
}

export {};
