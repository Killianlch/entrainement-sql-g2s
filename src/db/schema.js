export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS conseillers (
  id     INTEGER PRIMARY KEY,
  nom    TEXT    NOT NULL,
  agence TEXT    NOT NULL,
  ville  TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS clients (
  id     INTEGER PRIMARY KEY,
  nom    TEXT    NOT NULL,
  prenom TEXT    NOT NULL,
  ville  TEXT    NOT NULL,
  age    INTEGER NOT NULL,
  email  TEXT    NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS contrats_vie (
  id              INTEGER PRIMARY KEY,
  client_id       INTEGER NOT NULL REFERENCES clients(id),
  conseiller_id   INTEGER NOT NULL REFERENCES conseillers(id),
  type_contrat    TEXT    NOT NULL,
  montant         REAL    NOT NULL,
  statut          TEXT    NOT NULL,
  date_ouverture  TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS paiements (
  id             INTEGER PRIMARY KEY,
  contrat_id     INTEGER NOT NULL REFERENCES contrats_vie(id),
  montant        REAL    NOT NULL,
  date_paiement  TEXT    NOT NULL,
  mode_paiement  TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS beneficiaires (
  id            INTEGER PRIMARY KEY,
  contrat_id    INTEGER NOT NULL REFERENCES contrats_vie(id),
  nom           TEXT    NOT NULL,
  prenom        TEXT    NOT NULL,
  lien_parente  TEXT    NOT NULL,
  pourcentage   REAL    NOT NULL
);
`

export const SCHEMA_DEFINITION = {
  clients: {
    columns: [
      { name: 'id',     type: 'INTEGER', pk: true },
      { name: 'nom',    type: 'TEXT' },
      { name: 'prenom', type: 'TEXT' },
      { name: 'ville',  type: 'TEXT' },
      { name: 'age',    type: 'INTEGER' },
      { name: 'email',  type: 'TEXT' },
    ]
  },
  contrats_vie: {
    columns: [
      { name: 'id',             type: 'INTEGER', pk: true },
      { name: 'client_id',      type: 'INTEGER', fk: 'clients.id' },
      { name: 'conseiller_id',  type: 'INTEGER', fk: 'conseillers.id' },
      { name: 'type_contrat',   type: 'TEXT' },
      { name: 'montant',        type: 'REAL' },
      { name: 'statut',         type: 'TEXT' },
      { name: 'date_ouverture', type: 'TEXT' },
    ]
  },
  paiements: {
    columns: [
      { name: 'id',            type: 'INTEGER', pk: true },
      { name: 'contrat_id',    type: 'INTEGER', fk: 'contrats_vie.id' },
      { name: 'montant',       type: 'REAL' },
      { name: 'date_paiement', type: 'TEXT' },
      { name: 'mode_paiement', type: 'TEXT' },
    ]
  },
  conseillers: {
    columns: [
      { name: 'id',     type: 'INTEGER', pk: true },
      { name: 'nom',    type: 'TEXT' },
      { name: 'agence', type: 'TEXT' },
      { name: 'ville',  type: 'TEXT' },
    ]
  },
  beneficiaires: {
    columns: [
      { name: 'id',           type: 'INTEGER', pk: true },
      { name: 'contrat_id',   type: 'INTEGER', fk: 'contrats_vie.id' },
      { name: 'nom',          type: 'TEXT' },
      { name: 'prenom',       type: 'TEXT' },
      { name: 'lien_parente', type: 'TEXT' },
      { name: 'pourcentage',  type: 'REAL' },
    ]
  },
}
