module.exports = app => {
    const users = require("./user.controller");

    var router = require("express").Router();

    // Create new User
    router.post("/", users.create);

    // Fetch all users
    router.get("/", users.findAll);

    app.use('/api/users', router);
};