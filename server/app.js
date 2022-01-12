const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const logger = require('morgan');
const userRoutes = require('./routes/user.routes');
require("../config.js")

module.exports = (database) => {
  const app = express();

  app.use(express.static(path.resolve(__dirname, '../client/build')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(logger('dev'));
  
  // Initializing Sequelize (ORM) to create users table and fill it
  if(database){
    database.sync('localdb');
  }

  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', process.env.IP_ADDRESS);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, POST, GET, OPTIONS, HEAD');
    res.header(
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Headers, x-requested-with, Content-Type, Accept, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization'
    );
    res.header('Access-Control-Expose-Headers', 'Authorization');
    next();
  });

  // Handles GET requests on '{HOST}:{PORT}/api'
  app.get("/api", async (req, res) => {
    res.json({ message: "Hello from B&C Engine!" });
  });

  // User routes CRUD
  app.use('/api/users', userRoutes);

  return app;
};
