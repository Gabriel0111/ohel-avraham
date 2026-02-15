import { geocodeAddress } from "@/lib/google";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { addresses } = await request.json();

    if (!Array.isArray(addresses) || addresses.length === 0) {
      return NextResponse.json(
        { error: "addresses must be a non-empty array" },
        { status: 400 },
      );
    }

    // Limit to 25 addresses per request
    const limited = addresses.slice(0, 25);

    const results = await Promise.all(
      limited.map(async (address: string) => {
        const coords = await geocodeAddress(address);
        return { address, coords };
      }),
    );

    const coordsMap: Record<string, { lat: number; lng: number } | null> = {};
    for (const r of results) {
      coordsMap[r.address] = r.coords;
    }

    return NextResponse.json(coordsMap);
  } catch {
    return NextResponse.json(
      { error: "Failed to geocode addresses" },
      { status: 500 },
    );
  }
}
