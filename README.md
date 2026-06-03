# Entraînement SQL — Thème Assurances

Plateforme web d'entraînement SQL sur le thème des assurances vie.

L'utilisateur écrit de vraies requêtes SQL dans le navigateur, les exécute sur une base SQLite et reçoit un retour pédagogique immédiat. Aucun backend, aucune installation de base de données.

---

## Fonctionnalités

- **45 exercices** répartis en 9 catégories : lecture, filtres, agrégations, jointures, insertions, modifications, suppressions, structure de BDD, requêtes avancées
- **Éditeur SQL** avec coloration syntaxique, numéros de ligne et raccourci `Ctrl + Entrée`
- **Validation par résultat** : deux requêtes différentes produisant le même résultat sont toutes les deux acceptées
- **Indice et solution** disponibles à la demande
- **Schéma de base de données** toujours visible + aperçu des données réelles
- **Progression sauvegardée** en localStorage — reprise automatique après fermeture
- **Bilan final** : taux de réussite, réussites du premier coup, indices et solutions utilisés
- **Réinitialisation** propre de la base avant chaque exercice INSERT / UPDATE / DELETE

---

## Prérequis

- **Node.js 18 ou supérieur** — [télécharger](https://nodejs.org/)
- **npm 9 ou supérieur** (inclus avec Node.js)
- Un navigateur moderne avec support WebAssembly : Chrome 80+, Firefox 78+, Edge 80+, Safari 14+

Vérifier la version installée :

```bash
node --version   # doit afficher v18.x ou plus
npm --version    # doit afficher 9.x ou plus
```

---

## Installation — Mac

```bash
# 1. Ouvrir le Terminal et aller dans le dossier du projet
cd "/Users/killian/Desktop/EPSI/Entraînement SQL"

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```

Ouvrir ensuite **http://localhost:5173** dans le navigateur.

---

## Installation — Windows

```bash
# 1. Ouvrir l'Invite de commandes ou PowerShell et aller dans le dossier
cd "C:\chemin\vers\Entraînement SQL"

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```

Ouvrir ensuite **http://localhost:5173** dans le navigateur.

> Sur Windows, si le chemin contient des espaces ou des caractères accentués, utiliser des guillemets autour du chemin.

---

## Commandes

| Commande | Description |
|---|---|
| `npm install` | Installe les dépendances (à faire une seule fois) |
| `npm run dev` | Lance le serveur local sur http://localhost:5173 |
| `npm run build` | Compile le projet pour la production dans `dist/` |
| `npm run preview` | Prévisualise le build de production localement |

---

## Structure du projet

```
Entraînement SQL/
├── index.html                  # Page HTML principale
├── vite.config.js              # Configuration Vite + copie des fichiers WASM
├── package.json                # Dépendances (Vite, sql.js, CodeMirror)
│
└── src/
    ├── main.js                 # Point d'entrée : état global, navigation, vérification
    │
    ├── db/
    │   ├── init.js             # Chargement de sql.js + création du schéma + seed
    │   ├── schema.js           # DDL des 5 tables + définition pour le panneau schéma
    │   ├── seed.js             # 139 lignes de données réalistes (INSERT)
    │   └── reset.js            # Réinitialisation complète avant chaque exercice mutatif
    │
    ├── exercises/
    │   ├── index.js            # Les 45 exercices SQL
    │   └── categories.js       # Définition des 9 catégories
    │
    ├── validation/
    │   └── validator.js        # Moteur de comparaison de résultats SQL
    │
    ├── ui/
    │   ├── navigation.js       # Sidebar : catégories et liste d'exercices
    │   ├── editor.js           # Éditeur CodeMirror v6
    │   ├── results.js          # Affichage des tableaux de résultats
    │   ├── feedback.js         # Indice, solution, explication
    │   ├── schema-panel.js     # Panneau schéma + onglet données
    │   └── summary.js          # Page bilan final
    │
    ├── storage/
    │   └── progress.js         # Lecture / écriture localStorage
    │
    └── styles/
        ├── main.css            # Variables CSS, boutons, badges
        ├── layout.css          # Grille principale, sidebar, panneaux
        └── editor.css          # Styles CodeMirror, tableaux, feedback
```

---

## Base de données

La base contient 5 tables dans un contexte assurance vie personnelle :

| Table | Lignes | Description |
|---|---|---|
| `clients` | 25 | Nom, prénom, ville, âge, email |
| `contrats_vie` | 28 | Type, montant, statut, date d'ouverture, conseiller |
| `paiements` | 50 | Montant, date, mode de paiement par contrat |
| `conseillers` | 6 | Nom, agence, ville |
| `beneficiaires` | 30 | Lien de parenté, pourcentage par contrat |

**Valeurs importantes** (sans accents pour la comparaison SQL) :

- Statuts : `Actif`, `Suspendu`, `Cloture`
- Types : `Assurance Vie`, `PER`, `Prevoyance`, `Epargne`
- Modes de paiement : `Virement`, `Prelevement automatique`, `Cheque`
- Villes : `Rennes`, `Bruz`, `Pace`, `Mordelles`, `Cesson-Sevigne`, `Saint-Malo`, `Vannes`, `Nantes`

---

## Ajouter un exercice

Ouvrir `src/exercises/index.js` et ajouter un objet à la fin du tableau `exercises` :

```js
{
  id: 46,                          // Identifiant unique (incrémenter)
  title: 'Titre de l\'exercice',
  category: 'lecture',             // Voir src/exercises/categories.js
  difficulty: 'Facile',            // Facile | Moyen | Difficile
  statement: 'Énoncé réaliste sans mention de commande SQL.',
  hint: 'Indice léger, sans donner la solution.',
  solutionSql: `SELECT * FROM clients;`,
  expectedSql: `SELECT * FROM clients;`,   // SQL de référence pour valider
  explanation: 'Explication pédagogique après réussite.',

  // Champs optionnels :
  orderedResult: false,   // true si l'ORDER BY fait partie de la réponse attendue
  resetBefore: false,     // true pour INSERT / UPDATE / DELETE / DDL
  setupSql: null,         // SQL à exécuter avant la requête utilisateur (ex: CREATE TABLE)
}
```

**Catégories disponibles :** `lecture`, `filtres`, `agregations`, `jointures`, `insertions`, `modifications`, `suppressions`, `structure`, `avancees`

**Pour les exercices mutatifs** (INSERT / UPDATE / DELETE / DDL) :
- Mettre `resetBefore: true`
- `expectedSql` doit être une requête de vérification (ex: `SELECT COUNT(*) FROM ...`) qui retourne le résultat attendu *après* la mutation

---

## Modifier les données

Les données de démonstration se trouvent dans `src/db/seed.js`.

Après modification, recharger la page — la base est rechargée à chaque démarrage de l'application.

Si les exercices existants font référence à des valeurs précises (noms, ids, villes), vérifier que les `expectedSql` restent cohérents après modification.

---

## Réinitialiser la progression

### Via l'interface

Ouvrir le **Bilan final** (bouton en bas de la sidebar) puis cliquer **Recommencer l'entraînement**. Un dialogue de confirmation s'affiche.

### Via la console du navigateur

Ouvrir les outils développeur (`F12`) → onglet **Console** et saisir :

```js
localStorage.removeItem('sql_trainer_progress')
localStorage.removeItem('sql_trainer_current')
location.reload()
```

### Manuellement

Supprimer les entrées `sql_trainer_progress` et `sql_trainer_current` dans les outils développeur → onglet **Application** → **Local Storage**.

---

## Problèmes fréquents

### La page reste bloquée sur l'écran de chargement

- Vérifier que Node.js est en version 18 ou supérieure : `node --version`
- Relancer `npm install` puis `npm run dev`
- Vider le cache du navigateur (`Ctrl + Shift + R` ou `Cmd + Shift + R`)
- Vérifier la console du navigateur (`F12`) pour les messages d'erreur

### Le port 5173 est déjà utilisé

```bash
npm run dev -- --port 5174
```

Ouvrir ensuite http://localhost:5174

### Une requête correcte est refusée

- Vérifier les valeurs textuelles : les données n'ont **pas d'accents** (`Prevoyance` et non `Prévoyance`, `Cloture` et non `Clôturé`, `Cesson-Sevigne` et non `Cesson-Sévigné`)
- Les noms de colonnes sont sensibles à la casse (`nom`, `prenom`, `ville`…)
- Pour les exercices avec `orderedResult: true`, le ORDER BY doit correspondre exactement

### La validation échoue sur un exercice INSERT / UPDATE / DELETE

La base est **réinitialisée avant chaque vérification**. Si une requête modifie la base et que la vérification échoue, c'est que le résultat produit ne correspond pas au résultat attendu, pas que la base est dans un mauvais état.

### WebAssembly not supported

Le navigateur doit supporter WebAssembly. Mettre à jour le navigateur ou en utiliser un autre (Chrome recommandé).

---

## Statut final du projet

| Élément | Statut |
|---|---|
| Interface complète | ✅ |
| Base de données SQLite (browser) | ✅ |
| 45 exercices (9 catégories) | ✅ |
| Moteur de validation par résultat | ✅ |
| Exercices SELECT / WHERE / ORDER BY | ✅ |
| Exercices GROUP BY / HAVING | ✅ |
| Exercices INNER JOIN / LEFT JOIN | ✅ |
| Exercices INSERT / UPDATE / DELETE | ✅ |
| Exercices CREATE / ALTER / DROP TABLE | ✅ |
| Sous-requêtes / EXISTS / UNION | ✅ |
| Persistance localStorage | ✅ |
| Bilan final avec stats | ✅ |
| Tests navigateur (Playwright) | 47 / 47 passés |

```bash
npm install && npm run dev
# → http://localhost:5173
```
