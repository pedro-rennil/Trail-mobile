'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../store/useStore';

/**
 * Client-side route guard for the authenticated `(app)` area. Redirects to the
 * sign-in page when there is no user in the (persisted) store. Auth state lives
 * in localStorage today, so the guard runs on the client rather than middleware.
 *
 * The redirect decision is deferred until after the first client mount: the
 * server (and the first client paint) render nothing, then we re-evaluate once
 * the persisted store has rehydrated. This avoids an SSR→client mismatch and the
 * race where a slow hydration would briefly see `user === null` and bounce an
 * already-authenticated user to /signin.
 */
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = useStore((s) => s.user);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) router.replace('/signin');
  }, [mounted, user, router]);

  if (!mounted || !user) return null;
  return <>{children}</>;
}
