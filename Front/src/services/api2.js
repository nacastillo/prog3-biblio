import axios from 'axios'

const api2 = axios.create({
        baseURL: 'http://localhost:3000',
        timeout: 1000 * 10 // 10 segundos
    }
)

api2.interceptors.request.use (
    (conf) => {
        return conf;
    },
    (err) => Promise.reject(err)
)

api2.interceptors.response.use (
    (res) => res.data,
    (err) => Promise.reject(console.log(err))
)


export default api2