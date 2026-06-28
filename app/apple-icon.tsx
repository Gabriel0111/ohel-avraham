import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "linear-gradient(135deg, #b45309 0%, #d97706 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 72,
          fontWeight: 800,
          color: "white",
          letterSpacing: -3,
          fontFamily: "sans-serif",
        }}
      >
        OA
      </div>
    ),
    { ...size },
  );
}
