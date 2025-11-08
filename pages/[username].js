import { supabase } from '../lib/supabaseClient'; import TemplateRenderer from '../components/TemplateRenderer';
export default function Public({ site }){ if(!site) return <div className='container py-10 card'>Not found</div>; return <TemplateRenderer data={site.data} theme={site.theme?.palette}/> }
export async function getServerSideProps({ params }){ const { username } = params; const { data } = await supabase.from('sites').select('*').eq('username', username).limit(1).single(); if(!data) return { props:{ site:null } }; return { props:{ site: data } }; }
