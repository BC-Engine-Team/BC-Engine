const Sequelize = require("sequelize");
const env = 'development' || 'production';

// Load the configuration for the dbs
const config = require('./db.config')[env];

const db = {};

const databases = Object.keys(config.databases);

for(let i=0; i<databases.length; i++){
  let database = databases[i];
  let dbPath = config.databases[database];

  db[database] = new Sequelize(dbPath.DB, dbPath.USER, dbPath.PASSWORD, {
    host: dbPath.HOST || 'localhost',
    port: dbPath.port,
    dialect: dbPath.dialect,
    dialectModule: dbPath.dialectModule || "",
    timezone: dbPath.timezone || '+00:00',
    pool: {
      max: dbPath.pool ? dbPath.pool.max : 5,
      min: dbPath.pool ? dbPath.pool.min : 0,
      acquire: dbPath.pool ? dbPath.pool.acquire : 30000,
      idle: dbPath.pool ? dbPath.pool.idle : 10000
    }
  })
}

db.Sequelize = Sequelize;

// Add any tables to the database here
// Own database tables
db['mysqldb'].users = require("./models/mysql/user.model")(db['mysqldb'], Sequelize);

// Patricia database tables
db['mssql_pat'].employees = require("./models/mssql_pat/employee.model")(db['mssql_pat'], Sequelize);
db['mssql_pat'].invoice_header = require("./models/mssql_pat/invoice_header.model")(db['mssql_pat'], Sequelize);

//bosco database tables
db['mssql_bosco'].transactions = require("./models/mssql_bosco/accounting_client.model")(db['mssql_bosco'], Sequelize);


db.sync = async (database, options) => {
  await db[database].sync(options)
    .then(() => {
      return db[database].users.bulkCreate([
        {
          email: 'first@benoit-cote.com', 
          password: 'verySecurePassword', 
          name: 'Marc Benoit', 
          role: 'admin'
        },
        {
          email: 'second@benoit-cote.com', 
          password: 'verySecurePassword', 
          name: 'JC Benoit', 
          role: 'employee'
        }],
        {
          validate: true,
          individualHooks: true
        });
    })
    .then((data) => {
      data.forEach((e) => {
        console.log(e.toJSON());
      });
    })
    .catch((err) =>{
      if(err){
        console.log('Could not sync with the Database.');
      }
    });
}

module.exports = db;

