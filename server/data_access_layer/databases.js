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
db['localdb'].users = require('./models/localdb/user.model')(db['localdb'], Sequelize.DataTypes)
db['localdb'].chartReports = require('./models/localdb/chart_report.model')(db['localdb'], Sequelize.DataTypes)
db['localdb'].chartReportsData = require('./models/localdb/chart_report_data.model')(db['localdb'], Sequelize.DataTypes)
db['localdb'].reportTypes = require('./models/localdb/report_type.model')(db['localdb'], Sequelize.DataTypes)
db['localdb'].recipients = require('./models/localdb/recipient.model')(db['localdb'], Sequelize.DataTypes)
db['localdb'].reportTypeRecipients = require('./models/localdb/report_type_recipient.model')(db['localdb'], Sequelize.DataTypes)
db['localdb'].billingNumbers = require('./models/localdb/billing_numbers.model')(db['localdb'], Sequelize.DataTypes)
db['localdb'].performanceReports = require('./models/localdb/performance_report.model')(db['localdb'], Sequelize.DataTypes)
db['localdb'].clientGradingData = require('./models/localdb/client_grading.model')(db['localdb'], Sequelize.DataTypes)

// Configure relationships for localdb models
db['localdb'].chartReports.belongsTo(db['localdb'].users, {
  foreignKey: {
    name: 'user_user_id',
    allowNull: true
  },
  onDelete: 'CASCADE'
})

db['localdb'].chartReportsData.belongsTo(db['localdb'].chartReports, {
  foreignKey: {
    name: 'chart_report_id',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

db['localdb'].reportTypeRecipients.belongsTo(db['localdb'].reportTypes, {
  foreignKey: {
    name: 'report_type_id',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

db['localdb'].reportTypeRecipients.belongsTo(db['localdb'].recipients, {
  foreignKey: {
    name: 'recipient_id',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

db['localdb'].billingNumbers.belongsTo(db['localdb'].recipients, {
  foreignKey: 'employee_id',
  targetKey: 'employeeId',
})

db['localdb'].billingNumbers.hasOne(db['localdb'].billingNumbers, {
  foreignKey: {
    name: 'objectivesId',
    allowNull: true
  }
})

db['localdb'].performanceReports.belongsTo(db['localdb'].users, {
  foreignKey: {
    name: 'user_user_id',
    allowNull: true,
  }
});

db['localdb'].performanceReports.belongsTo(db['localdb'].reportTypes, {
  foreignKey: {
    name: 'report_type_id',
    allowNull: false
  }
})

db['localdb'].performanceReports.belongsTo(db['localdb'].billingNumbers, {
  foreignKey: {
    name: 'billing_obj_numbers',
    allowNull: false
  }
})

db['localdb'].performanceReports.belongsTo(db['localdb'].recipients, {
  foreignKey: {
    name: 'recipient_id',
    allowNull: false
  }
})

db['localdb'].performanceReports.belongsTo(db['localdb'].chartReports, {
  foreignKey: {
    name: 'chart_report_id',
    allowNull: false
  }
})




// patricia database tables
db['mssql_pat'].employees = require("./models/mssql_pat/employee.model")(db['mssql_pat'], Sequelize.DataTypes);

// Bosco database tables


// Populate local (MySQL) db with dummy data once db sync is successful
db.sync = async (database, options) => {
  await db[database].sync(options)
    .then(async () => {
      let data = {}

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
        },
        {
          email: 'france@benoit-cote.com',
          password: 'verySecurePassword1',
          name: 'France Côté',
          role: 'employee'
        },
        {
          email: 'ibrahim@benoit-cote.com',
          password: 'verySecurePassword1',
          name: 'Ibrahim Tamer',
          role: 'employee'
        },
        {
          email: 'marc@benoit-cote.com',
          password: 'verySecurePassword1',
          name: 'Marc Benoit',
          role: 'employee'
        },
        {
          email: 'hilal@benoit-cote.com',
          password: 'verySecurePassword1',
          name: 'Hilal El Ayoubi',
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
      data.chartReports = await db[database].chartReports.bulkCreate([
        {
          name: 'CR1',
          startDate: new Date(2019, 11, 1),
          endDate: new Date(2020, 11, 1),
          employee1Id: 12345,
          employee1Name: 'France Cote',
          countryId: 'CA',
          country: 'Canada',
          clientType: 'Corr',
          ageOfAccount: 'All',
          accountType: 'Receivables',
          user_user_id: data.users[0].userId
        },
        {
          name: 'CR2',
          startDate: new Date(2018, 11, 1),
          endDate: new Date(2019, 11, 1),
          employee1Id: -1,
          employee1Name: 'All',
          employee2Id: 12345,
          employee2Name: 'France Cote',
          countryId: '-1',
          country: 'All',
          clientType: 'Direct',
          ageOfAccount: '60-90',
          accountType: 'Receivables',
          user_user_id: data.users[0].userId
        },
        {
          name: 'CR3',
          startDate: new Date(2019, 11, 1),
          endDate: new Date(2020, 11, 1),
          employee1Id: 12345,
          employee1Name: 'France Cote',
          countryId: '-1',
          country: 'All',
          clientType: 'Any',
          ageOfAccount: '>90',
          accountType: 'Payables',
          user_user_id: data.users[1].userId
        },
        {
          name: 'CRForPerformanceReportMathieu',
          startDate: new Date(2020, 4, 1),
          endDate: new Date(2021, 4, 1),
          employee1Id: 20303,
          employee1Name: 'Mathieu Miron',
          employee2Id: -1,
          employee2Name: 'All',
          countryId: '-1',
          country: 'All',
          clientType: 'All',
          ageOfAccount: 'All',
          accountType: 'Receivable'
        }
      ]);
      return data;
    })
    .then(async (data) => {
      await db[database].chartReportsData.bulkCreate([
        {
          year: 2019,
          emp: 22769,
          january: 0,
          february: 0,
          march: 0,
          april: 0,
          may: 0,
          june: 0,
          july: 0,
          august: 0,
          september: 0,
          october: 0,
          november: 4814.72,
          december: 4150.12,
          chart_report_id: data.chartReports[0].chartReportId
        },
        {
          year: 2020,
          emp: 22769,
          january: 2331.89,
          february: 1269.2,
          march: 1298.39,
          april: 2052.09,
          may: 1618.3,
          june: 1415.21,
          july: 758.42,
          august: 997.22,
          september: 1044.7,
          october: 1293.92,
          november: 0,
          december: 0,
          chart_report_id: data.chartReports[0].chartReportId
        },
        {
          year: 2018,
          emp: -1,
          january: 0,
          february: 0,
          march: 0,
          april: 0,
          may: 0,
          june: 0,
          july: 0,
          august: 0,
          september: 0,
          october: 0,
          november: 70.93,
          december: 70.52,
          chart_report_id: data.chartReports[1].chartReportId
        },
        {
          year: 2019,
          emp: -1,
          january: 72.95,
          february: 76.06,
          march: 79.48,
          april: 49.34,
          may: 52.94,
          june: 88.26,
          july: 91.77,
          august: 63.49,
          september: 101.26,
          october: 61.08,
          november: 0,
          december: 0,
          chart_report_id: data.chartReports[1].chartReportId
        },
        {
          year: 2018,
          emp: 22769,
          january: 0,
          february: 0,
          march: 0,
          april: 0,
          may: 0,
          june: 0,
          july: 0,
          august: 0,
          september: 0,
          october: 0,
          november: 107.8,
          december: 72.58,
          chart_report_id: data.chartReports[1].chartReportId
        },
        {
          year: 2019,
          emp: 22769,
          january: 145.51,
          february: 62.33,
          march: 21.53,
          april: 56.88,
          may: 50.66,
          june: 144.47,
          july: 79.54,
          august: 40.33,
          september: 138.1,
          october: 24.29,
          november: 0,
          december: 0,
          chart_report_id: data.chartReports[1].chartReportId
        },
        {
          year: 2019,
          emp: 22769,
          january: 0,
          february: 0,
          march: 0,
          april: 0,
          may: 0,
          june: 0,
          july: 0,
          august: 0,
          september: 0,
          october: 0,
          november: 59.86,
          december: 76.61,
          chart_report_id: data.chartReports[2].chartReportId
        },
        {
          year: 2020,
          emp: 22769,
          january: 70.86,
          february: 82.67,
          march: 73.04,
          april: 89.35,
          may: 91.66,
          june: 93.34,
          july: 87.39,
          august: 60.29,
          september: 64.84,
          october: 71.73,
          november: 0,
          december: 0,
          chart_report_id: data.chartReports[2].chartReportId
        }
      ]);
      return data;
    })
    .then(async data => {
      data.recipients = await db['localdb'].recipients.bulkCreate([
        {
          employeeId: 26631,
          name: "Charles-André Caron",
          email: "charles-andre@benoit-cote.com",
          bonusPercent: 0.357
        },
        {
          employeeId: 22769,
          name: "France Coté",
          email: "france@benoit-cote.com",
          bonusPercent: 0.59
        },
        {
          employeeId: 29470,
          name: "Hilal El Ayoubi",
          email: "hilal@benoit-cote.com",
          bonusPercent: 0.65
        },
        {
          employeeId: 26628,
          name: "Ibrahim Tamer",
          email: "ibrahim@benoit-cote.com",
          bonusPercent: 0.59
        },
        {
          employeeId: 41830,
          name: "Irina Kostko",
          email: "irina@benoit-cote.com",
          bonusPercent: 0.10
        },
        {
          employeeId: 31106,
          name: "Ismaël Coulibaly",
          email: "ismael@benoit-cote.com",
          bonusPercent: 0.40
        },
        {
          employeeId: 25706,
          name: "Marc Benoît",
          email: "marc@benoit-cote.com",
          bonusPercent: 0.59
        },
        {
          employeeId: 42381,
          name: "Marilyne Séïde",
          email: "marilyne@benoit-cote.com",
          bonusPercent: 0.10
        },
        {
          employeeId: 20037,
          name: "Martin Roy",
          email: "martin@benoit-cote.com",
          bonusPercent: 0.10
        },
        {
          employeeId: 41930,
          name: "Mathieu Audet",
          email: "ma@benoit-cote.com",
          bonusPercent: 0.50
        },
        {
          employeeId: 20303,
          name: "Mathieu Miron",
          email: "mathieu@benoit-cote.com",
          bonusPercent: 0.526
        },
        {
          employeeId: 26629,
          name: "Michel Sofia",
          email: "michel@benoit-cote.com",
          bonusPercent: 0.50
        },
        {
          employeeId: 28658,
          name: "Philip Conrad",
          email: "phil@benoit-cote.com",
          bonusPercent: 0.50
        },
        {
          employeeId: 42410,
          name: "Sabrina Lavoie",
          email: "slavoie@benoit-cote.com",
          bonusPercent: 0.10
        },
        {
          employeeId: 38192,
          name: "Suzanne Antal",
          email: "suzanne@benoit-cote.com",
          bonusPercent: 0.3817
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
          year: 2021,
          may: Math.random() * (40000 - 20000) + 20000,
          june: Math.random() * (40000 - 20000) + 20000,
          july: Math.random() * (40000 - 20000) + 20000,
          august: Math.random() * (40000 - 20000) + 20000,
          september: Math.random() * (40000 - 20000) + 20000,
          october: Math.random() * (40000 - 20000) + 20000,
          november: Math.random() * (40000 - 20000) + 20000,
          december: Math.random() * (40000 - 20000) + 20000,
          january: Math.random() * (40000 - 20000) + 20000,
          february: Math.random() * (40000 - 20000) + 20000,
          march: Math.random() * (40000 - 20000) + 20000,
          april: Math.random() * (40000 - 20000) + 20000
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
          year: 2021,
          may: Math.random() * (40000 - 20000) + 20000,
          june: Math.random() * (40000 - 20000) + 20000,
          july: Math.random() * (40000 - 20000) + 20000,
          august: Math.random() * (40000 - 20000) + 20000,
          september: Math.random() * (40000 - 20000) + 20000,
          october: Math.random() * (40000 - 20000) + 20000,
          november: Math.random() * (40000 - 20000) + 20000,
          december: Math.random() * (40000 - 20000) + 20000,
          january: Math.random() * (40000 - 20000) + 20000,
          february: Math.random() * (40000 - 20000) + 20000,
          march: Math.random() * (40000 - 20000) + 20000,
          april: Math.random() * (40000 - 20000) + 20000
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
      return data
    })
    .then(async data => {
      data.performanceReports = await db['localdb'].performanceReports.bulkCreate([
        {
          name: 'TheUltimateTest',
          chart_report_id: data.chartReports[3].chartReportId,
          projectedBonus: 2000,
          user_user_id: data.users[2].userId,
          report_type_id: data.reportTypes.reportTypeId,
          recipient_id: data.recipients[10].recipientId,
          billing_obj_numbers: data.billingNumbers[20].dataValues.id

        },
        {
          name: 'MyFirstReportCool2',
          chart_report_id: data.chartReports[2].chartReportId,
          projectedBonus: 20384.09,
          user_user_id: data.users[3].userId,
          report_type_id: data.reportTypes.reportTypeId,
          recipient_id: data.recipients[1].recipientId,
          billing_obj_numbers: data.billingNumbers[2].dataValues.id
        },
        {
          name: 'MyFirstReportCool2',
          chart_report_id: data.chartReports[2].chartReportId,
          projectedBonus: 20384.09,
          user_user_id: data.users[3].userId,
          report_type_id: data.reportTypes.reportTypeId,
          recipient_id: data.recipients[1].recipientId,
          billing_obj_numbers: data.billingNumbers[2].dataValues.id
        },
        {
          name: 'MyFirstReportCool2',
          chart_report_id: data.chartReports[2].chartReportId,
          projectedBonus: 20384.09,
          user_user_id: data.users[2].userId,
          report_type_id: data.reportTypes.reportTypeId,
          recipient_id: data.recipients[10].recipientId,
          billing_obj_numbers: data.billingNumbers[20].dataValues.id
        },
        {
          name: 'MyFirstReportCool2',
          chart_report_id: data.chartReports[2].chartReportId,
          projectedBonus: 20384.09,
          user_user_id: data.users[2].userId,
          report_type_id: data.reportTypes.reportTypeId,
          recipient_id: data.recipients[10].recipientId,
          billing_obj_numbers: data.billingNumbers[20].dataValues.id
        },
        {
          name: 'MyFirstReportCool2',
          chart_report_id: data.chartReports[2].chartReportId,
          projectedBonus: 20384.09,
          user_user_id: data.users[2].userId,
          report_type_id: data.reportTypes.reportTypeId,
          recipient_id: data.recipients[10].recipientId,
          billing_obj_numbers: data.billingNumbers[20].dataValues.id
        },
        {
          name: 'MyFirstReportCool2',
          chart_report_id: data.chartReports[2].chartReportId,
          projectedBonus: 20384.09,
          user_user_id: data.users[2].userId,
          report_type_id: data.reportTypes.reportTypeId,
          recipient_id: data.recipients[10].recipientId,
          billing_obj_numbers: data.billingNumbers[20].dataValues.id
        },
        {
          name: 'MyFirstReportCool2',
          chart_report_id: data.chartReports[2].chartReportId,
          projectedBonus: 20384.09,
          user_user_id: data.users[2].userId,
          report_type_id: data.reportTypes.reportTypeId,
          recipient_id: data.recipients[10].recipientId,
          billing_obj_numbers: data.billingNumbers[20].dataValues.id
        },
        {
          name: 'MyFirstReportCool2',
          chart_report_id: data.chartReports[2].chartReportId,
          projectedBonus: 20384.09,
          user_user_id: data.users[2].userId,
          report_type_id: data.reportTypes.reportTypeId,
          recipient_id: data.recipients[10].recipientId,
          billing_obj_numbers: data.billingNumbers[20].dataValues.id
        },
        {
          name: 'MyFirstReportCool2',
          chart_report_id: data.chartReports[2].chartReportId,
          projectedBonus: 20384.09,
          user_user_id: data.users[2].userId,
          report_type_id: data.reportTypes.reportTypeId,
          recipient_id: data.recipients[10].recipientId,
          billing_obj_numbers: data.billingNumbers[20].dataValues.id
        },
        {
          name: 'MyFirstReportCool2',
          chart_report_id: data.chartReports[2].chartReportId,
          projectedBonus: 20384.09,
          user_user_id: data.users[2].userId,
          report_type_id: data.reportTypes.reportTypeId,
          recipient_id: data.recipients[10].recipientId,
          billing_obj_numbers: data.billingNumbers[20].dataValues.id
        }
      ])
      return data
    })
    .then(async data => {
      data.chartReportsData = await db['localdb'].chartReportsData.bulkCreate([
        {
          chart_report_id: data.chartReports[3].chartReportId,
          year: 2020,
          employee: data.chartReports[3].employee1Id,
          may: Math.random() * (100 - 5) + 5,
          june: Math.random() * (100 - 5) + 5,
          july: Math.random() * (100 - 5) + 5,
          august: Math.random() * (100 - 5) + 5,
          september: Math.random() * (100 - 5) + 5,
          october: Math.random() * (100 - 5) + 5,
          november: Math.random() * (100 - 5) + 5,
          december: Math.random() * (100 - 5) + 5
        },
        {
          chart_report_id: data.chartReports[3].chartReportId,
          year: 2021,
          employee: data.chartReports[3].employee1Id,
          january: Math.random() * (100 - 5) + 5,
          february: Math.random() * (100 - 5) + 5,
          march: Math.random() * (100 - 5) + 5,
          april: Math.random() * (100 - 5) + 5,
        },
        {
          chart_report_id: data.chartReports[3].chartReportId,
          year: 2020,
          employee: data.chartReports[3].employee2Id,
          may: Math.random() * (100 - 5) + 5,
          june: Math.random() * (100 - 5) + 5,
          july: Math.random() * (100 - 5) + 5,
          august: Math.random() * (100 - 5) + 5,
          september: Math.random() * (100 - 5) + 5,
          october: Math.random() * (100 - 5) + 5,
          november: Math.random() * (100 - 5) + 5,
          december: Math.random() * (100 - 5) + 5
        },
        {
          chart_report_id: data.chartReports[3].chartReportId,
          year: 2021,
          employee: data.chartReports[3].employee2Id,
          january: Math.random() * (100 - 5) + 5,
          february: Math.random() * (100 - 5) + 5,
          march: Math.random() * (100 - 5) + 5,
          april: Math.random() * (100 - 5) + 5,
        }
      ])
    })
    .then(async () => {
      await db[database].clientGradingData.create({
        clientGradingId: 1,
        maximumGradeAPlus: 300000,
        minimumGradeAPlus: 50000.01,
        averageCollectionTimeGradeAPlus: 30,
        maximumGradeA: 50000,
        minimumGradeA: 0,
        averageCollectionTimeGradeA: 30,
        maximumGradeB: 50000,
        minimumGradeB: 0,
        averageCollectionTimeGradeB: 60,
        maximumGradeC: 50000,
        minimumGradeC: 0,
        averageCollectionTimeGradeC: 90,
        maximumGradeEPlus: 50000,
        minimumGradeEPlus: 0,
        averageCollectionTimeGradeEPlus: 1
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = db;

