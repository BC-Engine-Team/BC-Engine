const mysqldb = require("../data_access_layer/mysqldb");
const User = mysqldb.users;

module.exports = app => {
    const users = require("./user.controller");

    var router = require("express").Router();

    // Create new User
    router.post("/", users.create);

    // Fetch all users
    router.get("/", users.findAll);

    // 
    router.post("/authenticate", users.authenticateUserWithEmail);

    router.get("/admins", users.getAdmins);

    app.use('/api/users', router);
};