# Solutions — Entraînement SQL Thème Assurances

Solutions de référence des 45 exercices.

> La plateforme accepte toute requête produisant le même résultat, pas uniquement celle-ci.

---

## Lecture simple

### Ex 1 — Liste complète des clients
```sql
SELECT * FROM clients;
```

### Ex 2 — Nom, prénom et ville de chaque client
```sql
SELECT nom, prenom, ville FROM clients;
```

### Ex 3 — Les 5 premiers contrats
```sql
SELECT * FROM contrats_vie LIMIT 5;
```

### Ex 4 — Villes sans doublons
```sql
SELECT DISTINCT ville FROM clients;
```

### Ex 5 — Export des identifiants et emails
```sql
SELECT id, email FROM clients ORDER BY id;
```

---

## Filtres et tris

### Ex 6 — Clients de Rennes
```sql
SELECT * FROM clients WHERE ville = 'Rennes';
```

### Ex 7 — Contrats actifs par montant décroissant
```sql
SELECT * FROM contrats_vie WHERE statut = 'Actif' ORDER BY montant DESC;
```

### Ex 8 — Clients entre 30 et 45 ans
```sql
SELECT nom, prenom, age, ville FROM clients WHERE age BETWEEN 30 AND 45;
```

### Ex 9 — Contrats Assurance Vie ou PER
```sql
SELECT * FROM contrats_vie WHERE type_contrat IN ('Assurance Vie', 'PER');
```

### Ex 10 — Clients dont le nom commence par L
```sql
SELECT * FROM clients WHERE nom LIKE 'L%';
```

### Ex 11 — Contrats ouverts entre 2019 et 2021
```sql
SELECT * FROM contrats_vie WHERE date_ouverture BETWEEN '2019-01-01' AND '2021-12-31';
```

---

## Agrégations

### Ex 12 — Nombre total de clients
```sql
SELECT COUNT(*) AS nb_clients FROM clients;
```

### Ex 13 — Somme des montants des contrats actifs
```sql
SELECT SUM(montant) AS total_actifs FROM contrats_vie WHERE statut = 'Actif';
```

### Ex 14 — Montant moyen par type de contrat
```sql
SELECT type_contrat, AVG(montant) AS montant_moyen FROM contrats_vie GROUP BY type_contrat;
```

### Ex 15 — Montant minimum et maximum des contrats
```sql
SELECT MIN(montant) AS montant_min, MAX(montant) AS montant_max FROM contrats_vie;
```

### Ex 16 — Nombre de clients par ville
```sql
SELECT ville, COUNT(*) AS nb_clients FROM clients GROUP BY ville ORDER BY nb_clients DESC;
```

### Ex 17 — Répartition des contrats par statut
```sql
SELECT statut, COUNT(*) AS nb_contrats FROM contrats_vie GROUP BY statut;
```

### Ex 18 — Types de contrats avec plus de 6 souscriptions
```sql
SELECT type_contrat, COUNT(*) AS nb FROM contrats_vie GROUP BY type_contrat HAVING nb > 6;
```

---

## Jointures

### Ex 19 — Clients avec leurs contrats
```sql
SELECT c.nom, c.prenom, cv.type_contrat, cv.montant
FROM clients c
INNER JOIN contrats_vie cv ON c.id = cv.client_id;
```

### Ex 20 — Clients sans aucun contrat
```sql
SELECT c.nom, c.prenom, c.ville
FROM clients c
LEFT JOIN contrats_vie cv ON c.id = cv.client_id
WHERE cv.id IS NULL;
```

### Ex 21 — Conseiller responsable de chaque contrat actif
```sql
SELECT co.nom AS conseiller, cv.type_contrat, cv.montant
FROM contrats_vie cv
INNER JOIN conseillers co ON cv.conseiller_id = co.id
WHERE cv.statut = 'Actif';
```

### Ex 22 — Clients, contrats et paiements
```sql
SELECT c.nom, c.prenom, cv.type_contrat, p.montant AS montant_paiement, p.date_paiement
FROM clients c
INNER JOIN contrats_vie cv ON c.id = cv.client_id
INNER JOIN paiements p ON cv.id = p.contrat_id;
```

### Ex 23 — Total des paiements versés par client
```sql
SELECT c.nom, c.prenom, SUM(p.montant) AS total_paiements
FROM clients c
INNER JOIN contrats_vie cv ON c.id = cv.client_id
INNER JOIN paiements p ON cv.id = p.contrat_id
GROUP BY c.id, c.nom, c.prenom;
```

### Ex 24 — Bénéficiaires des contrats de Claire Robin (id = 12)
```sql
SELECT b.nom, b.prenom, b.lien_parente, b.pourcentage
FROM beneficiaires b
INNER JOIN contrats_vie cv ON b.contrat_id = cv.id
WHERE cv.client_id = 12;
```

---

## Insertions

> Ces exercices modifient la base. La base est réinitialisée automatiquement après chaque vérification.

### Ex 25 — Enregistrer un nouveau client
```sql
INSERT INTO clients (id, nom, prenom, ville, age, email)
VALUES (26, 'Durand', 'Pierre', 'Rennes', 35, 'pierre.durand@mail.fr');
```

### Ex 26 — Ajouter un nouveau conseiller
```sql
INSERT INTO conseillers (id, nom, agence, ville)
VALUES (7, 'Garnier', 'Agence Nantes Sud', 'Nantes');
```

### Ex 27 — Créer un nouveau contrat
```sql
INSERT INTO contrats_vie (id, client_id, conseiller_id, type_contrat, montant, statut, date_ouverture)
VALUES (29, 1, 1, 'Prevoyance', 8000.00, 'Actif', '2024-06-01');
```

### Ex 28 — Enregistrer plusieurs paiements
```sql
INSERT INTO paiements (id, contrat_id, montant, date_paiement, mode_paiement)
VALUES
  (51, 7, 600.00, '2024-05-01', 'Virement'),
  (52, 7, 600.00, '2024-06-01', 'Virement');
```

---

## Modifications

> Ces exercices modifient la base. La base est réinitialisée automatiquement après chaque vérification.

### Ex 29 — Suspendre un contrat
```sql
UPDATE contrats_vie SET statut = 'Suspendu' WHERE id = 7;
```

### Ex 30 — Mettre à jour l'email d'un client
```sql
UPDATE clients SET email = 'thomas.leconte@groupama.fr' WHERE id = 1;
```

### Ex 31 — Revalorisation des contrats Epargne (+5 %)
```sql
UPDATE contrats_vie SET montant = montant * 1.05 WHERE type_contrat = 'Epargne';
```

### Ex 32 — Clôturer tous les contrats suspendus
```sql
UPDATE contrats_vie SET statut = 'Cloture' WHERE statut = 'Suspendu';
```

---

## Suppressions

> Ces exercices modifient la base. La base est réinitialisée automatiquement après chaque vérification.

### Ex 33 — Supprimer un client sans contrat
```sql
DELETE FROM clients WHERE id = 22;
```

### Ex 34 — Archiver les contrats clôturés
```sql
DELETE FROM contrats_vie WHERE statut = 'Cloture';
```

### Ex 35 — Supprimer les paiements d'un contrat
```sql
DELETE FROM paiements WHERE contrat_id = 8;
```

---

## Structure de BDD

> Ces exercices modifient la structure de la base. La base est réinitialisée automatiquement après chaque vérification.

### Ex 36 — Créer une table sinistres
```sql
CREATE TABLE sinistres (
  id                INTEGER PRIMARY KEY,
  contrat_id        INTEGER,
  date_sinistre     TEXT,
  description       TEXT,
  montant_rembourse REAL
);
```

### Ex 37 — Ajouter une colonne telephone à clients
```sql
ALTER TABLE clients ADD COLUMN telephone TEXT;
```

### Ex 38 — Créer une table agences avec contraintes NOT NULL
```sql
CREATE TABLE agences (
  id          INTEGER PRIMARY KEY,
  nom         TEXT    NOT NULL,
  ville       TEXT    NOT NULL,
  code_postal TEXT
);
```

### Ex 39 — Supprimer une table obsolète
```sql
DROP TABLE archive_clients;
```

---

## Requêtes avancées

### Ex 40 — Clients avec un contrat au-dessus de la moyenne
```sql
SELECT DISTINCT c.nom, c.prenom
FROM clients c
INNER JOIN contrats_vie cv ON c.id = cv.client_id
WHERE cv.montant > (SELECT AVG(montant) FROM contrats_vie);
```

### Ex 41 — Contrats sans bénéficiaire désigné (NOT EXISTS)
```sql
SELECT id, type_contrat
FROM contrats_vie
WHERE NOT EXISTS (
  SELECT 1 FROM beneficiaires
  WHERE beneficiaires.contrat_id = contrats_vie.id
);
```

### Ex 42 — Contrats avec au moins un bénéficiaire (EXISTS)
```sql
SELECT id, type_contrat, statut
FROM contrats_vie
WHERE EXISTS (
  SELECT 1 FROM beneficiaires
  WHERE beneficiaires.contrat_id = contrats_vie.id
);
```

### Ex 43 — Toutes les villes couvertes (UNION)
```sql
SELECT DISTINCT ville FROM clients
UNION
SELECT DISTINCT ville FROM conseillers;
```

### Ex 44 — Clients sans contrat Assurance Vie
```sql
SELECT nom, prenom
FROM clients
WHERE NOT EXISTS (
  SELECT 1 FROM contrats_vie
  WHERE contrats_vie.client_id = clients.id
    AND contrats_vie.type_contrat = 'Assurance Vie'
);
```

### Ex 45 — Classement des conseillers par activité
```sql
SELECT co.nom, COUNT(cv.id) AS nb_contrats_actifs
FROM conseillers co
LEFT JOIN contrats_vie cv ON co.id = cv.conseiller_id AND cv.statut = 'Actif'
GROUP BY co.id, co.nom
ORDER BY nb_contrats_actifs DESC;
```

---

## Rappel — valeurs de la base

Les données ne contiennent pas d'accents. Utiliser exactement ces valeurs dans les requêtes :

| Colonne | Valeurs |
|---|---|
| `statut` | `Actif` · `Suspendu` · `Cloture` |
| `type_contrat` | `Assurance Vie` · `PER` · `Prevoyance` · `Epargne` |
| `mode_paiement` | `Virement` · `Prelevement automatique` · `Cheque` |
| `ville` | `Rennes` · `Bruz` · `Pace` · `Mordelles` · `Cesson-Sevigne` · `Saint-Malo` · `Vannes` · `Nantes` |
