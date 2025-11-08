import { supabase } from '../lib/supabaseClient';
export default function UserSite({ site }) {
  if (!site) return <div className='container py-10 card'>Not found</div>;
  return <div dangerouslySetInnerHTML={{ __html: site.ai_html || '<p>No content</p>' }} />;
}

export async function getServerSideProps({ params }) {
  const { username } = params;
  const { data } = await supabase.from('sites').select('*').eq('username', username).limit(1).single();
  return { props: { site: data || null } };
}
