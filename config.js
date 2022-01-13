// This file is used to configure the environment files 
// Mainly for the local .env file located at the root level

const dotenv = require('dotenv');
const result = dotenv.config({ path: require('find-config')('.env') });

if (result.error) {
  throw result.error;
}

const { parsed: envs } = result;
module.exports = envs;