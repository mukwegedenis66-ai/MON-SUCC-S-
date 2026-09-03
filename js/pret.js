import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY
} from "./config.js";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const form = document.getElementById("pretForm");
const message = document.getElementById("message");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError) {
    message.textContent = userError.message;
    return;
  }

  if (!user) {
    message.textContent =
      "Veuillez vous connecter avant de faire une demande de prêt.";
    return;
  }

  const montant = Number(
    document.getElementById("montant").value
  );

  const duree = Number(
    document.getElementById("duree").value
  );

  const motif =
    document.getElementById("motif").value.trim();

  if (!montant || montant < 1000) {
    message.textContent =
      "Veuillez entrer un montant valide.";
    return;
  }

  if (!duree) {
    message.textContent =
      "Veuillez choisir une durée.";
    return;
  }

  if (!motif) {
    message.textContent =
      "Veuillez indiquer le motif du prêt.";
    return;
  }

  const { error } = await supabase
    .from("prets")
    .insert({
      user_id: user.id,
      montant: montant,
      duree_mois: duree,
      motif: motif,
      statut: "en_attente"
    });

  if (error) {
    message.textContent = error.message;
    return;
  }

  window.location.href = "confirmation-pret.html";
});
