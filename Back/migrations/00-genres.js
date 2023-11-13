// migracion de generos
const mongodb = require ('mongodb');

const { ObjectId } = mongodb;

const initialGenres = [
    {
        _id: new ObjectId('000000000000000000000001'),
        cod: 1,
        desc: "Terror",
    },
    {
        _id: new ObjectId('000000000000000000000002'),
        cod: 2,
        desc: "Comedia",
    },
    {
        _id: new ObjectId('000000000000000000000003'),
        cod: 3,
        desc: "Drama",
    },
    {
        _id: new ObjectId('000000000000000000000004'),
        cod: 4,
        desc: "Ciencia ficción",
    },
    {
        _id: new ObjectId('000000000000000000000005'),
        cod: 5,
        desc: "Romance",
    }
]

module.exports = {
    async up (db, client) {
        await db.collection('generos').insertMany(initialGenres);
    },

    async down (db, client) {
        await db.collection('generos').deleteMany({
            _id: {
                $in: initialGenres.map((genre) => genre._id),
            },
        })
    },
}