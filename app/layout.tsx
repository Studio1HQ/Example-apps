"use client";

import { VeltProvider } from "@veltdev/react";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from '../components/Sidebar';
import Header from '../components/header';
import VeltAuth from '../components/VeltAuth'; // Import the new component
import { useState, useEffect, createContext, useContext } from 'react';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Create Dark Mode Context
const DarkModeContext = createContext<{
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}>({
  isDarkMode: false,
  setIsDarkMode: () => { },
});

export const useDarkMode = () => useContext(DarkModeContext);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      setIsDarkMode(savedDarkMode);

      const body = document.getElementById('app-body');
      if (body) {
        if (savedDarkMode) {
          body.classList.add('dark');
        } else {
          body.classList.remove('dark');
        }
      }
    }
  }, []);

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`} id="app-body">
        <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
          <VeltProvider apiKey={process.env.NEXT_PUBLIC_VELT_API_KEY || ""}>
            <VeltAuth>
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
            </VeltAuth>
          </VeltProvider>
        </DarkModeContext.Provider>
      </body>
    </html>
  );
}
