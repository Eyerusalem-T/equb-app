import { ImageResponse } from "next/og";
export const alt = "Equb: save together, keep the receipts";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    (<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#0b3d2e", color: "#fff" }}>
      <div style={{ display: "flex", height: 24, width: "100%", marginBottom: 48, background: "linear-gradient(90deg,#078930 33%,#fcdd09 33% 66%,#da121a 66%)" }} />
      <div style={{ fontSize: 120, fontWeight: 800, lineHeight: 1 }}>Equb</div>
      <div style={{ fontSize: 52, marginTop: 24, color: "#fcdd09" }}>Save together. Keep the receipts.</div>
    </div>), size);
}
