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
        const token = localStorage.getItem("nicastillo.prog3");
        if (token) {
            conf.headers["Authorization"] = token;
        }
        return conf;
    },
    (err) => Promise.reject(err)
)

api.interceptors.response.use (
    (res) => {        
        return res.data
    },    
    (err) => {        
        return Promise.reject(err)
    }
)

export default api