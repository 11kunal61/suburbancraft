import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (!error) setSent(true);
    else alert(error.message);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-lg w-[420px]">
        <h1 className="text-xl font-bold mb-4">Login / Sign up</h1>
        {!sent ? (
          <>
            <input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@college.edu" className="border p-2 w-full rounded mb-3" />
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Send Magic Link</button>
          </>
        ) : (
          <p>Check your email for a login link.</p>
        )}
      </form>
    </div>
  );
}
