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

    #menuButton {

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

      transition: 0.2s ease;
    }

    #menuButton:hover {
      background: #064936;
      transform: translateY(-2px);
    }


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

      transition: 0.2s ease;
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
        right: 15px;
        left: 15px;

        width: auto;
      }

    }

  `;

  document.head.appendChild(style);


  // ========================================
  // CONSTRUIRE LE MENU
  // ========================================

  async function buildMenu() {

    const {
      data: { user }
    } = await supabase.auth.getUser();


    const links = document.getElementById("menuLinks");

    if (!links) return;


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
