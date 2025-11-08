import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import TemplateRenderer from '../components/TemplateRenderer';

export default function UserSite() {
  const router = useRouter();
  const { username } = router.query;
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    async function fetchSite() {
      const { data, error } = await supabase.from('sites').select('*').eq('username', username).single();
      if (!error) setSite(data);
      setLoading(false);
    }
    fetchSite();
  }, [username]);

  if (loading) return <p>Loading site...</p>;
  if (!site) return <p>Site not found.</p>;
  return <TemplateRenderer site={site} />;
}
