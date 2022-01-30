const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const logger = require('morgan');
const userRoutes = require('./routes/user.routes');
const invoiceRoutes = require('./routes/invoice.routes');
const reportRoutes = require('./routes/report.routes');
require("../config.js");

module.exports = (database) => {
  const app = express();

  app.use(express.static(path.resolve(__dirname, '../client/build')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(logger('dev'));

  // Initializing Sequelize (ORM) to create users table and fill it
  if (database) {
    database.sync('localdb');
  }

  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "http://localhost:3000");
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

  // Routes
  app.use('/api/invoice', invoiceRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/reports', reportRoutes);

  // Handles page refresh on the client side
  // (view index.hmtl and 404.html located in the client/public folder)
  app.use(function (req, res) {
    res.sendFile(path.resolve(__dirname, '../client/public/404.html'));
  });

  return app;
};
