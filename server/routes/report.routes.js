const reportController = require('../controllers/report.controller.js')
const router = require('express').Router()
const authService = require('../services/auth.service')

// Chart Reports routes
router.get('/chartReport', authService.authenticateToken, reportController.getChartReportsByUserId)

router.post('/chartReport', authService.authenticateToken, reportController.createChartReport)

router.get('/fetchPdf', authService.authenticateToken, reportController.fetchChartReportPDF)

router.post('/createPdf', authService.authenticateToken, reportController.createChartReportPDF)

router.delete('/delete/:chartReportId', authService.authenticateToken, reportController.deleteChartReport)

// Report Types routes
router.get('/performanceReport', authService.authenticateToken, reportController.getPerformanceReportsOfAllUsers)

router.get('/reportTypes', authService.authenticateToken, reportController.getReportTypesWithRecipients)

module.exports = router
