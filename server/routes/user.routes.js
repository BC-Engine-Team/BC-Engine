const users = require("../controllers/user.controller");
let router = require("express").Router();
const authService = require('../services/auth.service');


// Create new User
router.post("/", users.create);

// Fetch all users with authentication
router.get("/", authService.authenticateToken, users.findAll);

// Authenticate user
router.post("/authenticate", users.authenticateUserWithEmail);

// Fetch admins
router.get("/admins", users.getAdmins);

// Refresh JWT
router.post("/refresh", authService.refreshToken);

router.delete("/logout", authService.logout);

// Send users modification 
router.put("/modify", authService);

// Delete user selected
//router.delete("/users/delete/{id}");

module.exports = router;
