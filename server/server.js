const databases = require('./data_access_layer/databases');
const makeApp = require('./app');
//const dotenv = require('dotenv').config();

const PORT = process.env.PORT || 3001;

const app = makeApp(databases);

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

app.get("*", (req, res) => {
    let url = path.join(__dirname, '../client/build', 'index.html');
    if (!url.startsWith('/app/')) // we're on local windows
    url = url.substring(1);
   res.sendFile(url);
 });