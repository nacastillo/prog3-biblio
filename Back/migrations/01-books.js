// migracion de libros
const mongodb = require ('mongodb');

const { ObjectId } = mongodb

const initialBooks = [
    {
      "id": 1,
      "titulo": "El Gran Gatsby",
      "autor": "F. Scott Fitzgerald",
      "cant": 5,
      "prestable": true,
      "id_genero": new ObjectId('000000000000000000000001')
    },
    {
      "id": 2,
      "titulo": "Matar un ruiseñor",
      "autor": "Harper Lee",
      "cant": 8,
      "prestable": false,
      "id_genero": new ObjectId('000000000000000000000002')
    },
    {
      "id": 3,
      "titulo": "Don Quijote de la Mancha",
      "autor": "Miguel de Cervantes",
      "cant": 12,
      "prestable": true,
      "id_genero": new ObjectId('000000000000000000000004')
    },
    {
      "id": 4,
      "titulo": "Crimen y castigo",
      "autor": "Fiodor Dostoievski",
      "cant": 6,
      "prestable": false,
      "id_genero": new ObjectId('000000000000000000000005')
    },
    {
      "id": 5,
      "titulo": "Harry Potter y la Piedra Filosofal",
      "autor": "J.K. Rowling",
      "cant": 10,
      "prestable": true,
      id_genero: new ObjectId('000000000000000000000001')
    },
    {
      "id": 6,
      "titulo": "Los Juegos del Hambre",
      "autor": "Suzanne Collins",
      "cant": 7,
      "prestable": false,
      id_genero: new ObjectId('000000000000000000000002')
    },
    {
      "id": 7,
      "titulo": "La Carretera",
      "autor": "Cormac McCarthy",
      "cant": 3,
      "prestable": false,
      id_genero: new ObjectId('000000000000000000000003')
    },
    {
      "id": 8,
      "titulo": "Cien años de soledad",
      "autor": "Gabriel García Márquez",
      "cant": 0,
      "prestable": true,
      id_genero: new ObjectId('000000000000000000000004')
    },
    {
      "id": 9,
      "titulo": "Código Da Vinci",
      "autor": "Dan Brown",
      "cant": 9,
      "prestable": false,
      id_genero: new ObjectId('000000000000000000000005')
    },
    {
      "id": 10,
      "titulo": "1984",
      "autor": "George Orwell",
      "cant": 0,
      "prestable": true,
      id_genero: new ObjectId('000000000000000000000001')
    }
]

module.exports = {
    async up (db, client) {
        await db.collection('libros').insertMany(initialBooks);
    },

    async down (db, client) {
        await db.collection('libros').deleteMany ({
            _id: {
                $in: initialBooks.map((book) => book._id),
            },
        })
    },
}