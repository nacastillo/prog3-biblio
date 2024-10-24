import { defineConfig } from 'vite';
import {config} from "dotenv";
import react from '@vitejs/plugin-react'

if (process.env.NODE_ENV) {
    config({path: `.env.${process.env.NODE_ENV}`});
}
//console.log(process.env);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],    
    define: {
        "process.env": process.env || null
    },    
    server: {
        port: process.env.PORT_FRONT || null
    }
})
