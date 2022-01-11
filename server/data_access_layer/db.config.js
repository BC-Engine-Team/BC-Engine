const tedious = require('tedious');

module.exports = {
    development: {
        databases: {
            mysqldb: {
                HOST: "localhost",
                USER: "root",
                PASSWORD: process.env.MYSQL_ROOT_PASSWORD,
                DB: process.env.MYSQL_DATABASE,
                dialect: "mysql",
                timezone: "-05:00",
                port: process.env.MYSQL_LOCAL_PORT,
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                }
            },
            mssql_bosco: {
                HOST: "localhost",
                USER: "bcdev",
                PASSWORD: "coolSecurePassword",
                DB: "Bosco reduction",
                dialect: "mssql",
                dialectModule: tedious,
                port: 1433
            },
            mssql_pat: {
                HOST: "localhost",
                USER: "bcdev",
                PASSWORD: "coolSecurePassword",
                DB: "Patricia reduction",
                dialect: "mssql",
                dialectModule: tedious,
                port: 1433
            }
        }
    }
    
};