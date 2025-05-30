import type { Metadata } from "next";
import { Lato } from "next/font/google";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

import "./globals.css";

const font = Lato({
  variable: "--font-main",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HHS Lobby Signage",
  description: "Holliston High School informational lobby TV",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.variable} antialiased flex flex-row content-stretch p-6 gap-4`}>
        <AppRouterCacheProvider>
          {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
