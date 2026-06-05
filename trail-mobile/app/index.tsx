import { Redirect } from 'expo-router';

import { useAuthStore } from '@/store/authStore';

export default function Index() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const session = useAuthStore((state) => state.session);

  if (!hasHydrated) {
    return null;
  }

  return <Redirect href={session ? '/consulta' : '/signin'} />;
}