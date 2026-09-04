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
// VÉRIFIER LA CONNEXION
// ========================================

const {
  data: { user }
} = await supabase.auth.getUser();


// ========================================
// ÉLÉMENTS DE LA PAGE D'ACCUEIL
// ========================================

const connexionLinks =
  document.querySelectorAll('a[href="connexion.html"]');

const inscriptionLinks =
  document.querySelectorAll('a[href="inscription.html"]');


// ========================================
// UTILISATEUR CONNECTÉ
// ========================================

if (user) {

  // ----------------------------------------
  // MENU "CONNEXION" → "MON COMPTE"
  // ----------------------------------------

  connexionLinks.forEach((link) => {

    link.textContent = "Mon compte";

    link.href = "compte.html";

  });


  // ----------------------------------------
  // BOUTONS D'INSCRIPTION
  // ----------------------------------------

  inscriptionLinks.forEach((link) => {

    const text =
      link.textContent.trim().toLowerCase();

    // Boutons "Créer mon compte"
    if (text.includes("créer mon compte")) {

      link.textContent = "Mon compte";

      link.href = "compte.html";

    }

  });


// ========================================
// UTILISATEUR NON CONNECTÉ
// ========================================

} else {

  // Rien à modifier.
  // La page garde ses boutons
  // "Créer mon compte" et "Se connecter".

}
