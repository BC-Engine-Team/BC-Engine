const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3001;

const app = express();


app.use(express.static(path.resolve(__dirname, '../client/build', 'index.html')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Initializing Sequelize (ORM) to create users table
const mysqldb = require("./data_access_layer/mysqldb");
mysqldb.sequelize.sync()
  .catch(err =>{
    if(err){
      console.log(err.message);
      console.log(err.stack);
    }
  })


// Handles GET requests on '{HOST}:{PORT}/api'
app.get("/api", (req, res) => {
    res.json({ message: "Hello from B&C Engine!" });
  });


// Temporary User routes CRUD?
require("./api/user.routes")(app);

// Static endpoint (Delivery of the React SPA)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../client/public', 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});