const { sequelize,
    dataTypes,
    checkModelName,
    checkPropertyExists
} = require('sequelize-test-helpers');

const databases = require('../../data_access_layer/databases')
const ChartReportModel = require('../../data_access_layer/models/localdb/chart_report.model')(sequelize, dataTypes);
const ChartReportDAO = require('../../data_access_layer/daos/chart_report.dao');

let returnedChartReports = [
    {
        chartReportId: 'fakeUUID1',
        name: 'CR1',
        startDate: '2019-12-01',
        endDate: '2020-12-01',
        employee1Id: 12345,
        employee1Name: 'France Cote',
        employee2Id: null,
        employee2Name: null,
        country: 'Canada',
        clientType: 'Corr',
        ageOfAccount: 'All',
        accountType: 'Receivable',
        user_user_id: 'fakeUserId'
    },
    {
        chartReportId: 'fakeUUID2',
        name: 'CR1',
        startDate: '2019-12-01',
        endDate: '2020-12-01',
        employee1Id: 12345,
        employee1Name: 'France Cote',
        employee2Id: -1,
        employee2Name: 'All',
        country: 'Canada',
        clientType: 'Corr',
        ageOfAccount: 'All',
        accountType: 'Receivable',
        user_user_id: 'fakeUserId'
    }
];

let returnedOneChartReport = [
    {
        chartReportId: 'fakeUUID1',
        name: 'CR1',
        startDate: '2019-12-01',
        endDate: '2020-12-01',
        employee1Id: 12345,
        employee1Name: 'France Cote',
        employee2Id: null,
        employee2Name: null,
        country: 'Canada',
        clientType: 'Corr',
        ageOfAccount: 'All',
        accountType: 'Receivable',
        user_user_id: 'fakeUserId'
    }
];

let returnedChartData = [
    {
        dataValues: {
            year: 2018,
            employee: -1,
            data: [
                0,     0,     0,  0,
                0,     0,     0,  0,
            91.65, 83.36, 88.35, 89
            ]
        }
    },
    {
        dataValues: {
            year: 2019,
            employee: -1,
            data: [
            84.12, 87.92, 93.05,
            99.39, 96.37,     0,
                0,     0,     0,
                0,     0,     0
            ]
        }
    }
];

let SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();
var ChartReportMock = dbMock.define('chart_reports', returnedChartReports);
var ChartReportDataMock = dbMock.define('chart_reports_data', returnedChartReports);

describe("Test Chart Report DAO", () => {
    const ChartReport = new ChartReportModel();


    afterEach(() => {
        ChartReportMock.$queryInterface.$clearResults();
        ChartReportDataMock.$queryInterface.$clearResults();
    })

    beforeEach(() => {
        ChartReportMock.$queryInterface.$clearResults();
        ChartReportDataMock.$queryInterface.$clearResults();

    })

    // testing the chart report model properties
    checkModelName(ChartReportModel)('chart_reports');

    ['chartReportId', 'name', 'startDate', 'endDate', 'employee1Id', 'employee1Name',
        'employee2Id', 'employee2Name', 'country', 'clientType', 'ageOfAccount', 'accountType']
        .forEach(checkPropertyExists(ChartReport));



    describe("CRD1 - getChartReportsByUserId", () => {
        describe("CRD1.1 - given a userId", () => {
            it("CRD1.1.1 - should return list of chart Reports", async () => {
                // arrange
                ChartReportMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                    return Promise.resolve(returnedChartReports);
                });

                // act and assert
                await expect(ChartReportDAO.getChartReportsByUserId('fakeUserId', ChartReportMock)).resolves
                    .toEqual(returnedChartReports);
            });

            it("CRD1.1.2 - should resolve false when Model cant fetch data", async () => {
                // arrange
                ChartReportMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                    return Promise.resolve(false);
                });

                // act and assert
                await expect(ChartReportDAO.getChartReportsByUserId('fakeUserId', ChartReportMock)).resolves
                    .toEqual(false);
            });

            it("CRD1.1.3 - should reject error when Model throws error with defined status and message", async () => {
                // arrange
                let expectedError = {
                    status: 404,
                    message: "Error."
                };
                ChartReportMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                    return Promise.reject(expectedError);
                });

                // act and assert
                await expect(ChartReportDAO.getChartReportsByUserId('fakeUserId', ChartReportMock)).rejects
                    .toEqual(expectedError);
            });

            it("CRD1.1.4 - should reject error with 500 status and predefined message when model does not define them", async () => {
                // arrange
                let expectedError = {
                    status: 500,
                    message: "Could not fetch data."
                };
                ChartReportMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                    return Promise.reject({});
                });

                // act and assert
                await expect(ChartReportDAO.getChartReportsByUserId('fakeUserId', ChartReportMock)).rejects
                    .toEqual(expectedError);
            });
        });
    });

    describe("CRD2 - createChartReportForUser", () => {
        let fakeCreateChartReportModelResponse = {
            dataValues: {
                chartReportId: "fakeUUID",
                name: "CRname",
                employee1Id: 12345,
                employee2Id: -1
            }
        };

        let fakeChartReport = {
            user_user_id: "fakeUUID"
        };

        let fakeChartReportModel = {
            create: () => {
                return Promise.resolve(fakeCreateChartReportModelResponse);
            }
        };

        describe("CRD2.1 - given valid userId and chartReport", () => {
            it("CRD2.1.1 - when valid response from model, should resolve filtered data", async () => {
                // arrange
                let expectedResponse = {
                    chartReportId: fakeCreateChartReportModelResponse.dataValues.chartReportId,
                    name: fakeCreateChartReportModelResponse.dataValues.name,
                    emp1Id: fakeCreateChartReportModelResponse.dataValues.employee1Id,
                    emp2Id: fakeCreateChartReportModelResponse.dataValues.employee2Id
                };

                // act and assert
                await expect(ChartReportDAO.createChartReportForUser("fakeUUID", fakeChartReport, fakeChartReportModel))
                    .resolves.toEqual(expectedResponse);
            });

            it("CRD2.1.2 - when model throws error with specified status and message, should reject specified status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 600,
                    message: "Error."
                };
                fakeChartReportModel = {
                    create: () => {
                        return Promise.reject(expectedResponse);
                    }
                };

                // act and assert
                await expect(ChartReportDAO.createChartReportForUser("fakeUUID", fakeChartReport, fakeChartReportModel))
                    .rejects.toEqual(expectedResponse);
            });

            it("CRD2.1.3 - when model throws error with unspecified status and message, should reject default status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 500,
                    message: "Could not create data."
                };
                fakeChartReportModel = {
                    create: () => {
                        return Promise.reject({});
                    }
                };

                // act and assert
                await expect(ChartReportDAO.createChartReportForUser("fakeUUID", fakeChartReport, fakeChartReportModel))
                    .rejects.toEqual(expectedResponse);
            });

            it("CRD2.1.4 - when model resolves false, should resolve false", async () => {
                // arrange
                fakeChartReportModel = {
                    create: () => {
                        return Promise.resolve(false);
                    }
                };

                // act and assert
                await expect(ChartReportDAO.createChartReportForUser("fakeUUID", fakeChartReport, fakeChartReportModel))
                    .resolves.toEqual(false);
            });
        });
    });

    describe("CRD3 - createDataForChartReport", () => {
        let fakeBulkCreateDataForChartReportModelResponse = [
            {
                dataValues: {
                    id: 1,
                    year: 2020,
                    employee: 12345
                }
            },
            {
                dataValues: {
                    id: 2,
                    year: 2020,
                    employee: -1
                }
            }
        ];

        let fakeChartReportModel = {
            bulkCreate: () => {
                return Promise.resolve(fakeBulkCreateDataForChartReportModelResponse);
            }
        };

        describe("CRD3.1 - given valid chartReportId and data", () => {
            it("CRD3.1.1 - when valid response from model, should resolve with filtered data", async () => {
                // arrange
                let expectedResponse = [
                    {
                        chartReportDataId: fakeBulkCreateDataForChartReportModelResponse[0].dataValues.id,
                        year: fakeBulkCreateDataForChartReportModelResponse[0].dataValues.year,
                        employee: fakeBulkCreateDataForChartReportModelResponse[0].dataValues.employee
                    },
                    {
                        chartReportDataId: fakeBulkCreateDataForChartReportModelResponse[1].dataValues.id,
                        year: fakeBulkCreateDataForChartReportModelResponse[1].dataValues.year,
                        employee: fakeBulkCreateDataForChartReportModelResponse[1].dataValues.employee
                    }
                ];

                // act and assert
                await expect(ChartReportDAO.createDataForChartReport("fakeUUID", {}, fakeChartReportModel))
                    .resolves.toEqual(expectedResponse);
            });

            it("CRD3.1.2 - when model throws error with specified status and message, should reject specified status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 600,
                    message: "Error."
                };
                fakeChartReportModel = {
                    bulkCreate: () => {
                        return Promise.reject(expectedResponse);
                    }
                };

                // act and assert
                await expect(ChartReportDAO.createDataForChartReport("fakeUUID", {}, fakeChartReportModel))
                    .rejects.toEqual(expectedResponse);
            });

            it("CRD3.1.3 - when model throws error with unspecified status and message, should reject default status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 500,
                    message: "Could not create data."
                };
                fakeChartReportModel = {
                    bulkCreate: () => {
                        return Promise.reject({});
                    }
                };

                // act and assert
                await expect(ChartReportDAO.createDataForChartReport("fakeUUID", {}, fakeChartReportModel))
                    .rejects.toEqual(expectedResponse);
            });

            it("CRD3.1.4 - when model resolves false, should resolve false", async () => {
                // arrange
                fakeChartReportModel = {
                    bulkCreate: () => {
                        return Promise.resolve(false);
                    }
                };

                // act and assert
                await expect(ChartReportDAO.createDataForChartReport("fakeUUID", {}, fakeChartReportModel))
                    .resolves.toEqual(false);
            });
        });
    });

    describe("CRD4 - deleteChartReportById", () => {
        let fakeDeleteChartIdModelResponse = {
            chartReportId: "any"
        }

        let fakeChartReportModel = {
            destroy: () => {
                return Promise.resolve(fakeDeleteChartIdModelResponse);
            }
        };
        describe("CRD4.1 - given valid chartReportId", () => {
            it("UD4.1.1 - should return successful delete message", async () => {
                // arrange
                let expectedResponse = "Chart report deleted successfully."

                fakeChartReportModel = {
                    destroy: () => {
                        return Promise.resolve(expectedResponse);
                    }
                };

                // act and assert
                await expect(ChartReportDAO.deleteChartReportById("fakeUUID", fakeChartReportModel))
                    .resolves.toEqual(expectedResponse)
            });
        });

        describe("CRD4.1 - given invalid chartReportId", () => {
            it("CRD4.1.1 - when model resolves false, should resolve with an error message", async () => {
                // arrange
                let expectedResponse = false;

                fakeChartReportModel = {
                    destroy: () => {
                        return Promise.resolve(false);
                    }
                };

                // act and assert
                expect(ChartReportDAO.deleteChartReportById("fakeUUID", fakeChartReportModel))
                    .resolves.toEqual(expectedResponse);
            });
            it("CRD4.1.2 - when model throws error with specified status and message, should reject specified status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 600,
                    message: "Error."
                };

                fakeChartReportModel = {
                    destroy: () => {
                        return Promise.reject(expectedResponse);
                    }
                };

                // act and assert
                expect(ChartReportDAO.deleteChartReportById("fakeUUID", fakeChartReportModel))
                    .rejects.toEqual(expectedResponse);
            });

            it("CRD4.1.3 - when model throws error with unspecified status and message, should reject default status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 500,
                    message: "Could not delete data."
                };

                fakeChartReportModel = {
                    destroy: () => {
                        return Promise.reject({});
                    }
                };

                // act and assert
                expect(ChartReportDAO.deleteChartReportById("fakeUUID", fakeChartReportModel))
                    .rejects.toEqual(expectedResponse);
            });
        });
    });

    describe("CRD5 - getChartReportById", () => {
        describe("CRD5.1 - given a ReportId", () => {
            it("CRD5.1.1 - should return one chart report", async () => {
                // arrange
                ChartReportMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                    return Promise.resolve(returnedOneChartReport);
                });

                // act and assert
                await expect(ChartReportDAO.getChartReportById('fakeUUID1', ChartReportMock)).resolves
                    .toEqual(returnedOneChartReport);
            });

            it("CRD5.1.2 - should resolve false when Model cant fetch data", async () => {
                // arrange
                ChartReportMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                    return Promise.resolve(false);
                });

                // act and assert
                await expect(ChartReportDAO.getChartReportById('fakeUUID1', ChartReportMock)).resolves
                    .toEqual(false);
            });

            it("CRD5.1.3 - should reject error when Model throws error with defined status and message", async () => {
                // arrange
                let expectedError = {
                    status: 404,
                    message: "Error."
                };
                ChartReportMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                    return Promise.reject(expectedError);
                });

                // act and assert
                await expect(ChartReportDAO.getChartReportById('fakeUUID1', ChartReportMock)).rejects
                    .toEqual(expectedError);
            });

            it("CRD5.1.4 - should reject error with 500 status and predefined message when model does not define them", async () => {
                // arrange
                let expectedError = {
                    status: 500,
                    message: "Could not fetch data."
                };
                ChartReportMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                    return Promise.reject({});
                });

                // act and assert
                await expect(ChartReportDAO.getChartReportById('fakeUUID1', ChartReportMock)).rejects
                    .toEqual(expectedError);
            });
        });
    });

    describe("CRD6 - getDataForChartReport", () => {
        let expectedChartData = [
            {
                year: 2018,
                employee: -1,
                data: [
                      0,     0,     0,  0,
                      0,     0,     0,  0,
                  91.65, 83.36, 88.35, 89
                ]
            },
            {
                year: 2019,
                employee: -1,
                data: [
                  84.12, 87.92, 93.05,
                  99.39, 96.37,     0,
                      0,     0,     0,
                      0,     0,     0
                ]
            }
        ]
        describe("CRD6.1 - given a ReportId", () => {
            it("CRD6.1.1 - should return a list of chart report data", async () => {
                // arrange
                ChartReportDataMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                    return Promise.resolve(returnedChartData);
                });

                // act and assert
                await expect(ChartReportDAO.getDataForChartReport('fakeUUID1', ChartReportDataMock)).resolves
                    .toEqual(expectedChartData);
            });

            it("CRD6.1.2 - should resolve false when Model cant fetch data", async () => {
                // arrange
                ChartReportDataMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                    return Promise.resolve(false);
                });

                // act and assert
                await expect(ChartReportDAO.getDataForChartReport('fakeUUID1', ChartReportDataMock)).resolves
                    .toEqual(false);
            });

            it("CRD6.1.3 - should reject error when Model throws error with defined status and message", async () => {
                // arrange
                let expectedError = {
                    status: 404,
                    message: "Error."
                };
                ChartReportDataMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                    return Promise.reject(expectedError);
                });

                // act and assert
                await expect(ChartReportDAO.getDataForChartReport('fakeUUID1', ChartReportDataMock)).rejects
                    .toEqual(expectedError);
            });

            it("CRD6.1.4 - should reject error with 500 status and predefined message when model does not define them", async () => {
                // arrange
                let expectedError = {
                    status: 500,
                    message: "Could not fetch data."
                };
                ChartReportDataMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                    return Promise.reject({});
                });

                // act and assert
                await expect(ChartReportDAO.getDataForChartReport('fakeUUID1', ChartReportDataMock)).rejects
                    .toEqual(expectedError);
            });
        });
    });
});