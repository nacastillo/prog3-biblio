import axios from 'axios'
// import localStorage from './localStorage'

const api = axios.create({
  baseURL: 'https://swapi.dev/api',
  timeout: 1000 * 15, // 15 sec
  // headers: {
  //   Accept: 'application/json',
  //   'Content-Type': 'application/json',
  // },
})

api.interceptors.request.use(
  (config) => {
    // const data = localStorage.get() // Before request is sent
    // if (data) {
    //   // eslint-disable-next-line no-param-reassign
    //   config.headers.common.Authorization = `${data.token}`
    // }
    return config
  },
  (error) => Promise.reject(error) // Do something with request error
)

api.interceptors.response.use(
  (response) => response.data, // Do something with response data
  (error) =>
    // Do something with response error
    Promise.reject(console.log(error))
)

export default api
