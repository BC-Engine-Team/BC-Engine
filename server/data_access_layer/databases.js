const Sequelize = require("sequelize");
const env = 'development' || 'production';

// Load the configuration for the dbs
const config = require('./db.config')[env];

const db = {};

const databases = Object.keys(config.databases);

for (let i = 0; i < databases.length; i++) {
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

// Add any tables to the local database here
[db['localdb'].users, db['localdb'].chartReports] = require("./models/localdb/localdb.model")(db['localdb'], Sequelize);

// patricia database tables
db['mssql_pat'].employees = require("./models/mssql_pat/employee.model")(db['mssql_pat'], Sequelize);
db['mssql_pat'].invoice_header = require("./models/mssql_pat/invoice_header.model")(db['mssql_pat'], Sequelize);
db['mssql_pat'].invoice_affect = require("./models/mssql_pat/invoice_affect.model")(db['mssql_pat'], Sequelize);

// bosco database tables
db['mssql_bosco'].transactions = require("./models/mssql_bosco/accounting_client.model")(db['mssql_bosco'], Sequelize);
db['mssql_bosco'].transactions_stat = require("./models/mssql_bosco/accounting_client_stat.model")(db['mssql_bosco'], Sequelize);


db.sync = async (database, options) => {
  await db[database].sync(options)
    .then(async () => {
      return await db[database].users.bulkCreate([
        {
          email: 'first@benoit-cote.com',
          password: 'verySecurePassword1',
          name: 'Marc Benoit',
          role: 'admin'
        },
        {
          email: 'second@benoit-cote.com',
          password: 'verySecurePassword1',
          name: 'JC Benoit',
          role: 'employee'
        }],
        {
          validate: true,
          individualHooks: true
        });
    })
    .then(async (data) => {
      data.forEach((e) => {
        console.log(e.toJSON());
      });
      await db[database].chartReports.bulkCreate([
        {
          name: 'CR1',
          startDate: new Date(),
          endDate: new Date(),
          employee1Id: 12345,
          employee1Name: 'France Cote',
          country: 'Canada',
          clientType: 'Corr',
          ageOfAccount: 'All',
          accountType: 'Receivable',
          user_user_id: data[0].userId
        },
        {
          name: 'CR2',
          startDate: new Date(),
          endDate: new Date(),
          employee1Id: -1,
          employee1Name: 'All',
          employee2Id: 12345,
          employee2Name: 'France Cote',
          country: 'All',
          clientType: 'Direct',
          ageOfAccount: '60-90',
          accountType: 'Receivable',
          user_user_id: data[0].userId
        },
        {
          name: 'CR3',
          startDate: new Date(),
          endDate: new Date(),
          employee1Id: 12345,
          employee1Name: 'France Cote',
          country: 'All',
          clientType: 'Any',
          ageOfAccount: '<30',
          accountType: 'Payable',
          user_user_id: data[1].userId
        }
      ]);
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
}

module.exports = db;

