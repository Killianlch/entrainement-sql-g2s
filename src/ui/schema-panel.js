import { SCHEMA_DEFINITION } from '../db/schema.js'

export function initSchemaPanel() {
  renderSchema()
  initTabs()
  initDataTableSelector()
}

function renderSchema() {
  const container = document.getElementById('schema-content')
  container.innerHTML = ''

  for (const [tableName, tableDef] of Object.entries(SCHEMA_DEFINITION)) {
    const item = buildTableItem(tableName, tableDef)
    container.appendChild(item)
  }
}

function buildTableItem(tableName, tableDef) {
  const item = document.createElement('div')
  item.className = 'schema-table-item'

  const header = document.createElement('div')
  header.className = 'schema-table-name'
  header.innerHTML = `
    <span class="schema-table-name-text">${tableName}</span>
    <svg class="schema-table-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  `
  header.addEventListener('click', () => item.classList.toggle('open'))

  const columnsList = document.createElement('div')
  columnsList.className = 'schema-columns-list'

  for (const col of tableDef.columns) {
    const row = document.createElement('div')
    row.className = 'schema-column-row'

    let badge = ''
    if (col.pk) badge = '<span class="schema-col-pk">PK</span>'
    else if (col.fk) badge = '<span class="schema-col-fk">FK</span>'

    row.innerHTML = `
      <span class="schema-col-name">${col.name}</span>
      ${badge}
      <span class="schema-col-type">${col.type}</span>
    `
    columnsList.appendChild(row)
  }

  item.appendChild(header)
  item.appendChild(columnsList)
  return item
}

function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn')
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'))
      tab.classList.add('active')

      const targetId = `tab-${tab.dataset.tab}`
      document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'))
      document.getElementById(targetId).classList.remove('hidden')
    })
  })
}

function initDataTableSelector() {
  const select = document.getElementById('data-table-select')
  select.addEventListener('change', () => {
    const table = select.value
    const content = document.getElementById('data-content')
    if (!table) {
      content.innerHTML = '<p class="data-placeholder">Sélectionnez une table pour voir ses données.</p>'
      return
    }
    content.innerHTML = '<p class="data-placeholder">Base de données non encore chargée.</p>'
  })
}

export function refreshDataTab(db, tableName) {
  if (!db || !tableName) return
  const content = document.getElementById('data-content')
  try {
    const result = db.exec(`SELECT * FROM ${tableName} LIMIT 50`)
    if (!result.length) {
      content.innerHTML = '<p class="data-placeholder">Aucune donnée.</p>'
      return
    }
    const { columns, values } = result[0]
    const rows = values.map(v => {
      const row = {}
      columns.forEach((c, i) => { row[c] = v[i] })
      return row
    })
    renderDataTable(content, columns, rows)
  } catch (e) {
    content.innerHTML = `<p class="data-placeholder">Erreur : ${e.message}</p>`
  }
}

function renderDataTable(container, columns, rows) {
  const wrapper = document.createElement('div')
  wrapper.style.overflowX = 'auto'

  const table = document.createElement('table')
  table.className = 'result-table'
  table.style.fontSize = '11.5px'

  const thead = document.createElement('thead')
  thead.innerHTML = `<tr>${columns.map(c => `<th>${c}</th>`).join('')}</tr>`
  table.appendChild(thead)

  const tbody = document.createElement('tbody')
  for (const row of rows) {
    const tr = document.createElement('tr')
    tr.innerHTML = columns.map(c => {
      const v = row[c]
      if (v === null || v === undefined) return '<td class="null-value">NULL</td>'
      return `<td>${String(v)}</td>`
    }).join('')
    tbody.appendChild(tr)
  }
  table.appendChild(tbody)

  wrapper.appendChild(table)
  container.innerHTML = ''
  container.appendChild(wrapper)

  const meta = document.createElement('p')
  meta.className = 'result-meta'
  meta.style.padding = '6px 12px'
  meta.textContent = `${rows.length} ligne${rows.length !== 1 ? 's' : ''} (max 50)`
  container.appendChild(meta)
}
