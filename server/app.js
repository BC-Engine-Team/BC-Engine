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

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../../client/public', 'index.html'));
// });




//below is the code we need for the login

const ACCESS_TOKEN_SECRET="773ab1b4d3e80db2d7ab5b227e28d4007985017a165fad9bd602692d8302ee23a9b8f8d2d29b65c375a9d8673a8bada595a5c72c776352fb9eac74c756680db9"


const posts = [
  {
    username: 'Kyle',
    title: 'Post 1'
  },
  {
    username: 'Jim',
    title: 'Post 2'
  }
]



app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter(post => post.username === req.user.name ));
});


function authenticateToken(req, res, next){
   const authHeader = req.headers['authorization']
   const token = authHeader && authHeader.split(' ')[1]

   if(token == null){
     return res.sendStatus(401);
   }

   jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
     if(err){
       return res.sendStatus(403);
     }
     req.user = user;
     next();
   })
}


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});