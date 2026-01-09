import type { Metadata } from "next";
import { ReactNode } from "react";
import Providers from "./providers";
import 'leaflet/dist/leaflet.css';

export const metadata: Metadata = {
  title: "Guardian AI – Drone Flight Weather Assistant",
  description:
    "Weather-aware flight planning and safety analytics for drone operations."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
