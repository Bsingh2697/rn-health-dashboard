import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RN Health Dashboard — OTA + Crash Monitoring for React Native",
  description:
    "Know exactly when your OTA update broke production. Unified crash rate and OTA release monitoring for React Native teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
