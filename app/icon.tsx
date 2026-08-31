import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Simple initials placeholder — swap for a real mark later.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#171512",
          color: "#FAF8F5",
          fontFamily: "sans-serif",
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: -1,
        }}
      >
        WP
      </div>
    ),
    size,
  );
}
