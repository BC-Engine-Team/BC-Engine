const tedious = require('tedious');
require("../../config.js")

module.exports = {
    development: {
        databases: {
            localdb: {
                HOST: process.env.LOCAL_HOST,
                USER: process.env.LOCAL_USER,
                PASSWORD: process.env.LOCAL_ROOT_PASSWORD,
                DB: process.env.LOCAL_DATABASE,
                dialect: "mysql",
                timezone: "-05:00",
                port: process.env.LOCAL_PORT,
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
    },
    test: {
        databases: {
            mysqldb: {
                HOST: "localhost",
                USER: "root",
                PASSWORD: "root",
                DB: "bcenginetestdb",
                dialect: "mysql",
                timezone: "-05:00",
                port: 3308,
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                }
            }
        }
    }

    
};