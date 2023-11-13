import api from './api'

const swService = {}

swService.getRoot = () => api.get('/')
swService.getPeople = () => api.get(`/people`)
swService.getPersonById = (id) => api.get(`/people/${id}`)

export default swService
