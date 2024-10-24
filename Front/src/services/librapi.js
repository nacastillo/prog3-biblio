import api from './api'

// http://covers.openlibrary.org/b/isbn/

const serv = {};

serv.login = (u, p) => api.post('/login', { usr: u, pwd: p })
serv.getAll = (ruta) => api.get(`/${ruta}`)
serv.crear = (ruta, objeto) => api.post(`/${ruta}`, objeto)
serv.leer = (ruta, id) => api.get(`${ruta}/${id}`)
/**
 * 
 * @param {string} ruta 
 * @param {ObjectId} id 
 * @param {object} objeto 
 * @returns 
 */
serv.actualizar = (ruta, id, objeto) => api.put(`${ruta}/${id}`, objeto)
serv.borrar = (ruta, id) => api.delete(`/${ruta}/${id}`)

export default serv