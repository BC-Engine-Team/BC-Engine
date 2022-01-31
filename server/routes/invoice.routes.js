const invoiceController = require("../controllers/invoice.controller");
let router = require("express").Router();
const authService = require('../services/auth.service');


router.get("/defaultChartAndTable/:startDate/:endDate", authService.authenticateToken, invoiceController.getAverages);

router.get("/getCountries", authService.authenticateToken, invoiceController.getCountriesName);

module.exports = router;