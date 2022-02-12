const reportController = require("../controllers/report.controller.js");
let router = require("express").Router();
const authService = require("../services/auth.service");

//Fetch all chart reports
router.get("/chartReport", authService.authenticateToken, reportController.getChartReportsByUserId);

// Create chart report
router.post("/chartReport", authService.authenticateToken, reportController.createChartReport);

// Delete chart report selected
router.delete("/delete/:chartReportId", authService.authenticateToken, reportController.deleteChartReport);

module.exports = router;