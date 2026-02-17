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

/*
[
    {
        "placePrediction": {
            "place": "places/ChIJVwKfXrzXAhUR6wyR-2Wgv4Y",
            "placeId": "ChIJVwKfXrzXAhUR6wyR-2Wgv4Y",
            "text": {
                "text": "Bayit VeGan, Jerusalem, Israel",
                "matches": [
                    {
                        "endOffset": 5
                    }
                ]
            },
            "structuredFormat": {
                "mainText": {
                    "text": "Bayit VeGan",
                    "matches": [
                        {
                            "endOffset": 5
                        }
                    ]
                },
                "secondaryText": {
                    "text": "Jerusalem, Israel"
                }
            },
            "types": [
                "neighborhood",
                "geocode",
                "political"
            ]
        }
    },
    {
        "placePrediction": {
            "place": "places/ChIJyy9wspshHBURqrw8M1aHfdQ",
            "placeId": "ChIJyy9wspshHBURqrw8M1aHfdQ",
            "text": {
                "text": "Bayit Bagalil by Herbert Samuel, Hatzor HaGlilit, Israel",
                "matches": [
                    {
                        "endOffset": 5
                    }
                ]
            },
            "structuredFormat": {
                "mainText": {
                    "text": "Bayit Bagalil by Herbert Samuel",
                    "matches": [
                        {
                            "endOffset": 5
                        }
                    ]
                },
                "secondaryText": {
                    "text": "Hatzor HaGlilit, Israel"
                }
            },
            "types": [
                "lodging",
                "establishment",
                "point_of_interest",
                "spa",
                "hotel"
            ]
        }
    },
    {
        "placePrediction": {
            "place": "places/EiRCYXlpdCB2YS1HYW4gU3RyZWV0LCBCYXQgWWFtLCBJc3JhZWwiLiosChQKEgmDqbi2QLMCFRFvTtFz5TrgyxIUChIJi7MrQRKzAhURMpxIzGUalrI",
            "placeId": "EiRCYXlpdCB2YS1HYW4gU3RyZWV0LCBCYXQgWWFtLCBJc3JhZWwiLiosChQKEgmDqbi2QLMCFRFvTtFz5TrgyxIUChIJi7MrQRKzAhURMpxIzGUalrI",
            "text": {
                "text": "Bayit va-Gan Street, Bat Yam, Israel",
                "matches": [
                    {
                        "endOffset": 5
                    }
                ]
            },
            "structuredFormat": {
                "mainText": {
                    "text": "Bayit va-Gan Street",
                    "matches": [
                        {
                            "endOffset": 5
                        }
                    ]
                },
                "secondaryText": {
                    "text": "Bat Yam, Israel"
                }
            },
            "types": [
                "route",
                "geocode"
            ]
        }
    },
    {
        "placePrediction": {
            "place": "places/EiBCYXlpdCB2YS1HYW4gU3QsIE5ldGl2b3QsIElzcmFlbCIuKiwKFAoSCadTrNN6fgIVEaPWJKHLv-HFEhQKEgkr6oXYdX4CFRFquoKU2d1eng",
            "placeId": "EiBCYXlpdCB2YS1HYW4gU3QsIE5ldGl2b3QsIElzcmFlbCIuKiwKFAoSCadTrNN6fgIVEaPWJKHLv-HFEhQKEgkr6oXYdX4CFRFquoKU2d1eng",
            "text": {
                "text": "Bayit va-Gan St, Netivot, Israel",
                "matches": [
                    {
                        "endOffset": 5
                    }
                ]
            },
            "structuredFormat": {
                "mainText": {
                    "text": "Bayit va-Gan St",
                    "matches": [
                        {
                            "endOffset": 5
                        }
                    ]
                },
                "secondaryText": {
                    "text": "Netivot, Israel"
                }
            },
            "types": [
                "geocode",
                "route"
            ]
        }
    },
    {
        "placePrediction": {
            "place": "places/EiVCYXlpdCBWYWdhbiBTdHJlZXQsIEplcnVzYWxlbSwgSXNyYWVsIi4qLAoUChIJKxUXXLzXAhUR84XwTFIbb-0SFAoSCUv8wTTW1wIVEcvhbkU-Ym_Z",
            "placeId": "EiVCYXlpdCBWYWdhbiBTdHJlZXQsIEplcnVzYWxlbSwgSXNyYWVsIi4qLAoUChIJKxUXXLzXAhUR84XwTFIbb-0SFAoSCUv8wTTW1wIVEcvhbkU-Ym_Z",
            "text": {
                "text": "Bayit Vagan Street, Jerusalem, Israel",
                "matches": [
                    {
                        "endOffset": 5
                    }
                ]
            },
            "structuredFormat": {
                "mainText": {
                    "text": "Bayit Vagan Street",
                    "matches": [
                        {
                            "endOffset": 5
                        }
                    ]
                },
                "secondaryText": {
                    "text": "Jerusalem, Israel"
                }
            },
            "types": [
                "geocode",
                "route"
            ]
        }
    }
]
 */

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
