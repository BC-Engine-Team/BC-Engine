const reportController = require("../controllers/report.controller.js");
let router = require("express").Router();
const authService = require("../services/auth.service");

router.get("/chartReport", authService.authenticateToken, reportController.getChartReportsByUserId);

router.post("/chartReport", authService.authenticateToken, reportController.createChartReport);

router.get("/create-pdf", (req,res) => {
    res.sendFile(`${__dirname}/docs/pdf_files/chartReport-${req.query.reportId}`);
});

router.post("/create-pdf", authService.authenticateToken, reportController.createChartReportPDF);

module.exports = router;