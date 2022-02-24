const reportController = require("../controllers/report.controller.js");
let router = require("express").Router();
const authService = require("../services/auth.service");

// Chart Reports routes
router.get("/chartReport", authService.authenticateToken, reportController.getChartReportsByUserId);

router.post("/chartReport", authService.authenticateToken, reportController.createChartReport);

router.delete("/delete/:chartReportId", authService.authenticateToken, reportController.deleteChartReport);

// Report Types routes
router.get("/reportTypes", authService.authenticateToken, reportController.getReportTypesWithRecipients);

// Performance Report routes
router.get("/performanceReport", authService.authenticateToken, reportController.getPerformanceReports);

router.get('/performanceReport/:userId', authService.authenticateToken, reportController.getPerformanceReportsByUserId)

// Export PDF routes
router.post('/createPerformanceReportPdf', authService.authenticateToken, reportController.createPerformanceReportPDF)

router.post("/createChartReportPdf", authService.authenticateToken, reportController.createChartReportPDF);

router.get("/fetchPdf", authService.authenticateToken, reportController.fetchReportPDF);


module.exports = router;