'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Home, Trophy, Dumbbell, List, LogOut } from 'lucide-react';

export default function Navbar() {
  return (
    <>
      <nav className="fixed bottom-0 left-0 w-full bg-black text-white py-2 border-t border-gray-700 z-50">
        <div className="flex justify-around items-center text-xs">
          <Link
            href="/"
            className="flex flex-col items-center hover:text-blue-400"
          >
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link
            href="/personalBest"
            className="flex flex-col items-center hover:text-blue-400"
          >
            <Trophy size={20} />
            <span>My PRs</span>
          </Link>
          <Link
            href="/workoutSessions"
            className="flex flex-col items-center hover:text-blue-400"
          >
            <Dumbbell size={20} />
            <span>My Workouts</span>
          </Link>
          <Link
            href="/exercises"
            className="flex flex-col items-center hover:text-blue-400"
          >
            <List size={20} />
            <span>Exercises</span>
          </Link>
          <button
            onClick={() => signOut()}
            className="flex flex-col items-center hover:text-red-400"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
}
