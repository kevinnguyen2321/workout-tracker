'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import '../app/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import Navbar from './components/Navbar'; // Import Navbar
import Image from 'next/image';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <html lang="en">
        <head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/app_icon.png" />
          <meta name="theme-color" content="#0f172a" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <AuthWrapper>{children}</AuthWrapper>
        </body>
      </html>
    </SessionProvider>
  );
}

// AuthWrapper component to handle session logic
function AuthWrapper({ children }) {
  const { data: session } = useSession();

  return (
    <>
      {/* Full-width black header */}
      <div className="bg-black w-full p-4 flex justify-center items-center">
        <Image src="/dumbbell.png" alt="Dumbbell" width={40} height={40} />
      </div>
      {children}
      {session && <Navbar />} {/* Show Navbar only if user is logged in */}
    </>
  );
}
