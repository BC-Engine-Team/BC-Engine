const userController = require("../controllers/user.controller");
let router = require("express").Router();
const authService = require('../services/auth.service');


// Create new User
router.post("/", authService.authenticateToken, userController.create);

// Fetch all users with authentication
router.get("/", authService.authenticateToken, userController.findAll);

// Authenticate user
router.post("/authenticate", userController.authenticateUserWithEmail);

// Fetch admins
router.get("/admins",  authService.authenticateToken, userController.getAdmins);

// Refresh JWT
router.post("/refresh", authService.refreshToken);

router.delete("/logout", authService.logout);

// Send users modification 
router.put(`/modify/:email`, authService.authenticateToken, userController.modifyUser);

// Delete user selected
//router.delete("/users/delete/:email");

module.exports = router;
