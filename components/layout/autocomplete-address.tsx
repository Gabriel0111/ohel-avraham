"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Loader2, MapPin } from "lucide-react";
import { useT } from "@/lib/i18n/context";

export interface PlaceData {
  address: string;
  lat: number;
  lng: number;
}

interface PlaceSuggestion {
  placeId: string;
  text: string;
}

interface Props {
  defaultValue: string;
  onPlaceSelect: (place: PlaceData) => void;
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

async function fetchSuggestions(input: string): Promise<PlaceSuggestion[]> {
  if (!input.trim()) return [];
  try {
    const res = await fetch(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": API_KEY,
          "X-Goog-FieldMask":
            "suggestions.placePrediction.placeId,suggestions.placePrediction.text",
        },
        body: JSON.stringify({ input, includedRegionCodes: ["il"] }),
      },
    );
    const data = await res.json();
    return (
      data.suggestions?.map(
        (item: {
          placePrediction: { placeId: string; text: { text: string } };
        }) => ({
          placeId: item.placePrediction.placeId,
          text: item.placePrediction.text.text,
        }),
      ) ?? []
    );
  } catch {
    return [];
  }
}

async function fetchPlaceDetails(placeId: string): Promise<{
  address: string;
  lat: number;
  lng: number;
  streetNumber?: string;
}> {
  const res = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "location,addressComponents,formattedAddress",
      },
    },
  );
  const data = await res.json();
  const components: { types: string[]; longText: string }[] =
    data.addressComponents ?? [];
  const getComp = (type: string) =>
    components.find((c) => c.types.includes(type))?.longText;

  return {
    lat: data.location.latitude,
    lng: data.location.longitude,
    address: data.formattedAddress,
    streetNumber: getComp("street_number"),
  };
}

const AutocompleteAddress = ({ defaultValue, onPlaceSelect }: Props) => {
  const { t } = useT();
  const [predictions, setPredictions] = useState<PlaceSuggestion[]>([]);
  const [text, setText] = useState(defaultValue);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPredictions = useDebouncedCallback(async (value: string) => {
    const results = await fetchSuggestions(value);
    setPredictions(results);
  }, 350);

  const handleValueChange = (value: string) => {
    setText(value);
    setError(null);
    setResultsOpen(value.trim() !== "");
    fetchPredictions(value);
  };

  const handleSelectPlace = async (placeId: string, placeText: string) => {
    setText(placeText);
    setResultsOpen(false);
    setError(null);
    setIsLoading(true);

    try {
      const data = await fetchPlaceDetails(placeId);
      if (!data.streetNumber) {
        setError(t.address.streetNumberRequired);
        return;
      }
      onPlaceSelect({ address: data.address, lat: data.lat, lng: data.lng });
    } catch {
      setError(t.address.fetchError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <Command
        className="rounded-lg border border-input bg-background dark:bg-input/30"
        shouldFilter={false}
      >
        <CommandInput
          placeholder={t.address.searchPlaceholder}
          value={text}
          onValueChange={handleValueChange}
        />
        {resultsOpen && (
          <CommandList>
            <CommandEmpty className="py-3 text-center text-xs text-muted-foreground">
              {t.address.selectFromList}
            </CommandEmpty>
            <CommandGroup>
              {predictions.map((item) => (
                <CommandItem
                  key={item.placeId}
                  value={item.placeId}
                  onSelect={() => handleSelectPlace(item.placeId, item.text)}
                  className="flex items-center gap-2 text-sm"
                >
                  <MapPin className="size-3.5 text-muted-foreground shrink-0" />
                  {item.text}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>

      {isLoading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-3 animate-spin" />
          {t.address.loading}
        </div>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default AutocompleteAddress;
