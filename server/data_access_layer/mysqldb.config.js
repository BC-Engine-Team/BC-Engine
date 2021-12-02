module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "root",
    DB: "bcenginedb",
    dialect: "mysql",
    timezone: "-05:00",
    port: 3308,
    dialectOptions: {
        useUTC: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};