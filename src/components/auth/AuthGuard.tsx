

'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  if (isUserLoading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return null; // Render nothing while redirecting
  }

  return <>{children}</>;
}
