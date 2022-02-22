const databases = require("../databases");
const ReportTypeModel = databases['localdb'].reportTypes;
const RecipientsModel = databases['localdb'].recipients;
const ReportTypeRecipientsModel = databases['localdb'].reportTypeRecipients;
const PerformanceReportModel = databases['localdb'].performanceReports;
const ChartReportModel = databases['localdb'].chartReports
const BillingNumbersModel = databases['localdb'].billingNumbers

// Report Types related functions
exports.getReportTypesWithRecipientIds = async (reportTypesModel = ReportTypeModel, reportTypeRecipients = ReportTypeRecipientsModel) => {
    return new Promise((resolve, reject) => {
        reportTypesModel.findAll()
            .then(async reportTypes => {
                if (reportTypes) {
                    let returnData = {
                        reportTypes: [],
                    };
                    let types = [];
                    for (let i = 0; i < reportTypes.length; i++) {
                        types.push({
                            reportTypeId: reportTypes[i].dataValues.reportTypeId,
                            name: reportTypes[i].dataValues.reportTypeName,
                            frequency: reportTypes[i].dataValues.frequency
                        });
                    }
                    returnData.reportTypes = types;
                    returnData.recipients = await reportTypeRecipients.findAll();
                    return returnData;
                }
                resolve(false);
            })
            .then(async data => {
                if (data.recipients) {
                    for (let i = 0; i < data.reportTypes.length; i++) {
                        data.reportTypes[i].recipients = {};
                        for (let j = 0; j < data.recipients.length; j++) {
                            if (data.reportTypes[i].reportTypeId === data.recipients[j].dataValues.report_type_id &&
                                !(data.recipients[j].dataValues.recipient_id in data.reportTypes[i].recipients)) {
                                data.reportTypes[i].recipients[data.recipients[j].dataValues.recipient_id] = { name: "" };
                            }
                        }
                    }
                    resolve(data.reportTypes);
                }
                resolve(false);
            })
            .catch(err => {
                const response = {
                    status: err.status || 500,
                    message: err.message || "Malfunction in the B&C Engine."
                };
                reject(response);
            })
    });
}

exports.getRecipients = async (recipientsModel = RecipientsModel) => {
    return new Promise((resolve, reject) => {
        recipientsModel.findAll()
            .then(async reportRecipients => {
                if (reportRecipients) {
                    let returnData = [];
                    for (let i = 0; i < reportRecipients.length; i++) {
                        returnData.push({
                            recipientId: reportRecipients[i].recipientId,
                            name: reportRecipients[i].name,
                            email: reportRecipients[i].email
                        });
                    }
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
            })
    });
}


// Performance Reports  related functions

exports.getPerformanceReportById = async (reportId, performanceReportModel = PerformanceReportModel) => {
    return new Promise((resolve, reject) => {
        performanceReportModel.findOne({
            where: {
                performanceReportId: reportId
            },
            include: [
                {
                    model: ChartReportModel, attributes: ['name',
                        'createdAt', 'updatedAt', 'employee2Name',
                        'employee1Name', 'ageOfAccount', 'accountType',
                        'country', 'clientType', 'startDate', 'endDate']
                },
                { model: BillingNumbersModel, attributes: ['may', 'june'] }
            ]
        })
            .then(async data => {
                if (data) {
                    let returnData = {
                        chartReportId: data.dataValues.chart_report_id,
                        performanceReportInfo: {
                            performanceReportId: data.dataValues.performanceReportId,
                            name: data.dataValues.name,
                            createdAt: data.dataValues.createdAt,
                            updatedAt: data.dataValues.updatedAt
                        },
                        billingnumbers: {
                            actual: [],
                            objective: []
                        },
                        chartReportInfo: {
                            name: data.chart_report.dataValues.name,
                            employee1Name: data.chart_report.dataValues.employee1Name,
                            employee2Name: data.chart_report.dataValues.employee2Name,
                            ageOfAccount: data.chart_report.dataValues.ageOfAccount,
                            accountType: data.chart_report.dataValues.accountType,
                            country: data.chart_report.dataValues.country,
                            startDate: data.chart_report.dataValues.startDate,
                            endDate: data.chart_report.dataValues.endDate,
                            createdAt: data.chart_report.dataValues.createdAt,
                            updatedAt: data.dataValues.chart_report.dataValues.updatedAt
                        }
                    }
                    resolve(returnData)
                }
                else
                    resolve(false)
            })
    })
}

exports.getPerformanceReports = async (performanceReportModel = PerformanceReportModel) => {
    return new Promise((resolve, reject) => {
        performanceReportModel.findAll({
            include: [{ model: RecipientsModel, attributes: ['name'] }]
        }).then(async data => {
            if (data) {
                let returnData = []
                for (let i = 0; i < data.length; i++) {
                    returnData.push({
                        ...data[i].dataValues,
                        recipient: data[i].recipient.dataValues.name,
                        createdAt: data[i].dataValues.createdAt.toISOString().split('T')[0]
                    })
                }
                resolve(returnData)
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
}

exports.getPerformanceReportsByUserId = async (userId, performanceReportModel = PerformanceReportModel) => {
    return new Promise((resolve, reject) => {
        performanceReportModel.findAll({
            where: {
                user_user_id: userId
            },
            include: [{ model: RecipientsModel, attributes: ['name'] }]
        })
            .then(async data => {
                if (data) {
                    let returnData = []
                    for (let i = 0; i < data.length; i++) {
                        returnData.push({
                            ...data[i].dataValues,
                            recipient: data[i].recipient.dataValues.name,
                            createdAt: data[i].dataValues.createdAt.toISOString().split('T')[0]
                        })
                    }
                    resolve(returnData)
                }
                resolve(false)
            })
            .catch(err => {
                const response = {
                    status: err.status || 500,
                    message: err.message || 'Could not fetch Performance Reports by User Id.'
                }
                reject(response)
            })
    })
}