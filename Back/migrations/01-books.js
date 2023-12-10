// migracion de libros
const mongodb = require('mongodb');

const { ObjectId } = mongodb

const initialBooks =
  [
    {
      "cod": 1,
      "titulo": "El Gran Gatsby",
      "autor": "F. Scott Fitzgerald",
      "lecturaLocal": 10,
      "paraPrestamo": 5,
      "id_genero": new ObjectId('000000000000000000000001')
    },
    {
      "cod": 2,
      "titulo": "Matar un ruiseñor",
      "autor": "Harper Lee",
      "lecturaLocal": 8,
      "paraPrestamo": 3,
      "id_genero": new ObjectId('000000000000000000000002')
    },
    {
      "cod": 3,
      "titulo": "Don Quijote de la Mancha",
      "autor": "Miguel de Cervantes",
      "lecturaLocal": 12,
      "paraPrestamo": 7,
      "id_genero": new ObjectId('000000000000000000000003')
    },
    {
      "cod": 4,
      "titulo": "Crimen y castigo",
      "autor": "Fiodor Dostoievski",
      "lecturaLocal": 15,
      "paraPrestamo": 9,
      "id_genero": new ObjectId('000000000000000000000004')
    },
    {
      "cod": 5,
      "titulo": "Harry Potter y la Piedra Filosofal",
      "autor": "J.K. Rowling",
      "lecturaLocal": 20,
      "paraPrestamo": 12,
      "id_genero": new ObjectId('000000000000000000000005')
    },
    {
      "cod": 6,
      "titulo": "Los Juegos del Hambre",
      "autor": "Suzanne Collins",
      "lecturaLocal": 3,
      "paraPrestamo": 1,
      "id_genero": new ObjectId('000000000000000000000005')
    },
    {
      "cod": 7,
      "titulo": "La Carretera",
      "autor": "Cormac McCarthy",
      "lecturaLocal": 5,
      "paraPrestamo": 5,
      "id_genero": new ObjectId('000000000000000000000005')
    },
    {
      "cod": 8,
      "titulo": "Cien años de soledad",
      "autor": "Gabriel García Márquez",
      "lecturaLocal": 0,
      "paraPrestamo": 7,
      "id_genero": new ObjectId('000000000000000000000005')
    },
    {
      "cod": 9,
      "titulo": "Código Da Vinci",
      "autor": "Dan Brown",
      "lecturaLocal": 0,
      "paraPrestamo": 7,
      "id_genero": new ObjectId('000000000000000000000005')
    },

  ]

/*   








"titulo": "1984",
"autor": "George Orwell",
      
*/

module.exports = {
  async up(db, client) {
    await db.collection('libros').insertMany(initialBooks);
  },

  async down(db, client) {
    await db.collection('libros').deleteMany({
      _id: {
        $in: initialBooks.map((book) => book._id),
      },
    })
  },
}