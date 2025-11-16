import type { Metadata } from "next";
import "./globals.css";
import { ApiProvider } from "@/hooks/useApi";
import { UserAuthProvider } from "@/hooks/useUserAuth";
import { Toaster as Sonner } from "@/components/utility/sonner";
import LoadingOverlay from "@/components/utility/LoadingOverlay";

export const metadata: Metadata = {
  title: "FaRS",
  description: "Financial and Risk Solutions",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Sonner />
        <ApiProvider>
          <UserAuthProvider>
            <LoadingOverlay />
            {children}
          </UserAuthProvider>
        </ApiProvider>
      </body>
    </html>
  );
}