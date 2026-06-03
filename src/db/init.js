import initSqlJs from 'sql.js'
import { SCHEMA_SQL } from './schema.js'
import { SEED_SQL } from './seed.js'

export async function initDb() {
  const SQL = await initSqlJs({
    locateFile: file => `/${file}`
  })

  const db = new SQL.Database()
  db.run(SCHEMA_SQL)
  db.run(SEED_SQL)

  return db
}
