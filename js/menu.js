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
// RÉCUPÉRER LE HEADER
// ========================================

const header = document.querySelector("header");

if (!header) {
  console.warn("Header introuvable.");
} else {

  // ========================================
  // BOUTON MENU
  // ========================================

  let menuButton = document.getElementById("menuButton");

  if (!menuButton) {

    menuButton = document.createElement("button");

    menuButton.id = "menuButton";
    menuButton.type = "button";
    menuButton.setAttribute("aria-label", "Ouvrir le menu");
    menuButton.innerHTML = "☰";

    header.querySelector(".container")?.appendChild(menuButton);
  }


  // ========================================
  // PANNEAU DU MENU
  // ========================================

  const menuPanel = document.createElement("div");

  menuPanel.id = "menuPanel";

  menuPanel.innerHTML = `
    <div class="menu-header">
      <strong>Menu</strong>

      <button
        id="menuClose"
        type="button"
        aria-label="Fermer le menu"
      >
        ×
      </button>
    </div>

    <nav id="menuLinks"></nav>
  `;

  document.body.appendChild(menuPanel);


  // ========================================
  // STYLE DU MENU
  // ========================================

  const style = document.createElement("style");

  style.textContent = `

/* ========================================
   HEADER + BOUTON MENU
======================================== */

header {
  position: sticky;
  top: 0;
  z-index: 1000;
}

header .container {
  position: relative !important;

  width: 100% !important;
  max-width: none !important;

  margin: 0 !important;

  display: flex !important;
  flex-direction: row !important;

  align-items: center !important;
  justify-content: space-between !important;

  min-height: 72px !important;

  padding-left: 20px !important;
  padding-right: 80px !important;
}


/* ========================================
   BOUTON MENU
======================================== */

#menuButton {

  position: absolute !important;

  top: 50% !important;
  right: 0 !important;

  transform: translateY(-50%) !important;

  width: 58px;
  height: 58px;

  border: none;
  border-radius: 18px;

  background: #0b6b4f;
  color: white;

  font-size: 32px;
  line-height: 1;

  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow:
    0 6px 18px rgba(0,0,0,0.15);

  transition:
    background 0.2s ease,
    transform 0.2s ease;

  z-index: 1001;
}


#menuButton:hover {

  background: #064936;

}


#menuButton:active {

  transform:
    translateY(-50%)
    scale(0.96);

}


/* ========================================
   PANNEAU DU MENU
======================================== */

#menuPanel {

  position: fixed;

  top: 90px;
  right: 20px;

  width: 280px;

  background: white;

  border: 1px solid #e2e9e6;
  border-radius: 20px;

  padding: 18px;

  box-shadow:
    0 15px 45px rgba(0,0,0,0.18);

  z-index: 9998;

  display: none;

  animation: menuFade 0.2s ease;
}


#menuPanel.active {

  display: block;

}


/* ========================================
   EN-TÊTE DU MENU
======================================== */

.menu-header {

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding-bottom: 14px;

  border-bottom: 1px solid #e2e9e6;

  margin-bottom: 10px;
}


.menu-header strong {

  color: #064936;

  font-size: 20px;

}


#menuClose {

  width: 35px;
  height: 35px;

  border: none;
  border-radius: 50%;

  background: #f5f8f7;

  color: #555;

  font-size: 24px;

  cursor: pointer;

}


/* ========================================
   LIENS DU MENU
======================================== */

#menuLinks {

  display: flex;

  flex-direction: column;

  gap: 5px;

}


#menuLinks a,
#menuLinks button {

  width: 100%;

  padding: 14px 15px;

  border: none;
  border-radius: 12px;

  background: transparent;

  color: #45534d;

  text-align: left;

  font-size: 16px;
  font-weight: 600;

  cursor: pointer;

  text-decoration: none;

  transition: 0.2s ease;
}


#menuLinks a:hover,
#menuLinks button:hover {

  background: #e8f5f0;

  color: #0b6b4f;

}


/* ========================================
   DÉCONNEXION
======================================== */

#menuLinks .logout {

  margin-top: 8px;

  color: #c74646;

  border-top: 1px solid #e2e9e6;

  border-radius: 0;

  padding-top: 16px;

}


#menuLinks .logout:hover {

  background: #fff0f0;

  color: #a53333;

}


/* ========================================
   ANIMATION
======================================== */

@keyframes menuFade {

  from {

    opacity: 0;

    transform: translateY(-8px);

  }

  to {

    opacity: 1;

    transform: translateY(0);

  }

}


/* ========================================
   MOBILE
======================================== */

@media (max-width: 650px) {

  header .container {

    display: flex !important;

    flex-direction: row !important;

    align-items: center !important;

    justify-content: space-between !important;

    min-height: 72px !important;

    padding-top: 10px !important;
    padding-bottom: 10px !important;

    padding-right: 75px !important;

  }


  #menuButton {

    width: 58px;
    height: 58px;

    right: 0 !important;

    top: 50% !important;

    transform: translateY(-50%) !important;

  }


  #menuPanel {

    top: 85px;

    right: 15px;

    left: 15px;

    width: auto;

  }

}

`;


    // ========================================
    // UTILISATEUR CONNECTÉ
    // ========================================

    if (user) {

      menu += `

        <a href="compte.html">
          👤 Mon compte
        </a>

        <button
          type="button"
          class="logout"
          id="menuLogout"
        >
          🚪 Se déconnecter
        </button>

      `;

    }

    // ========================================
    // UTILISATEUR NON CONNECTÉ
    // ========================================

    else {

      menu += `

        <a href="connexion.html">
          🔐 Se connecter
        </a>

        <a href="inscription.html">
          👤 S'inscrire
        </a>

      `;

    }


    links.innerHTML = menu;


    // ========================================
    // DÉCONNEXION
    // ========================================

    const logoutButton =
      document.getElementById("menuLogout");

    logoutButton?.addEventListener("click", async () => {

      const { error } =
        await supabase.auth.signOut();

      if (error) {

        alert(error.message);
        return;

      }

      window.location.href = "index.html";

    });

  }


  // ========================================
  // OUVRIR / FERMER
  // ========================================

  menuButton.addEventListener("click", () => {

    menuPanel.classList.toggle("active");

  });


  // ========================================
  // FERMER
  // ========================================

  document
    .getElementById("menuClose")
    .addEventListener("click", () => {

      menuPanel.classList.remove("active");

    });


  // ========================================
  // CLIQUER EN DEHORS
  // ========================================

  document.addEventListener("click", (event) => {

    if (
      !menuPanel.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {

      menuPanel.classList.remove("active");

    }

  });


  // ========================================
  // INITIALISATION
  // ========================================

  buildMenu();

    }
