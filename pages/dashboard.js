import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import TemplateRenderer from "../components/TemplateRenderer";

export default function Dashboard() {
  const [site, setSite] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

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

        if (error && error.code === "PGRST116") {
          // no site found
          setSite(null);
        } else if (!error) {
          setSite(data);
        }
      }
      setLoading(false);
    }

    loadUserData();
  }, []);

  const handleCreateSite = async () => {
    if (!user) return;
    setCreating(true);

    const { data, error } = await supabase
      .from("sites")
      .insert([
        {
          user_id: user.id,
          username: user.email.split("@")[0], // basic username
          title: "My New Portfolio",
          description: "Welcome to my personal site!",
          sections: [
            { heading: "About Me", content: "This is my story..." },
            { heading: "Projects", content: "I love building cool things!" },
          ],
        },
      ])
      .select()
      .single();

    if (!error) setSite(data);
    setCreating(false);
  };

  if (loading) return <p>Loading...</p>;

  if (!site)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>No site found for this user.</p>
        <button
          onClick={handleCreateSite}
          disabled={creating}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          {creating ? "Creating..." : "Create My Site"}
        </button>
      </div>
    );

  return (
    <div>
      <TemplateRenderer site={site} />
    </div>
  );
}
