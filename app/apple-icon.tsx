import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Simple initials placeholder — swap for a real mark later.
export default function AppleIcon() {
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
          fontSize: 84,
          fontWeight: 600,
          letterSpacing: -4,
        }}
      >
        WP
      </div>
    ),
    size,
  );
}
