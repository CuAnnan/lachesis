import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@CharacterEditor': path.resolve(__dirname, 'src/Components/CharacterEditor'),
            '@inc': path.resolve(__dirname, 'src/inc'),
        },
    },
})
