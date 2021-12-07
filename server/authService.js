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
//    res.sendFile(path.resolve(__dirname, '../../client/public', 'index.html'));
// });



//below is the code we need for the login

const ACCESS_TOKEN_SECRET="773ab1b4d3e80db2d7ab5b227e28d4007985017a165fad9bd602692d8302ee23a9b8f8d2d29b65c375a9d8673a8bada595a5c72c776352fb9eac74c756680db9"
const REFRESH_TOKEN_SECRET="c208182c162568cb40fba6ee43762c47d2b9d7689b4c2dfec7020213f79e8a855e6f1d2aeb2d65da21b5c564e7950d4ea6cfb579416ccf570c9ee87dc5c119ea"

let refreshTokens = []

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

//post the login credentials
app.post('/login', (req, res) => {

    //Authenticate the user
    const username = req.body.username;
    const user = { name: username};
  
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET)
  
    //it acts as the database for the token, of course it is going to be different
    refreshTokens.push(refreshToken)
  
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
  });
  

//function to generate the access token
function generateAccessToken(user){
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '15m'} );
}


//request to send the user credentials
app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter(post => post.username === req.user.name ));
});


//function to authenticate the request
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


//post request to resend an accesstoken when the old access token is expired
app.post('/token', (req, res) => {
  const refreshToken = req.body.token; 
  if(refreshToken == null){
    return res.sendStatus(401);
  }
  if(!refreshTokens.includes(refreshToken)){
    return res.sendStatus(403);
  }
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if(err){
      return res.sendStatus(403)
    }
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  })
})


//request to log the user out and erase the token
app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token != req.body.token)
  res.sendStatus(204)
});




app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});