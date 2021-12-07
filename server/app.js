const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");


module.exports =  (database) => {
  const app = express();

  app.use(express.static(path.resolve(__dirname, '../client/build', 'index.html')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  // Initializing Sequelize (ORM) to create users table and fill it
  if(database){
    database.sync();
  }
  


  // Handles GET requests on '{HOST}:{PORT}/api'
  app.get("/api", async (req, res) => {
    res.json({ message: "Hello from B&C Engine!" });
  });

  // Temporary User routes CRUD?
  require("./api/user.routes")(app);

  // Static endpoint (Delivery of the React SPA)
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/public', 'index.html'));
  });

  return app;
};
