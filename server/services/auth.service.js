const jwt = require('jsonwebtoken');

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



exports.getTokens = (user) => {
    //Authenticate the user
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET)
  
    //it acts as the database for the token, of course it is going to be different
    refreshTokens.push(refreshToken)
  
    return [accessToken, refreshToken];
};
  

//function to generate the access token
function generateAccessToken(user){
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '15m'} );
}


exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
 
    if(token == null){
      return res.sendStatus(401);
    }
 
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err) => {
      if(err){
        return res.sendStatus(403);
      }
      next();
    });
};

exports.refreshToken = (req, res) => {
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
        const accessToken = generateAccessToken({ email: user.email });
        res.json({ accessToken: accessToken });
    })
};

exports.logout = (req, res) => {
    if(!req.body.token) res.sendStatus(400);
    refreshTokens = refreshTokens.filter(t => t != req.body.token);
    res.sendStatus(204);
};
