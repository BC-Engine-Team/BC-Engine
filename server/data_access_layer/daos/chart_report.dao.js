const databases = require("../databases");
const ChartReportModel = databases['localdb'].chartReports;


exports.getChartReportsByUserId = async (userId, chartReportModel = ChartReportModel) => {
    return new Promise((resolve, reject) => {
        chartReportModel.findAll({
            where: {
                user_user_id: userId
            },
            order: [['name', 'ASC']]
        }).then(async data => {
            if (data) {
                console.log(data)
                resolve(data)
            }
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