// frontend/src/app/layout.tsx
import { ReactNode } from "react";
// import type { Metadata } from "next";
//import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
// import ClientOnlyNavigation from "@/components/admin/ClientOnlyNavigation";

import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Admin Panel",
//   description: "Secure login panel",
// };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (

    <html lang="en">
      {/* <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > */}
       <body>
         <Provider store={store}> 
         {/* <ClientOnlyNavigation />   */}
        <main>
        {children}
        </main>
        </Provider>
      </body>
    </html>
  );
}
