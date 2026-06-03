import { getStats } from '../storage/progress.js'

export function showSummary(state, actions) {
  document.getElementById('exercise-view').classList.add('hidden')
  const view = document.getElementById('summary-view')
  view.classList.remove('hidden')
  renderSummary(view, state, actions)
}

export function hideSummary() {
  document.getElementById('summary-view').classList.add('hidden')
  document.getElementById('exercise-view').classList.remove('hidden')
}

function renderSummary(container, state, actions) {
  const stats = getStats(state.progress, state.exercises)
  const categoryStats = buildCategoryStats(state)
  const notCompleted = state.exercises.filter(e => !state.progress[e.id]?.completed)

  container.innerHTML = `
    <div class="summary-header">
      <h2 class="summary-title">Bilan d'entraînement</h2>
      <p class="summary-subtitle">Votre progression sur l'ensemble des exercices SQL</p>
    </div>

    <div class="summary-stats-grid">
      <div class="stat-card">
        <div class="stat-value">${stats.completed}<span style="font-size:16px;color:var(--color-text-muted)">/${stats.total}</span></div>
        <div class="stat-label">Exercices complétés</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color:var(--color-accent)">${stats.rate}%</div>
        <div class="stat-label">Taux de réussite</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color:var(--color-success)">${stats.firstTry}</div>
        <div class="stat-label">Réussis du premier coup</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color:var(--color-text-muted)">${stats.usedHint}</div>
        <div class="stat-label">Indices utilisés</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color:var(--color-text-muted)">${stats.usedSolution}</div>
        <div class="stat-label">Solutions consultées</div>
      </div>
    </div>

    <h3 style="font-size:13px;font-weight:600;color:var(--color-text-secondary);margin-bottom:14px;letter-spacing:0.03em;text-transform:uppercase">
      Progression par catégorie
    </h3>

    <div class="summary-categories">
      ${categoryStats.map(c => `
        <div class="summary-category-row">
          <span class="summary-category-name">${c.label}</span>
          <div class="summary-category-bar">
            <div class="summary-category-fill ${c.pct === 100 ? 'complete' : ''}" style="width:${c.pct}%"></div>
          </div>
          <span class="summary-category-pct">${c.done}/${c.total}</span>
        </div>
      `).join('')}
    </div>

    <div class="summary-actions">
      <button class="btn btn-primary" id="summary-retry-errors" ${notCompleted.length === 0 ? 'disabled' : ''}>
        Refaire les erreurs${notCompleted.length > 0 ? ` (${notCompleted.length})` : ''}
      </button>
      <button class="btn btn-secondary" id="summary-restart">Recommencer l'entraînement</button>
      <button class="btn btn-ghost" id="summary-close">Retour aux exercices</button>
    </div>
  `

  document.getElementById('summary-close')?.addEventListener('click', hideSummary)

  document.getElementById('summary-retry-errors')?.addEventListener('click', () => {
    const first = state.exercises.find(e => !state.progress[e.id]?.completed)
    if (first) {
      hideSummary()
      actions?.retryErrors(first.id)
    }
  })

  document.getElementById('summary-restart')?.addEventListener('click', () => {
    if (!confirm('Remettre à zéro toute la progression ? Cette action est irréversible.')) return
    hideSummary()
    actions?.restart()
  })
}

function buildCategoryStats(state) {
  return state.categories.map(cat => {
    const exercises = state.exercises.filter(e => e.category === cat.id)
    const done = exercises.filter(e => state.progress[e.id]?.completed).length
    const total = exercises.length
    const pct = total > 0 ? Math.round((done / total) * 100) : 0
    return { label: cat.label, done, total, pct }
  }).filter(c => c.total > 0)
}
