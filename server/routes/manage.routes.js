const manageController = require("../controllers/manage.controller");
let router = require("express").Router();
const authService = require('../services/auth.service');

router.get("/clients", authService.authenticateToken, manageController.getAverages);

module.exports = router;