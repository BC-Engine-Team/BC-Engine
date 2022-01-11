const dotenv = require('dotenv');
const result = dotenv.config({ path: require('find-config')('.env') });

if (result.error) {
  throw result.error;
}

const { parsed: envs } = result;

console.log("Environment variables:")
console.log(envs);
module.exports = envs;