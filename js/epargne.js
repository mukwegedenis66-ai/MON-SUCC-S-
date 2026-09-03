import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const money = (n) =>
  new Intl.NumberFormat("fr-FR").format(n) + " FCFA";

async function load() {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError) {
    alert(userError.message);
    return;
  }

  if (!user) {
    alert("Veuillez vous connecter.");
    return;
  }

  const { data: operations, error } = await supabase
    .from("epargne")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    alert(error.message);
    return;
  }

  const rows = operations || [];

  const balance = rows.reduce((total, operation) => {
    const montant = Number(operation.amount);

    return operation.type_operation === "retrait"
      ? total - montant
      : total + montant;
  }, 0);

  const goal = 500000;

  document.getElementById("balance").textContent = money(balance);
  document.getElementById("goalAmount").textContent = money(goal);

  const percent = Math.min(
    100,
    Math.round((balance / goal) * 100)
  );

  document.getElementById("progress").style.width =
    percent + "%";

  document.getElementById("progressText").textContent =
    percent + "% de votre objectif";

  const history = document.getElementById("history");

  if (!rows.length) {
    history.innerHTML = `
      <div class="empty-history">
        Aucun mouvement d'épargne pour le moment.
      </div>
    `;
    return;
  }

  history.innerHTML = rows
    .map((operation) => {
      const signe =
        operation.type_operation === "retrait" ? "-" : "+";

      return `
        <p>
          <b>${signe} ${money(operation.amount)}</b>
          — ${new Date(operation.created_at).toLocaleString("fr-FR")}
        </p>
      `;
    })
    .join("");
}

document
  .getElementById("savingForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError) {
      alert(userError.message);
      return;
    }

    if (!user) {
      alert("Veuillez vous connecter.");
      return;
    }

    const amount = Number(
      document.getElementById("amount").value
    );

    if (!amount || amount <= 0) {
      alert("Veuillez entrer un montant valide.");
      return;
    }

    const { error } = await supabase
      .from("epargne")
      .insert({
        user_id: user.id,
        amount: amount,
        type_operation: "depot"
      });

    if (error) {
      alert(error.message);
      return;
    }

    document.getElementById("amount").value = "";

    await load();
  });

load();
