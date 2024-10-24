if (process.env.NODE_ENV) {    
  require("dotenv").config({path: `.env.${process.env.NODE_ENV}`});
}

const db_url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/'
const db_name = process.env.MONGO_DB || 'prueba'

module.exports = {
  mongodb: {
    url: db_url + db_name,
    options: {},
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
}
