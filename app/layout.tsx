import type { Metadata } from "next";
import { IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-source",
});

export const metadata: Metadata = {
  title: {
    default: "Fathom",
    template: "%s · Fathom",
  },
  description: "Meeting notes, transcripts, and clips for the Northwind workspace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable} ${sans.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
