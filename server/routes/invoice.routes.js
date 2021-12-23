const invoiceController = require("../controllers/invoice.controller");
let router = require("express").Router();
const authService = require('../services/auth.service');

// Fetch all invoices
router.get("/", authService.authenticateToken, invoiceController.findAll);

module.exports = router;