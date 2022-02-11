const ChartReportDao = require("../data_access_layer/daos/chart_report.dao");

const pdf = require('html-pdf');
const pdfTemplate = require("../docs/chartReportPDF");

exports.getChartReportsByUserId = async (userId) => {
    return new Promise(async (resolve, reject) => {
        await ChartReportDao.getChartReportsByUserId(userId)
            .then(async data => {
                if (data) {
                    resolve(data);
                }
                resolve(false);
            }).catch(async err => {
                const response = {
                    status: err.status || 500,
                    message: err.message || "Could not fetch data."
                };
                reject(response);
            })
    });
}

exports.createChartReportForUser = async (criteria, data, userId) => {
    return new Promise(async (resolve, reject) => {
        if (!this.verifyChartReport(criteria))
            return reject({
                status: 400,
                message: "Invalid content."
            });

        await this.createChartReport(userId, criteria)
            .then(async createdChartReport => {
                if (createdChartReport) {
                    return [await this.createChartReportData(createdChartReport, data),
                        createdChartReport];
                }
                resolve(false);
            })
            .then(async data => {
                if (data[0]) {
                    let returnData = {
                        createdChartReport: data[1],
                        createdChartReportData: data[0]
                    };
                    resolve(returnData);
                }
                resolve(false);
            })
            .catch(err => {
                const response = {
                    status: err.status || 500,
                    message: err.message || "Malfunction in the B&C Engine."
                };
                reject(response);
            });
    });
}

exports.createChartReportPDFByReportId = async (reportId) => {
    const pdfOptions = {
        format: "letter"
    };

    return new Promise(async (resolve, reject) => {
        ChartReportDao.getChartReportById(reportId)
            .then(async data => {
                if (data) {
                    let averagesList = [];

                    await this.getChartReportPDFAverages(reportId).then(async dataAvg => {
                        for(let i = 0; i < dataAvg.length; i++) {
                            console.log(dataAvg[i])
                            let avgObject = {
                                year: dataAvg[i].year,
                                employee: dataAvg[i].employee,
                                data: [
                                    dataAvg[i].january,
                                    dataAvg[i].february,
                                    dataAvg[i].march,
                                    dataAvg[i].april,
                                    dataAvg[i].may,
                                    dataAvg[i].june,
                                    dataAvg[i].july,
                                    dataAvg[i].august,
                                    dataAvg[i].september,
                                    dataAvg[i].october,
                                    dataAvg[i].november,
                                    dataAvg[i].december,
                                ]
                            }
                            averagesList.push(avgObject);
                        }
                    }).catch(err => {
                        reject(err);
                    });

                    console.log(averagesList)

                    pdf.create(pdfTemplate(data, averagesList), pdfOptions)
                    .toFile(`./docs/pdf_files/chartReport-${reportId}.pdf`, (err) => {
                        if(err) {
                            reject(err);
                        }
                        resolve(true);
                    });
                }
                else
                    resolve(false);
            })
            .catch(err => {
                const response = {
                    status: err.status || 500,
                    message: err.message || "Malfunction in the B&C Engine."
                }
                reject(response);
            });
    });
}

exports.getChartReportPDFAverages = async (reportId) => {
    return new Promise(async (resolve, reject) => {
        ChartReportDao.getDataForChartReport(reportId)
        .then(data => {
            if (data) resolve(data);
            resolve(false);
        })
        .catch(err => {
            reject(err);
        });
    });
}

exports.createChartReportData = async (createdChartReport, data) => {
    return new Promise(async (resolve, reject) => {
        let preparedData = [];

        for (let i = 0; i < data.length; i++) {
            let isEmpFiltered = data[i].label.toString().split(" - ").at(-1) === "emp";
            let year = parseInt(data[i].label.toString().split(" - ")[0]);
            let set = {
                chart_report_id: createdChartReport.chartReportId,
                year: year,
                employee: createdChartReport.emp1Id === -1 ? -1 : createdChartReport.emp2Id === null ? createdChartReport.emp1Id : isEmpFiltered ? createdChartReport.emp1Id : createdChartReport.emp2Id,
                january: data[i].data[0],
                february: data[i].data[1],
                march: data[i].data[2],
                april: data[i].data[3],
                may: data[i].data[4],
                june: data[i].data[5],
                july: data[i].data[6],
                august: data[i].data[7],
                september: data[i].data[8],
                october: data[i].data[9],
                november: data[i].data[10],
                december: data[i].data[11]
            };
            preparedData.push(set);
        }

        await ChartReportDao.createDataForChartReport(createdChartReport.chartReportId, preparedData)
            .then(async data => {
                if (data)
                    resolve(data);
                else
                    resolve(false);
            })
            .catch(err => {
                const response = {
                    status: err.status || 500,
                    message: err.message || "Malfunction in the B&C Engine."
                }
                reject(response);
            });
    });
}

exports.createChartReport = async (userId, criteria) => {
    return new Promise(async (resolve, reject) => {
        ChartReportDao.createChartReportForUser(userId, criteria)
            .then(async data => {
                if (data)
                    resolve(data);
                else
                    resolve(false);
            })
            .catch(err => {
                const response = {
                    status: err.status || 500,
                    message: err.message || "Could not create Chart Report."
                }
                reject(response);
            });
    });
}

exports.verifyChartReport = (criteria) => {

    let verified = true;

    if (!('name' in criteria) || !('startDate' in criteria) || !('endDate' in criteria)
        || !('employee1Id' in criteria) || !('employee1Name' in criteria) || !('employee2Id' in criteria)
        || !('employee2Name' in criteria) || !('clientType' in criteria) || !('ageOfAccount' in criteria)
        || !('countryId' in criteria) || !('country' in criteria)) {
        verified = false;
    }

    return verified;
}