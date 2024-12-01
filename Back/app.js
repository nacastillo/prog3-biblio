const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const auth = require("./middlewares/auth");

const app = express()
const statusRouter = require('./routes/status')
const loginRouter = require('./routes/login')
const librosRouter = require('./routes/libros')
const prestamosRouter = require ('./routes/prestamos')
const generosRouter = require('./routes/generos')
const usuariosRouter = require('./routes/usuarios')
const rolesRouter = require('./routes/roles')

app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.get('/favicon.ico', (req, res) => res.status(204))
app.use('/', statusRouter);
app.use('/login', loginRouter);
app.use('/libros', auth, librosRouter);
app.use('/generos', auth, generosRouter);
app.use('/prestamos', auth, prestamosRouter);
app.use('/usuarios', auth, usuariosRouter);
app.use('/roles', auth, rolesRouter);

module.exports = app
