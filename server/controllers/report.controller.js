const reportService = require('../services/report.service');

exports.getChartReportsByUserId = async (req, res) => {
    if (!req.user || !req.user.userId || req.user.userId === "" || req.user.userId === undefined)
        return res.status(400).send({ message: "Content cannot be empty." });
    await reportService.getChartReportsByUserId(req.user.userId)
        .then(async response => {
            if (response) {
                return res.send(response);
            }
            return res.status(500).send({ message: "The data could not be fetched." });
        })
        .catch(async err => {
            return res.status(err.status || 500).send({ message: err.message || "Malfunction in the B&C Engine." });
        });
}

exports.createChartReport = async (req, res) => {
    if (!req.user || !req.user.userId || req.user.userId === "" ||
        req.user.userId === undefined || !req.body.chartReport ||
        req.body.chartReport === undefined || !req.body.chartReportData ||
        req.body.chartReportData === undefined)
        return res.status(400).send({ message: "Content cannot be empty." });

    let chartReportCriteria = req.body.chartReport;
    let chartReportData = req.body.chartReportData;

    await reportService.createChartReportForUser(chartReportCriteria, chartReportData, req.user.userId)
        .then(async response => {
            if (response) {
                return res.send(response);
            }
            return res.status(500).send({ message: "The data could not be fetched." });
        })
        .catch(async err => {
            return res.status(err.status || 500).send({ message: err.message || "Malfunction in the B&C Engine." });
        });
}

exports.getReportTypesWithRecipients = async (req, res) => {
    if (!req.user || !req.user.userId || req.userId === "" ||
        req.user.userId === undefined) {
        return res.status(400).send({ message: "Content cannot be empty." });
    }

    if (req.user.role !== "admin")
        return res.status(403).send({ message: "You are not authorized to fetch from this resource." });

    await reportService.getReportTypesWithRecipients()
        .then(async response => {
            if (response) {
                return res.send(response);
            }
            return res.status(500).send({ message: "The data could not be fetched." });
        })
        .catch(err => {
            return res.status(err.status || 500).send({ message: err.message || "Malfunction in the B&C Engine." });
        });
}

exports.deleteChartReport = async (req, res) => {

    await reportService.deleteChartReportById(req.body.chartReportId)
        .then(response => {
            if (response) {
                return res.send(response);
            }
            return res.status(500).send({ message: "The data could not be deleted." });
        })
        .catch(async err => {
            return res.status(err.status || 500).send({ message: err.message || "Malfunction in the B&C Engine." });
        });
}
