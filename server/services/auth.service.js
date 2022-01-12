const jwt = require('jsonwebtoken');
require("../../config.js")

const ACCESS_TOKEN_SECRET=process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET=process.env.REFRESH_TOKEN_SECRET

// Refresh tokens should be stored in the db  or 
//the expiry date of each user's refresh token can be stored with the user
let refreshTokens = []

exports.getTokens = (user) => {
    // Generate JWTs for the authenticated user
    const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, {expiresIn: '900s'});
    const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET);
  

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

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
      if(err){
        return res.sendStatus(401);
      }
      req.user = user;
      next();
    });
};

exports.refreshToken = async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if(token == null){
      return res.sendStatus(401);
  }
  if(!refreshTokens.includes(token)){
      return res.sendStatus(403);
  }
  jwt.verify(token, REFRESH_TOKEN_SECRET, (err, user) => {
      if(err){
        return res.sendStatus(403);
      }
      const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, {expiresIn: '900s'});
      return res
          .header('authorization', accessToken).send();
  });
};

exports.logout = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null || !refreshTokens.find(t => t == token)){
      return res.sendStatus(403);
    }
    refreshTokens = refreshTokens.filter(t => t != token);

    return res.sendStatus(204);
};

// for testing purposes
exports.setRefreshTokens = (rToken) => {
  refreshTokens = [rToken];
};

