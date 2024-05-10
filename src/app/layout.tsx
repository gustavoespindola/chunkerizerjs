import type { Metadata } from "next";
import "./globals.css";

import { Space_Grotesk, Noto_Serif } from "next/font/google";
import { ThemeProvider } from "./provider";
const space = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-grotesk",
})
const noto = Noto_Serif({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-noto-serif",
});

export const metadata: Metadata = {
  title: "Chunkerizer",
  description: "Chunkerizer splits text into chunks.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${space.variable} ${noto.variable}`}>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html >
  );
}
