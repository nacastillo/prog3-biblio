import api2 from './api2'

const lbServ = {}

lbServ.getLibros = () => api2.get('/libros')
lbServ.getPrestables = () => api2.get('/libros/prestables')

export default lbServ