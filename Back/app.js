const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

const app = express()

// Rutas
const statusRouter = require('./routes/status')
const authRouter = require('./routes/auth')
const loginRouter = require('./routes/login')
const librosRouter = require('./routes/libros')
const prestamosRouter = require ('./routes/prestamos')
const generosRouter = require('./routes/generos')
const usuariosRouter = require('./routes/usuarios')
const rolesRouter = require('./routes/roles')

// Middleware
const authentication = require('./middlewares/authentication')
const authorization = require('./middlewares/authorization')


app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(authorization)

// This is to aviod error
app.get('/favicon.ico', (req, res) => res.status(204))
app.use('/', statusRouter);
app.use('/auth', authRouter);
app.use('/login', loginRouter);
app.use('/libros', librosRouter);
app.use('/generos', generosRouter);
app.use('/prestamos', prestamosRouter);
app.use('/usuarios', usuariosRouter);
//app.use('/users', authentication, userRouter);
app.use('/roles', rolesRouter);

module.exports = app
