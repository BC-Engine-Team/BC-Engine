const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const mysqldb = require("./data_access_layer/mysqldb");
mysqldb.sequelize.sync()
  .catch(err =>{
    if(err){
      console.log(err.message);
      console.log(err.stack);
    }
  })


app.get("/api", (req, res) => {
    res.json({ message: "Hello from B&C Engine!" });
  });


// user routes
require("./api/user.routes")(app);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../client/public', 'index.html'));
});



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});