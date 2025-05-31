import type { Metadata } from "next";
import { Lato } from "next/font/google";
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
        {children}
      </body>
    </html>
  );
}
