'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-black text-white p-4 z-50">
      {/* Desktop Menu */}
      <div className="hidden md:flex justify-around items-center container mx-auto">
        <Image src="/dumbbell.png" alt="Add" width={60} height={60} />
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/personalBest" className="hover:underline">
          Achievements
        </Link>
        <Link href="/workoutSessions" className="hover:underline">
          My Workouts
        </Link>
        <Link href="/exercises" className="hover:underline">
          Exercises
        </Link>
        <button
          onClick={() => signOut()}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="flex md:hidden justify-between items-center">
        <button onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        {/* <span className="text-lg font-semibold">Menu</span> */}
        <Image src="/dumbbell.png" alt="Add" width={60} height={60} />
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-2 flex flex-col items-start">
          <Link href="/" className="hover:underline" onClick={toggleMenu}>
            Home
          </Link>
          <Link
            href="/personalBest"
            className="hover:underline"
            onClick={toggleMenu}
          >
            Achievements
          </Link>
          <Link
            href="/workoutSessions"
            className="hover:underline"
            onClick={toggleMenu}
          >
            My Workouts
          </Link>
          <Link
            href="/exercises"
            className="hover:underline"
            onClick={toggleMenu}
          >
            Exercises
          </Link>
          <button
            onClick={() => {
              toggleMenu();
              signOut();
            }}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
