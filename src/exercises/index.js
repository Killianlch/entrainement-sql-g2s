export const exercises = [

  // ─── LECTURE SIMPLE ──────────────────────────────────────────────────────────

  {
    id: 1,
    title: 'Liste complète des clients',
    category: 'lecture',
    difficulty: 'Facile',
    statement: 'Affichez la liste complète de tous les clients enregistrés dans la base de données.',
    hint: 'Toutes les colonnes, toutes les lignes — pensez au symbole qui représente "tout".',
    solutionSql: `SELECT * FROM clients;`,
    expectedSql: `SELECT * FROM clients;`,
    explanation: 'SELECT * retourne toutes les colonnes de la table. Ici, 25 clients sont retournés avec l\'ensemble de leurs informations.',
  },

  {
    id: 2,
    title: 'Nom, prénom et ville de chaque client',
    category: 'lecture',
    difficulty: 'Facile',
    statement: 'Votre responsable souhaite un listing simplifié : affichez uniquement le nom, le prénom et la ville de résidence de chaque client.',
    hint: 'Listez les noms de colonnes voulus après SELECT, séparés par des virgules.',
    solutionSql: `SELECT nom, prenom, ville FROM clients;`,
    expectedSql: `SELECT nom, prenom, ville FROM clients;`,
    explanation: 'En listant explicitement les colonnes après SELECT, on n\'affiche que les informations utiles. C\'est une bonne pratique par rapport à SELECT * dans un contexte professionnel.',
  },

  {
    id: 3,
    title: 'Les 5 premiers contrats',
    category: 'lecture',
    difficulty: 'Facile',
    statement: 'Pour une vérification rapide de la structure des données, affichez uniquement les 5 premières lignes de la table des contrats.',
    hint: 'Il existe un mot-clé SQL pour restreindre le nombre de lignes retournées.',
    solutionSql: `SELECT * FROM contrats_vie LIMIT 5;`,
    expectedSql: `SELECT * FROM contrats_vie LIMIT 5;`,
    explanation: 'LIMIT n permet de ne récupérer que les n premières lignes d\'un résultat. Très utile pour explorer une table ou vérifier la structure sans charger toutes les données.',
  },

  {
    id: 4,
    title: 'Villes sans doublons',
    category: 'lecture',
    difficulty: 'Facile',
    statement: 'Dressez la liste des villes dans lesquelles résident nos clients. Chaque ville ne doit apparaître qu\'une seule fois dans le résultat.',
    hint: 'Un mot-clé placé après SELECT permet d\'éliminer automatiquement les doublons.',
    solutionSql: `SELECT DISTINCT ville FROM clients;`,
    expectedSql: `SELECT DISTINCT ville FROM clients;`,
    explanation: 'DISTINCT supprime les doublons dans le résultat. Sans lui, chaque ligne de la table serait retournée, avec des répétitions de villes. Ici, 8 villes distinctes sont identifiées.',
  },

  {
    id: 5,
    title: 'Export des identifiants et emails',
    category: 'lecture',
    difficulty: 'Moyen',
    statement: 'Le service informatique a besoin d\'un export contenant uniquement l\'identifiant et l\'adresse e-mail de chaque client, triés par identifiant croissant.',
    hint: 'Sélectionnez deux colonnes et utilisez un tri sur l\'identifiant.',
    solutionSql: `SELECT id, email FROM clients ORDER BY id;`,
    expectedSql: `SELECT id, email FROM clients ORDER BY id;`,
    orderedResult: true,
    explanation: 'ORDER BY tri le résultat selon la colonne indiquée. Par défaut, le tri est croissant (ASC). On peut aussi écrire ORDER BY id ASC pour être explicite.',
  },

  // ─── FILTRES ET TRIS ─────────────────────────────────────────────────────────

  {
    id: 6,
    title: 'Clients de Rennes',
    category: 'filtres',
    difficulty: 'Facile',
    statement: 'Affichez la liste de tous les clients dont la ville de résidence est Rennes.',
    hint: 'Utilisez une condition sur la colonne ville avec la valeur exacte attendue.',
    solutionSql: `SELECT * FROM clients WHERE ville = 'Rennes';`,
    expectedSql: `SELECT * FROM clients WHERE ville = 'Rennes';`,
    explanation: 'WHERE permet de filtrer les lignes selon une condition. La comparaison de texte avec = est sensible à la casse et aux espaces. Ici, 5 clients habitent Rennes.',
  },

  {
    id: 7,
    title: 'Contrats actifs par montant décroissant',
    category: 'filtres',
    difficulty: 'Facile',
    statement: 'Listez tous les contrats actuellement actifs, du montant souscrit le plus élevé au plus faible.',
    hint: 'Filtrez sur le statut, puis appliquez un tri descendant sur le montant.',
    solutionSql: `SELECT * FROM contrats_vie WHERE statut = 'Actif' ORDER BY montant DESC;`,
    expectedSql: `SELECT * FROM contrats_vie WHERE statut = 'Actif' ORDER BY montant DESC;`,
    orderedResult: true,
    explanation: 'On combine WHERE (filtre sur statut) et ORDER BY ... DESC (tri descendant). DESC signifie du plus grand au plus petit. Sans DESC, le tri serait croissant par défaut.',
  },

  {
    id: 8,
    title: 'Clients entre 30 et 45 ans',
    category: 'filtres',
    difficulty: 'Facile',
    statement: 'Retrouvez les clients dont l\'âge est compris entre 30 et 45 ans inclus, en affichant leur nom, prénom, âge et ville.',
    hint: 'Il existe un opérateur SQL pour tester si une valeur est comprise dans un intervalle.',
    solutionSql: `SELECT nom, prenom, age, ville FROM clients WHERE age BETWEEN 30 AND 45;`,
    expectedSql: `SELECT nom, prenom, age, ville FROM clients WHERE age BETWEEN 30 AND 45;`,
    explanation: 'BETWEEN valeur1 AND valeur2 filtre les lignes dont la valeur est comprise dans l\'intervalle, bornes incluses. Équivalent à WHERE age >= 30 AND age <= 45.',
  },

  {
    id: 9,
    title: 'Contrats Assurance Vie ou PER',
    category: 'filtres',
    difficulty: 'Moyen',
    statement: 'Un audit interne porte sur les produits d\'épargne long terme. Affichez tous les contrats de type "Assurance Vie" ou "PER".',
    hint: 'Pour filtrer sur plusieurs valeurs d\'une même colonne, il existe un opérateur plus pratique que deux conditions OR.',
    solutionSql: `SELECT * FROM contrats_vie WHERE type_contrat IN ('Assurance Vie', 'PER');`,
    expectedSql: `SELECT * FROM contrats_vie WHERE type_contrat IN ('Assurance Vie', 'PER');`,
    explanation: 'IN (valeur1, valeur2, ...) est l\'équivalent condensé de plusieurs conditions OR. Plus lisible et plus maintenable quand on filtre sur de nombreuses valeurs possibles.',
  },

  {
    id: 10,
    title: 'Clients dont le nom commence par L',
    category: 'filtres',
    difficulty: 'Moyen',
    statement: 'Recherchez tous les clients dont le nom de famille commence par la lettre L. Affichez leurs informations complètes.',
    hint: 'Un opérateur de comparaison de texte permet d\'utiliser des caractères jokers.',
    solutionSql: `SELECT * FROM clients WHERE nom LIKE 'L%';`,
    expectedSql: `SELECT * FROM clients WHERE nom LIKE 'L%';`,
    explanation: 'LIKE permet la comparaison de texte avec des caractères jokers. Le % remplace n\'importe quelle suite de caractères. LIKE \'L%\' signifie "commence par L". Le _ remplace un seul caractère.',
  },

  {
    id: 11,
    title: 'Contrats ouverts entre 2019 et 2021',
    category: 'filtres',
    difficulty: 'Moyen',
    statement: 'Identifiez les contrats qui ont été ouverts entre le 1er janvier 2019 et le 31 décembre 2021. Affichez toutes leurs informations.',
    hint: 'Les dates sont stockées au format texte AAAA-MM-JJ, ce qui permet de les comparer alphabétiquement avec BETWEEN.',
    solutionSql: `SELECT * FROM contrats_vie WHERE date_ouverture BETWEEN '2019-01-01' AND '2021-12-31';`,
    expectedSql: `SELECT * FROM contrats_vie WHERE date_ouverture BETWEEN '2019-01-01' AND '2021-12-31';`,
    explanation: 'SQLite stocke les dates sous forme de texte ISO 8601 (AAAA-MM-JJ). Grâce à ce format, la comparaison alphabétique correspond à la comparaison chronologique. BETWEEN fonctionne donc correctement sur les dates.',
  },

  // ─── AGRÉGATIONS ─────────────────────────────────────────────────────────────

  {
    id: 12,
    title: 'Nombre total de clients',
    category: 'agregations',
    difficulty: 'Facile',
    statement: 'Combien de clients sont actuellement enregistrés dans la base de données ?',
    hint: 'Une fonction SQL permet de compter le nombre de lignes dans un résultat.',
    solutionSql: `SELECT COUNT(*) AS nb_clients FROM clients;`,
    expectedSql: `SELECT COUNT(*) AS nb_clients FROM clients;`,
    explanation: 'COUNT(*) compte toutes les lignes du résultat, y compris celles avec des valeurs NULL. AS permet de donner un alias à la colonne calculée pour la rendre plus lisible.',
  },

  {
    id: 13,
    title: 'Somme des montants des contrats actifs',
    category: 'agregations',
    difficulty: 'Facile',
    statement: 'Calculez la somme totale des montants de tous les contrats actuellement actifs.',
    hint: 'Combinez une fonction d\'agrégation avec un filtre sur le statut.',
    solutionSql: `SELECT SUM(montant) AS total_actifs FROM contrats_vie WHERE statut = 'Actif';`,
    expectedSql: `SELECT SUM(montant) AS total_actifs FROM contrats_vie WHERE statut = 'Actif';`,
    explanation: 'SUM(colonne) calcule la somme de toutes les valeurs de la colonne. On peut combiner les fonctions d\'agrégation avec WHERE pour n\'agréger qu\'une partie des données. Résultat : 824 000 €.',
  },

  {
    id: 14,
    title: 'Montant moyen par type de contrat',
    category: 'agregations',
    difficulty: 'Moyen',
    statement: 'Calculez le montant moyen des contrats pour chaque type de produit proposé par la société.',
    hint: 'Regroupez les lignes par type de contrat, puis calculez la moyenne dans chaque groupe.',
    solutionSql: `SELECT type_contrat, AVG(montant) AS montant_moyen FROM contrats_vie GROUP BY type_contrat;`,
    expectedSql: `SELECT type_contrat, AVG(montant) AS montant_moyen FROM contrats_vie GROUP BY type_contrat;`,
    explanation: 'GROUP BY regroupe les lignes ayant la même valeur dans la colonne indiquée. AVG(montant) calcule alors la moyenne dans chaque groupe. Toute colonne SELECT qui n\'est pas une agrégation doit apparaître dans GROUP BY.',
  },

  {
    id: 15,
    title: 'Montant minimum et maximum des contrats',
    category: 'agregations',
    difficulty: 'Moyen',
    statement: 'Quels sont le montant le plus faible et le montant le plus élevé parmi tous les contrats du portefeuille ?',
    hint: 'Deux fonctions d\'agrégation peuvent être utilisées dans la même requête.',
    solutionSql: `SELECT MIN(montant) AS montant_min, MAX(montant) AS montant_max FROM contrats_vie;`,
    expectedSql: `SELECT MIN(montant) AS montant_min, MAX(montant) AS montant_max FROM contrats_vie;`,
    explanation: 'MIN et MAX peuvent être combinées dans la même requête. Elles retournent respectivement la valeur la plus faible (10 000 €) et la plus élevée (100 000 €) de la colonne.',
  },

  {
    id: 16,
    title: 'Nombre de clients par ville',
    category: 'agregations',
    difficulty: 'Moyen',
    statement: 'Pour orienter la stratégie commerciale, affichez le nombre de clients par ville, en commençant par les villes les mieux représentées.',
    hint: 'Regroupez par ville, comptez les clients dans chaque groupe, et triez du plus grand au plus petit.',
    solutionSql: `SELECT ville, COUNT(*) AS nb_clients FROM clients GROUP BY ville ORDER BY nb_clients DESC;`,
    expectedSql: `SELECT ville, COUNT(*) AS nb_clients FROM clients GROUP BY ville ORDER BY nb_clients DESC;`,
    orderedResult: true,
    explanation: 'On combine GROUP BY (pour regrouper), COUNT(*) (pour compter dans chaque groupe) et ORDER BY ... DESC (pour trier). Rennes arrive en tête avec 5 clients.',
  },

  {
    id: 17,
    title: 'Répartition des contrats par statut',
    category: 'agregations',
    difficulty: 'Moyen',
    statement: 'Dressez un tableau de bord indiquant combien de contrats sont dans chaque statut (Actif, Suspendu, Clôturé).',
    hint: 'Regroupez les contrats selon leur statut et comptez le nombre de contrats dans chaque groupe.',
    solutionSql: `SELECT statut, COUNT(*) AS nb_contrats FROM contrats_vie GROUP BY statut;`,
    expectedSql: `SELECT statut, COUNT(*) AS nb_contrats FROM contrats_vie GROUP BY statut;`,
    explanation: 'GROUP BY statut crée un groupe par valeur distincte du statut. COUNT(*) compte les contrats dans chaque groupe. Résultat : 21 Actifs, 4 Clôturés, 3 Suspendus.',
  },

  {
    id: 18,
    title: 'Types de contrats avec plus de 6 souscriptions',
    category: 'agregations',
    difficulty: 'Difficile',
    statement: 'Identifiez les types de contrats pour lesquels le nombre total de contrats souscrits dépasse 6.',
    hint: 'Après avoir regroupé et compté, il est possible de filtrer sur le résultat d\'une agrégation — mais pas avec WHERE.',
    solutionSql: `SELECT type_contrat, COUNT(*) AS nb FROM contrats_vie GROUP BY type_contrat HAVING nb > 6;`,
    expectedSql: `SELECT type_contrat, COUNT(*) AS nb FROM contrats_vie GROUP BY type_contrat HAVING nb > 6;`,
    explanation: 'HAVING filtre sur le résultat des agrégations, là où WHERE ne peut pas être utilisé. WHERE s\'applique avant le GROUP BY (sur les lignes brutes), HAVING s\'applique après (sur les groupes). Résultat : Assurance Vie (9) et PER (8).',
  },

  // ─── JOINTURES ───────────────────────────────────────────────────────────────

  {
    id: 19,
    title: 'Clients avec leurs contrats',
    category: 'jointures',
    difficulty: 'Facile',
    statement: 'Affichez le nom et le prénom de chaque client ainsi que le type et le montant de ses contrats.',
    hint: 'Reliez deux tables par leur colonne commune : l\'identifiant client.',
    solutionSql: `SELECT c.nom, c.prenom, cv.type_contrat, cv.montant
FROM clients c
INNER JOIN contrats_vie cv ON c.id = cv.client_id;`,
    expectedSql: `SELECT c.nom, c.prenom, cv.type_contrat, cv.montant FROM clients c INNER JOIN contrats_vie cv ON c.id = cv.client_id;`,
    explanation: 'INNER JOIN combine les lignes de deux tables selon la condition ON. Seules les lignes ayant une correspondance dans les deux tables apparaissent. Les clients sans contrat sont exclus. On obtient 28 lignes (une par contrat).',
  },

  {
    id: 20,
    title: 'Clients sans aucun contrat',
    category: 'jointures',
    difficulty: 'Moyen',
    statement: 'Le service marketing souhaite contacter les clients n\'ayant encore souscrit aucun contrat. Listez leur nom, prénom et ville.',
    hint: 'Une jointure qui conserve tous les enregistrements d\'une table, même sans correspondance dans l\'autre, peut révéler les absences.',
    solutionSql: `SELECT c.nom, c.prenom, c.ville
FROM clients c
LEFT JOIN contrats_vie cv ON c.id = cv.client_id
WHERE cv.id IS NULL;`,
    expectedSql: `SELECT c.nom, c.prenom, c.ville FROM clients c LEFT JOIN contrats_vie cv ON c.id = cv.client_id WHERE cv.id IS NULL;`,
    explanation: 'LEFT JOIN retourne tous les clients, même ceux sans contrat (cv.id sera NULL pour eux). Le filtre WHERE cv.id IS NULL permet d\'isoler uniquement ces clients. 4 clients n\'ont aucun contrat.',
  },

  {
    id: 21,
    title: 'Conseiller responsable de chaque contrat actif',
    category: 'jointures',
    difficulty: 'Moyen',
    statement: 'Pour chaque contrat actuellement actif, affichez le nom du conseiller qui le gère, le type de contrat et son montant.',
    hint: 'Joignez la table des contrats à celle des conseillers via l\'identifiant conseiller.',
    solutionSql: `SELECT co.nom AS conseiller, cv.type_contrat, cv.montant
FROM contrats_vie cv
INNER JOIN conseillers co ON cv.conseiller_id = co.id
WHERE cv.statut = 'Actif';`,
    expectedSql: `SELECT co.nom AS conseiller, cv.type_contrat, cv.montant FROM contrats_vie cv INNER JOIN conseillers co ON cv.conseiller_id = co.id WHERE cv.statut = 'Actif';`,
    explanation: 'On joint contrats_vie à conseillers via la clé étrangère conseiller_id. On peut cumuler JOIN et WHERE. L\'alias AS conseiller renomme la colonne dans le résultat. 21 contrats actifs sont retournés.',
  },

  {
    id: 22,
    title: 'Clients, contrats et paiements',
    category: 'jointures',
    difficulty: 'Moyen',
    statement: 'Affichez le nom du client, le type de son contrat, le montant de chaque paiement effectué et sa date.',
    hint: 'Trois tables sont nécessaires : commencez par joindre les clients aux contrats, puis les contrats aux paiements.',
    solutionSql: `SELECT c.nom, c.prenom, cv.type_contrat, p.montant AS montant_paiement, p.date_paiement
FROM clients c
INNER JOIN contrats_vie cv ON c.id = cv.client_id
INNER JOIN paiements p ON cv.id = p.contrat_id;`,
    expectedSql: `SELECT c.nom, c.prenom, cv.type_contrat, p.montant AS montant_paiement, p.date_paiement FROM clients c INNER JOIN contrats_vie cv ON c.id = cv.client_id INNER JOIN paiements p ON cv.id = p.contrat_id;`,
    explanation: 'On peut enchaîner plusieurs INNER JOIN dans une même requête. Chaque JOIN ajoute une table en précisant la condition de liaison. Ici, 50 lignes sont retournées (une par paiement enregistré).',
  },

  {
    id: 23,
    title: 'Total des paiements versés par client',
    category: 'jointures',
    difficulty: 'Difficile',
    statement: 'Calculez le montant total des paiements versés par chaque client ayant effectué au moins un paiement. Affichez son nom, son prénom et le total.',
    hint: 'Joignez trois tables, puis regroupez par client pour agréger les paiements.',
    solutionSql: `SELECT c.nom, c.prenom, SUM(p.montant) AS total_paiements
FROM clients c
INNER JOIN contrats_vie cv ON c.id = cv.client_id
INNER JOIN paiements p ON cv.id = p.contrat_id
GROUP BY c.id, c.nom, c.prenom;`,
    expectedSql: `SELECT c.nom, c.prenom, SUM(p.montant) AS total_paiements FROM clients c INNER JOIN contrats_vie cv ON c.id = cv.client_id INNER JOIN paiements p ON cv.id = p.contrat_id GROUP BY c.id, c.nom, c.prenom;`,
    explanation: 'On combine jointure multi-table et agrégation. Le GROUP BY regroupe par client (id, nom, prenom). SUM additionne tous les paiements du client, y compris ceux de ses différents contrats. 16 clients ont au moins un paiement.',
  },

  {
    id: 24,
    title: 'Bénéficiaires des contrats de Claire Robin',
    category: 'jointures',
    difficulty: 'Difficile',
    statement: 'Affichez les bénéficiaires désignés sur l\'ensemble des contrats du client dont l\'identifiant est 12. Indiquez leur nom, prénom, lien de parenté et pourcentage.',
    hint: 'Joignez les bénéficiaires aux contrats, puis filtrez sur l\'identifiant client.',
    solutionSql: `SELECT b.nom, b.prenom, b.lien_parente, b.pourcentage
FROM beneficiaires b
INNER JOIN contrats_vie cv ON b.contrat_id = cv.id
WHERE cv.client_id = 12;`,
    expectedSql: `SELECT b.nom, b.prenom, b.lien_parente, b.pourcentage FROM beneficiaires b INNER JOIN contrats_vie cv ON b.contrat_id = cv.id WHERE cv.client_id = 12;`,
    explanation: 'La table beneficiaires est reliée aux contrats via contrat_id. En joignant beneficiaires à contrats_vie, on peut filtrer par client_id. Claire Robin a 2 contrats avec 4 bénéficiaires au total.',
  },

  // ─── INSERTIONS ──────────────────────────────────────────────────────────────

  {
    id: 25,
    title: 'Enregistrer un nouveau client',
    category: 'insertions',
    difficulty: 'Facile',
    statement: 'Un nouveau client vient de souscrire ses premiers services. Enregistrez-le dans la base avec les informations suivantes : identifiant 26, nom Durand, prénom Pierre, ville Rennes, âge 35, email pierre.durand@mail.fr.',
    hint: 'La commande d\'insertion nécessite de préciser la table, les colonnes et les valeurs correspondantes.',
    solutionSql: `INSERT INTO clients (id, nom, prenom, ville, age, email)
VALUES (26, 'Durand', 'Pierre', 'Rennes', 35, 'pierre.durand@mail.fr');`,
    expectedSql: `SELECT id, nom, prenom, ville, age, email FROM clients WHERE id = 26;`,
    explanation: 'INSERT INTO ... VALUES permet d\'ajouter une ligne dans une table. Il faut lister les colonnes dans le même ordre que les valeurs fournies. Si toutes les colonnes sont renseignées dans l\'ordre du schéma, la liste des colonnes peut être omise.',
    resetBefore: true,
  },

  {
    id: 26,
    title: 'Ajouter un nouveau conseiller',
    category: 'insertions',
    difficulty: 'Facile',
    statement: 'Une nouvelle agence ouvre à Nantes. Ajoutez son conseiller dans la base : identifiant 7, nom Garnier, agence "Agence Nantes Sud", ville Nantes.',
    hint: 'Identifiez la table concernée et insérez une seule ligne avec les quatre valeurs.',
    solutionSql: `INSERT INTO conseillers (id, nom, agence, ville)
VALUES (7, 'Garnier', 'Agence Nantes Sud', 'Nantes');`,
    expectedSql: `SELECT id, nom, agence, ville FROM conseillers WHERE id = 7;`,
    explanation: 'On cible la table conseillers en précisant les 4 colonnes et leurs valeurs. L\'identifiant 7 est libre car la base ne contient que 6 conseillers (ids 1 à 6).',
    resetBefore: true,
  },

  {
    id: 27,
    title: 'Créer un nouveau contrat',
    category: 'insertions',
    difficulty: 'Moyen',
    statement: 'Le client Leconte Thomas (id = 1) souscrit un nouveau contrat de Prevoyance d\'un montant de 8 000 €, géré par le conseiller Dupont (id = 1), statut Actif, ouvert le 01/06/2024. Utilisez l\'identifiant 29.',
    hint: 'Respectez les types de données : le montant est un nombre décimal, la date est une chaîne au format AAAA-MM-JJ.',
    solutionSql: `INSERT INTO contrats_vie (id, client_id, conseiller_id, type_contrat, montant, statut, date_ouverture)
VALUES (29, 1, 1, 'Prevoyance', 8000.00, 'Actif', '2024-06-01');`,
    expectedSql: `SELECT id, client_id, type_contrat, montant, statut FROM contrats_vie WHERE id = 29;`,
    explanation: 'Il faut respecter l\'ordre et les types de chaque colonne. client_id et conseiller_id sont des clés étrangères : elles doivent référencer des identifiants existants dans leurs tables respectives.',
    resetBefore: true,
  },

  {
    id: 28,
    title: 'Enregistrer plusieurs paiements',
    category: 'insertions',
    difficulty: 'Moyen',
    statement: 'Le contrat numéro 7 a reçu deux nouveaux paiements par virement, le 01/05/2024 et le 01/06/2024, chacun d\'un montant de 600 €. Utilisez les identifiants 51 et 52.',
    hint: 'Il est possible d\'insérer plusieurs lignes en une seule instruction.',
    solutionSql: `INSERT INTO paiements (id, contrat_id, montant, date_paiement, mode_paiement)
VALUES
  (51, 7, 600.00, '2024-05-01', 'Virement'),
  (52, 7, 600.00, '2024-06-01', 'Virement');`,
    expectedSql: `SELECT id, contrat_id, montant, date_paiement, mode_paiement FROM paiements WHERE id IN (51, 52) ORDER BY id;`,
    orderedResult: true,
    explanation: 'INSERT permet d\'insérer plusieurs lignes en une seule requête en ajoutant plusieurs tuples VALUES séparés par des virgules. C\'est plus efficace que plusieurs INSERT séparés.',
    resetBefore: true,
  },

  // ─── MODIFICATIONS ───────────────────────────────────────────────────────────

  {
    id: 29,
    title: 'Suspendre un contrat',
    category: 'modifications',
    difficulty: 'Facile',
    statement: 'Suite à un impayé, le contrat numéro 7 doit être suspendu. Mettez à jour son statut en conséquence.',
    hint: 'La commande de modification cible une table, définit la nouvelle valeur d\'une colonne et filtre sur l\'identifiant.',
    solutionSql: `UPDATE contrats_vie SET statut = 'Suspendu' WHERE id = 7;`,
    expectedSql: `SELECT id, statut FROM contrats_vie WHERE id = 7;`,
    explanation: 'UPDATE ... SET ... WHERE permet de modifier des lignes existantes. Sans clause WHERE, toutes les lignes seraient modifiées — c\'est une erreur fréquente et dangereuse.',
    resetBefore: true,
  },

  {
    id: 30,
    title: 'Mettre à jour l\'email d\'un client',
    category: 'modifications',
    difficulty: 'Facile',
    statement: 'Le client Leconte Thomas (id = 1) a changé d\'adresse e-mail. Enregistrez sa nouvelle adresse : thomas.leconte@groupama.fr.',
    hint: 'Mettez à jour une seule colonne pour une seule ligne identifiée par son id.',
    solutionSql: `UPDATE clients SET email = 'thomas.leconte@groupama.fr' WHERE id = 1;`,
    expectedSql: `SELECT id, email FROM clients WHERE id = 1;`,
    explanation: 'SET définit la ou les colonnes à modifier avec leur nouvelle valeur. Le WHERE garantit qu\'on ne modifie que le bon client. Sans WHERE, tous les clients auraient le même email.',
    resetBefore: true,
  },

  {
    id: 31,
    title: 'Revalorisation des contrats Epargne',
    category: 'modifications',
    difficulty: 'Moyen',
    statement: 'Dans le cadre d\'une revalorisation annuelle, les montants de tous les contrats de type Epargne doivent être augmentés de 5 %. Effectuez cette mise à jour.',
    hint: 'Le nouveau montant peut être calculé à partir de l\'ancien en utilisant une expression arithmétique dans SET.',
    solutionSql: `UPDATE contrats_vie SET montant = montant * 1.05 WHERE type_contrat = 'Epargne';`,
    expectedSql: `SELECT id, type_contrat, montant FROM contrats_vie WHERE type_contrat = 'Epargne' ORDER BY id;`,
    orderedResult: true,
    explanation: 'SET peut utiliser des expressions : montant = montant * 1.05 multiplie la valeur actuelle par 1.05 (+5 %). Le WHERE cible uniquement les contrats Epargne. 6 contrats sont mis à jour.',
    resetBefore: true,
  },

  {
    id: 32,
    title: 'Clôturer tous les contrats suspendus',
    category: 'modifications',
    difficulty: 'Moyen',
    statement: 'À la fin du trimestre, tous les contrats ayant le statut "Suspendu" doivent passer au statut "Cloture". Effectuez cette mise à jour groupée.',
    hint: 'Un seul UPDATE peut modifier plusieurs lignes si la condition WHERE correspond à plusieurs enregistrements.',
    solutionSql: `UPDATE contrats_vie SET statut = 'Cloture' WHERE statut = 'Suspendu';`,
    expectedSql: `SELECT COUNT(*) AS nb_suspendus FROM contrats_vie WHERE statut = 'Suspendu';`,
    explanation: 'UPDATE avec WHERE sur un statut cible toutes les lignes correspondantes en une seule opération. Après exécution, aucun contrat ne doit avoir le statut Suspendu — COUNT(*) retourne 0.',
    resetBefore: true,
  },

  // ─── SUPPRESSIONS ────────────────────────────────────────────────────────────

  {
    id: 33,
    title: 'Supprimer un client sans contrat',
    category: 'suppressions',
    difficulty: 'Facile',
    statement: 'Le client Henry Léa (id = 22) a demandé la suppression de son compte. Ce client n\'a aucun contrat. Supprimez-le de la base de données.',
    hint: 'La commande de suppression cible une table et filtre sur l\'identifiant pour ne supprimer qu\'un seul enregistrement.',
    solutionSql: `DELETE FROM clients WHERE id = 22;`,
    expectedSql: `SELECT COUNT(*) AS nb FROM clients WHERE id = 22;`,
    explanation: 'DELETE FROM ... WHERE supprime les lignes correspondant à la condition. Sans WHERE, toute la table serait vidée. Vérifier que le client n\'a pas de données liées (contrats, etc.) avant de le supprimer.',
    resetBefore: true,
  },

  {
    id: 34,
    title: 'Archiver les contrats clôturés',
    category: 'suppressions',
    difficulty: 'Moyen',
    statement: 'Dans le cadre d\'un archivage trimestriel, tous les contrats ayant le statut "Cloture" doivent être retirés de la table active. Supprimez-les.',
    hint: 'Filtrez sur le statut pour cibler uniquement les contrats à supprimer.',
    solutionSql: `DELETE FROM contrats_vie WHERE statut = 'Cloture';`,
    expectedSql: `SELECT COUNT(*) AS nb_clotures FROM contrats_vie WHERE statut = 'Cloture';`,
    explanation: 'DELETE avec une condition de statut supprime toutes les lignes correspondantes en une seule opération. Après cette suppression, aucun contrat clôturé ne doit subsister — COUNT(*) retourne 0.',
    resetBefore: true,
  },

  {
    id: 35,
    title: 'Supprimer les paiements d\'un contrat',
    category: 'suppressions',
    difficulty: 'Moyen',
    statement: 'Le contrat numéro 8 vient d\'être clôturé. Ses paiements associés doivent être supprimés de la table des paiements.',
    hint: 'Filtrez sur la colonne qui identifie le contrat dans la table des paiements.',
    solutionSql: `DELETE FROM paiements WHERE contrat_id = 8;`,
    expectedSql: `SELECT COUNT(*) AS nb FROM paiements WHERE contrat_id = 8;`,
    explanation: 'On cible les paiements par leur contrat_id, pas par leur propre id. DELETE supprime les 2 paiements liés au contrat 8. La vérification par COUNT(*) doit retourner 0.',
    resetBefore: true,
  },

  // ─── STRUCTURE DE BASE DE DONNÉES ────────────────────────────────────────────

  {
    id: 36,
    title: 'Créer une table sinistres',
    category: 'structure',
    difficulty: 'Moyen',
    statement: 'Pour préparer un futur module de gestion des sinistres, créez une table "sinistres" avec les colonnes suivantes : id (entier, clé primaire), contrat_id (entier), date_sinistre (texte), description (texte), montant_rembourse (réel).',
    hint: 'La commande de création définit le nom de la table et, entre parenthèses, chaque colonne avec son type.',
    solutionSql: `CREATE TABLE sinistres (
  id               INTEGER PRIMARY KEY,
  contrat_id       INTEGER,
  date_sinistre    TEXT,
  description      TEXT,
  montant_rembourse REAL
);`,
    expectedSql: `SELECT COUNT(*) AS nb FROM sqlite_master WHERE type = 'table' AND name = 'sinistres';`,
    explanation: 'CREATE TABLE définit la structure d\'une nouvelle table. PRIMARY KEY garantit l\'unicité et la non-nullité de la colonne id. En SQLite, INTEGER PRIMARY KEY crée un alias pour le rowid avec auto-incrémentation.',
    resetBefore: true,
  },

  {
    id: 37,
    title: 'Ajouter une colonne à la table clients',
    category: 'structure',
    difficulty: 'Moyen',
    statement: 'Suite à une demande du service relation client, la table clients doit accueillir une nouvelle colonne "telephone" de type TEXT pour stocker les numéros de téléphone.',
    hint: 'Il existe une commande pour modifier la structure d\'une table existante en lui ajoutant une colonne.',
    solutionSql: `ALTER TABLE clients ADD COLUMN telephone TEXT;`,
    expectedSql: `SELECT telephone FROM clients LIMIT 1;`,
    explanation: 'ALTER TABLE ... ADD COLUMN ajoute une nouvelle colonne à une table existante sans perdre les données. La colonne sera NULL pour toutes les lignes existantes, ce qui est souvent acceptable si la colonne ne porte pas de contrainte NOT NULL.',
    resetBefore: true,
  },

  {
    id: 38,
    title: 'Créer une table agences avec contraintes',
    category: 'structure',
    difficulty: 'Difficile',
    statement: 'Créez une table "agences" pour référencer les agences commerciales de la société. Elle doit contenir : id (entier, clé primaire), nom (texte, obligatoire), ville (texte, obligatoire), code_postal (texte, facultatif).',
    hint: 'Certaines colonnes doivent porter une contrainte interdisant les valeurs nulles.',
    solutionSql: `CREATE TABLE agences (
  id          INTEGER PRIMARY KEY,
  nom         TEXT    NOT NULL,
  ville       TEXT    NOT NULL,
  code_postal TEXT
);`,
    expectedSql: `SELECT COUNT(*) AS nb FROM sqlite_master WHERE type = 'table' AND name = 'agences';`,
    explanation: 'NOT NULL interdit les valeurs nulles dans une colonne. Sans cette contrainte, une insertion sans valeur laisserait la colonne à NULL. code_postal est facultatif — aucune contrainte n\'est nécessaire.',
    resetBefore: true,
  },

  {
    id: 39,
    title: 'Supprimer une table obsolète',
    category: 'structure',
    difficulty: 'Moyen',
    statement: 'Une table "archive_clients" a été créée lors d\'un test et n\'est plus utile. Elle existe dans la base. Supprimez-la.',
    hint: 'Une commande SQL permet de supprimer définitivement une table et toutes ses données.',
    solutionSql: `DROP TABLE archive_clients;`,
    expectedSql: `SELECT COUNT(*) AS nb FROM sqlite_master WHERE type = 'table' AND name = 'archive_clients';`,
    explanation: 'DROP TABLE supprime définitivement la table et toutes ses données. C\'est une opération irréversible. DROP TABLE IF EXISTS évite une erreur si la table n\'existe pas.',
    resetBefore: true,
    setupSql: `CREATE TABLE IF NOT EXISTS archive_clients (id INTEGER PRIMARY KEY, nom TEXT);`,
  },

  // ─── REQUÊTES AVANCÉES ───────────────────────────────────────────────────────

  {
    id: 40,
    title: 'Clients avec un contrat au-dessus de la moyenne',
    category: 'avancees',
    difficulty: 'Moyen',
    statement: 'Identifiez les clients dont au moins un contrat a un montant supérieur au montant moyen de l\'ensemble des contrats. Affichez leur nom et prénom, sans doublons.',
    hint: 'Le montant de référence peut être calculé dans une sous-requête à l\'intérieur du WHERE.',
    solutionSql: `SELECT DISTINCT c.nom, c.prenom
FROM clients c
INNER JOIN contrats_vie cv ON c.id = cv.client_id
WHERE cv.montant > (SELECT AVG(montant) FROM contrats_vie);`,
    expectedSql: `SELECT DISTINCT c.nom, c.prenom FROM clients c INNER JOIN contrats_vie cv ON c.id = cv.client_id WHERE cv.montant > (SELECT AVG(montant) FROM contrats_vie);`,
    explanation: 'Une sous-requête est une requête imbriquée dans une autre. Ici, SELECT AVG(montant) FROM contrats_vie calcule la moyenne (≈ 40 964 €). La requête principale compare chaque montant à cette valeur. DISTINCT évite les doublons si un client a plusieurs contrats éligibles.',
  },

  {
    id: 41,
    title: 'Contrats sans bénéficiaire désigné',
    category: 'avancees',
    difficulty: 'Moyen',
    statement: 'Pour des raisons réglementaires, identifiez tous les contrats qui n\'ont encore aucun bénéficiaire désigné. Affichez leur identifiant et leur type.',
    hint: 'Une condition peut vérifier l\'absence de lignes correspondantes dans une autre table.',
    solutionSql: `SELECT id, type_contrat
FROM contrats_vie
WHERE NOT EXISTS (
  SELECT 1 FROM beneficiaires
  WHERE beneficiaires.contrat_id = contrats_vie.id
);`,
    expectedSql: `SELECT id, type_contrat FROM contrats_vie WHERE NOT EXISTS (SELECT 1 FROM beneficiaires WHERE beneficiaires.contrat_id = contrats_vie.id);`,
    explanation: 'NOT EXISTS est vrai pour chaque ligne où la sous-requête ne retourne aucun résultat. SELECT 1 est une convention : on vérifie l\'existence, pas les données. 11 contrats n\'ont aucun bénéficiaire.',
  },

  {
    id: 42,
    title: 'Contrats avec au moins un bénéficiaire',
    category: 'avancees',
    difficulty: 'Difficile',
    statement: 'Quels contrats ont au moins un bénéficiaire désigné ? Affichez leur identifiant, leur type de contrat et leur statut.',
    hint: 'Une condition peut vérifier la présence d\'au moins une ligne correspondante dans une autre table.',
    solutionSql: `SELECT id, type_contrat, statut
FROM contrats_vie
WHERE EXISTS (
  SELECT 1 FROM beneficiaires
  WHERE beneficiaires.contrat_id = contrats_vie.id
);`,
    expectedSql: `SELECT id, type_contrat, statut FROM contrats_vie WHERE EXISTS (SELECT 1 FROM beneficiaires WHERE beneficiaires.contrat_id = contrats_vie.id);`,
    explanation: 'EXISTS est vrai si la sous-requête retourne au moins une ligne. Contrairement à JOIN, EXISTS s\'arrête dès qu\'il trouve une correspondance (plus performant pour tester l\'existence). 17 contrats ont des bénéficiaires.',
  },

  {
    id: 43,
    title: 'Toutes les villes couvertes',
    category: 'avancees',
    difficulty: 'Difficile',
    statement: 'Dressez la liste complète de toutes les villes où la société est présente, que ce soit via des clients ou des conseillers. Chaque ville ne doit apparaître qu\'une fois.',
    hint: 'Deux requêtes SELECT peuvent être combinées pour réunir leurs résultats en supprimant les doublons.',
    solutionSql: `SELECT DISTINCT ville FROM clients
UNION
SELECT DISTINCT ville FROM conseillers;`,
    expectedSql: `SELECT DISTINCT ville FROM clients UNION SELECT DISTINCT ville FROM conseillers;`,
    explanation: 'UNION combine les résultats de deux SELECT et supprime automatiquement les doublons (comme DISTINCT). UNION ALL conserverait les doublons. Les deux SELECT doivent avoir le même nombre de colonnes et des types compatibles.',
  },

  {
    id: 44,
    title: 'Clients sans contrat Assurance Vie',
    category: 'avancees',
    difficulty: 'Difficile',
    statement: 'Le responsable des ventes souhaite contacter les clients qui n\'ont souscrit aucun contrat de type "Assurance Vie" pour leur proposer ce produit. Listez leur nom et prénom.',
    hint: 'Vérifiez pour chaque client l\'absence de contrat d\'un type spécifique dans une sous-requête corrélée.',
    solutionSql: `SELECT nom, prenom
FROM clients
WHERE NOT EXISTS (
  SELECT 1 FROM contrats_vie
  WHERE contrats_vie.client_id = clients.id
    AND contrats_vie.type_contrat = 'Assurance Vie'
);`,
    expectedSql: `SELECT nom, prenom FROM clients WHERE NOT EXISTS (SELECT 1 FROM contrats_vie WHERE contrats_vie.client_id = clients.id AND contrats_vie.type_contrat = 'Assurance Vie');`,
    explanation: 'La sous-requête est corrélée : elle référence clients.id de la requête externe. Pour chaque client, elle vérifie l\'absence de contrat Assurance Vie. 16 clients sont éligibles, dont les 4 clients sans aucun contrat.',
  },

  {
    id: 45,
    title: 'Classement des conseillers par activité',
    category: 'avancees',
    difficulty: 'Difficile',
    statement: 'Le directeur régional souhaite un classement des conseillers selon le nombre de contrats actifs qu\'ils gèrent, du plus actif au moins actif. Tous les conseillers doivent apparaître, même ceux sans contrat actif.',
    hint: 'Une jointure qui conserve tous les enregistrements d\'une table permet d\'inclure les conseillers sans contrat actif.',
    solutionSql: `SELECT co.nom, COUNT(cv.id) AS nb_contrats_actifs
FROM conseillers co
LEFT JOIN contrats_vie cv ON co.id = cv.conseiller_id AND cv.statut = 'Actif'
GROUP BY co.id, co.nom
ORDER BY nb_contrats_actifs DESC;`,
    expectedSql: `SELECT co.nom, COUNT(cv.id) AS nb_contrats_actifs FROM conseillers co LEFT JOIN contrats_vie cv ON co.id = cv.conseiller_id AND cv.statut = 'Actif' GROUP BY co.id, co.nom ORDER BY nb_contrats_actifs DESC;`,
    orderedResult: true,
    explanation: 'La condition AND cv.statut = \'Actif\' est dans le ON (pas dans WHERE) pour préserver les conseillers sans contrat actif dans le LEFT JOIN. COUNT(cv.id) retourne 0 pour les conseillers sans correspondance (là où COUNT(*) retournerait 1).',
  },

]
