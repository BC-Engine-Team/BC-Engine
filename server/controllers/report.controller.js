const reportService = require('../services/report.service');
let fs = require('fs');
require("../../config.js");

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

exports.getPerformanceReports = async (req, res) => {
    if (!req.user || !req.user.userId || req.user.userId === "" || req.user.userId === undefined)
        return res.status(400).send({ message: "Content cannot be empty." });

    await reportService.getPerformanceReports()
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

exports.getPerformanceReportsByUserId = async (req, res) => {
    if (!req.user || !req.user.userId || req.user.userId === "" || req.user.userId === undefined)
        return res.status(400).send({ message: "Content cannot be empty." });

    let regexUUIDStr = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
    let regexUUID = new RegExp(regexUUIDStr)

    if (!regexUUID.test(req.params.userId))
        return res.status(400).send({ message: 'Invalid userId format.' })

    await reportService.getPerformanceReportsByUserId(req.params.userId)
        .then(async response => {
            if (response) {
                return res.send(response)
            }
            return res.status(500).send({ message: 'The data could not be fetched.' })
        })
        .catch(err => {
            return res.status(err.status || 500).send({ message: err.message || "Malfunction in the B&C Engine." })
        })
}
exports.createChartReportPDF = async (req, res) => {
    if (!req.body.reportid)
        return res.status(400).send({ message: "Content cannot be empty." });

    await reportService.createChartReportPDFById(req.body.reportid)
        .then(response => {
            if (response) {
                return res.status(200).send(response);
            }
            return res.status(500).send({ message: "The data could not be fetched." });
        })
        .catch(err => {
            return res.status(err.status || 500).send({ message: err.message || "Malfunction in the B&C Engine." });
        });
}

exports.fetchChartReportPDF = async (req, res) => {
    // create file path
    let filePath;
    if (__dirname !== '/home/runner/work/BC-Engine/BC-Engine/server/controllers') {
        filePath = `${__dirname.replace("controllers", "")}docs\\pdf_files\\chartReport-${req.query.reportid}.pdf`;
    }
    else {
        filePath = `${__dirname.replace("controllers", "")}docs/pdf_files/chartReport-${req.query.reportid}.pdf`;
    }

    if (!req.query.reportid)
        return res.status(400).send({ message: "Content cannot be empty." });

    await res.sendFile(filePath, {}, (err) => {
        if (err) {
            return res.status(err.status || 500).send({ message: err.message || "File not found." });
        }
        else {
            fs.unlinkSync(filePath);
            return res.status(200)
        }
    });
}

