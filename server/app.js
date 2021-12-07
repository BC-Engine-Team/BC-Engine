const path = require('path');
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const jwt = require('jsonwebtoken');
const { nextTick } = require('process');


app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get("/api", (req, res) => {
    res.json({ message: "Hello from B&C Engine!" });
  });

app.get('*', (req, res) => {
   res.sendFile(path.resolve(__dirname, '../../client/public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});