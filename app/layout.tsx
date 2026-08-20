import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "../lib/useOmd";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ONE MILLION DEGENS",
  description: "1,000,000 degens on Robinhood Chain. Mint by burning DEGEN. Supply only goes down.",
  icons: { icon: "/degen_7.png", apple: "/degen_7.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
