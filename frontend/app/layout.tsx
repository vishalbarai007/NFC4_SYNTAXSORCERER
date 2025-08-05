import type React from "react";
import type { Metadata } from "next";
import { Inter, Courier_Prime } from "next/font/google";
import { Playwrite_AU_NSW } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/toast-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { SettingsProvider } from "@/contexts/settings-context";
import { ScriptsProvider } from "@/contexts/scripts-context";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-courier",
});
const playwrite = Playwrite_AU_NSW({
  weight: ["100", "200", "300", "400"],
  display: "swap",
  variable: "--font-playwrite", // ✅ This line is critical
});


export const metadata: Metadata = {
  title: "ScriptCraft",
  description: "Write Better. Speak Louder. Feel Deeper. 🎬✨",
  viewport: "width=device-width, initial-scale=1",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="font-playwrite text-lg"
    >
      <body
        className={`${inter.variable} ${courierPrime.variable} font-sans antialiased`}
      >
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <SettingsProvider>
              <ScriptsProvider>
                <div className="min-h-screen flex flex-col">{children}</div>
                <ToastProvider />
              </ScriptsProvider>
            </SettingsProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
