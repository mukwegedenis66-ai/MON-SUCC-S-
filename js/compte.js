import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY
} from "./config.js";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const accountInfo = document.getElementById("accountInfo");
const loans = document.getElementById("loans");
const logoutButton = document.getElementById("logoutButton");

const money = (amount) =>
  new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";

async function loadAccount() {

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError) {
    accountInfo.textContent = userError.message;
    return;
  }

  if (!user) {

    accountInfo.innerHTML = `
      <p>Vous devez être connecté pour accéder à votre compte.</p>
      <a href="connexion.html">Se connecter</a>
    `;

    loans.innerHTML = "";
    return;
  }

  accountInfo.innerHTML = `
    <p><strong>Email :</strong> ${user.email}</p>
  `;

  const { data, error } = await supabase
    .from("prets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    loans.textContent = error.message;
    return;
  }

  if (!data || data.length === 0) {

    loans.innerHTML = `
      <p>Aucune demande de prêt pour le moment.</p>
    `;

    return;
  }

  /* Notification */

const accepte = data.filter(
  (pret) =>
    pret.statut === "accepte" &&
    pret.notification_lue === false
);

const refuse = data.filter(
  (pret) =>
    pret.statut === "refuse" &&
    pret.notification_lue === false
);

let notification = "";

if (accepte.length > 0) {
  notification += `
    <div class="card">
      <h3>🔔 Bonne nouvelle !</h3>
      <p>
        Votre demande de prêt a été
        <strong>✅ acceptée</strong>.
      </p>
    </div>
  `;
}

if (refuse.length > 0) {
  notification += `
    <div class="card">
      <h3>🔔 Notification</h3>
      <p>
        Une demande de prêt a été
        <strong>❌ refusée</strong>.
      </p>
    </div>
  `;
}

  loans.innerHTML = notification;

  loans.innerHTML += data.map((pret) => {

    let statut = "⏳ En attente";

    if (pret.statut === "accepte") {
      statut = "✅ Acceptée";
    }

    if (pret.statut === "refuse") {
      statut = "❌ Refusée";
    }

    return `
      <div class="loan-item">

        <p>
          <strong>Montant :</strong>
          ${money(pret.montant)}
        </p>

        <p>
          <strong>Durée :</strong>
          ${pret.duree_mois} mois
        </p>

        <p>
          <strong>Motif :</strong>
          ${pret.motif}
        </p>

        <p>
          <strong>Statut :</strong>
          ${statut}
        </p>

        <p>
          <small>
            ${new Date(pret.created_at).toLocaleString("fr-FR")}
          </small>
        </p>

      </div>

      <hr>
    `;

  }).join("");
}

logoutButton?.addEventListener("click", async () => {

  const { error } = await supabase.auth.signOut();

  if (error) {
    alert(error.message);
    return;
  }

  window.location.href = "connexion.html";
});

loadAccount();
