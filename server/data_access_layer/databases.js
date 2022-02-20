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

// Add any tables to the database here
// Add any tables to the local database here
[db['localdb'].users,
db['localdb'].chartReports,
db['localdb'].chartReportsData,
db['localdb'].reportTypes,
db['localdb'].recipients,
db['localdb'].reportTypeRecipients,
db['localdb'].clientGradingData] = require("./models/localdb/localdb.model")(db['localdb'], Sequelize);


// patricia database tables
db['mssql_pat'].employees = require("./models/mssql_pat/employee.model")(db['mssql_pat'], Sequelize);

// Bosco database tables



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
      await db[database].chartReports.bulkCreate([
        {
          name: 'CR1',
          startDate: new Date(2019, 11, 1),
          endDate: new Date(2019, 11, 1),
          employee1Id: 12345,
          employee1Name: 'France Cote',
          countryId: 'CA',
          country: 'Canada',
          clientType: 'Corr',
          ageOfAccount: 'All',
          accountType: 'Receivable',
          user_user_id: data[0].userId
        },
        {
          name: 'CR2',
          startDate: new Date(2019, 11, 1),
          endDate: new Date(2019, 11, 1),
          employee1Id: -1,
          employee1Name: 'All',
          employee2Id: 12345,
          employee2Name: 'France Cote',
          countryId: '-1',
          country: 'All',
          clientType: 'Direct',
          ageOfAccount: '60-90',
          accountType: 'Receivable',
          user_user_id: data[0].userId
        },
        {
          name: 'CR3',
          startDate: new Date(2019, 11, 1),
          endDate: new Date(2019, 11, 1),
          employee1Id: 12345,
          employee1Name: 'France Cote',
          countryId: '-1',
          country: 'All',
          clientType: 'Any',
          ageOfAccount: '<30',
          accountType: 'Payable',
          user_user_id: data[1].userId
        }
      ]);
    })
    .then(async () => {
      await db[database].clientGradingData.bulkCreate({
        maximumGradeAPlus: 50000,
        minimumGradeAPlus: 45000,
        averageCollectionTimeGradeAPlus: "30 days or less",
        maximumGradeA: 44999,
        minimumGradeA: 25000,
        averageCollectionTimeGradeA: "30 days or less",
        maximumGradeB: 24999,
        minimumGradeB: 15000,
        averageCollectionTimeGradeB: "30 days or less",
        maximumGradeC: 14999,
        minimumGradeC: 9000,
        averageCollectionTimeGradeC: "30 days or less",
        maximumGradeEPlus: 8999,
        minimumGradeEPlus: 500,
        averageCollectionTimeGradeEPlus: "30 days or less"
      });
    })
    .then(async () => {
      let recipients = await db['localdb'].recipients.bulkCreate([
        {
          name: "Charles-André Caron",
          email: "charles-andre@benoit-cote.com"
        },
        {
          name: "France Coté",
          email: "france@benoit-cote.com"
        },
        {
          name: "Hilal El Ayoubi",
          email: "hilal@benoit-cote.com"
        },
        {
          name: "Ibrahim Tamer",
          email: "ibrahim@benoit-cote.com"
        },
        {
          name: "Irina Kostko",
          email: "irina@benoit-cote.com"
        },
        {
          name: "Ismaël Coulibaly",
          email: "ismael@benoit-cote.com"
        },
        {
          name: "Marc Benoît",
          email: "marc@benoit-cote.com"
        },
        {
          name: "Mailyne Séïde",
          email: "marilyne@benoit-cote.com"
        },
        {
          name: "Martin Roy",
          email: "martin@benoit-cote.com"
        },
        {
          name: "Mathieu Audet",
          email: "ma@benoit-cote.com"
        },
        {
          name: "Mathieu Miron",
          email: "mathieu@benoit-cote.com"
        },
        {
          name: "Michel Sofia",
          email: "michel@benoit-cote.com"
        },
        {
          name: "Philip Conrad",
          email: "phil@benoit-cote.com"
        },
        {
          name: "Sabrina Lavoie",
          email: "slavoie@benoit-cote.com"
        },
        {
          name: "Suzanne Antal",
          email: "suzanne@benoit-cote.com"
        }
      ]);
      return recipients;
    })
    .then(async (recipients) => {
      let reportTypes = await db['localdb'].reportTypes.create({
        reportTypeName: 'Monthly Employee Performance Report',
        frequency: 0
      });
      return { reportTypes: reportTypes, recipients: recipients };
    })
    .then(async data => {
      let reportTypeRecipients = [];
      for (let i = 0; i < data.recipients.length; i++) {
        reportTypeRecipients.push({
          report_type_id: data.reportTypes.reportTypeId,
          recipient_id: data.recipients[i].recipientId
        });
      }
      await db['localdb'].reportTypeRecipients.bulkCreate(reportTypeRecipients);
    })
    .catch((err) => {
      console.log(err.message);
    });
}

module.exports = db;

