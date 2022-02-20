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
[db['localdb'].users,
db['localdb'].chartReports,
db['localdb'].chartReportsData,
db['localdb'].reportTypes,
db['localdb'].recipients,
db['localdb'].reportTypeRecipients,
db['localdb'].billingNumbers,
db['localdb'].performanceReport,
] = require("./models/localdb/localdb.model")(db['localdb'], Sequelize);

// patricia database tables
db['mssql_pat'].employees = require("./models/mssql_pat/employee.model")(db['mssql_pat'], Sequelize);

// Bosco database tables


// Populate local (MySQL) db with dummy data once db sync is successful
db.sync = async (database, options) => {
  await db[database].sync(options)
    .then(async () => {
      let data = {
        users: null
      }

      data.users = await db[database].users.bulkCreate([
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
        },
        {
          email: 'mathieu@benoit-cote.com',
          password: 'verySecurePassword1',
          name: 'Mathieu Miron',
          role: 'employee'
        }
      ],
        {
          validate: true,
          individualHooks: true
        });

      return data
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
          user_user_id: data.users[0].userId
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
          user_user_id: data.users[0].userId
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
          user_user_id: data.users[1].userId
        }
      ]);
      return data;
    })
    .then(async data => {
      data.recipients = await db['localdb'].recipients.bulkCreate([
        {
          employeeId: 26631,
          name: "Charles-André Caron",
          email: "charles-andre@benoit-cote.com"
        },
        {
          employeeId: 22769,
          name: "France Coté",
          email: "france@benoit-cote.com"
        },
        {
          employeeId: 29470,
          name: "Hilal El Ayoubi",
          email: "hilal@benoit-cote.com"
        },
        {
          employeeId: 26628,
          name: "Ibrahim Tamer",
          email: "ibrahim@benoit-cote.com"
        },
        {
          employeeId: 41830,
          name: "Irina Kostko",
          email: "irina@benoit-cote.com"
        },
        {
          employeeId: 31106,
          name: "Ismaël Coulibaly",
          email: "ismael@benoit-cote.com"
        },
        {
          employeeId: 25706,
          name: "Marc Benoît",
          email: "marc@benoit-cote.com"
        },
        {
          employeeId: 42381,
          name: "Marilyne Séïde",
          email: "marilyne@benoit-cote.com"
        },
        {
          employeeId: 20037,
          name: "Martin Roy",
          email: "martin@benoit-cote.com"
        },
        {
          employeeId: 41930,
          name: "Mathieu Audet",
          email: "ma@benoit-cote.com"
        },
        {
          employeeId: 20303,
          name: "Mathieu Miron",
          email: "mathieu@benoit-cote.com"
        },
        {
          employeeId: 26629,
          name: "Michel Sofia",
          email: "michel@benoit-cote.com"
        },
        {
          employeeId: 28658,
          name: "Philip Conrad",
          email: "phil@benoit-cote.com"
        },
        {
          employeeId: 42410,
          name: "Sabrina Lavoie",
          email: "slavoie@benoit-cote.com"
        },
        {
          employeeId: 38192,
          name: "Suzanne Antal",
          email: "suzanne@benoit-cote.com"
        }
      ]);
      return data;
    })
    .then(async (data) => {
      data.reportTypes = await db['localdb'].reportTypes.create({
        reportTypeName: 'Monthly Employee Performance Report',
        frequency: 0
      });
      return data;
    })
    .then(async data => {
      let reportTypeRecipients = [];
      let billingNumbers = [];
      for (let i = 0; i < data.recipients.length; i++) {
        reportTypeRecipients.push({
          report_type_id: data.reportTypes.reportTypeId,
          recipient_id: data.recipients[i].recipientId
        });

        let billingObject = {
          employee_id: data.recipients[i].employeeId,
          objectivesId: null,
          year: 2020,
          january: Math.random() * (40000 - 20000) + 20000,
          february: Math.random() * (40000 - 20000) + 20000,
          march: Math.random() * (40000 - 20000) + 20000,
          april: Math.random() * (40000 - 20000) + 20000,
          may: Math.random() * (40000 - 20000) + 20000,
          june: Math.random() * (40000 - 20000) + 20000,
          july: Math.random() * (40000 - 20000) + 20000,
          august: Math.random() * (40000 - 20000) + 20000,
          september: Math.random() * (40000 - 20000) + 20000,
          october: Math.random() * (40000 - 20000) + 20000,
          november: Math.random() * (40000 - 20000) + 20000,
          december: Math.random() * (40000 - 20000) + 20000
        }
        billingObject.total = 0;
        Object.keys(billingObject).forEach((value, index) => {
          if (index > 2) {
            billingObject.total += billingObject[value]
          }
        })

        let billingActual = {
          employee_id: data.recipients[i].employeeId,
          objectivesId: data.recipients.length * 2 - (data.recipients.length * 2 - i) + i + 1,
          year: 2020,
          january: Math.random() * (40000 - 20000) + 20000,
          february: Math.random() * (40000 - 20000) + 20000,
          march: Math.random() * (40000 - 20000) + 20000,
          april: Math.random() * (40000 - 20000) + 20000,
          may: Math.random() * (40000 - 20000) + 20000,
          june: Math.random() * (40000 - 20000) + 20000,
          july: Math.random() * (40000 - 20000) + 20000,
          august: Math.random() * (40000 - 20000) + 20000,
          september: Math.random() * (40000 - 20000) + 20000,
          october: Math.random() * (40000 - 20000) + 20000,
          november: Math.random() * (40000 - 20000) + 20000,
          december: Math.random() * (40000 - 20000) + 20000
        }
        billingActual.total = 0;
        Object.keys(billingActual).forEach((value, index) => {
          if (index > 2) {
            billingActual.total += billingActual[value]
          }
        })
        billingNumbers.push(billingObject)
        billingNumbers.push(billingActual)
      }
      await db['localdb'].reportTypeRecipients.bulkCreate(reportTypeRecipients);
      data.billingNumbers = await db['localdb'].billingNumbers.bulkCreate(billingNumbers)
      console.log(data.billingNumbers)
      return data
    })
    .then(async data => {
      await db['localdb'].performanceReport.create({
        projectedBonus: 20384.09,
        user_user_id: data.users[1].userId,
        report_type_id: data.reportTypes.reportTypeId,
        recipient_id: data.recipients[0].recipientId,
        billing_actual_numbers: data.billingNumbers[1].id,
        billing_obj_numbers: data.billingNumbers[1].objectivesId
      })
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = db;

