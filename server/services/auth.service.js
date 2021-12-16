//const dotenv = require('dotenv').config();

const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET="5a31e2610f69c20c60ca6956fd2d3aadb29d61dfb87f6a90216b5792c27a57782dd6b9a19c46c3b54b1ba286d7e0b5d85fbc362503f7175679b9df57734f5e85"
const REFRESH_TOKEN_SECRET="d984a56cb27b7275cc0c5feb27d17eab945b935f775455537db8c25b8aaa45f4c66b5e1d009d90c13249b33a0172416612aff8555b3f40a27203b40a0a5ede92"

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

