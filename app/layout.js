'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import '../app/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import Navbar from './components/Navbar'; // Import Navbar

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
      {children}
      {session && <Navbar />} {/* Show Navbar only if user is logged in */}
    </>
  );
}
