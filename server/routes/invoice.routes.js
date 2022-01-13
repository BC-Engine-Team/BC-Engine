const invoiceController = require("../controllers/invoice.controller");
let router = require("express").Router();
const authService = require('../services/auth.service');

// Fetch all invoices
router.get("/allInvoices", authService.authenticateToken, invoiceController.findAllInvoices);

// fetch all transactions
router.get("/allTransactions", authService.authenticateToken, invoiceController.findAllTransactions);


router.get("/defaultChart", invoiceController.getAverages);

router.get("/defaultChartTest", invoiceController.getAveragesTest);

router.get("/testInvoices", invoiceController.testInvoices);

module.exports = router;