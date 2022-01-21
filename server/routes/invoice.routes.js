const invoiceController = require("../controllers/invoice.controller");
let router = require("express").Router();
const authService = require('../services/auth.service');


router.get("/defaultChartAndTable/:startDate/:endDate", authService.authenticateToken, invoiceController.getAverages);

// router.get("/defaultChart", authService.authenticateToken, invoiceController.getAverages);

// router.get("/defaultTable", authService.authenticateToken, invoiceController.getNamesAndCountries);

router.get("/defaultChartTest", invoiceController.getAveragesTest);

router.get("/testInvoices", invoiceController.testInvoices);

module.exports = router;