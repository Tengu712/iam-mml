import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import rehypeShiki from '@shikijs/rehype'
import remarkGfm from 'remark-gfm'
import fs from 'fs'

const mmlGrammar = JSON.parse(fs.readFileSync('./mml.tmLanguage.json', 'utf8'))

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        [
          rehypeShiki,
          {
            theme: 'slack-dark',
            langs: [mmlGrammar]
          }
        ]
      ]
    }),
    react()
  ],
  base: '/iam-mml/'
})
