const reportController = require("../controllers/report.controller.js");
let router = require("express").Router();
const authService = require("../services/auth.service");

router.get("/chartReport", authService.authenticateToken, reportController.getChartReportsByUserId);

router.get("/reportTypes", authService.authenticateToken, reportController.getReportTypesWithRecipients);

router.post("/chartReport", authService.authenticateToken, reportController.createChartReport);

module.exports = router;