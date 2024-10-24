const express = require('express')
const bcrypt = require('bcrypt')

const User = require('../schemas/user')
const Role = require('../schemas/role')

const router = express.Router()

router.get('/', getAllUsers)

/** Create -> Post, Read -> Get, Update -> Put, Delete -> Delete */

router.post('/', crearUser)
router.get('/:id', leerUser)
router.put('/:id', actualizarUser)
router.delete('/:id', borrarUser)

async function getAllUsers(req, res, next) {/*
    console.log('getAllUsers by user ', req.user._id)
    try {
        const users = await User.find({ isActive: true }).populate('role')
        res.send(users)
    } catch (err) {
        next(err)
    }
    */
    try {
        const users = await User.find({}).populate('role')
        res.send(users)
    }
    catch (err) {
        next(err)
    }
}

async function crearUser(req, res, next) {
    const user = req.body
    try {
        const pwdHasheada = await bcrypt.hash(user.pwd,10);
        const userN = await User.create({ 
            ...user,
            pwd:pwdHasheada
        });
        res.send(userN);
    }
    catch (err) {
        next(err)
    }
}

async function leerUser(req, res, next) {    
    if (!req.params.id) {
        res.status(400).send('No hay dni')
    }
    try {
        const user = await User.findById(req.params.id).populate('role')
        //const user = await User.find({ dni: req.params.id }).populate('role')
        if (!user || user.length == 0) {
            res.status(404).send('Usuario no encontrado')
        }
        res.send(user)
    }
    catch (err) {
        next(err)
    }
}

async function actualizarUser(req, res, next) {    
    if (!req.params.id) {
        res.status(404).send('No hay _id')
    }
    try {
        const userA = await User.findById(req.params.id)
        //const userA = await User.findOne({ dni: req.params.id })
        if (!userA) {
            res.status(404).send('Usuario no encontrado')
        }
        if (req.body.role) {
            const newRole = await Role.findById(req.body.role)
            if (!newRole) {
                res.status(404).send('ID de rol no encontrado')
            }
        }        
        if (!req.body.email) {
            req.body.email = userA.email
        }        
        if (!req.body.role) {
            req.body.role = userA.role
        }
        if (!req.body.fullName) {
            req.body.fullName = userA.fullName
        }        
        if (!req.body.phone) {
            req.body.phone = userA.phone
        }
        if (!req.body.dni) {
            req.body.dni = userA.dni
        }
        if (!req.body.bornDate) {
            req.body.bornDate = userA.bornDate
        }
        if (!req.body.isActive) {
            req.body.isActive = userA.isActive
        }
        /*
        if (!req.body.password) {            
            req.body.password = userA.password
        }
        */
        if (req.body.pwd) {
            //const pwdHasheada  = await bcrypt.hash(req.body.pwd, 10);
            //req.body.pwd = pwdHasheada;
            //req.body.pwd = userA.pwd
            req.body.pwd = await bcrypt.hash(req.body.pwd, 10);
        }
        else {
            req.body.pwd = userA.pwd
        }
        
        await userA.updateOne(req.body)
        /*
        await userA.updateOne({
            ...req.body,
            pwd: pwdHasheada
        });
        */
        res.send(userA)
    }
    catch (err) {
        next(err)
    }
}

async function borrarUser(req, res, next) {
    if (!req.params.id) {
        return res.status(404).send('No hay _id')
    }
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).send('Usuario no encontrado')
        }
        await User.deleteOne({ _id: user._id })
        return res.send(`Usuario borrado: ${user}`)
    }
    catch (err) {
        return next(err)
    }
}

async function updateUser(req, res, next) {
    console.log('updateUser with id: ', req.params.id)

    if (!req.params.id) {
        return res.status(404).send('Parameter id not found')
    }

    if (!req.isAdmin() && req.params.id != req.user._id) {
        return res.status(403).send('Unauthorized')
    }

    // The email can't be updated
    delete req.body.email

    try {
        const userToUpdate = await User.findById(req.params.id)

        if (!userToUpdate) {
            req.logger.error('User not found')
            return res.status(404).send('User not found')
        }

        if (req.body.role) {
            const newRole = await Role.findById(req.body.role)

            if (!newRole) {
                req.logger.verbose('New role not found. Sending 400 to client')
                return res.status(400).end()
            }
            req.body.role = newRole._id
        }

        if (req.body.password) {
            const passEncrypted = await bcrypt.hash(req.body.password, 10)
            req.body.password = passEncrypted
        }

        // This will return the previous status
        await userToUpdate.updateOne(req.body)
        res.send(userToUpdate)

        // This return the current status
        // userToUpdate.password = req.body.password
        // userToUpdate.role = req.body.role
        // userToUpdate.firstName = req.body.firstName
        // userToUpdate.lastName = req.body.lastName
        // userToUpdate.phone = req.body.phone
        // userToUpdate.bornDate = req.body.bornDate
        // userToUpdate.isActive = req.body.isActive
        // await userToUpdate.save()
        // res.send(userToUpdate)
    } catch (err) {
        next(err)
    }
}

async function deleteUser(req, res, next) {
    console.log('deleteUser with id: ', req.params.id)
    if (!req.params.id) {
        res.status(500).send('The param id is not defined')
    }
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            res.status(404).send('User not found')
        }
        await User.deleteOne({ _id: user._id })
        res.send(`User deleted :  ${req.params.id}`)
    } catch (err) {
        next(err)
    }
}

async function getUserById(req, res, next) {
    console.log('getUser with id: ', req.params.id)

    if (!req.params.id) {
        res.status(500).send('The param id is not defined')
    }

    try {
        const user = await User.findById(req.params.id).populate('role')

        if (!user || user.length == 0) {
            res.status(404).send('User not found')
        }

        res.send(user)
    } catch (err) {
        next(err)
    }
}

// Por Postman
// {
//   "_id": "000000000000000000000000",
//   "email": "admin@baseapinode.com",
//   "password": "Password1",
//   "firstName": "Admin",
//   "lastName": "BaseApiNode",
//   "role": "admin",
//   "isActive": true
// }
// {
//   "_id": "000000000000000000000001",
//   "email": "client@baseapinode.com",
//   "password": "Password1",
//   "firstName": "Client",
//   "lastName": "BaseApiNode",
//   "role": "client",
//     "governmentId": {
//     "type": "dni",
//     "number": "22222222"
//   },
//   "isActive": true
// }

module.exports = router


