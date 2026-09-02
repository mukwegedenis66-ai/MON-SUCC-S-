import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const profile = document.getElementById("profile");
const logout = document.getElementById("logout");

if (profile) {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    window.location.href = "connexion.html";
  } else {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    profile.innerHTML = `
      <b>Nom :</b> ${data?.full_name || "-"}<br>
      <b>Téléphone :</b> ${data?.phone || "-"}<br>
      <b>Email :</b> ${user.email || "-"}
    `;
  }
}

if (logout) {
  logout.addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "index.html";
  });
}
