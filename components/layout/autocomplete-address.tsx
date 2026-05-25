"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useRef, useState } from "react";
import {
  autocomplete,
  getFullPlaceData,
  type PlaceSuggestion,
} from "@/lib/google";
import { useDebouncedCallback } from "use-debounce";
import { Loader2 } from "lucide-react";
import { useT } from "@/lib/i18n/context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface PlaceData {
  address: string;
  lat: number;
  lng: number;
}

interface Props {
  defaultValue: string;
  onPlaceSelect: (place: PlaceData) => void;
}

type PartialPlace = {
  address: string;
  lat: number;
  lng: number;
};

const AutocompleteAddress = ({ defaultValue, onPlaceSelect }: Props) => {
  const { t } = useT();
  const [predictions, setPredictions] = useState<PlaceSuggestion[]>([]);
  const [text, setText] = useState(defaultValue);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partialPlace, setPartialPlace] = useState<PartialPlace | null>(null);
  const [streetNumber, setStreetNumber] = useState("");
  const streetNumberInputRef = useRef<HTMLInputElement>(null);

  const debouncedFetchPredictions = useDebouncedCallback(
    async (value: string) => {
      const results = await autocomplete(value);
      setPredictions(results || []);
    },
    800,
  );

  useEffect(() => {
    if (!partialPlace) {
      debouncedFetchPredictions(text);
    }
  }, [text, debouncedFetchPredictions, partialPlace]);

  useEffect(() => {
    if (partialPlace) {
      streetNumberInputRef.current?.focus();
    }
  }, [partialPlace]);

  const handleSelectedPlace = async (placeId: string, placeText: string) => {
    setText(placeText);
    setResultsOpen(false);
    setError(null);
    setIsLoading(true);

    try {
      const data = await getFullPlaceData(placeId);
      if (!data.streetNumber) {
        setPartialPlace({ address: data.address, lat: data.lat, lng: data.lng });
        setStreetNumber("");
      } else {
        onPlaceSelect({ address: data.address, lat: data.lat, lng: data.lng });
      }
    } catch {
      setError(t.address.fetchError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmStreetNumber = () => {
    if (!partialPlace || !streetNumber.trim()) return;
    const fullAddress = `${streetNumber.trim()} ${partialPlace.address}`;
    onPlaceSelect({ address: fullAddress, lat: partialPlace.lat, lng: partialPlace.lng });
    setText(fullAddress);
    setPartialPlace(null);
    setStreetNumber("");
  };

  const handleValueChange = (value: string) => {
    setText(value);
    setError(null);
    setPartialPlace(null);
    setResultsOpen(value !== "");
  };

  return (
    <div className="space-y-2">
      <Command className="rounded-lg border-border border" shouldFilter={false}>
        <CommandInput
          placeholder={t.address.searchPlaceholder}
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
          {t.address.loading}
        </div>
      )}
      {partialPlace && (
        <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">{t.address.streetNumberHint}</p>
          <div className="flex gap-2">
            <Input
              ref={streetNumberInputRef}
              type="text"
              placeholder={t.address.streetNumberPlaceholder}
              value={streetNumber}
              onChange={(e) => setStreetNumber(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleConfirmStreetNumber();
                }
              }}
              className="h-8 w-28"
            />
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmStreetNumber}
              disabled={!streetNumber.trim()}
            >
              {t.address.streetNumberConfirm}
            </Button>
          </div>
        </div>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default AutocompleteAddress;
