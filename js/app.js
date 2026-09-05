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
// VÉRIFIER LA SESSION
// ========================================

const {
  data: { user }
} = await supabase.auth.getUser();


// ========================================
// ÉLÉMENTS DE LA PAGE D'ACCUEIL
// ========================================

const homeProfile =
  document.getElementById("homeProfile");

const homeConnexion =
  document.getElementById("homeConnexion");

const homeActions =
  document.getElementById("homeActions");


// ========================================
// UTILISATEUR CONNECTÉ — ACCUEIL
// ========================================

if (user) {

  if (homeProfile) {
    homeProfile.style.display = "flex";
  }

  if (homeConnexion) {
    homeConnexion.style.display = "none";
  }

  if (homeActions) {
    homeActions.style.display = "none";
  }

}


// ========================================
// MENU
// ========================================

const menuButton =
  document.getElementById("menuButton");


// Si la page possède un bouton menu
if (menuButton) {

  // ======================================
  // PANNEAU DU MENU
  // ======================================

  const menuPanel =
    document.createElement("div");

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


  // ======================================
  // STYLE DU MENU
  // ======================================

  const style =
    document.createElement("style");

  style.textContent = `

    #menuPanel {

      position: fixed;

      top: 90px;
      right: 15px;

      width: 280px;

      background: white;

      border: 1px solid #e2e9e6;
      border-radius: 20px;

      padding: 18px;

      box-shadow:
        0 15px 45px rgba(0,0,0,0.18);

      z-index: 99999;

      display: none;

      box-sizing: border-box;
    }


    #menuPanel.active {

      display: block;

      animation: menuFade 0.2s ease;
    }


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

      box-sizing: border-box;
    }


    #menuLinks a:hover,
    #menuLinks button:hover {

      background: #e8f5f0;

      color: #0b6b4f;
    }


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


    @media (max-width: 650px) {

      #menuPanel {

        top: 85px;

        left: 15px;

        right: 15px;

        width: auto;

      }

    }

  `;

  document.head.appendChild(style);


  // ======================================
  // CONSTRUIRE LES LIENS
  // ======================================

  const menuLinks =
    document.getElementById("menuLinks");


  let menu = `

    <a href="epargne.html">
      🏦 Épargne
    </a>

    <a href="pret.html">
      🤝 Prêt
    </a>

    <a href="index.html#projets">
      🎯 Projets
    </a>

  `;


  // ======================================
  // UTILISATEUR CONNECTÉ
  // ======================================

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


  // ======================================
  // UTILISATEUR NON CONNECTÉ
  // ======================================

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


  menuLinks.innerHTML = menu;


  // ======================================
  // OUVRIR LE MENU
  // ======================================

  menuButton.addEventListener(
    "click",
    (event) => {

      event.stopPropagation();

      menuPanel.classList.toggle("active");

    }
  );


  // ======================================
  // FERMER LE MENU
  // ======================================

  const menuClose =
    document.getElementById("menuClose");


  menuClose?.addEventListener(
    "click",
    () => {

      menuPanel.classList.remove("active");

    }
  );


  // ======================================
  // CLIQUER EN DEHORS
  // ======================================

  document.addEventListener(
    "click",
    (event) => {

      if (
        !menuPanel.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {

        menuPanel.classList.remove("active");

      }

    }
  );


  // ======================================
  // DÉCONNEXION
  // ======================================

  const logoutButton =
    document.getElementById("menuLogout");


  logoutButton?.addEventListener(
    "click",
    async () => {

      const { error } =
        await supabase.auth.signOut();

      if (error) {

        alert(error.message);

        return;

      }

      window.location.href = "index.html";

    }
  );

}
