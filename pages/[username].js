import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import TemplateRenderer from "../components/TemplateRenderer";

export default function UserSite() {
  const router = useRouter();
  const { username } = router.query;
  const [site, setSite] = useState(null);

  useEffect(() => {
    if (!username) return;

    async function fetchSite() {
      const { data, error } = await supabase
        .from("sites")
        .select("*")
        .eq("username", username)
        .single();

      if (!error) setSite(data);
    }

    fetchSite();
  }, [username]);

  if (!site) return <p>Loading site...</p>;

  return <TemplateRenderer site={site} />;
}
