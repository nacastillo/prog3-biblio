import api from './api'

// http://covers.openlibrary.org/b/isbn/

const serv = {} // crea objeto vacío y luego le agrega atributos

serv.login = (e, p) => api.post('/login', { email: e, password: p })
serv.getAll = (ruta) => api.get(`/${ruta}`)
serv.crear = (ruta, objeto) => api.post(`/${ruta}`, objeto)
serv.leer = (ruta, id) => api.get(`${ruta}/${id}`)
serv.actualizar = (ruta, id, objeto) => api.put(`${ruta}/${id}`, objeto)
serv.borrar = (ruta, id) => api.delete(`/${ruta}/${id}`)
serv.getPrestables = () => api.get('/libros/prestables')

export default serv