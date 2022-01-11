const userController = require("../controllers/user.controller");
let router = require("express").Router();
const authService = require('../services/auth.service');
const empService = require('../services/emp.service');


// Create new User
router.post("/", authService.authenticateToken, empService.checkEmail, userController.create);

// Fetch all users with authentication
router.get("/", authService.authenticateToken, userController.findAll);

// Authenticate user
router.post("/authenticate", userController.authenticateUserWithEmail);

// Refresh JWT
router.post("/refresh", authService.refreshToken);

router.delete("/logout", authService.logout);

// Send users modification 
router.put(`/modify/:email`, authService.authenticateToken, userController.modifyUser);

// Delete user selected
router.delete("/delete/:email", authService.authenticateToken, userController.deleteUser);

module.exports = router;
