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
})