import { SCHEMA_SQL } from './schema.js'
import { SEED_SQL } from './seed.js'

export function resetDb(db) {
  // Supprimer toutes les tables non-système (y compris celles créées par les exercices DDL)
  const result = db.exec(`SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'`)
  if (result.length) {
    for (const [name] of result[0].values) {
      db.run(`DROP TABLE IF EXISTS "${name}"`)
    }
  }

  db.run(SCHEMA_SQL)
  db.run(SEED_SQL)
}
