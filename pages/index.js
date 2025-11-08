import { useEffect } from 'react'; import { supabase } from '../lib/supabaseClient'; import { useRouter } from 'next/router';
export default function Home() { const router = useRouter(); useEffect(()=>{ async function check(){ const { data } = await supabase.auth.getUser(); if (data?.user) router.push('/dashboard'); else router.push('/login'); } check(); },[router]); return <p>Loading...</p>; }
