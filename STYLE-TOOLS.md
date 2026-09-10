# MON SUCCÈS — Code style & tools

Configurations et outils pour garantir un code propre, lisible et reproductible.

## Contenu
- Prettier (formatage HTML/CSS/JS)
- HTMLHint pour la qualité du HTML
- GitHub Actions pour lancer lint à chaque PR

## Install
Ajoute les dépendances (si tu utilises npm):

```bash
npm init -y
npm install --save-dev prettier htmlhint
```

## Scripts
Ajoute ces scripts dans `package.json`:

```json
{
  "scripts": {
    "format": "prettier --write \"**/*.{html,css,js,json,md}\"",
    "lint:html": "htmlhint \"**/*.html\""
  }
}
```

## GitHub Actions
La workflow `ci-lint.yml` lance `npm run lint:html`.

## Remarques
- Si tu préfères yarn, adapte les commandes.
- Je fournis un fichier `.github/workflows/ci-lint.yml` dans la PR qui installe les dépendances et exécute le linter.
