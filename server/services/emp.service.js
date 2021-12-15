const databases = require("../data_access_layer/mysqldb");
const Employee = databases['mssql_pat'].employees;

exports.checkEmail = async (req, res, next) => {
    
};