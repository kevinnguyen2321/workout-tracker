'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  if (status === 'loading') {
    return <p>Loading...</p>; // Show a loading state while checking session
  }

  if (!session) {
    router.push('/auth/login');

    return null; // Prevent rendering the page content before redirect
  }

  return (
    <div className="border-2 border-yellow-100 m-8">
      <p>Welcome, {session.user.email}!</p>
    </div>
  );
}
