
const { sequelize,
    dataTypes,
    checkModelName,
    checkPropertyExists
} = require('sequelize-test-helpers');

const databases = require('../../data_access_layer/databases')
const PerformanceReportModel = require('../../data_access_layer/models/localdb/performance_report.model')(sequelize, dataTypes);
const ReportTypeModel = require('../../data_access_layer/models/localdb/report_type.model')(sequelize, dataTypes);
const RecipientModel = require('../../data_access_layer/models/localdb/recipient.model')(sequelize, dataTypes);
const ReportTypeRecipientModel = require('../../data_access_layer/models/localdb/report_type_recipient.model')(sequelize, dataTypes);
const ReportDAO = require('../../data_access_layer/daos/report.dao');



let returnedPerformanceReports = [
    {
        dataValues: {
            name: 'reportName1',
            createdAt: new Date(2020, 11, 1)
        },
        recipient: {
            dataValues: {
                name: 'recipientName1'
            }
        }
    },
    {
        dataValues: {
            name: 'reportName2',
            createdAt: new Date(2020, 11, 1)
        },
        recipient: {
            dataValues: {
                name: 'recipientName2'
            }
        }
    }
]

let SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();
var PerformanceReportMock = dbMock.define('performance_reports', returnedPerformanceReports);


describe("Test Report Related Models", () => {
    const ReportTypeInstance = new ReportTypeModel();
    const RecipientInstance = new RecipientModel();
    const PerformanceInstance = new PerformanceReportModel();
    checkModelName(PerformanceReportModel)('performance_reports');
    checkModelName(ReportTypeModel)('report_types');
    checkModelName(RecipientModel)('recipients');
    checkModelName(ReportTypeRecipientModel)('report_type_recipients');

    ['performanceReportId', 'name', 'projectedBonus']
        .forEach(checkPropertyExists(PerformanceInstance));

    ['reportTypeId', 'reportTypeName', 'frequency']
        .forEach(checkPropertyExists(ReportTypeInstance));

    ['recipientId', 'name', 'email']
        .forEach(checkPropertyExists(RecipientInstance));
});

describe("Test Report DAO", () => {
    let fakeReportTypeModel;
    let fakeReportTypeRecipientModel;

    let fakeReportTypeFindAllResponse = [
        {
            dataValues: {
                reportTypeId: "ReportUUID1",
                reportTypeName: "ReportName1",
                frequency: 0
            }
        },
        {
            dataValues: {
                reportTypeId: "ReportUUID2",
                reportTypeName: "ReportName2",
                frequency: -1
            }
        },
        {
            dataValues: {
                reportTypeId: "ReportUUID4",
                reportTypeName: "ReportName4",
                frequency: 2
            }
        }
    ];

    let fakeReportTypeRecipientFindAllResponse = [
        {
            dataValues: {
                report_type_id: "ReportUUID1",
                recipient_id: "recUUID1"
            }
        },
        {
            dataValues: {
                report_type_id: "ReportUUID1",
                recipient_id: "recUUID2"
            }
        },
        {
            dataValues: {
                report_type_id: "ReportUUID1",
                recipient_id: "recUUID3"
            }
        },
        {
            dataValues: {
                report_type_id: "ReportUUID3",
                recipient_id: "recUUID4"
            }
        },
        {
            dataValues: {
                report_type_id: "ReportUUID2",
                recipient_id: "recUUID5"
            }
        }
    ];
    describe("RD1 - getReportTypesWithRecipientIds", () => {
        describe("RD1.1 - given valid response from reportTypes and reportTypeRecipients models", () => {
            it("RD1.1.1 - should respond with report types with recipients", async () => {
                // arrange 
                let expectedResponse = [
                    {
                        reportTypeId: fakeReportTypeFindAllResponse[0].dataValues.reportTypeId,
                        name: fakeReportTypeFindAllResponse[0].dataValues.reportTypeName,
                        frequency: fakeReportTypeFindAllResponse[0].dataValues.frequency,
                        recipients: {
                            recUUID1: {
                                name: ""
                            },
                            recUUID2: {
                                name: ""
                            },
                            recUUID3: {
                                name: ""
                            }
                        }

                    },
                    {
                        reportTypeId: fakeReportTypeFindAllResponse[1].dataValues.reportTypeId,
                        name: fakeReportTypeFindAllResponse[1].dataValues.reportTypeName,
                        frequency: fakeReportTypeFindAllResponse[1].dataValues.frequency,
                        recipients: {
                            recUUID5: {
                                name: ""
                            }
                        }

                    },
                    {
                        reportTypeId: fakeReportTypeFindAllResponse[2].dataValues.reportTypeId,
                        name: fakeReportTypeFindAllResponse[2].dataValues.reportTypeName,
                        frequency: fakeReportTypeFindAllResponse[2].dataValues.frequency,
                        recipients: {}
                    }
                ]
                fakeReportTypeModel = {
                    findAll: () => {
                        return Promise.resolve(fakeReportTypeFindAllResponse);
                    }
                };
                fakeReportTypeRecipientModel = {
                    findAll: () => {
                        return Promise.resolve(fakeReportTypeRecipientFindAllResponse);
                    }
                }

                // act and assert
                await expect(ReportDAO.getReportTypesWithRecipientIds(fakeReportTypeModel, fakeReportTypeRecipientModel))
                    .resolves.toEqual(expectedResponse);
            });
        });

        describe("RD1.2 - given invalid response from reportType model", () => {
            it("RD1.2.1 - when model resolves false, should resolve false", async () => {
                // arrange
                fakeReportTypeModel = {
                    findAll: () => {
                        return Promise.resolve(false);
                    }
                };

                // act and assert
                await expect(ReportDAO.getReportTypesWithRecipientIds(fakeReportTypeModel, fakeReportTypeRecipientModel))
                    .resolves.toEqual(false);
            });

            it("RD1.2.2 - when model rejects specified status and message, should reject with specified status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 600,
                    message: "Error."
                };
                fakeReportTypeModel = {
                    findAll: () => {
                        return Promise.reject(expectedResponse);
                    }
                };

                // act and assert
                await expect(ReportDAO.getReportTypesWithRecipientIds(fakeReportTypeModel, fakeReportTypeRecipientModel))
                    .rejects.toEqual(expectedResponse);
            });

            it("RD1.2.3 - when model rejects unspecified status and message, should reject with default status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 500,
                    message: "Malfunction in the B&C Engine."
                };
                fakeReportTypeModel = {
                    findAll: () => {
                        return Promise.reject({});
                    }
                };

                // act and assert
                await expect(ReportDAO.getReportTypesWithRecipientIds(fakeReportTypeModel, fakeReportTypeRecipientModel))
                    .rejects.toEqual(expectedResponse);
            });
        });

        describe("RD1.3 - given invalid response from reportTypeRecipients model", () => {
            it("RD1.3.1 - when model resolves false, should resolve false", async () => {
                // arrange
                fakeReportTypeModel = {
                    findAll: () => {
                        return Promise.resolve(fakeReportTypeFindAllResponse);
                    }
                };
                fakeReportTypeRecipientModel = {
                    findAll: () => {
                        return Promise.resolve(false);
                    }
                }

                // act and assert
                await expect(ReportDAO.getReportTypesWithRecipientIds(fakeReportTypeModel, fakeReportTypeRecipientModel))
                    .resolves.toEqual(false);
            });

            it("RD1.3.2 - when model rejects specified status and message, should reject with specified status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 600,
                    message: "Error."
                };
                fakeReportTypeRecipientModel = {
                    findAll: () => {
                        return Promise.reject(expectedResponse);
                    }
                };

                // act and assert
                await expect(ReportDAO.getReportTypesWithRecipientIds(fakeReportTypeModel, fakeReportTypeRecipientModel))
                    .rejects.toEqual(expectedResponse);
            });

            it("RD1.3.3 - when model rejects unspecified status and message, should reject with default status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 500,
                    message: "Malfunction in the B&C Engine."
                };
                fakeReportTypeRecipientModel = {
                    findAll: () => {
                        return Promise.reject({});
                    }
                };

                // act and assert
                await expect(ReportDAO.getReportTypesWithRecipientIds(fakeReportTypeModel, fakeReportTypeRecipientModel))
                    .rejects.toEqual(expectedResponse);
            });
        });
    });

    describe("RD2 - getRecipients", () => {
        let fakeRecipientModelResponse = [
            {
                recipientId: "recUUID1",
                name: "name1",
                email: "email1"
            },
            {
                recipientId: "recUUID2",
                name: "name2",
                email: "email2"
            },
            {
                recipientId: "recUUID3",
                name: "name3",
                email: "email3"
            }
        ];
        let fakeRecipientModel;

        describe("RD2.1 - given valid response from recipients model", () => {
            it("RD2.1.1 - should resolve response from model", async () => {
                // arrange
                fakeRecipientModel = {
                    findAll: () => {
                        return Promise.resolve(fakeRecipientModelResponse);
                    }
                };

                // act and assert
                await expect(ReportDAO.getRecipients(fakeRecipientModel))
                    .resolves.toEqual(fakeRecipientModelResponse);
            });
        });

        describe("RD2.2 - given invalid response from recipients model", () => {
            it("RD2.2.1 - when model resolves false, should resolve false", async () => {
                // arrange
                fakeRecipientModel = {
                    findAll: () => {
                        return Promise.resolve(false);
                    }
                };

                // act and assert
                await expect(ReportDAO.getRecipients(fakeRecipientModel))
                    .resolves.toEqual(false);
            });

            it("RD2.2.2 - when model reject with specified status and message, should reject specified status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 600,
                    message: "Error."
                };
                fakeRecipientModel = {
                    findAll: () => {
                        return Promise.reject(expectedResponse);
                    }
                };

                // act and assert
                await expect(ReportDAO.getRecipients(fakeRecipientModel))
                    .rejects.toEqual(expectedResponse);
            });

            it("RD2.2.3 - when model reject with unspecified status and message, should reject default status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 500,
                    message: "Malfunction in the B&C Engine."
                };
                fakeRecipientModel = {
                    findAll: () => {
                        return Promise.reject({});
                    }
                };

                // act and assert
                await expect(ReportDAO.getRecipients(fakeRecipientModel))
                    .rejects.toEqual(expectedResponse);
            });
        });
    });



    describe("RD3 - getPerformanceReports", () => {

        afterEach(() => {
            PerformanceReportMock.$queryInterface.$clearResults();
        })

        beforeEach(() => {
            PerformanceReportMock.$queryInterface.$clearResults();
        })


        describe("RD3.1 - given a userId", () => {
            it("RD3.1.1 - should return list of performance reports", async () => {
                // arrange
                PerformanceReportMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                    return Promise.resolve(returnedPerformanceReports);
                });
                let expectedResponse = [
                    {
                        name: returnedPerformanceReports[0].dataValues.name,
                        createdAt: '2020-12-01',
                        recipient: returnedPerformanceReports[0].recipient.dataValues.name
                    },
                    {
                        name: returnedPerformanceReports[1].dataValues.name,
                        createdAt: '2020-12-01',
                        recipient: returnedPerformanceReports[1].recipient.dataValues.name
                    }
                ]

                // act and assert
                await expect(ReportDAO.getPerformanceReports(PerformanceReportMock)).resolves
                    .toEqual(expectedResponse);
            });

            it("RD3.1.2 - should resolve false when Model cant fetch data", async () => {
                // arrange
                PerformanceReportMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                    return Promise.resolve(false);
                });

                // act and assert
                await expect(ReportDAO.getPerformanceReports(PerformanceReportMock)).resolves
                    .toEqual(false);
            });

            it("RD3.1.3 - should reject error when Model throws error with defined status and message", async () => {
                // arrange
                let expectedError = {
                    status: 404,
                    message: "Error."
                };
                PerformanceReportMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                    return Promise.reject(expectedError);
                });

                // act and assert
                await expect(ReportDAO.getPerformanceReports(PerformanceReportMock)).rejects
                    .toEqual(expectedError);
            });

            it("RD3.1.4 - should reject error with 500 status and predefined message when model does not define them", async () => {
                // arrange
                let expectedError = {
                    status: 500,
                    message: "Could not fetch data."
                };
                PerformanceReportMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                    return Promise.reject({});
                });

                // act and assert
                await expect(ReportDAO.getPerformanceReports(PerformanceReportMock)).rejects
                    .toEqual(expectedError);
            });
        });
    });

    describe('RD4 - getPerformanceReportsByUserId', () => {
        let userId = '6075fbef-62fb-4f83-a6f8-6921835d6689'
        let performanceReportModelStub = {
            findAll: () => {
                return Promise.resolve(returnedPerformanceReports)
            }
        }

        describe('RD4.1 - given valid response from model', () => {
            it('RD4.1.1 - should resolve formatted list of reports', async () => {
                // arrange
                let expectedResponse = [
                    {
                        name: returnedPerformanceReports[0].dataValues.name,
                        recipient: returnedPerformanceReports[0].recipient.dataValues.name,
                        createdAt: '2020-12-01'
                    },
                    {
                        name: returnedPerformanceReports[1].dataValues.name,
                        recipient: returnedPerformanceReports[1].recipient.dataValues.name,
                        createdAt: '2020-12-01'
                    }
                ]

                // act and assert
                await expect(ReportDAO.getPerformanceReportsByUserId(userId, performanceReportModelStub))
                    .resolves.toEqual(expectedResponse)
            })
        })

        describe('RD4.2 - given invalid response from model', () => {
            it('RD4.2.1 - when model resolves false, should resolve false', async () => {
                // arrange
                performanceReportModelStub = {
                    findAll: () => {
                        return Promise.resolve(false)
                    }
                }

                // act and assert
                await expect(ReportDAO.getPerformanceReportsByUserId(userId, performanceReportModelStub))
                    .resolves.toEqual(false)
            })

            it('RD4.2.2 - when model rejects specified status and message, should reject specified status and message', async () => {
                // arrange
                let expectedResponse= {
                    status: 600,
                    message: 'Error.'
                }
                performanceReportModelStub = {
                    findAll: () => {
                        return Promise.reject(expectedResponse)
                    }
                }

                // act and assert
                await expect(ReportDAO.getPerformanceReportsByUserId(userId, performanceReportModelStub))
                    .rejects.toEqual(expectedResponse)
            })

            it('RD4.2.3 - when model rejects unspecified status and message, should reject default status and message', async () => {
                // arrange
                let expectedResponse= {
                    status: 500,
                    message: 'Could not fetch Performance Reports by User Id.'
                }
                performanceReportModelStub = {
                    findAll: () => {
                        return Promise.reject({})
                    }
                }

                // act and assert
                await expect(ReportDAO.getPerformanceReportsByUserId(userId, performanceReportModelStub))
                    .rejects.toEqual(expectedResponse)
            })
        })
    })
});
