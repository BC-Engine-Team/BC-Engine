const users = require("../controllers/user.controller");
let router = require("express").Router();
const authService = require('../services/auth.service');


// Create new User
router.post("/", users.create);

// Fetch all users
router.get("/", authService.authenticateToken, users.findAll);

// Authenticate user
router.post("/authenticate", users.authenticateUserWithEmail);

// Fetch admins
router.get("/admins", users.getAdmins);

module.exports = router;
