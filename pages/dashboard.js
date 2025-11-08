import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import TemplateRenderer from '../components/TemplateRenderer';

export default function Dashboard() {
  const [site, setSite] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.push('/login');
      else {
        setUser(data.user);
        const { data: siteData, error } = await supabase
          .from('sites')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (error) setSite(null);
        else setSite(siteData);
      }
      setLoading(false);
    }
    loadUser();
  }, [router]);

  const createSite = async () => {
    const { data, error } = await supabase
      .from('sites')
      .insert([
        {
          user_id: user.id,
          username: user.email.split('@')[0],
          title: 'My Portfolio',
          description: 'Welcome to my personal site!',
          color: '#2563eb',
          sections: [
            { heading: 'About Me', content: 'Hello! I build things.' },
            { heading: 'Projects', content: 'Project list goes here.' },
          ],
        },
      ])
      .select()
      .single();
    if (!error) setSite(data);
  };

  if (loading) return <p>Loading...</p>;
  if (!site)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>No site found. Create one below:</p>
        <button onClick={createSite} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Create My Site</button>
      </div>
    );

  return (
    <div className="p-4">
      <TemplateRenderer site={site} />
      <p className="text-center mt-6 text-gray-600">View your site at: <a className="text-blue-600 underline" href={'/'+site.username}>{'/' + site.username}</a></p>
    </div>
  );
}
