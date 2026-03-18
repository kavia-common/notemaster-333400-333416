import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  title: "NoteMaster",
  description:
    "A clean notes app with tags, pin/favorite, search and authentication.",
};

/**
 * PUBLIC_INTERFACE
 * RootLayout is the global app shell wrapper (providers + global styles).
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
