const ChartReportDao = require("../data_access_layer/daos/chart_report.dao");
const ReportDao = require("../data_access_layer/daos/report.dao");

// Chart Report Related functions
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

exports.createChartReportData = async (createdChartReport, data) => {
    return new Promise(async (resolve, reject) => {
        let preparedData = [];

        for (let i = 0; i < data.length; i++) {
            let isEmpFiltered = data[i].label.toString().split(" - ").at(-1) === "employee";
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


// Reports Types related functions
exports.getReportTypesWithRecipients = async () => {
    return new Promise(async (resolve, reject) => {
        this.getReportTypes()
            .then(async reportTypes => {

                if (reportTypes) {
                    let returnData = {
                        reportTypes: reportTypes
                    };
                    returnData.recipients = await this.getRecipients();
                    return returnData;
                }
                resolve(false);
            })
            .then(async data => {
                if (data.recipients) {
                    for (let i = 0; i < data.reportTypes.length; i++) {
                        for (let j = 0; j < data.recipients.length; j++) {
                            let recipientId = data.recipients[j].recipientId;
                            if (recipientId in data.reportTypes[i].recipients) {
                                data.reportTypes[i].recipients[recipientId].name = data.recipients[j].name;
                                data.reportTypes[i].recipients[recipientId].isRecipient = true;
                            }
                            else {
                                data.reportTypes[i].recipients[recipientId] = data.recipients[j].name;
                            }
                        }
                    }
                    resolve(data.reportTypes);
                }
                resolve(false);
            })
            .then(async data => {
                if (data[0]) {

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

exports.getReportTypes = async () => {
    return new Promise(async (resolve, reject) => {
        await ReportDao.getReportTypesWithRecipientIds()
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

exports.getRecipients = async () => {
    return new Promise(async (resolve, reject) => {
        await ReportDao.getRecipients()
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
