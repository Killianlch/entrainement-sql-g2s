const KEY         = 'sql_trainer_progress'
const CURRENT_KEY = 'sql_trainer_current'

export function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}')
  } catch {
    return {}
  }
}

export function saveProgress(progress) {
  localStorage.setItem(KEY, JSON.stringify(progress))
}

export function markCompleted(progress, exerciseId, { usedHint, usedSolution, firstTry }) {
  const updated = {
    ...progress,
    [exerciseId]: {
      completed: true,
      usedHint: usedHint ?? false,
      usedSolution: usedSolution ?? false,
      firstTry: firstTry ?? false,
      completedAt: Date.now(),
    }
  }
  saveProgress(updated)
  return updated
}

export function clearProgress() {
  localStorage.removeItem(KEY)
  localStorage.removeItem(CURRENT_KEY)
  return {}
}

export function saveCurrentExercise(id) {
  localStorage.setItem(CURRENT_KEY, String(id))
}

export function loadCurrentExercise() {
  const saved = localStorage.getItem(CURRENT_KEY)
  return saved ? parseInt(saved, 10) : null
}

export function getStats(progress, exercises) {
  const completed = exercises.filter(e => progress[e.id]?.completed)
  const firstTry = completed.filter(e => progress[e.id]?.firstTry)
  const usedHint = completed.filter(e => progress[e.id]?.usedHint)
  const usedSolution = completed.filter(e => progress[e.id]?.usedSolution)
  return {
    total: exercises.length,
    completed: completed.length,
    firstTry: firstTry.length,
    usedHint: usedHint.length,
    usedSolution: usedSolution.length,
    rate: exercises.length > 0 ? Math.round((completed.length / exercises.length) * 100) : 0,
  }
}
