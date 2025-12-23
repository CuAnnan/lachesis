// javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@CharacterEditor': path.resolve(__dirname, 'src/components/CharacterEditor'),
            '@CharacterSheet': path.resolve(__dirname, 'src/components/CharacterSheet'),
            '@CharacterModel': path.resolve(__dirname, '../Character Model'),
            '@inc': path.resolve(__dirname, 'src/inc'),
            '@root': path.resolve(__dirname, '..'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('bootstrap')) return 'vendor-bootstrap';
                    if (id.endsWith('print.css')) return 'print';
                },
            },
        },
    },
})
