import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY
} from "./config.js";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const adminMessage =
  document.getElementById("adminMessage");

const adminPanel =
  document.getElementById("adminPanel");

const loanList =
  document.getElementById("loanList");

const money = (amount) =>
  new Intl.NumberFormat("fr-FR").format(amount) +
  " FCFA";


async function checkAdmin() {

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {

    adminMessage.textContent =
      "⛔ Vous devez être connecté pour accéder à cette page.";

    return;
  }


  const { data: admin, error: adminError } =
    await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();


  if (adminError) {

    adminMessage.textContent =
      adminError.message;

    return;
  }


  if (!admin) {

    adminMessage.textContent =
      "⛔ Accès refusé. Cette page est réservée à l'administrateur.";

    return;
  }


  adminMessage.textContent =
    "✅ Accès administrateur autorisé.";

  adminPanel.style.display = "block";

  loadLoans();
}


async function loadLoans() {

  const { data: loans, error } =
    await supabase
      .from("prets")
      .select("*")
      .order("created_at", {
        ascending: false
      });


  if (error) {

    loanList.textContent =
      error.message;

    return;
  }


  if (!loans || loans.length === 0) {

    loanList.innerHTML =
      "<p>Aucune demande de prêt.</p>";

    return;
  }


  loanList.innerHTML = loans.map((loan) => {

    let statut = "⏳ En attente";

    if (loan.statut === "accepte") {
      statut = "✅ Acceptée";
    }

    if (loan.statut === "refuse") {
      statut = "❌ Refusée";
    }


    return `
      <div class="loan-item">

        <h3>
          Demande #${loan.id}
        </h3>

        <p>
          <strong>Montant :</strong>
          ${money(loan.montant)}
        </p>

        <p>
          <strong>Durée :</strong>
          ${loan.duree_mois} mois
        </p>

        <p>
          <strong>Motif :</strong>
          ${loan.motif}
        </p>

        <p>
          <strong>Statut :</strong>
          ${statut}
        </p>

        <button
          onclick="updateLoan(${loan.id}, 'accepte')"
        >
          ✅ Accepter
        </button>

        <button
          onclick="updateLoan(${loan.id}, 'refuse')"
        >
          ❌ Refuser
        </button>

      </div>

      <hr>
    `;

  }).join("");
}


window.updateLoan = async function(id, statut) {

  const { error } =
    await supabase
      .from("prets")
      .update({
        statut: statut
      })
      .eq("id", id);


  if (error) {

    alert(error.message);

    return;
  }


  await loadLoans();
};


checkAdmin();
