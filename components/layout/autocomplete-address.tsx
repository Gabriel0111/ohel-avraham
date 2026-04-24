"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import {
  autocomplete,
  getFullPlaceData,
  type PlaceSuggestion,
} from "@/lib/google";
import { useDebouncedCallback } from "use-debounce";
import { Loader2 } from "lucide-react";

export interface PlaceData {
  address: string;
  lat: number;
  lng: number;
}

interface Props {
  defaultValue: string;
  onPlaceSelect: (place: PlaceData) => void;
}

const AutocompleteAddress = ({ defaultValue, onPlaceSelect }: Props) => {
  const [predictions, setPredictions] = useState<PlaceSuggestion[]>([]);
  const [text, setText] = useState(defaultValue);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedFetchPredictions = useDebouncedCallback(
    async (value: string) => {
      const results = await autocomplete(value);
      setPredictions(results || []);
    },
    800,
  );

  useEffect(() => {
    debouncedFetchPredictions(text);
  }, [text, debouncedFetchPredictions]);

  const handleSelectedPlace = async (placeId: string, placeText: string) => {
    setText(placeText);
    setResultsOpen(false);
    setError(null);
    setIsLoading(true);

    try {
      const data = await getFullPlaceData(placeId);
      if (!data.streetNumber) {
        setError("Please select an address that includes a street number.");
        return;
      }
      onPlaceSelect({ address: data.address, lat: data.lat, lng: data.lng });
    } catch {
      setError("Failed to fetch address details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleValueChange = (value: string) => {
    setText(value);
    setError(null);
    setResultsOpen(value !== "");
  };

  return (
    <div className="space-y-1">
      <Command className="rounded-lg border-border border" shouldFilter={false}>
        <CommandInput
          placeholder="Search for an address with street number..."
          value={text}
          onValueChange={handleValueChange}
        />
        <CommandList hidden={!resultsOpen}>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {predictions.map((item) => (
              <CommandItem
                key={item.placeId}
                onSelect={() => handleSelectedPlace(item.placeId, item.text)}
              >
                {item.text}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
      {isLoading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-3 animate-spin" />
          Loading address details...
        </div>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default AutocompleteAddress;
