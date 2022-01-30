const { sequelize,
    dataTypes,
    checkModelName,
    checkPropertyExists,
    checkHookDefined
} = require('sequelize-test-helpers');

const [UserModel, ChartReportModel] = require('../../data_access_layer/models/localdb/localdb.model')(sequelize, dataTypes);
const ChartReportDAO = require('../../data_access_layer/daos/chart_report.dao');

let returnedChartReports = [
    {
        chartReportId: 'fakeUUID1',
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
        chartReportId: 'fakeUUID2',
        name: 'CR1',
        startDate: '2019-12-01',
        endDate: '2020-12-01',
        employee1Id: 12345,
        employee1Name: 'France Cote',
        employee2Id: 12345,
        employee2Name: 'France Cote',
        country: 'Canada',
        clientType: 'Corr',
        ageOfAccount: 'All',
        accountType: 'Receivable',
        user_user_id: 'fakeUserId'
    }
];

let SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();
var ChartReportMock = dbMock.define('chart_reports', returnedChartReports);


describe("Test Chart Report DAO", () => {
    const instance = new ChartReportModel();

    afterEach(() => {
        ChartReportMock.$queryInterface.$clearResults();
    })

    beforeEach(() => {
        ChartReportMock.$queryInterface.$clearResults();
    })

    // testing the chart report model properties
    checkModelName(ChartReportModel)('chart_reports');
    ['chartReportId', 'name', 'startDate', 'endDate', 'employee1Id', 'employee1Name',
        'employee2Id', 'employee2Name', 'country', 'clientType', 'ageOfAccount', 'accountType']
        .forEach(checkPropertyExists(instance));

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
});
