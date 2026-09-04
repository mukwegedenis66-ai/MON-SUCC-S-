import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY
} from "./config.js";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Création de la boîte de notification
const notificationBox = document.createElement("div");

notificationBox.id = "notificationBox";

notificationBox.innerHTML = `
  <button id="notificationButton" type="button">
    🔔
    <span id="notificationCount">0</span>
  </button>

  <div id="notificationPanel">
    <h3>🔔 Notifications</h3>
    <div id="notificationContent">
      Chargement...
    </div>
  </div>
`;

document.body.appendChild(notificationBox);

// Style
const style = document.createElement("style");

style.textContent = `
  #notificationBox {
    position: fixed;
    left: 15px;
    bottom: 20px;
    z-index: 9999;
    font-family: Arial, sans-serif;
  }

  #notificationButton {
    width: 58px;
    height: 58px;
    border: none;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 3px 12px rgba(0,0,0,0.25);
    font-size: 27px;
    cursor: pointer;
    position: relative;
  }

  #notificationCount {
    position: absolute;
    top: -5px;
    right: -5px;
    min-width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #e53935;
    color: white;
    font-size: 13px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #notificationPanel {
    display: none;
    position: absolute;
    left: 0;
    bottom: 70px;
    width: 280px;
    max-height: 380px;
    overflow-y: auto;
    background: white;
    border-radius: 15px;
    padding: 18px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.25);
  }

  #notificationPanel h3 {
    margin-top: 0;
  }

  .notification-item {
    padding: 12px 0;
    border-bottom: 1px solid #ddd;
  }

  .notification-item:last-child {
    border-bottom: none;
  }
`;

document.head.appendChild(style);

const button = document.getElementById("notificationButton");
const panel = document.getElementById("notificationPanel");
const count = document.getElementById("notificationCount");
const content = document.getElementById("notificationContent");

button.addEventListener("click", () => {
  panel.style.display =
    panel.style.display === "none" ? "block" : "none";
});

async function loadNotifications() {

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    count.textContent = "0";
    content.innerHTML = `
      <p>Connectez-vous pour voir vos notifications.</p>
    `;
    return;
  }

  const { data, error } = await supabase
    .from("prets")
    .select("id, montant, statut, created_at")
    .eq("user_id", user.id)
    .in("statut", ["accepte", "refuse"])
    .order("created_at", { ascending: false });

  if (error) {
    content.textContent = error.message;
    return;
  }

  count.textContent = data.length;

  if (data.length === 0) {
    content.innerHTML = `
      <p>Aucune nouvelle notification.</p>
    `;
    return;
  }

  content.innerHTML = data.map((pret) => {

    const montant = new Intl.NumberFormat("fr-FR")
      .format(pret.montant);

    const message =
      pret.statut === "accepte"
        ? "✅ Votre demande de prêt a été acceptée."
        : "❌ Votre demande de prêt a été refusée.";

    return `
      <div class="notification-item">
        <strong>${message}</strong>
        <p>💰 ${montant} FCFA</p>
        <small>
          ${new Date(pret.created_at).toLocaleString("fr-FR")}
        </small>
      </div>
    `;

  }).join("");
}

loadNotifications();
