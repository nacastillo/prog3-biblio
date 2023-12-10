import axios from 'axios'

const api = axios.create({
        baseURL: 'http://localhost:3000',
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
    (err) => Promise.reject(console.log(err))
)


export default api