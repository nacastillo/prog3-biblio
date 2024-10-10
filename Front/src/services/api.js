import axios from 'axios'

//const addr = "localhost";
const addr = "192.168.0.142";

const api = axios.create({
        //baseURL: 'http://localhost:3000',
        baseURL: `http://${addr}:3000`,
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
    //(err) => Promise.reject(console.log(err))
    (err) => Promise.reject(err)
)

export default api