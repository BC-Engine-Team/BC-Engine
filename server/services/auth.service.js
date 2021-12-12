require('dotenv').config();

const jwt = require('jsonwebtoken');

// Refresh tokens should be stored in the db  or 
//the expiry date of each user's refresh token can be stored with the user
let refreshTokens = []

exports.getTokens = (user) => {
    // Generate JWTs for the authenticated user
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKENSECRET, {expiresIn: '20s'});
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  
    //it acts as the database for the token, of course it is going to be different
    refreshTokens.push(refreshToken);
  
    return [accessToken, refreshToken];
};

exports.authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
 
    if(token == null){
      return res.sendStatus(403);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if(err){
        console.log("still in the real implementation")
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
};

exports.refreshToken = async (req, res) => {
    const refreshToken = req.body.token; 
    if(refreshToken == null){
        res.sendStatus(401);
    }
    if(!refreshTokens.includes(refreshToken)){
        res.sendStatus(403);
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err){
          res.sendStatus(403);
        }
        const accessToken = generateAccessToken({ email: user.email });
        res.json({ accessToken: accessToken });
    })
};

exports.logout = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null || !refreshTokens.find(t => t == token)){
      res.sendStatus(403);
      return;
    }
    refreshTokens = refreshTokens.filter(t => t != token);

    res.sendStatus(204);
};

exports.setRefreshTokens = (rToken) => {
  refreshTokens = [rToken];
};

