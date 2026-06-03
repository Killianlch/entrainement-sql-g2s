export function initNavigation(state, onNavigate) {
  const nav = document.getElementById('exercise-nav')
  renderNav(nav, state, onNavigate)
}

export function updateNavigation(state, onNavigate) {
  const nav = document.getElementById('exercise-nav')
  renderNav(nav, state, onNavigate)
}

function renderNav(nav, state, onNavigate) {
  nav.innerHTML = ''

  for (const category of state.categories) {
    const exercises = state.exercises.filter(e => e.category === category.id)
    if (exercises.length === 0) continue

    const section = buildCategorySection(category, exercises, state, onNavigate)
    nav.appendChild(section)
  }
}

function buildCategorySection(category, exercises, state, onNavigate) {
  const section = document.createElement('div')
  section.className = 'category-section'
  section.dataset.category = category.id

  const completedCount = exercises.filter(e => state.progress[e.id]?.completed).length
  const isActive = exercises.some(e => e.id === state.currentExerciseId)
  if (!isActive) section.classList.add('collapsed')

  const header = document.createElement('button')
  header.className = 'category-header'
  header.innerHTML = `
    <span class="category-header-left">
      <svg class="category-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
      <span>${category.label}</span>
    </span>
    <span class="category-count">${completedCount}/${exercises.length}</span>
  `
  header.addEventListener('click', () => {
    section.classList.toggle('collapsed')
  })

  const list = document.createElement('ul')
  list.className = 'exercise-list'

  for (const exercise of exercises) {
    const item = buildExerciseItem(exercise, state, onNavigate)
    list.appendChild(item)
  }

  list.style.maxHeight = exercises.length * 38 + 'px'

  section.appendChild(header)
  section.appendChild(list)
  return section
}

function buildExerciseItem(exercise, state, onNavigate) {
  const isActive = exercise.id === state.currentExerciseId
  const isCompleted = !!state.progress[exercise.id]?.completed

  const item = document.createElement('li')
  item.className = [
    'exercise-item',
    isActive ? 'active' : '',
    isCompleted ? 'completed' : '',
  ].filter(Boolean).join(' ')
  item.dataset.id = exercise.id

  const diffClass = exercise.difficulty?.toLowerCase() ?? 'facile'

  item.innerHTML = `
    <span class="exercise-status-dot"></span>
    <span class="exercise-nav-title">${exercise.title}</span>
    <span class="difficulty-pip ${diffClass}"></span>
  `

  item.addEventListener('click', () => onNavigate(exercise.id))
  return item
}
