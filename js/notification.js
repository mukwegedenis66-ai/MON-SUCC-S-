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

    <div class="notification-header">
      <h3>🔔 Notifications</h3>
      <button id="closeNotification" type="button">×</button>
    </div>

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

  box-shadow:
    0 3px 12px rgba(0,0,0,0.25);

  font-size: 27px;
  cursor: pointer;
  position: relative;

  transition: transform 0.2s ease;
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

  width: 300px;
  max-height: 400px;

  overflow-y: auto;

  background: white;

  border-radius: 15px;

  padding: 18px;

  box-shadow:
    0 5px 20px rgba(0,0,0,0.25);
}

.notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 15px;
}

.notification-header h3 {
  margin: 0;
  font-size: 18px;
}

#closeNotification {
  border: none;
  background: transparent;

  font-size: 25px;

  cursor: pointer;
  color: #777;
}

.notification-item {
  padding: 13px 0;
  border-bottom: 1px solid #ddd;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item strong {
  display: block;
  line-height: 1.4;
}

.notification-item p {
  margin: 7px 0;
  font-size: 15px;
}

.notification-item small {
  color: #777;
  font-size: 12px;
}

.notification-empty {
  color: #777;
  text-align: center;
  padding: 20px 5px;
}

@media (max-width: 480px) {

  #notificationPanel {
    width: 260px;
    left: 0;
  }

}

`;

document.head.appendChild(style);


// ========================================
// ÉLÉMENTS
// ========================================

const button =
  document.getElementById("notificationButton");

const panel =
  document.getElementById("notificationPanel");

const closeButton =
  document.getElementById("closeNotification");

const count =
  document.getElementById("notificationCount");

const content =
  document.getElementById("notificationContent");


// ========================================
// CHARGER LES NOTIFICATIONS
// ========================================

async function loadNotifications() {

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  // ========================================
  // PAS CONNECTÉ
  // ========================================

  if (userError || !user) {

    count.textContent = "0";

    content.innerHTML = `
      <p class="notification-empty">
        Connectez-vous pour voir vos notifications.
      </p>
    `;

    return;
  }


  // ========================================
  // RÉCUPÉRER UNIQUEMENT LES NOTIFICATIONS
  // NON LUES
  // ========================================

  const {
    data,
    error
  } = await supabase

    .from("prets")

    .select(`
      id,
      montant,
      statut,
      created_at,
      notification_lue
    `)

    .eq("user_id", user.id)

    .in("statut", [
      "accepte",
      "refuse"
    ])

    .eq("notification_lue", false)

    .order("created_at", {
      ascending: false
    });


  // ========================================
  // ERREUR
  // ========================================

  if (error) {

    console.error(
      "Erreur notifications :",
      error
    );

    count.textContent = "0";

    content.innerHTML = `
      <p class="notification-empty">
        Impossible de charger les notifications.
      </p>
    `;

    return;
  }


  // ========================================
  // COMPTEUR
  // ========================================

  count.textContent = data.length;


  // ========================================
  // AUCUNE NOUVELLE NOTIFICATION
  // ========================================

  if (data.length === 0) {

    content.innerHTML = `
      <p class="notification-empty">
        Aucune nouvelle notification.
      </p>
    `;

    return;
  }


  // ========================================
  // AFFICHAGE
  // ========================================

  content.innerHTML = data.map((pret) => {

    const montant =
      new Intl.NumberFormat("fr-FR")
        .format(pret.montant);

    let message;
    let emoji;

    if (pret.statut === "accepte") {

      emoji = "✅";

      message =
        "Votre demande de prêt a été acceptée.";

    } else {

      emoji = "❌";

      message =
        "Votre demande de prêt a été refusée.";
    }

    const date =
      new Date(pret.created_at)
        .toLocaleString("fr-FR");

    return `

      <div
        class="notification-item"
        data-id="${pret.id}"
      >

        <strong>
          ${emoji} ${message}
        </strong>

        <p>
          💰 ${montant} FCFA
        </p>

        <small>
          ${date}
        </small>

      </div>

    `;

  }).join("");
}


// ========================================
// MARQUER LES NOTIFICATIONS COMME LUES
// ========================================

async function markNotificationsAsRead() {

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return;
  }

  const { error } = await supabase

    .from("prets")

    .update({
      notification_lue: true
    })

    .eq("user_id", user.id)

    .in("statut", [
      "accepte",
      "refuse"
    ])

    .eq("notification_lue", false);

  if (error) {

    console.error(
      "Erreur lors du marquage des notifications :",
      error
    );

    return;
  }

  // Le compteur passe immédiatement à 0
  count.textContent = "0";
}


// ========================================
// OUVRIR / FERMER
// ========================================

button.addEventListener("click", async () => {

  if (panel.style.display === "block") {

    panel.style.display = "none";

    return;
  }

  panel.style.display = "block";

  // Charger les notifications
  await loadNotifications();

  // Les considérer comme lues
  await markNotificationsAsRead();

  // Recharger pour vider le panneau
  await loadNotifications();

});


// ========================================
// BOUTON FERMER
// ========================================

closeButton.addEventListener("click", () => {

  panel.style.display = "none";

});


// ========================================
// ACTUALISATION AUTOMATIQUE
// ========================================

setInterval(() => {

  loadNotifications();

}, 10000);


// ========================================
// CHARGEMENT INITIAL
// ========================================

loadNotifications();


// ========================================
// TEMPS RÉEL SUPABASE
// ========================================

supabase

  .channel("prets-notifications")

  .on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "prets"
    },
    (payload) => {

      console.log(
        "Statut de prêt modifié :",
        payload.new
      );

      loadNotifications();

    }
  )

  .subscribe();
