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
import { autocomplete } from "@/lib/google";
import { useDebouncedCallback } from "use-debounce";

interface Props {
  defaultValue: string;
  onValueChange: (value: string) => void;
}

const Autocomplete = ({ defaultValue, onValueChange }: Props) => {
  const [predictions, setPredictions] = useState<string[]>([]);
  const [text, setText] = useState(defaultValue);
  const [resultsOpen, setResultsOpen] = useState(false);

  const debouncedFetchPredictions = useDebouncedCallback(
    async (value: string) => {
      const predictions = await autocomplete(value);
      setPredictions(predictions || []);
    },
    300,
  );

  useEffect(() => {
    debouncedFetchPredictions(text);
  }, [text, debouncedFetchPredictions]);

  const handleSelectedPlace = (place: string) => {
    setText(place);
    onValueChange(place);
    setResultsOpen(false);
  };

  const handleValueChange = (text: string) => {
    setText(text);
    setResultsOpen(text !== "");
  };

  return (
    <Command className="rounded-lg border-border border" shouldFilter={false}>
      <CommandInput
        placeholder="Search for an address..."
        value={text}
        onValueChange={handleValueChange}
      />
      <CommandList hidden={!resultsOpen}>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          {predictions.map((item) => (
            <CommandItem key={item} onSelect={() => handleSelectedPlace(item)}>
              {item}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default Autocomplete;
