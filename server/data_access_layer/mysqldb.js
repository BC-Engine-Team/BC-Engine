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
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Add any tables to the database here
db.users = require("./models/user.model")(sequelize, Sequelize);

db.sync = () => {
  db.sequelize.sync()
    .then((data) => {
      return db.users.bulkCreate([
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

