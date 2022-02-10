var { expect, jest } = require('@jest/globals');

const ReportService = require("../../services/report.service");
const ChartReportDao = require("../../data_access_layer/daos/chart_report.dao");



describe("Test Report Service", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    afterAll(() => {
        process.exit;
    });

    // Tests for getting saved Chart Reports of a specific user
    let expectedChartReports = [
        {
            name: 'CR1',
            startDate: '2019-12-01',
            endDate: '2020-12-01',
            employee1Id: 12345,
            employee1Name: 'France Cote',
            country: 'Canada',
            clientType: 'Corr',
            ageOfAccount: 'All',
            accountType: 'Receivable',
            user_user_id: 'fakeUserId'
        },
        {
            name: 'CR2',
            startDate: '2020-12-01',
            endDate: '2021-12-01',
            employee1Id: -1,
            employee1Name: 'All',
            employee2Id: 12345,
            employee2Name: 'France Cote',
            country: 'All',
            clientType: 'Direct',
            ageOfAccount: '60-90',
            accountType: 'Receivable',
            user_user_id: 'fakeUserId'
        }
    ];

    let chartReportDaoSpy = jest.spyOn(ChartReportDao, 'getChartReportsByUserId')
        .mockImplementation(() => new Promise((resolve) => {
            resolve(expectedChartReports);
        }));

    describe("RS1 - getChartReportsByUserId", () => {
        describe("RS1.1 - given a userId", () => {
            it("RS1.1.1 - should return list of chartReports", async () => {
                // arrange
                chartReportDaoSpy = jest.spyOn(ChartReportDao, 'getChartReportsByUserId')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(expectedChartReports);
                    }));

                // act and assert
                await expect(ReportService.getChartReportsByUserId("someUserId")).resolves
                    .toEqual(expectedChartReports);
            });

            it("RS1.1.2 - should resolve false when dao returns false", async () => {
                // arrange
                chartReportDaoSpy = jest.spyOn(ChartReportDao, 'getChartReportsByUserId')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));

                // act and assert
                await expect(ReportService.getChartReportsByUserId("someUserId")).resolves
                    .toEqual(false);
            });

            it("RS1.1.3 - should reject with dao error status and message when dao throws error", async () => {
                // arrange
                let expectedError = {
                    status: 404,
                    message: "Error message."
                };
                chartReportDaoSpy = jest.spyOn(ChartReportDao, 'getChartReportsByUserId')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject(expectedError);
                    }));

                // act and assert
                await expect(ReportService.getChartReportsByUserId("someUserId")).rejects
                    .toEqual(expectedError);
            });

            it("RS1.1.4 - should reject with status 500 and message when dao error doesn't specify", async () => {
                // arrange
                let expectedError = {
                    status: 500,
                    message: "Could not fetch data."
                };
                chartReportDaoSpy = jest.spyOn(ChartReportDao, 'getChartReportsByUserId')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({});
                    }));

                // act and assert
                await expect(ReportService.getChartReportsByUserId("someUserId")).rejects
                    .toEqual(expectedError);
            });
        });

        describe("RS1.2 - given no userId", () => {
            it("RS1.2.1 - should reject with 500 status and message", async () => {
                // arrange
                let expectedError = {
                    status: 500,
                    message: "Could not fetch data."
                };

                // act and assert
                await expect(ReportService.getChartReportsByUserId()).rejects
                    .toEqual(expectedError);
            });
        });
    });


    // Tests for creating a Chart Report with its associated Char Report Data
    let fakeChartReportRequest = {
        chartReport: {
            name: "CRname",
            startDate: new Date(2019, 1, 1).toISOString(),
            endDate: new Date(2019, 11, 1).toISOString(),
            employee1Id: 12345,
            employee1Name: "Emp1",
            employee2Id: -1,
            employee2Name: "All",
            countryId: "CA",
            country: "Canada",
            clientType: "Corr",
            ageOfAccount: "All",
            accountType: "Receivable",
            user_user_id: "fakeUUID"
        },
        chartReportData: [
            {
                label: "2019 - emp",
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                label: "2019",
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
        ]
    };

    let fakeCreateChartReportDaoResponse = {
        chartReportId: "fakeUUID",
        name: "fakeName",
        emp1Id: 12345,
        emp2Id: -1
    };

    let fakeCreateDataForChartReportDaoResponse = [
        {
            chartReportDataId: "fakeUUID",
            year: 2019,
            employee: 12345
        },
        {
            chartReportDataId: "fakeUUID",
            year: 2019,
            employee: -1
        }
    ];

    let createChartReportSpy = jest.spyOn(ReportService, 'createChartReport')
        .mockImplementation(() => new Promise((resolve, reject) => {
            resolve(fakeCreateChartReportDaoResponse);
        }));

    let createChartReportDataSpy = jest.spyOn(ReportService, 'createChartReportData')
        .mockImplementation(() => new Promise((resolve, reject) => {
            resolve(fakeCreateDataForChartReportDaoResponse);
        }));
    let verifyChartReportSpy = jest.spyOn(ReportService, 'verifyChartReport')
        .mockImplementation(() => {
            return true;
        });

    describe("RS2 - createChartReportForUser", () => {


        describe("RS2.1 - given valid criteria", () => {
            it("RS2.1.1 - when valid response from functions, should call functions with prepared data and respond with functions response", async () => {
                // arrange
                let expectedResponse = {
                    createdChartReport: fakeCreateChartReportDaoResponse,
                    createdChartReportData: fakeCreateDataForChartReportDaoResponse
                };

                // act
                const response = await ReportService.createChartReportForUser(fakeChartReportRequest.chartReport,
                    fakeChartReportRequest.chartReportData,
                    "fakeUUID");

                // assert
                expect(response).toEqual(expectedResponse);
                expect(verifyChartReportSpy).toHaveBeenCalledWith(fakeChartReportRequest.chartReport);
                expect(createChartReportSpy).toHaveBeenCalledWith("fakeUUID", fakeChartReportRequest.chartReport);
                expect(createChartReportDataSpy).toHaveBeenCalledWith(fakeCreateChartReportDaoResponse, fakeChartReportRequest.chartReportData);
            });

            it("RS2.1.2 - when createChartReport throws error with specified status and message, should reject specified status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 600,
                    message: "Error."
                };

                createChartReportSpy = jest.spyOn(ReportService, 'createChartReport')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject(expectedResponse);
                    }));


                // act and assert
                await expect(ReportService.createChartReportForUser(fakeChartReportRequest.chartReport,
                    fakeChartReportRequest.chartReportData,
                    "fakeUUID")).rejects.toEqual(expectedResponse);
                expect(verifyChartReportSpy).toHaveBeenCalledWith(fakeChartReportRequest.chartReport);
                expect(createChartReportSpy).toHaveBeenCalledWith("fakeUUID", fakeChartReportRequest.chartReport);
                expect(createChartReportDataSpy).toHaveBeenCalledTimes(0);
            });

            it("RS2.1.3 - when createChartReport throws error with unspecified status and message, should reject default status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 500,
                    message: "Malfunction in the B&C Engine."
                };
                createChartReportSpy = jest.spyOn(ReportService, 'createChartReport')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({});
                    }));


                // act and assert
                await expect(ReportService.createChartReportForUser(fakeChartReportRequest.chartReport,
                    fakeChartReportRequest.chartReportData,
                    "fakeUUID")).rejects.toEqual(expectedResponse);
                expect(verifyChartReportSpy).toHaveBeenCalledWith(fakeChartReportRequest.chartReport);
                expect(createChartReportSpy).toHaveBeenCalledWith("fakeUUID", fakeChartReportRequest.chartReport);
                expect(createChartReportDataSpy).toHaveBeenCalledTimes(0);
            });

            it("RS2.1.4 - when createChartReport resolves false, should resolve false", async () => {
                // arrange
                createChartReportSpy = jest.spyOn(ReportService, 'createChartReport')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));

                // act and assert
                await expect(ReportService.createChartReportForUser(fakeChartReportRequest.chartReport,
                    fakeChartReportRequest.chartReportData, "fakeUUID")).resolves.toBe(false);
                expect(verifyChartReportSpy).toHaveBeenCalledWith(fakeChartReportRequest.chartReport);
                expect(createChartReportSpy).toHaveBeenCalledWith("fakeUUID", fakeChartReportRequest.chartReport);
                expect(createChartReportDataSpy).toHaveBeenCalledTimes(0);
            });

            it("RS2.1.5 - when createChartReportData resolves false, should resolve false", async () => {
                // arrange
                createChartReportSpy = jest.spyOn(ReportService, 'createChartReport')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeCreateChartReportDaoResponse);
                    }));
                createChartReportDataSpy = jest.spyOn(ReportService, 'createChartReportData')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));

                // act and assert
                await expect(ReportService.createChartReportForUser(fakeChartReportRequest.chartReport,
                    fakeChartReportRequest.chartReportData, "fakeUUID")).resolves.toBe(false);
                expect(verifyChartReportSpy).toHaveBeenCalledWith(fakeChartReportRequest.chartReport);
                expect(createChartReportSpy).toHaveBeenCalledWith("fakeUUID", fakeChartReportRequest.chartReport);
                expect(createChartReportDataSpy).toHaveBeenCalledWith(fakeCreateChartReportDaoResponse, fakeChartReportRequest.chartReportData);
            });

            it("RS2.1.6 - when createChartReportData rejects error with specified status and message, should reject specified status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 600,
                    message: "Error."
                };
                createChartReportDataSpy = jest.spyOn(ReportService, 'createChartReportData')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject(expectedResponse);
                    }));

                // act and assert
                await expect(ReportService.createChartReportForUser(fakeChartReportRequest.chartReport,
                    fakeChartReportRequest.chartReportData, "fakeUUID")).rejects.toEqual(expectedResponse);
                expect(verifyChartReportSpy).toHaveBeenCalledWith(fakeChartReportRequest.chartReport);
                expect(createChartReportSpy).toHaveBeenCalledWith("fakeUUID", fakeChartReportRequest.chartReport);
                expect(createChartReportDataSpy).toHaveBeenCalledWith(fakeCreateChartReportDaoResponse, fakeChartReportRequest.chartReportData);
            });

            it("RS2.1.7 - when createChartReportData rejects error with unspecified status and message, should reject default status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 500,
                    message: "Malfunction in the B&C Engine."
                };
                createChartReportDataSpy = jest.spyOn(ReportService, 'createChartReportData')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({});
                    }));

                // act and assert
                await expect(ReportService.createChartReportForUser(fakeChartReportRequest.chartReport,
                    fakeChartReportRequest.chartReportData, "fakeUUID")).rejects.toEqual(expectedResponse);
                expect(verifyChartReportSpy).toHaveBeenCalledWith(fakeChartReportRequest.chartReport);
                expect(createChartReportSpy).toHaveBeenCalledWith("fakeUUID", fakeChartReportRequest.chartReport);
                expect(createChartReportDataSpy).toHaveBeenCalledWith(fakeCreateChartReportDaoResponse, fakeChartReportRequest.chartReportData);
            });
        });

        describe("RS2.2 - given invalid criteria", () => {
            it("RS2.2.1 - should reject with status 400 and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 400,
                    message: "Invalid content."
                };
                verifyChartReportSpy = jest.spyOn(ReportService, 'verifyChartReport')
                    .mockImplementation(() => {
                        return false;
                    });

                // act and assert
                await expect(ReportService.createChartReportForUser(fakeChartReportRequest.chartReport, fakeChartReportRequest.chartReportData))
                    .rejects.toEqual(expectedResponse);
            });
        });
    });

    describe("RS3 - createChartReport", () => {
        describe("RS3.1 - given valid userId and criteria", () => {
            it("RS3.1.1 - when valid response from dao, should resolve response from dao", async () => {
                // arrange
                createChartReportSpy.mockRestore();
                chartReportDaoSpy = jest.spyOn(ChartReportDao, 'createChartReportForUser')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeCreateChartReportDaoResponse);
                    }));
                let expectedResponse = fakeCreateChartReportDaoResponse;

                // act and assert
                const response = await ReportService.createChartReport("fakeUUID", fakeChartReportRequest.chartReport);

                expect(response).toEqual(expectedResponse);
                expect(chartReportDaoSpy).toHaveBeenCalledWith("fakeUUID", fakeChartReportRequest.chartReport);
            });

            it("RS3.1.2 - when dao resolves false, should resolve false", async () => {
                // arrange
                chartReportDaoSpy = jest.spyOn(ChartReportDao, 'createChartReportForUser')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));

                // act and assert
                await expect(ReportService.createChartReport("fakeUUID", fakeChartReportRequest.chartReport))
                    .resolves.toBe(false);
                expect(chartReportDaoSpy).toHaveBeenCalledWith("fakeUUID", fakeChartReportRequest.chartReport);
            });

            it("RS3.1.3 - when dao throws error with specified status and message, should reject with specified status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 600,
                    message: "Error."
                };
                chartReportDaoSpy = jest.spyOn(ChartReportDao, 'createChartReportForUser')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject(expectedResponse);
                    }));

                // act and assert
                await expect(ReportService.createChartReport("fakeUUID", fakeChartReportRequest.chartReport))
                    .rejects.toEqual(expectedResponse);
                expect(chartReportDaoSpy).toHaveBeenCalledWith("fakeUUID", fakeChartReportRequest.chartReport);
            });

            it("RS3.1.4 - when dao throws error with unspecified status and message, should reject with default status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 500,
                    message: "Could not create Chart Report."
                };
                chartReportDaoSpy = jest.spyOn(ChartReportDao, 'createChartReportForUser')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({});
                    }));

                // act and assert
                await expect(ReportService.createChartReport("fakeUUID", fakeChartReportRequest.chartReport))
                    .rejects.toEqual(expectedResponse);
                expect(chartReportDaoSpy).toHaveBeenCalledWith("fakeUUID", fakeChartReportRequest.chartReport);
            });
        })
    });

    describe("RS4 - createChartReportData", () => {
        let fakePreparedData = [
            {
                chart_report_id: fakeCreateChartReportDaoResponse.chartReportId,
                year: 2019,
                employee: 12345,
                january: 0,
                february: 0,
                march: 0,
                april: 0,
                may: 0,
                june: 0,
                july: 0,
                august: 0,
                september: 0,
                october: 0,
                november: 0,
                december: 0
            },
            {
                chart_report_id: fakeCreateChartReportDaoResponse.chartReportId,
                year: 2019,
                employee: -1,
                january: 0,
                february: 0,
                march: 0,
                april: 0,
                may: 0,
                june: 0,
                july: 0,
                august: 0,
                september: 0,
                october: 0,
                november: 0,
                december: 0
            }
        ];

        describe("RS4.1 - given valid createdChartReport and data", () => {
            it("RS4.1.1 - when comparison and valid response from dao, should resolve response from dao", async () => {
                // arrange
                createChartReportDataSpy.mockRestore();
                chartReportDaoSpy = jest.spyOn(ChartReportDao, 'createDataForChartReport')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeCreateDataForChartReportDaoResponse);
                    }));
                let expectedResponse = fakeCreateDataForChartReportDaoResponse;

                // act and assert
                await expect(ReportService.createChartReportData(fakeCreateChartReportDaoResponse, fakeChartReportRequest.chartReportData))
                    .resolves.toEqual(expectedResponse);
                expect(chartReportDaoSpy).toHaveBeenCalledWith(fakeCreateChartReportDaoResponse.chartReportId, fakePreparedData);
            });

            it("RS4.1.2 - when all employees and valid response from dao, should resolve response from dao", async () => {
                // arrange
                createChartReportDataSpy.mockRestore();
                chartReportDaoSpy = jest.spyOn(ChartReportDao, 'createDataForChartReport')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeCreateDataForChartReportDaoResponse);
                    }));
                let expectedResponse = fakeCreateDataForChartReportDaoResponse;
                let fakeCreatedChartReportAllEmployees = {
                    chartReportId: "fakeUUID",
                    name: "fakeName",
                    emp1Id: -1,
                    emp2Id: null
                };
                let chartReportData = [
                    {
                        label: "2019",
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    }
                ];
                let fakePreparedDataAllEmployees = [fakePreparedData[1]];


                // act and assert
                await expect(ReportService.createChartReportData(fakeCreatedChartReportAllEmployees, chartReportData))
                    .resolves.toEqual(expectedResponse);
                expect(chartReportDaoSpy).toHaveBeenCalledWith(fakeCreatedChartReportAllEmployees.chartReportId, fakePreparedDataAllEmployees);
            });

            it("RS4.1.3 - when one employee and valid response from dao, should resolve response from dao", async () => {
                // arrange
                createChartReportDataSpy.mockRestore();
                chartReportDaoSpy = jest.spyOn(ChartReportDao, 'createDataForChartReport')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeCreateDataForChartReportDaoResponse);
                    }));
                let expectedResponse = fakeCreateDataForChartReportDaoResponse;
                let fakeCreatedChartReportOneEmployee = {
                    chartReportId: "fakeUUID",
                    name: "fakeName",
                    emp1Id: 12345,
                    emp2Id: null
                }
                let chartReportData = [
                    {
                        label: "2019",
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    }
                ];
                let fakePreparedDataOneEmployee = [fakePreparedData[0]];

                // act and assert
                await expect(ReportService.createChartReportData(fakeCreatedChartReportOneEmployee, chartReportData))
                    .resolves.toEqual(expectedResponse);
                expect(chartReportDaoSpy).toHaveBeenCalledWith(fakeCreatedChartReportOneEmployee.chartReportId, fakePreparedDataOneEmployee);
            });

            it("RS4.1.4 - when dao resolves false, should resolve false", async () => {
                // arrange
                chartReportDaoSpy = jest.spyOn(ChartReportDao, 'createDataForChartReport')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));

                // act and assert
                await expect(ReportService.createChartReportData(fakeCreateChartReportDaoResponse, fakeChartReportRequest.chartReportData))
                    .resolves.toBe(false);
                expect(chartReportDaoSpy).toHaveBeenCalledWith(fakeCreateChartReportDaoResponse.chartReportId, fakePreparedData);
            });

            it("RS4.1.5 - when dao rejects with specified status and message, should reject with specified status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 600,
                    message: "Error."
                };
                chartReportDaoSpy = jest.spyOn(ChartReportDao, 'createDataForChartReport')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject(expectedResponse);
                    }));

                // act and assert
                await expect(ReportService.createChartReportData(fakeCreateChartReportDaoResponse, fakeChartReportRequest.chartReportData))
                    .rejects.toEqual(expectedResponse);
                expect(chartReportDaoSpy).toHaveBeenCalledWith(fakeCreateChartReportDaoResponse.chartReportId, fakePreparedData);
            });

            it("RS4.1.6 - when dao rejects with unspecified status and message, should reject with default status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 500,
                    message: "Malfunction in the B&C Engine."
                };
                chartReportDaoSpy = jest.spyOn(ChartReportDao, 'createDataForChartReport')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({});
                    }));

                // act and assert
                await expect(ReportService.createChartReportData(fakeCreateChartReportDaoResponse, fakeChartReportRequest.chartReportData))
                    .rejects.toEqual(expectedResponse);
                expect(chartReportDaoSpy).toHaveBeenCalledWith(fakeCreateChartReportDaoResponse.chartReportId, fakePreparedData);
            });
        });
    });

    describe("RS5 - verifyChartReport", () => {

        describe("RS5.1 - given valid criteria", () => {
            it("RS5.1.1 - should return true", () => {
                // arrange
                verifyChartReportSpy.mockRestore();

                // act and assert
                expect(ReportService.verifyChartReport(fakeChartReportRequest.chartReport)).toBe(true);
            });
        });

        describe("RS5.2 - given invalid criteria", () => {
            it("RS5.2.1 - when no name, should return false", () => {
                // arrange
                let name = fakeChartReportRequest.chartReport['name'];
                delete fakeChartReportRequest.chartReport['name'];

                expect(ReportService.verifyChartReport(fakeChartReportRequest.chartReport)).toBe(false);
                fakeChartReportRequest.chartReport['name'] = name;
            });

            it("RS5.2.2 - when no startDate, should return false", () => {
                // arrange
                let startDate = fakeChartReportRequest.chartReport['startDate'];
                delete fakeChartReportRequest.chartReport['startDate'];

                expect(ReportService.verifyChartReport(fakeChartReportRequest.chartReport)).toBe(false);
                fakeChartReportRequest.chartReport['startDate'] = startDate;
            });

            it("RS5.2.3 - when no endDate, should return false", () => {
                // arrange
                let endDate = fakeChartReportRequest.chartReport['endDate'];
                delete fakeChartReportRequest.chartReport['endDate'];

                expect(ReportService.verifyChartReport(fakeChartReportRequest.chartReport)).toBe(false);
                fakeChartReportRequest.chartReport['endDate'] = endDate;
            });

            it("RS5.2.4 - when no employee1Id, should return false", () => {
                // arrange
                let employee1Id = fakeChartReportRequest.chartReport['employee1Id'];
                delete fakeChartReportRequest.chartReport['employee1Id'];

                expect(ReportService.verifyChartReport(fakeChartReportRequest.chartReport)).toBe(false);
                fakeChartReportRequest.chartReport['employee1Id'] = employee1Id;
            });

            it("RS5.2.5 - when no employee1Name, should return false", () => {
                // arrange
                let employee1Name = fakeChartReportRequest.chartReport['employee1Name'];
                delete fakeChartReportRequest.chartReport['employee1Name'];

                expect(ReportService.verifyChartReport(fakeChartReportRequest.chartReport)).toBe(false);
                fakeChartReportRequest.chartReport['employee1Name'] = employee1Name;
            });

            it("RS5.2.6 - when no employee2Id, should return false", () => {
                // arrange
                let employee2Id = fakeChartReportRequest.chartReport['employee2Id'];
                delete fakeChartReportRequest.chartReport['employee2Id'];

                expect(ReportService.verifyChartReport(fakeChartReportRequest.chartReport)).toBe(false);
                fakeChartReportRequest.chartReport['employee2Id'] = employee2Id;
            });

            it("RS5.2.7 - when no employee2Name, should return false", () => {
                // arrange
                let employee2Name = fakeChartReportRequest.chartReport['employee2Name'];
                delete fakeChartReportRequest.chartReport['employee2Name'];

                expect(ReportService.verifyChartReport(fakeChartReportRequest.chartReport)).toBe(false);
                fakeChartReportRequest.chartReport['employee2Name'] = employee2Name;
            });

            it("RS5.2.8 - when no clientType, should return false", () => {
                // arrange
                let clientType = fakeChartReportRequest.chartReport['clientType'];
                delete fakeChartReportRequest.chartReport['clientType'];

                expect(ReportService.verifyChartReport(fakeChartReportRequest.chartReport)).toBe(false);
                fakeChartReportRequest.chartReport['clientType'] = clientType;
            });

            it("RS5.2.9 - when no ageOfAccount, should return false", () => {
                // arrange
                let ageOfAccount = fakeChartReportRequest.chartReport['ageOfAccount'];
                delete fakeChartReportRequest.chartReport['ageOfAccount'];

                expect(ReportService.verifyChartReport(fakeChartReportRequest.chartReport)).toBe(false);
                fakeChartReportRequest.chartReport['ageOfAccount'] = ageOfAccount;
            });

            it("RS5.2.10 - when no countryId, should return false", () => {
                // arrange
                let countryId = fakeChartReportRequest.chartReport['countryId'];
                delete fakeChartReportRequest.chartReport['countryId'];

                expect(ReportService.verifyChartReport(fakeChartReportRequest.chartReport)).toBe(false);
                fakeChartReportRequest.chartReport['countryId'] = countryId;
            });

            it("RS5.2.11 - when no country, should return false", () => {
                // arrange
                let country = fakeChartReportRequest.chartReport['country'];
                delete fakeChartReportRequest.chartReport['country'];

                expect(ReportService.verifyChartReport(fakeChartReportRequest.chartReport)).toBe(false);
                fakeChartReportRequest.chartReport['country'] = country;
            });
        });

        describe("RS6 - deleteChartReportById", () => {
            let fakeChartIdObject = {
                chartReportId: "fakeUUID"
            };
            describe("RS6.1 - given valid chart report id", () => {
                it("RS6.1.1 - should return an empty promise", () => {

                    //arrange
                    chartReportDaoSpy = jest.spyOn(ChartReportDao, 'deleteChartReportById')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        resolve({});
                    }));
                    
                    let expectedResponse = Promise.resolve({})

                    // act
                    const response = ReportService.deleteChartReportById(fakeChartIdObject.chartReportId);

                    // assert
                    expect(response).toEqual(expectedResponse);
                });
            });

            describe("RS6.2 - given invalid chart report id", () => {
                it("RS6.2.1 - should return Dao error", () => {
                    // arrange
                   chartReportDaoSpy = jest.spyOn(ChartReportDao, 'deleteChartReportById')
                   .mockImplementation(() => new Promise((resolve, reject) => {
                       reject(expectedData);
                   }));

                   let expectedData = {
                       status: 500,
                       message: "Some error occured"
                   }
                   
                   //act and assert
                   expect(ReportService.deleteChartReportById(fakeChartIdObject.chartReportId)).rejects
                    .toEqual(expectedData);
                   
                });

                it("RS6.2.2 - should return false", () => {
                     // arrange
                    chartReportDaoSpy = jest.spyOn(ChartReportDao, 'deleteChartReportById')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        resolve(false);
                    }));

                    //act and assert
                    expect(ReportService.deleteChartReportById(fakeChartIdObject.chartReportId)).resolves
                        .toEqual(false);
                });

                it("RS6.2.3 - when dao rejects with specified status and message, should reject with specified status and message", async () => {
                    // arrange
                    let expectedResponse = {
                        status: 600,
                        message: "Error."
                    };
                    chartReportDaoSpy = jest.spyOn(ChartReportDao, 'deleteChartReportById')
                        .mockImplementation(() => new Promise((resolve, reject) => {
                            reject(expectedResponse);
                        }));
    
                    // act and assert
                    await expect(ReportService.deleteChartReportById(fakeChartIdObject.chartReportId))
                        .rejects.toEqual(expectedResponse);
                    expect(chartReportDaoSpy).toHaveBeenCalledWith(fakeChartIdObject.chartReportId);
                });
    
                it("RS6.2.4 - when dao rejects with unspecified status and message, should reject with default status and message", async () => {
                    // arrange
                    let expectedResponse = {
                        status: 500,
                        message: "Malfunction in the B&C Engine."
                    };
                    chartReportDaoSpy = jest.spyOn(ChartReportDao, 'deleteChartReportById')
                        .mockImplementation(() => new Promise((resolve, reject) => {
                            reject({});
                        }));
    
                    // act and assert
                    await expect(ReportService.deleteChartReportById(fakeChartIdObject.chartReportId))
                        .rejects.toEqual(expectedResponse);
                    expect(chartReportDaoSpy).toHaveBeenCalledWith(fakeChartIdObject.chartReportId);
                });
            });
        });
    });
})

