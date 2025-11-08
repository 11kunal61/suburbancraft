import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import TemplateRenderer from "../components/TemplateRenderer";

export default function Dashboard() {
  const [site, setSite] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUserData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from("sites")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (!error) setSite(data);
      }
    }

    loadUserData();
  }, []);

  if (!user) return <p>Loading...</p>;
  if (!site) return <p>No site data found. Create one in your dashboard!</p>;

  return (
    <div>
      <TemplateRenderer site={site} />
    </div>
  );
}
