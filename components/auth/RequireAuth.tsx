'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../store/useStore';

/**
 * Client-side route guard for the authenticated `(app)` area. Redirects to the
 * sign-in page when there is no user in the (persisted) store. Auth state lives
 * in localStorage today, so the guard runs on the client rather than middleware.
 */
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = useStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) router.replace('/signin');
  }, [user, router]);

  if (!user) return null;
  return <>{children}</>;
}
