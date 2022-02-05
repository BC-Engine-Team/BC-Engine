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
            return res.status(err.status).send({ message: err.message || "Malfunction in the B&C Engine." });
        });
}

exports.createChartReport = async (req, res) => {
    if (!req.user || !req.user.userId || req.user.userId === "" || req.user.userId === undefined)
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
            return res.status(err.status).send({ message: err.message || "Malfunction in the B&C Engine." });
        });
}
