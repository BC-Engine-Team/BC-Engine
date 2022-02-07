var { expect, jest } = require('@jest/globals');

const ReportService = require("../../services/report.service");
const ChartReportDao = require("../../data_access_layer/daos/chart_report.dao");


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


describe("Test Report Service", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        process.exit;
    });

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

    describe("RS2 - createChartReportForUser", () => {
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
                    label: "2019 - employee",
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                },
                {
                    label: "2019",
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                }
            ]
        };
        let fakePreparedData = [
            {
                chart_report_id: fakeCreateChartReportDaoResponse.chartReportId,
                year: 2019,
                employee: 12345,
                january: 0,
                februray: 0,
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
                februray: 0,
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

        let verifyChartReportSpy = jest.spyOn(ReportService, 'verifyChartReport')
            .mockImplementation(() => {
                return true;
            });
        // let createChartReportDaoSpy = jest.spyOn(ChartReportDao, 'createChartReportForUser')
        //     .mockImplementation(() => new Promise((resolve) => {
        //         resolve(fakeCreateChartReportDaoResponse);
        //     }));
        // let createDataForChartReportDaoSpy = jest.spyOn(ChartReportDao, 'createDataForChartReport')
        //     .mockImplementation(() => new Promise((resolve) => {
        //         resolve(fakeCreateDataForChartReportDaoResponse);
        //     }));

        let createChartReportSpy = jest.spyOn(ReportService, 'createChartReport')
            .mockImplementation(() => new Promise((resolve, reject) => {
                resolve(fakeCreateChartReportDaoResponse);
            }));

        let createChartReporDataSpy = jest.spyOn(ReportService, 'createChartReportData')
            .mockImplementation(() => new Promise((resolve, reject) => {
                resolve(fakeCreateDataForChartReportDaoResponse);
            }));

        describe("RS2.1 - given valid criteria", () => {
            it("RS2.1.1 - when valid response from daos, should respond call daos with prepared data and respond with dao response", async () => {
                // arrange
                let expectedResponse = {
                    chartReport: fakeCreateChartReportDaoResponse,
                    data: fakeCreateDataForChartReportDaoResponse
                };

                // act
                const response = await ReportService.createChartReportForUser(fakeChartReportRequest.chartReport,
                    fakeChartReportRequest.chartReportData,
                    "fakeUUID");

                // assert
                expect(response).toEqual(expectedResponse);
                expect(createChartReportSpy).toHaveBeenCalledWith("fakeUUID", fakeChartReportRequest.chartReport);
                expect(createChartReporDataSpy).toHaveBeenCalledWith(fakeCreateChartReportDaoResponse.chartReportId, fakePreparedData);
            });

            it("RS2.1.1 - when createChartReportDao throws error with specified status and message, should reject specified status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 600,
                    message: "Error."
                };
                // createChartReportDaoSpy = jest.spyOn(ChartReportDao, 'createChartReportForUser')
                //     .mockImplementation(() => new Promise((resolve, reject) => {
                //         reject(expectedResponse);
                //     }));
                createChartReportSpy = jest.spyOn(ReportService, 'createChartReport')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        console.log("watatatawpw")
                        reject(expectedResponse);
                    }));

                // let createChartReportDataSpy = jest.spyOn(ReportService, 'createChartReportData')
                //     .mockImplementation(() => new Promise((resolve, reject) => {
                //         reject(expectedResponse);
                //     }));


                // act and assert
                await expect(ReportService.createChartReportForUser(fakeChartReportRequest.chartReport,
                    fakeChartReportRequest.chartReportData,
                    "fakeUUID")).rejects.toEqual(expectedResponse);
            });
        });
    });
})