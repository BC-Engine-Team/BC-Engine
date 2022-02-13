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

exports.createChartReportPDF = async (req, res) => {
    if (!req.body.reportid)
    return res.status(400).send({ message: "Content cannot be empty." });

    await reportService.createChartReportPDFById(req.body.reportid)
        .then(response => {
            if(response) {
                return res.status(200).send(response);
            }
            return res.status(500).send({ message: "The data could not be fetched." });
        })
        .catch(err => {
            return res.status(err.status || 500)
                .send({ message: !!err.message ? err.message : "Malfunction in the B&C Engine." });
        });
}

exports.fetchChartReportPDF = async (req, res) => {
    if (!req.query.reportid)
    return res.status(400).send({ message: "Content cannot be empty." });

    await res.sendFile(`${__dirname.replace("controllers", "")}docs\\pdf_files\\chartReport-${req.query.reportid}.pdf`, {}, (err) => {
        if(err) {
            return res.status(err.status).end();
        }
        else {
            return res.status(200)
        }
    });
}