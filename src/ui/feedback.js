export function showHint(exercise) {
  const area = document.getElementById('feedback-area')
  area.classList.remove('hidden')

  area.innerHTML = `
    <div class="feedback-block">
      <div class="feedback-block-title hint">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        Indice
      </div>
      <p class="feedback-text">${exercise.hint}</p>
    </div>
  `
}

export function showSolution(exercise) {
  const area = document.getElementById('feedback-area')
  area.classList.remove('hidden')

  const existingHint = area.querySelector('.feedback-block')
  area.innerHTML = existingHint ? existingHint.outerHTML : ''

  area.innerHTML += `
    <div class="feedback-block">
      <div class="feedback-block-title solution">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
        </svg>
        Solution
      </div>
      <pre class="feedback-code">${exercise.solutionSql}</pre>
    </div>
  `
}

export function showExplanation(exercise) {
  const area = document.getElementById('feedback-area')
  area.classList.remove('hidden')

  area.innerHTML += `
    <div class="feedback-block">
      <div class="feedback-block-title explanation">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Explication
      </div>
      <p class="feedback-text">${exercise.explanation}</p>
    </div>
  `
}

export function clearFeedback() {
  const area = document.getElementById('feedback-area')
  area.innerHTML = ''
  area.classList.add('hidden')
}
