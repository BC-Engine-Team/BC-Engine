const reportController = require("../controllers/report.controller.js");
let router = require("express").Router();
const authService = require("../services/auth.service");

// Chart Reports routes
router.get("/chartReport", authService.authenticateToken, reportController.getChartReportsByUserId);

router.post("/chartReport", authService.authenticateToken, reportController.createChartReport);

router.get("/fetchPdf", authService.authenticateToken, reportController.fetchChartReportPDF);

router.post("/createPdf", authService.authenticateToken, reportController.createChartReportPDF);

router.delete("/delete/:chartReportId", authService.authenticateToken, reportController.deleteChartReport);

// Report Types routes
router.get("/reportTypes", authService.authenticateToken, reportController.getReportTypesWithRecipients);

// Performance Report routes
router.get("/performanceReport", authService.authenticateToken, reportController.getPerformanceReports);

router.get('/performanceReport/:userId', authService.authenticateToken, reportController.getPerformanceReportsByUserId)

router.post('/performanceReport/createPdf', authService.authenticateToken, reportController.createPerformanceReportPDF)

router.get('/performanceReport/fetchPdf', authService.authenticateToken, reportController.fetchPerformanceReportPDF)

module.exports = router;