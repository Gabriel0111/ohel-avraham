import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ placeId: string }> },
) {
  const { placeId } = await params;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
          "X-Goog-FieldMask": "location,addressComponents,formattedAddress",
        },
      },
    );

    const data = await res.json();
    const components = data.addressComponents ?? [];
    const getComp = (type: string) =>
      components.find((c: { types: string[]; longText: string }) =>
        c.types.includes(type),
      )?.longText;

    return NextResponse.json({
      lat: data.location.latitude,
      lng: data.location.longitude,
      address: data.formattedAddress,
      streetNumber: getComp("street_number"),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch place data" },
      { status: 500 },
    );
  }
}
