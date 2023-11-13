const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

const app = express()

const librosRouter = require('./routes/libros')
const statusRouter = require('./routes/status')
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
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
app.use('/users', authentication, userRouter);
app.use('/libros',librosRouter);

module.exports = app
