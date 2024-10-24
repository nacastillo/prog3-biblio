/* eslint-disable no-unused-vars */
const mongodb = require('mongodb')

const { ObjectId } = mongodb

const initialRoles = [
  {
    _id: new ObjectId('000000000000000000000000'),
    cod: 0,
    name: 'Administrador',
    ///createdAt: new Date(),
    //updatedAt: new Date(),
  },
  {
    _id: new ObjectId('000000000000000000000001'),
    cod: 1,
    name: 'Bibliotecario',
    //createdAt: new Date(),
    //updatedAt: new Date(),
  },
  {
    _id: new ObjectId('000000000000000000000002'),
    cod: 2,
    name: 'Socio',
    //createdAt: new Date(),
    //updatedAt: new Date(),
  },
]

module.exports = {
  async up(db, client) {
    await db.collection('roles').insertMany(initialRoles)
  },

  async down(db, client) {
    await db.collection('roles').deleteMany({
      _id: {
        $in: initialRoles.map((role) => role._id),
      },
    })
  },
}
