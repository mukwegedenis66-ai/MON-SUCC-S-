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

  const headerContainer =
    header.querySelector(".container");

  if (!headerContainer) {

    console.warn("Conteneur du header introuvable.");

  } else {


    // ========================================
    // BOUTON MENU
    // ========================================

    let menuButton =
      document.getElementById("menuButton");


    if (!menuButton) {

      menuButton =
        document.createElement("button");

      menuButton.id = "menuButton";

      menuButton.type = "button";

      menuButton.setAttribute(
        "aria-label",
        "Ouvrir le menu"
      );

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );

      menuButton.innerHTML = "☰";

      headerContainer.appendChild(menuButton);

    }


    // ========================================
    // PANNEAU DU MENU
    // ========================================

    let menuPanel =
      document.getElementById("menuPanel");


    if (!menuPanel) {

      menuPanel =
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

    }


    // ========================================
    // STYLE
    // ========================================

    const style =
      document.createElement("style");


    style.textContent = `

      /* ========================================
         HEADER
      ======================================== */

      header {
        position: sticky;
        top: 0;
        z-index: 1000;
      }


      header .container {

        position: relative !important;

        display: flex !important;

        flex-direction: row !important;

        align-items: center !important;

        justify-content: space-between !important;

        min-height: 72px !important;

      }


      /* ========================================
         BOUTON MENU
      ======================================== */

      #menuButton {

        position: absolute !important;

        top: 50% !important;

        right: 0 !important;

        transform: translateY(-50%) !important;

        width: 58px !important;

        height: 58px !important;

        border: none !important;

        border-radius: 18px !important;

        background: #0b6b4f !important;

        color: white !important;

        font-size: 32px !important;

        line-height: 1 !important;

        cursor: pointer !important;

        display: flex !important;

        align-items: center !important;

        justify-content: center !important;

        box-shadow:
          0 6px 18px rgba(0,0,0,0.15);

        z-index: 1001 !important;

        transition:
          background 0.2s ease,
          transform 0.2s ease;

      }


      #menuButton:hover {

        background: #064936 !important;

      }


      #menuButton:active {

        transform:
          translateY(-50%)
          scale(0.96) !important;

      }


      /* ========================================
         PANNEAU
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

      }


      #menuPanel.active {

        display: block;

        animation: menuFade 0.2s ease;

      }


      /* ========================================
         EN-TÊTE DU MENU
      ======================================== */

      .menu-header {

        display: flex;

        align-items: center;

        justify-content: space-between;

        padding-bottom: 14px;

        border-bottom:
          1px solid #e2e9e6;

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
         LIENS
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

        border-top:
          1px solid #e2e9e6;

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

          position: relative !important;

          display: flex !important;

          flex-direction: row !important;

          align-items: center !important;

          justify-content: flex-start !important;

          min-height: 72px !important;

          padding-right: 75px !important;

        }


        #menuButton {

          right: 0 !important;

          top: 50% !important;

          transform:
            translateY(-50%) !important;

        }


        #menuPanel {

          top: 85px;

          left: 15px;

          right: 15px;

          width: auto;

        }

      }

    `;


    // IMPORTANT
    document.head.appendChild(style);


    // ========================================
    // CONSTRUIRE LE MENU
    // ========================================

    async function buildMenu() {

      const {
        data: { user }
      } = await supabase.auth.getUser();


      const links =
        document.getElementById("menuLinks");


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
      // CONNECTÉ
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
      // NON CONNECTÉ
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


      logoutButton?.addEventListener(
        "click",
        async () => {

          const { error } =
            await supabase.auth.signOut();


          if (error) {

            alert(error.message);

            return;

          }


          window.location.href =
            "index.html";

        }
      );

    }


    // ========================================
    // OUVRIR / FERMER
    // ========================================

    menuButton.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();

        const isOpen =
          menuPanel.classList.toggle("active");

        menuButton.setAttribute(
          "aria-expanded",
          isOpen ? "true" : "false"
        );

      }
    );


    // ========================================
    // FERMER
    // ========================================

    document
      .getElementById("menuClose")
      ?.addEventListener(
        "click",
        () => {

          menuPanel.classList.remove("active");

          menuButton.setAttribute(
            "aria-expanded",
            "false"
          );

        }
      );


    // ========================================
    // CLIQUER À L'EXTÉRIEUR
    // ========================================

    document.addEventListener(
      "click",
      (event) => {

        if (
          !menuPanel.contains(event.target) &&
          !menuButton.contains(event.target)
        ) {

          menuPanel.classList.remove("active");

          menuButton.setAttribute(
            "aria-expanded",
            "false"
          );

        }

      }
    );


    // ========================================
    // INITIALISATION
    // ========================================

    buildMenu();

  }

}
