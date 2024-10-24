import axios from 'axios'

const addr = process.env.URL_BACK || "localhost";
const port = process.env.PORT_BACK || 3000;
const api = axios.create({        
        baseURL: `http://${addr}:${port}`,
        timeout: 1000 * 10 // 10 segundos
    }
)

api.interceptors.request.use (
    (conf) => {
        return conf;
    },
    (err) => Promise.reject(err)
)

api.interceptors.response.use (
    (res) => res.data,    
    (err) => Promise.reject(err)
)

export default api