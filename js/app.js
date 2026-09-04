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
// ÉLÉMENTS
// ========================================

const homeProfile =
  document.getElementById("homeProfile");

const homeConnexion =
  document.getElementById("homeConnexion");

const homeActions =
  document.getElementById("homeActions");


// ========================================
// UTILISATEUR CONNECTÉ
// ========================================

if (user) {

  // Afficher l'icône 👤

  if (homeProfile) {
    homeProfile.style.display = "flex";
  }


  // Supprimer "Connexion"

  if (homeConnexion) {
    homeConnexion.style.display = "none";
  }


  // Supprimer les boutons
  // Créer mon compte / Se connecter

  if (homeActions) {
    homeActions.style.display = "none";
  }

}
