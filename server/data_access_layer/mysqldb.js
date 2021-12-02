const myDbConfig = require("./mysqldb.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(myDbConfig.DB, myDbConfig.USER, myDbConfig.PASSWORD, {
  host: myDbConfig.HOST || 'localhost',
  port: myDbConfig.port,
  dialect: myDbConfig.dialect,
  timezone: myDbConfig.timezone,
  pool: {
    max: myDbConfig.pool.max,
    min: myDbConfig.pool.min,
    acquire: myDbConfig.pool.acquire,
    idle: myDbConfig.pool.idle
  },
  dialectOptions: {
    useUTC: false
  }
});
console.log("in mysqldb.js" );

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./models/user.model")(sequelize, Sequelize);

module.exports = db;

