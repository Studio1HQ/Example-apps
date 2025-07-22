"use client";

import { VeltProvider } from "@veltdev/react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from '../components/Sidebar';
import Header from '../components/header';
import VeltInitializer from '../components/VeltInitializer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} id="app-body">
        <VeltProvider apiKey="hnbXx3OVUnYwsPsmATqe">
          <VeltInitializer />
          <div style={{ display: "flex", height: "100vh" }}>
            {/* Sidebar */}
            <Sidebar />
            {/* Main Content */}
            <main style={{ flex: 1, overflowX: "auto", height: "100vh", margin: 0, padding: 0, display: "flex", flexDirection: "column" }}>
              <Header />
              <div style={{ flex: 1, margin: 0, padding: 0, height: "100%" }}>
                {children}
              </div>
            </main>
          </div>
        </VeltProvider>
      </body>
    </html>
  );
}
