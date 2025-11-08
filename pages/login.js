import { useState } from 'react';
import supabase from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signIn(
      { email },
      { redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard` }
    );

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the login link!');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Magic Link</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
