import { categories } from './exercises/categories.js'
import { exercises } from './exercises/index.js'
import { loadProgress, markCompleted, getStats, clearProgress, saveCurrentExercise, loadCurrentExercise } from './storage/progress.js'
import { initNavigation, updateNavigation } from './ui/navigation.js'
import { initEditor, getEditorValue, setEditorValue, clearEditor } from './ui/editor.js'
import { renderResults, renderValidationResults, renderSqlError } from './ui/results.js'
import { showHint, showSolution, showExplanation, clearFeedback } from './ui/feedback.js'
import { initSchemaPanel, refreshDataTab } from './ui/schema-panel.js'
import { showSummary } from './ui/summary.js'
import { initDb } from './db/init.js'
import { validateExercise } from './validation/validator.js'

const savedId = loadCurrentExercise()
const validSavedId = exercises.find(e => e.id === savedId)?.id ?? null

const state = {
  db: null,
  exercises,
  categories,
  currentExerciseId: validSavedId ?? exercises[0]?.id ?? null,
  progress: loadProgress(),
  session: { usedHint: false, usedSolution: false, attempts: 0 },
}

function getCurrentExercise() {
  return state.exercises.find(e => e.id === state.currentExerciseId) ?? null
}

function getNextExercise() {
  const idx = state.exercises.findIndex(e => e.id === state.currentExerciseId)
  return state.exercises[idx + 1] ?? null
}

function navigateTo(exerciseId) {
  state.currentExerciseId = exerciseId
  state.session = { usedHint: false, usedSolution: false, attempts: 0 }
  saveCurrentExercise(exerciseId)
  clearFeedback()
  renderResults(document.getElementById('results-area'), null)
  renderExercise(getCurrentExercise())
  updateNavigation(state, navigateTo)
  updateProgress()
}

function renderExercise(exercise) {
  if (!exercise) return

  const diffClass = exercise.difficulty?.toLowerCase() ?? 'facile'

  document.getElementById('exercise-category-badge').textContent =
    categories.find(c => c.id === exercise.category)?.label ?? exercise.category

  const diffBadge = document.getElementById('exercise-difficulty-badge')
  diffBadge.textContent = exercise.difficulty
  diffBadge.className = `badge badge-difficulty ${diffClass}`

  const idx = state.exercises.findIndex(e => e.id === exercise.id)
  document.getElementById('exercise-number').textContent = `Exercice ${idx + 1} / ${state.exercises.length}`
  document.getElementById('exercise-title').textContent = exercise.title
  document.getElementById('exercise-statement-text').textContent = exercise.statement

  setEditorValue('')
  document.getElementById('btn-next').disabled = !getNextExercise()
  updateHeaderBreadcrumb(exercise)
}

function updateHeaderBreadcrumb(exercise) {
  const cat = categories.find(c => c.id === exercise.category)
  document.getElementById('header-breadcrumb').innerHTML = `
    <span>${cat?.label ?? ''}</span>
    <span class="header-breadcrumb-sep">›</span>
    <span style="color:var(--color-text-secondary)">${exercise.title}</span>
  `
}

function updateProgress() {
  const stats = getStats(state.progress, state.exercises)
  const pct = `${stats.rate}%`

  document.getElementById('header-progress-text').textContent = `${stats.completed} / ${stats.total}`
  document.getElementById('header-progress-fill').style.width = pct
  document.getElementById('sidebar-progress-fill').style.width = pct
  document.getElementById('sidebar-progress-label').textContent =
    stats.completed === 1 ? '1 exercice complété' : `${stats.completed} exercices complétés`
}

async function handleVerify() {
  const query = getEditorValue().trim()
  if (!query) return

  const exercise = getCurrentExercise()
  if (!exercise) return

  const resultsArea = document.getElementById('results-area')
  state.session.attempts++

  if (!state.db) {
    renderResults(resultsArea, { error: 'Base de données non initialisée. Rechargez la page.' })
    return
  }

  const validation = validateExercise(state.db, exercise, query)

  if (validation.error) {
    renderSqlError(resultsArea, validation.error, validation.friendlyError, validation.expectedResult)
    return
  }

  renderValidationResults(resultsArea, validation.userResult, validation.expectedResult, validation.success)

  if (validation.success) {
    const isFirstTry = state.session.attempts === 1 && !state.session.usedSolution
    state.progress = markCompleted(state.progress, exercise.id, {
      usedHint: state.session.usedHint,
      usedSolution: state.session.usedSolution,
      firstTry: isFirstTry,
    })
    showExplanation(exercise)
    document.getElementById('btn-next').disabled = !getNextExercise()
    updateNavigation(state, navigateTo)
    updateProgress()
  }
}

function bindButtons() {
  document.getElementById('btn-verify').addEventListener('click', handleVerify)

  document.getElementById('btn-hint').addEventListener('click', () => {
    const exercise = getCurrentExercise()
    if (!exercise) return
    state.session.usedHint = true
    showHint(exercise)
  })

  document.getElementById('btn-solution').addEventListener('click', () => {
    const exercise = getCurrentExercise()
    if (!exercise) return
    state.session.usedSolution = true
    showSolution(exercise)
  })

  document.getElementById('btn-next').addEventListener('click', () => {
    const next = getNextExercise()
    if (next) navigateTo(next.id)
  })

  document.getElementById('btn-reset-query').addEventListener('click', () => {
    clearEditor()
    clearFeedback()
    renderResults(document.getElementById('results-area'), null)
    state.session = { usedHint: false, usedSolution: false, attempts: 0 }
  })

  document.getElementById('btn-summary').addEventListener('click', () => {
    showSummary(state, {
      retryErrors: (firstId) => navigateTo(firstId),
      restart: () => {
        state.progress = clearProgress()
        navigateTo(state.exercises[0]?.id ?? null)
      },
    })
  })

  document.getElementById('data-table-select').addEventListener('change', e => {
    if (state.db) refreshDataTab(state.db, e.target.value)
  })
}

async function init() {
  initSchemaPanel()
  initEditor(handleVerify)
  bindButtons()
  renderExercise(getCurrentExercise())
  updateNavigation(state, navigateTo)
  updateProgress()

  try {
    state.db = await initDb()
  } catch (e) {
    console.error('Erreur initialisation DB :', e)
  }

  document.getElementById('loading-overlay').style.display = 'none'
}

init()
