const databases = require("../databases");
const ChartReportModel = databases['localdb'].chartReports;


exports.getChartReportsByUserId = async (userId, chartReportModel = ChartReportModel) => {
    return new Promise((resolve, reject) => {
        chartReportModel.findAll({
            where: {
                user_user_id: userId
            }
        })
            .then(async data => {
                if (data) resolve(data)
                resolve(false);
            })
            .catch(async err => {
                const response = {
                    status: err.status || 500,
                    message: err.message || "Could not fetch data."
                };
                reject(response);
            });
    });
};