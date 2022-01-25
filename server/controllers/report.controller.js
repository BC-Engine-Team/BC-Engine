const { ParameterStatusMessage } = require('pg-protocol/dist/messages');
const reportService = require('../services/report.service');

exports.getChartReportsByUserId = async (req, res) => {

    await reportService.getChartReportsByUserId(req.user.userId)
        .then(async response => {
            if (response) {
                return res.send(response);
            }
            return res.status(500).send({ message: "The data could not be fetched." });
        })
        .catch(async err => {
            return res.status(err.status).send({ message: err.message });
        });
}