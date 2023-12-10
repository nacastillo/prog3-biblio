/* eslint-disable no-unused-vars */
const mongodb = require('mongodb')

const { ObjectId } = mongodb

const initialUsers = [
  {
    _id: new ObjectId('000000000000000000000000'),
    email: 'admin@baseapinode.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000000'), // Admin
    fullName: 'BaseApi, Admin' ,
    // firstName: 'Admin',
    // lastName: 'BaseApi',
    phone: '00 0000 0000',
    dni: '99999999',  
    bornDate: new Date(),
    isActive: true,
    // createdAt: new Date(),
    // updatedAt: new Date(),
    //  __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000001'),
    email: 'nicastillo@baseapinode.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Bibliotecario
    fullName: 'Castillo, Nicolas',
    // firstName: 'Nicolas',
    // lastName: 'Castillo',    
    phone: '(+54) 9 1145449869',
    dni: '35361921',
    bornDate: new Date(1990, 11, 22),
    isActive: true,
    //createdAt: new Date(),
    //updatedAt: new Date(),
    //__v: 0,
  },  
  {
    _id: new ObjectId('000000000000000000000002'),
    email: 'clopez@baseapinode.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000002'), // Socio
    fullName: 'Lopez, Carlos',
    // firstName: 'Carlos',
    // lastName: 'Lopez',
    phone: '(+598) 2204 5199',
    dni: '5023877',    
    bornDate: new Date(2000, 0, 15),    
    isActive: true,
    // createdAt: new Date(),
    // updatedAt: new Date(),
    // __v: 0,
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
