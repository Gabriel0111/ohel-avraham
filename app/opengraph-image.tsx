import { ImageResponse } from "next/og";
import { translations } from "@/lib/i18n/translations";

// Shared by the OG and Twitter cards. Static and English: link previews are
// rendered by the crawler, which carries no language cookie.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = translations.en.seo.ogAlt;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0C0A09",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        {/* Warm bloom, echoing the amber mark */}
        <div
          style={{
            position: "absolute",
            top: -260,
            right: -180,
            width: 720,
            height: 720,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(217,119,6,0.38) 0%, rgba(180,83,9,0) 70%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #b45309 0%, #d97706 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 800,
              color: "white",
              letterSpacing: -1,
            }}
          >
            OA
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: "#FAFAF9",
              letterSpacing: -0.5,
            }}
          >
            Ohel Avraham
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              color: "#FAFAF9",
              letterSpacing: -2.5,
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            A table for Shabbat, anywhere in Israel.
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#A8A29E",
              lineHeight: 1.4,
              maxWidth: 860,
            }}
          >
            Hosts and guests, matched by region, community and level of kashrut.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 24,
            color: "#D97706",
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 9999,
              background: "#D97706",
            }}
          />
          ohel-avraham.com
        </div>
      </div>
    ),
    { ...size },
  );
}
