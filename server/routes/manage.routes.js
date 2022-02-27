const manageController = require("../controllers/manage.controller");
let router = require("express").Router();
const authService = require('../services/auth.service');


router.get("/getClientGrading", authService.authenticateToken, manageController.getClientGradings)

router.put("/modifyClientGrading", authService.authenticateToken, manageController.modifyClientGradings);

router.put("/modifyClientGradingInDatabase", authService.authenticateToken, manageController.sendNewClientGradingInDatabase);

router.get("/clients", authService.authenticateToken, manageController.getClients);

module.exports = router;