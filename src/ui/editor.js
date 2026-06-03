import { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { sql } from '@codemirror/lang-sql'
import { oneDark } from '@codemirror/theme-one-dark'

let editorView = null

export function initEditor(onExecute) {
  const container = document.getElementById('editor')
  container.innerHTML = ''

  const runOnCtrlEnter = keymap.of([
    {
      key: 'Ctrl-Enter',
      run() {
        onExecute(getEditorValue())
        return true
      }
    },
    {
      key: 'Mod-Enter',
      run() {
        onExecute(getEditorValue())
        return true
      }
    }
  ])

  const startState = EditorState.create({
    doc: '',
    extensions: [
      history(),
      lineNumbers(),
      highlightActiveLine(),
      drawSelection(),
      sql(),
      oneDark,
      keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
      runOnCtrlEnter,
      EditorView.lineWrapping,
    ]
  })

  editorView = new EditorView({
    state: startState,
    parent: container,
  })

  return editorView
}

export function getEditorValue() {
  return editorView?.state.doc.toString() ?? ''
}

export function setEditorValue(sql) {
  if (!editorView) return
  editorView.dispatch({
    changes: {
      from: 0,
      to: editorView.state.doc.length,
      insert: sql,
    }
  })
}

export function clearEditor() {
  setEditorValue('')
}
