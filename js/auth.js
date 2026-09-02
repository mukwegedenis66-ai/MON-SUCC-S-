import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const message = document.getElementById("message");
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    message.textContent = "Création du compte...";

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      message.className = "error";
      message.textContent = error.message;
      return;
    }

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: name,
        phone: phone
      });
    }

    message.className = "success";
    message.textContent =
      "Compte créé. Vérifiez votre adresse email si une confirmation est demandée.";
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    message.textContent = "Connexion...";

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      message.className = "error";
      message.textContent = error.message;
      return;
    }

    window.location.href = "epargne.html";
  });
                              }
