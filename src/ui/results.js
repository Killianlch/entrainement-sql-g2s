// ─── Affichage principal ─────────────────────────────────────────────────────

export function renderResults(container, result) {
  container.innerHTML = ''

  if (!result) {
    container.innerHTML = `
      <div class="results-placeholder">
        <p>Écrivez votre requête SQL puis cliquez sur <strong>Vérifier</strong>.</p>
      </div>`
    return
  }

  if (result.error) {
    renderError(container, result.error)
    return
  }

  if (result.rows !== undefined) {
    renderTable(container, result.columns, result.rows, result.label)
  }
}

// ─── Erreur SQL (avec explication pédagogique) ────────────────────────────────

export function renderSqlError(container, technicalError, friendlyError, expectedResult) {
  container.innerHTML = ''

  const wrapper = document.createElement('div')
  wrapper.className = 'results-section'

  const msg = document.createElement('div')
  msg.className = 'result-message error'
  msg.innerHTML = `
    <div class="result-message-title">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      Erreur SQL
    </div>
    <div class="result-message-body">${friendlyError || getFriendlyError(technicalError)}</div>
    <div class="result-message-technical">${escapeHtml(technicalError)}</div>
  `
  wrapper.appendChild(msg)

  if (expectedResult?.columns?.length > 0 || expectedResult?.rows?.length > 0) {
    const section = document.createElement('div')
    section.innerHTML = '<p class="results-section-title" style="padding:16px 0 8px">Résultat attendu</p>'
    buildTable(section, expectedResult.columns, expectedResult.rows)
    const meta = document.createElement('p')
    meta.className = 'result-meta'
    meta.textContent = `${expectedResult.rows.length} ligne${expectedResult.rows.length !== 1 ? 's' : ''} attendue${expectedResult.rows.length !== 1 ? 's' : ''}`
    section.appendChild(meta)
    wrapper.appendChild(section)
  }

  container.appendChild(wrapper)
}

// ─── Résultats de validation (succès ou échec) ────────────────────────────────

export function renderValidationResults(container, userResult, expectedResult, isSuccess) {
  container.innerHTML = ''

  const wrapper = document.createElement('div')
  wrapper.className = 'results-section'

  // Message succès / échec
  const msg = document.createElement('div')
  msg.className = `result-message ${isSuccess ? 'success' : 'error'}`

  if (isSuccess) {
    msg.innerHTML = `
      <div class="result-message-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        Bonne réponse !
      </div>
      <div class="result-message-body">Votre requête retourne le résultat attendu.</div>
    `
  } else {
    const reason = getFailReason(userResult, expectedResult)
    msg.innerHTML = `
      <div class="result-message-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
        Résultat incorrect
      </div>
      <div class="result-message-body">${reason}</div>
    `
  }
  wrapper.appendChild(msg)

  // Résultat utilisateur
  if (userResult?.columns !== undefined) {
    const section = document.createElement('div')
    const label = document.createElement('p')
    label.className = 'results-section-title'
    label.style.cssText = 'padding: 16px 0 8px'
    label.textContent = 'Votre résultat'
    section.appendChild(label)

    if (userResult.columns.length === 0) {
      const note = document.createElement('p')
      note.style.cssText = 'font-size:12.5px;color:var(--color-text-muted);padding:8px 0'
      note.textContent = 'La requête a été exécutée (aucune donnée retournée).'
      section.appendChild(note)
    } else {
      buildTable(section, userResult.columns, userResult.rows)
      const meta = document.createElement('p')
      meta.className = 'result-meta'
      meta.textContent = `${userResult.rows.length} ligne${userResult.rows.length !== 1 ? 's' : ''} retournée${userResult.rows.length !== 1 ? 's' : ''}`
      section.appendChild(meta)
    }

    wrapper.appendChild(section)
  }

  // Résultat attendu (toujours affiché — utile en cas de succès ET d'échec)
  if (expectedResult?.columns !== undefined) {
    const section = document.createElement('div')
    const label = document.createElement('p')
    label.className = 'results-section-title'
    label.style.cssText = `padding: 16px 0 8px; color: ${isSuccess ? 'var(--color-text-muted)' : 'inherit'}`
    label.textContent = isSuccess ? 'Résultat attendu (pour référence)' : 'Résultat attendu'
    section.appendChild(label)

    if (expectedResult.columns.length === 0) {
      const note = document.createElement('p')
      note.style.cssText = 'font-size:12.5px;color:var(--color-text-muted);padding:8px 0'
      note.textContent = isSuccess ? 'Requête exécutée avec succès.' : 'Aucun résultat attendu.'
      section.appendChild(note)
    } else {
      buildTable(section, expectedResult.columns, expectedResult.rows)
      const meta = document.createElement('p')
      meta.className = 'result-meta'
      meta.textContent = `${expectedResult.rows.length} ligne${expectedResult.rows.length !== 1 ? 's' : ''} attendue${expectedResult.rows.length !== 1 ? 's' : ''}`
      section.appendChild(meta)
    }

    wrapper.appendChild(section)
  }

  container.appendChild(wrapper)
}

// ─── Fonctions internes ───────────────────────────────────────────────────────

function renderError(container, error) {
  container.innerHTML = `
    <div class="result-message error">
      <div class="result-message-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        Erreur
      </div>
      <div class="result-message-body">${getFriendlyError(error)}</div>
      <div class="result-message-technical">${escapeHtml(error)}</div>
    </div>
  `
}

function renderTable(container, columns, rows, label) {
  if (label) {
    const title = document.createElement('p')
    title.className = 'results-section-title'
    title.style.marginBottom = '8px'
    title.textContent = label
    container.appendChild(title)
  }
  buildTable(container, columns, rows)
  const meta = document.createElement('p')
  meta.className = 'result-meta'
  meta.textContent = `${rows.length} ligne${rows.length !== 1 ? 's' : ''} retournée${rows.length !== 1 ? 's' : ''}`
  container.appendChild(meta)
}

function buildTable(container, columns, rows) {
  const wrapper = document.createElement('div')
  wrapper.className = 'result-table-wrapper'

  const table = document.createElement('table')
  table.className = 'result-table'

  const thead = document.createElement('thead')
  thead.innerHTML = `<tr>${columns.map(c => `<th>${escapeHtml(String(c))}</th>`).join('')}</tr>`
  table.appendChild(thead)

  const tbody = document.createElement('tbody')
  for (const row of rows) {
    const tr = document.createElement('tr')
    tr.innerHTML = columns.map(c => {
      const val = row[c]
      if (val === null || val === undefined) return `<td class="null-value">NULL</td>`
      return `<td>${escapeHtml(String(val))}</td>`
    }).join('')
    tbody.appendChild(tr)
  }
  table.appendChild(tbody)

  wrapper.appendChild(table)
  container.appendChild(wrapper)
}

function getFailReason(userResult, expectedResult) {
  if (!userResult) return 'Votre requête n\'a pas retourné de résultat exploitable.'

  const userCols = [...(userResult.columns ?? [])].sort().join(', ')
  const expectedCols = [...(expectedResult?.columns ?? [])].sort().join(', ')

  if (userCols !== expectedCols) {
    return `Les colonnes retournées ne correspondent pas. Attendu : <strong>${escapeHtml(expectedCols)}</strong>.`
  }
  if ((userResult.rows?.length ?? 0) !== (expectedResult?.rows?.length ?? 0)) {
    return `Le nombre de lignes est incorrect. Votre requête retourne <strong>${userResult.rows?.length ?? 0}</strong> ligne(s), ${expectedResult?.rows?.length ?? 0} attendue(s).`
  }
  return 'Les valeurs retournées ne correspondent pas au résultat attendu.'
}

function getFriendlyError(error) {
  if (!error) return 'Une erreur est survenue.'
  const e = error.toLowerCase()
  if (e.includes('no such table')) return 'La table mentionnée n\'existe pas. Vérifiez le schéma.'
  if (e.includes('no such column')) return 'Colonne inexistante. Vérifiez les noms de colonnes.'
  if (e.includes('syntax error')) return 'Erreur de syntaxe SQL.'
  if (e.includes('ambiguous')) return 'Colonne ambiguë — précisez le nom de la table.'
  if (e.includes('misuse of aggregate')) return 'Mauvaise utilisation d\'une agrégation (GROUP BY manquant ?).'
  return 'Erreur SQL. Consultez le message ci-dessous.'
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
