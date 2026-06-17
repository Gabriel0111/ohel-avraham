import { NextRequest, NextResponse } from "next/server";

interface AutocompleteSuggestion {
  placePrediction: {
    placeId: string;
    text: { text: string };
  };
}

export async function POST(req: NextRequest) {
  const { input } = await req.json();

  if (!input?.trim()) return NextResponse.json([]);

  try {
    const res = await fetch(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
          "X-Goog-FieldMask":
            "suggestions.placePrediction.placeId,suggestions.placePrediction.text",
        },
        body: JSON.stringify({ input, includedRegionCodes: ["il"] }),
      },
    );

    const data = await res.json();

    return NextResponse.json(
      data.suggestions?.map((item: AutocompleteSuggestion) => ({
        placeId: item.placePrediction.placeId,
        text: item.placePrediction.text.text,
      })) ?? [],
    );
  } catch {
    return NextResponse.json([]);
  }
}
