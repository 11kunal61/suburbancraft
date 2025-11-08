import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
export default function Nav({ user, onLogout }) {
  return (
    <nav className='header container'>
      <div><Link href='/'><a className='font-bold'>Krytil</a></Link></div>
      <div className='flex gap-3 items-center'>
        {user ? (
          <>
            <span className='text-sm'>{user.email}</span>
            <button className='px-3 py-1 border rounded' onClick={async ()=>{await supabase.auth.signOut(); onLogout();}}>Logout</button>
          </>
        ) : (
          <Link href='/dashboard'><a className='px-3 py-1 bg-sky-600 text-white rounded'>Get Started</a></Link>
        )}
      </div>
    </nav>
  );
}
