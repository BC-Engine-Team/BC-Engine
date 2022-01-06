const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const logger = require('morgan');
const userRoutes = require('./routes/user.routes');

module.exports = (database) => {
  const app = express();

  app.use(express.static(path.join(__dirname, '../client/build')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(logger('dev'));
  
  // Initializing Sequelize (ORM) to create users table and fill it
  if(database){
    database.sync('mysqldb');
  }

  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://bc-engine.herokuapp.com');
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

  // Static endpoint (Delivery of the React SPA)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });

  // User routes CRUD
  app.use('/users', userRoutes);

  return app;
};
