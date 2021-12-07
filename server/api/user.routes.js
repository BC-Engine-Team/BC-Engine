const mysqldb = require("../data_access_layer/mysqldb");
const User = mysqldb.users;

module.exports = app => {
    const users = require("./user.controller");

    const router = require("express").Router();

    // Create new User
    router.post("/", users.create);

    // Fetch all users
    router.get("/", users.findAll);

    // Authenticate user
    router.post("/authenticate", users.authenticateUserWithEmail);

    // Fetch admins
    router.get("/admins", users.getAdmins);

    
    app.use('/api/users', router);
};