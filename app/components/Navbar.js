'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-black text-white p-4">
      <div className="container mx-auto flex justify-around items-center">
        <Link href="/dashboard" className="hover:underline">
          My workouts
        </Link>
        <button
          onClick={() => signOut()}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
