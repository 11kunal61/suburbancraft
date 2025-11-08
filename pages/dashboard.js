import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check current session
    const session = supabase.auth.session();
    if (!session) {
      router.push('/login');
    } else {
      setUser(session.user);
    }

    // Listen for session changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push('/login');
      else setUser(session.user);
    });

    return () => listener?.unsubscribe();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <p>Here you can generate your website after selecting prompts.</p>
    </div>
  );
}
