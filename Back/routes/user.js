const express = require('express')
const bcrypt = require('bcrypt')

const User = require('../schemas/user')
const Role = require('../schemas/role')

const router = express.Router()

router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

async function getAllUsers(req, res, next) {
  console.log('getAllUsers by user ', req.user._id)
  try {
    const users = await User.find({ isActive: true }).populate('role')
    res.send(users)
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

async function createUser(req, res, next) {
  console.log('createUser: ', req.body)

  const user = req.body

  try {
    const role = await Role.findOne({ name: user.role })
    if (!role) {
      res.status(404).send('Role not found')
    }

    const passEncrypted = await bcrypt.hash(user.password, 10)

    const userCreated = await User.create({ ...user, password: passEncrypted, role: role._id })

    res.send(userCreated)
  } catch (err) {
    next(err)
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

module.exports = router
