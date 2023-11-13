/* eslint-disable no-unused-vars */
const mongodb = require('mongodb')

const { ObjectId } = mongodb

const initialUsers = [
  {
    _id: new ObjectId('000000000000000000000000'),
    email: 'admin@baseapinode.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    firstName: 'Admin',
    lastName: 'BaseApi',
    role: new ObjectId('000000000000000000000000'), // Admin
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000001'),
    email: 'nicastillo@baseapinode.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    firstName: 'Nicolas',
    lastName: 'Castillo',
    role: new ObjectId('000000000000000000000001'), // Bibliotecario
    phone: '(+54) 9 1145449869',
    governmentId: {
      type: 'cuil',
      number: '20-35361921-8',
    },
    bornDate: new Date(1990, 11, 22),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
  },  
  {
    _id: new ObjectId('000000000000000000000002'),
    email: 'clopez@baseapinode.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    firstName: 'Carlos',
    lastName: 'Lopez',
    phone: '(+598) 2204 5199',
    governmentId: {
      type: 'dni',
      number: '5023877',
    },
    bornDate: new Date(2000, 0, 15),
    role: new ObjectId('000000000000000000000002'), // Socio
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
  },
]

module.exports = {
  async up(db, client) {
    await db.collection('users').insertMany(initialUsers)
  },

  async down(db, client) {
    await db.collection('users').deleteMany({
      _id: {
        $in: initialUsers.map((user) => user._id),
      },
    })
  },
}
