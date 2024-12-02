import { defineConfig } from 'vite';
import {config} from "dotenv";
import react from '@vitejs/plugin-react'

if (process.env.NODE_ENV) {
    config({path: `.env.${process.env.NODE_ENV}`});
}

export default defineConfig({
    plugins: [react()],    
    define: {
        "process.env": process.env || null
    },    
    server: {
        port: process.env.PORT_FRONT || 5173
    }
})
