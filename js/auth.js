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
    message.className = "";

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          "https://mukwegedenis66-ai.github.io/MON-SUCC-S-/"
      }
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

    window.location.href = "confirmation.html";
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    message.textContent = "Connexion...";
    message.className = "";

    const email = document.getElementById("email").value.trim();
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
