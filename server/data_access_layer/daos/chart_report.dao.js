const databases = require("../databases");
const ChartReportModel = databases['localdb'].chartReports;
const ChartReportDataModel = databases['localdb'].chartReportsData;


exports.getChartReportsByUserId = async (userId, chartReportModel = ChartReportModel) => {
    return new Promise((resolve, reject) => {
        chartReportModel.findAll({
            where: {
                user_user_id: userId
            },
            order: [['name', 'ASC']]
        }).then(async data => {
            if (data) {
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

exports.createChartReportForUser = async (userId, chartReport, chartReportModel = ChartReportModel) => {
    console.log("cool stuff");
    return new Promise((resolve, reject) => {
        chartReport.user_user_id = userId;
        chartReportModel.create(chartReport)
            .then(async data => {
                if (data) {
                    let returnData = {
                        chartReportId: data.dataValues.chartReportId,
                        name: data.dataValues.name,
                        emp1Id: data.dataValues.employee1Id,
                        emp2Id: data.dataValues.employee2Id
                    };
                    resolve(returnData)
                }
                resolve(false);
            })
            .catch(async err => {
                const response = {
                    status: err.status || 500,
                    message: err.message || "Malfunction in the B&C Engine."
                }
                reject(response);
            })
    });
}

exports.createDataForChartReport = async (chartReportId, data, chartReportDataModel = ChartReportDataModel) => {
    console.log("what the hell???")
    return new Promise((resolve, reject) => {
        data.chart_report_id = chartReportId;
        console.log(data)
        chartReportDataModel.bulkCreate(data)
            .then(async data => {
                if (data) {
                    let returnData = [];
                    for (let i = 0; i < data.length; i++) {
                        returnData.push({
                            chartReportDataId: data[i].dataValues.id,
                            year: data[i].dataValues.year,
                            employee: data[i].dataValues.employee
                        });
                    }
                    resolve(returnData)
                }
                resolve(false);
            })
            .catch(async err => {
                const response = {
                    status: err.status || 500,
                    message: err.message || "Malfunction in the B&C Engine."
                }
                reject(response);
            })
    });
}