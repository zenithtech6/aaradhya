import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Diwali Diya Store — handmade diyas, 24-hour delivery";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#4A0E1C",
          color: "#FFF6E5",
        }}
      >
        <div style={{ fontSize: 28, color: "#D4A017", marginBottom: 16 }}>
          Handmade · COD · 24-hr delivery
        </div>
        <div style={{ fontSize: 72, fontWeight: 700 }}>Diwali Diya Store</div>
        <div style={{ fontSize: 32, marginTop: 20, color: "#F28C28" }}>
          Light up this Diwali
        </div>
      </div>
    ),
    size
  );
}
