"use client";

import localFont from "next/font/local";
import "./globals.css";
import AppSidebar from "./(components)/Sidebar";
import client from "./(services)/apollo-client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { ApolloProvider } from "@apollo/client";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ApolloProvider client={client}>
          <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger />
            {children}
            <Toaster />
          </SidebarProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
