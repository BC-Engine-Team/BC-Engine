const mysqldb = require('./data_access_layer/mysqldb');
const makeApp = require('./app');
//const dotenv = require('dotenv').config();

const PORT = process.env.PORT || 3001;

const app = makeApp(mysqldb);

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});