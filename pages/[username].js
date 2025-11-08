import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import TemplateRenderer from "../components/TemplateRenderer";

export default function UserSite() {
  const router = useRouter();
  const { username } = router.query;
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;

    async function fetchSite() {
      setLoading(true);
      const { data, error } = await supabase
        .from("sites")
        .select("*")
        .eq("username", username.toLowerCase())
        .single();

      if (error) {
        console.error("Error fetching site:", error);
        setError("Site not found or username invalid.");
      } else {
        setSite(data);
      }
      setLoading(false);
    }

    fetchSite();
  }, [username]);

  if (loading) return <p>Loading site...</p>;
  if (error) return <p>{error}</p>;
  if (!site) return <p>No site data available.</p>;

  return <TemplateRenderer site={site} />;
}
