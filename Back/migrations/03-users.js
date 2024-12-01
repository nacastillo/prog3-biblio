const mongodb = require('mongodb')

const { ObjectId } = mongodb

const initialUsers = [
    {
        _id: new ObjectId('000000000000000000000000'),
        usr: "admin",
        email: 'admin@baseapinode.com',        
        pwd: "$2b$10$pzkZL0XY2CGMVjkDjR7Tje7Ho508XcOaXJV3IpZB4uEbCFuGxG0l.", // admin
        role: new ObjectId('000000000000000000000000'), // Admin
        fullName: 'ADMIN, Admin',
        phone: '00 0000 0000',
        dni: '99999999',
        bornDate: new Date(),
        isActive: true,        
    },
    {
        _id: new ObjectId('000000000000000000000001'),
        usr: "nicolas",
        email: 'nicastillo@baseapinode.com',
        pwd: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
        role: new ObjectId('000000000000000000000001'), // Bibliotecario
        fullName: 'Castillo, Nicolas',        
        phone: '(+54) 9 1145449869',
        dni: '35361921',
        bornDate: new Date(1990, 11, 22),
        isActive: true,        
    },
    {
        _id: new ObjectId('000000000000000000000002'),
        usr: "clopez",
        email: 'clopez@baseapinode.com',
        pwd: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
        role: new ObjectId('000000000000000000000002'), // Socio
        fullName: 'Lopez, Carlos',        
        phone: '(+598) 2204 5199',
        dni: '45323877',
        bornDate: new Date(2000, 0, 15),
        isActive: true,        
    },
    {
        _id: new ObjectId("673412c6047bd66044c56027"),
        usr: "biblio",
        pwd: "$2b$10$D2fEx3NDq3QYX6foI.lwFeDCmOfZd0A6P9uqsQtyNPD9QbdcYNmNq", // biblio
        email: "biblio@tecario.com",
        role: new ObjectId("000000000000000000000001"),
        fullName: "TECARIO, biblio",
        dni: "2",
        isActive: true,
    },    
    {
        _id: new ObjectId("673412dd047bd66044c5602c"),            
        usr: "socio",
        pwd: "$2b$10$T8BSdwy0sO9npDnLgCrXze0Nir7MzhSHccIhclSlSoMkYTTaAe/uC", // socio
        email: "socio@correo.com",
        role: new ObjectId("000000000000000000000002"),            
        fullName: "SOCIO, socio",
        dni: "3",
        isActive: true,
    }    
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
