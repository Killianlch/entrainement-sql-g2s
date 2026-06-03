import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'node_modules/sql.js/dist/sql-wasm.wasm',         dest: '' },
        { src: 'node_modules/sql.js/dist/sql-wasm-browser.wasm', dest: '' }
      ]
    })
  ]
})
