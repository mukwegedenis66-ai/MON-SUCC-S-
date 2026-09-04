import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY
} from "./config.js";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ========================================
// CRÉATION DE LA BOÎTE DE NOTIFICATION
// ========================================

const notificationBox = document.createElement("div");

notificationBox.id = "notificationBox";

notificationBox.innerHTML = `
  <button id="notificationButton" type="button" aria-label="Notifications">
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


// ========================================
// STYLE
// ========================================

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

#notificationButton:hover {
  transform: scale(1.05);
}

#notificationCount {
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 22px;
  height: 22px;
  padding: 0 5px;
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
  margin-bottom: 15px;
}

.notification-item {
  padding: 12px 0;
  border-bottom: 1px solid #ddd;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item p {
  margin: 6px 0;
}

.notification-item small {
  color: #777;
}

.notification-empty {
  color: #777;
  text-align: center;
  padding: 15px 0;
}

@media (max-width: 480px) {
  #notificationPanel {
    width: 260px;
  }
}
`;

document.head.appendChild(style);


// ========================================
// ÉLÉMENTS
// ========================================

const button = document.getElementById("notificationButton");
const panel = document.getElementById("notificationPanel");
const count = document.getElementById("notificationCount");
const content = document.getElementById("notificationContent");


// ========================================
// OUVRIR / FERMER LES NOTIFICATIONS
// ========================================

button.addEventListener("click", () => {

  if (panel.style.display === "none" || panel.style.display === "") {
    panel.style.display = "block";
  } else {
    panel.style.display = "none";
  }

});


// ========================================
// CHARGER LES NOTIFICATIONS
// ========================================

async function loadNotifications() {

  const {
    data: { user }
  } = await supabase.auth.getUser();


  // ----------------------------------------
  // UTILISATEUR NON CONNECTÉ
  // ----------------------------------------

  if (!user) {

    count.textContent = "0";

    content.innerHTML = `
      <p class="notification-empty">
        Connectez-vous pour voir vos notifications.
      </p>
    `;

    return;
  }


  // ----------------------------------------
  // RÉCUPÉRER LES DEMANDES TRAITÉES
  // ----------------------------------------

  const { data, error } = await supabase
    .from("prets")
    .select("id, montant, statut, created_at")
    .eq("user_id", user.id)
    .in("statut", ["accepte", "refuse"])
    .order("created_at", { ascending: false });


  // ----------------------------------------
  // ERREUR SUPABASE
  // ----------------------------------------

  if (error) {

    console.error("Erreur notifications :", error);

    count.textContent = "0";

    content.innerHTML = `
      <p class="notification-empty">
        Impossible de charger les notifications.
      </p>
    `;

    return;
  }


  // ----------------------------------------
  // COMPTEUR
  // ----------------------------------------

  count.textContent = data.length;


  // ----------------------------------------
  // AUCUNE NOTIFICATION
  // ----------------------------------------

  if (data.length === 0) {

    content.innerHTML = `
      <p class="notification-empty">
        Aucune nouvelle notification.
      </p>
    `;

    return;
  }


  // ----------------------------------------
  // AFFICHAGE
  // ----------------------------------------

  content.innerHTML = data.map((pret) => {

    const montant = new Intl.NumberFormat("fr-FR")
      .format(pret.montant);

    let message;

    if (pret.statut === "accepte") {

      message = "✅ Votre demande de prêt a été acceptée.";

    } else {

      message = "❌ Votre demande de prêt a été refusée.";

    }

    const date = new Date(pret.created_at)
      .toLocaleString("fr-FR");

    return `
      <div class="notification-item">

        <strong>${message}</strong>

        <p>💰 ${montant} FCFA</p>

        <small>${date}</small>

      </div>
    `;

  }).join("");

}


// ========================================
// LANCEMENT
// ========================================

loadNotifications();
