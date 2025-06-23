// src/app/layout.tsx
import { ReactNode } from "react";
import Providers from "@/components/Providers";
import ClientOnlyNavigation from "@/components/admin/ClientOnlyNavigation";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ClientOnlyNavigation />
          <>{children}</>
        </Providers>
      </body>
    </html>
  );
}
