import type { Metadata } from "next";
import "./globals.css";
import { ApiProvider } from "@/hooks/useApi";
import { UserAuthProvider } from "@/hooks/useUserAuth";
import { Toaster as Sonner } from "@/components/utility/sonner";

export const metadata: Metadata = {
  title: "Login Page",
  description: "Authentication page for the application",
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
            {children}
          </UserAuthProvider>
        </ApiProvider>
      </body>
    </html>
  );
}