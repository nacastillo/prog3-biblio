import api from './api'

const serv = {};

serv.login = (u, p) => api.post('/login', { usr: u, pwd: p })
serv.getAll = (ruta) => api.get(`/${ruta}`)
serv.crear = (ruta, objeto) => api.post(`/${ruta}`, objeto)
serv.leer = (ruta, id) => api.get(`${ruta}/${id}`)
serv.actualizar = (ruta, id, objeto) => api.put(`${ruta}/${id}`, objeto)
serv.borrar = (ruta, id) => api.delete(`/${ruta}/${id}`)

export default serv