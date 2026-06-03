import { resetDb } from '../db/reset.js'

// ─── Exécution ────────────────────────────────────────────────────────────────

export function executeSql(db, sql) {
  const result = db.exec(sql)
  if (!result.length) return { columns: [], rows: [] }
  const { columns, values } = result[0]
  const rows = values.map(v => {
    const row = {}
    columns.forEach((col, i) => { row[col] = v[i] })
    return row
  })
  return { columns, rows }
}

// ─── Point d'entrée principal ────────────────────────────────────────────────

export function validateExercise(db, exercise, userSql) {
  const orderedResult = exercise.orderedResult ?? false
  const isMutatif = !!exercise.resetBefore

  let userResult = null
  let expectedResult = null
  let userError = null

  // Calcul du résultat utilisateur
  try {
    resetDb(db)
    if (exercise.setupSql) db.run(exercise.setupSql)

    if (isMutatif) {
      db.run(userSql)
      userResult = executeSql(db, exercise.expectedSql)
    } else {
      userResult = executeSql(db, userSql)
    }
  } catch (e) {
    userError = e.message
  }

  // Calcul du résultat attendu (toujours calculé, même en cas d'erreur utilisateur)
  try {
    resetDb(db)
    if (exercise.setupSql) db.run(exercise.setupSql)
    db.run(exercise.solutionSql)
    expectedResult = executeSql(db, exercise.expectedSql)
  } catch (e) {
    console.error('Erreur calcul résultat attendu :', e.message)
    expectedResult = { columns: [], rows: [] }
  }

  // Remettre la base en état propre
  resetDb(db)

  if (userError) {
    return {
      success: false,
      error: userError,
      friendlyError: explainSqlError(userError),
      userResult: null,
      expectedResult,
    }
  }

  const { success, reason } = compareResults(userResult, expectedResult, orderedResult)
  return { success, reason, userResult, expectedResult }
}

// ─── Comparaison ─────────────────────────────────────────────────────────────

function compareResults(actual, expected, orderedResult) {
  if (!actual || !expected) {
    return { success: false, reason: 'null_result' }
  }

  // Comparaison des colonnes (indépendante de l'ordre)
  const actualCols = [...actual.columns].sort()
  const expectedCols = [...expected.columns].sort()
  if (JSON.stringify(actualCols) !== JSON.stringify(expectedCols)) {
    return { success: false, reason: 'columns_mismatch' }
  }

  // Comparaison du nombre de lignes
  if (actual.rows.length !== expected.rows.length) {
    return { success: false, reason: 'row_count_mismatch' }
  }

  // Comparaison des valeurs (avec normalisation)
  const actualNorm = normalizeResult(actual, orderedResult)
  const expectedNorm = normalizeResult(expected, orderedResult)

  if (JSON.stringify(actualNorm) !== JSON.stringify(expectedNorm)) {
    return { success: false, reason: 'values_mismatch' }
  }

  return { success: true }
}

function normalizeResult(result, orderedResult) {
  const cols = [...result.columns].sort()

  const rows = result.rows.map(row => {
    const obj = {}
    for (const col of cols) {
      const val = row[col]
      obj[col] = val === null || val === undefined ? null : normalizeValue(val)
    }
    return obj
  })

  if (!orderedResult) {
    rows.sort((a, b) => {
      const keyA = cols.map(c => String(a[c] ?? '')).join('\x00')
      const keyB = cols.map(c => String(b[c] ?? '')).join('\x00')
      return keyA.localeCompare(keyB, undefined, { numeric: true, sensitivity: 'base' })
    })
  }

  return rows
}

function normalizeValue(val) {
  if (typeof val === 'number') {
    // Arrondi à 6 décimales pour éviter les écarts de virgule flottante
    return Math.round(val * 1000000) / 1000000
  }
  if (typeof val === 'string') {
    return val.trim()
  }
  return val
}

// ─── Messages d'erreur pédagogiques ──────────────────────────────────────────

export function explainSqlError(message) {
  const e = message.toLowerCase()

  if (e.includes('no such table')) {
    return 'La table mentionnée n\'existe pas dans la base. Vérifiez le nom exact dans le panneau de schéma à droite.'
  }
  if (e.includes('no such column')) {
    return 'Une colonne mentionnée n\'existe pas dans cette table. Vérifiez les noms de colonnes dans le panneau de schéma.'
  }
  if (e.includes('syntax error')) {
    return 'Erreur de syntaxe SQL. Vérifiez les mots-clés, les virgules et les parenthèses.'
  }
  if (e.includes('ambiguous column name')) {
    return 'Nom de colonne ambigu : plusieurs tables ont cette colonne. Préfixez avec le nom de la table (ex : clients.nom).'
  }
  if (e.includes('misuse of aggregate') || e.includes('non-aggregate')) {
    return 'Mauvaise utilisation d\'une fonction d\'agrégation. Si vous combinez SUM/COUNT/AVG avec d\'autres colonnes, ajoutez un GROUP BY.'
  }
  if (e.includes('unique constraint failed')) {
    return 'Contrainte d\'unicité violée : une ligne avec cette valeur existe déjà dans la table.'
  }
  if (e.includes('not null constraint failed')) {
    return 'Contrainte NOT NULL violée : une colonne obligatoire n\'a pas de valeur.'
  }
  if (e.includes('foreign key constraint failed')) {
    return 'Contrainte de clé étrangère : la valeur référencée n\'existe pas dans la table parente.'
  }
  if (e.includes('already exists')) {
    return 'Cet objet (table, index…) existe déjà dans la base. Utilisez IF NOT EXISTS pour éviter cette erreur.'
  }
  if (e.includes('no such function')) {
    return 'Fonction SQL inconnue. Vérifiez l\'orthographe de la fonction.'
  }
  if (e.includes('incomplete input') || e.includes('unrecognized token')) {
    return 'La requête semble incomplète ou contient un caractère non reconnu.'
  }
  return 'Vérifiez la syntaxe de votre requête, les noms de tables et de colonnes.'
}
