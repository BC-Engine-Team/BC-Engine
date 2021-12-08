const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const logger = require('morgan');
const users = require('./routes/user.routes');


module.exports = (database) => {
  const app = express();

  app.use(express.static(path.resolve(__dirname, '../client/build', 'index.html')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(logger('dev'));

  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, POST, GET');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });

  // Initializing Sequelize (ORM) to create users table and fill it
  if(database){
    database.sync();
  }

  // Handles GET requests on '{HOST}:{PORT}/api'
  app.get("/api", (req, res) => {
      res.json({ message: "Hello from B&C Engine!" });
  });

  // Static endpoint (Delivery of the React SPA)
  // app.get('*', (req, res) => {
  //   res.sendFile(path.resolve(__dirname, '../../client/public', 'index.html'));
  // });

  // User routes CRUD
  app.use('/users', users);

  return app;
};



