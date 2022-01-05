const databases = require('./data_access_layer/databases');
const makeApp = require('./app');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const publicPath = path.join(__dirname, '..', 'public');


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

 app.use(express.static(publicPath));