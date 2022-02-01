const sinon = require('sinon');
const { afterEach, afterAll } = require('jest-circus');
var { expect, jest } = require('@jest/globals');
const supertest = require('supertest');
var MockExpressResponse = require('mock-express-response');

const ReportController = require('../../controllers/report.controller');
const ReportService = require('../../services/report.service');
const AuthService = require('../../services/auth.service');

let reqUser = {
    userId: "fakeUUID",
    email: "valid@benoit-cote.com",
    password: "validPassword1",
    name: "validName",
    role: "admin"
};


let sandbox = sinon.createSandbox();
let authStub = sandbox.stub(AuthService, 'authenticateToken')
    .callsFake(function (req, res, next) {
        req.user = reqUser;
        return next();
    });

let reportServiceSpy = jest.spyOn(ReportService, 'getChartReportsByUserId')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(false);
    }));

const makeApp = require('../../app');
let app = makeApp();
const request = supertest(app);
let res;

describe("Test Report Controller", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        res = new MockExpressResponse();
    });

    afterEach(() => {
        sandbox.restore();
    });

    afterAll(() => {
        process.exit;
    });

    describe("RC1 - Get averages", () => {
        describe("RC1.1 - given a valid user from auth service", () => {
            it("RC1.1.1 - should respond with 200 and body", async () => {
                // arrange
                let expectedResponse = [
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

                reportServiceSpy = jest.spyOn(ReportService, 'getChartReportsByUserId')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(expectedResponse);
                    }));

                // act
                const response = await request.get("/api/reports/chartReport");

                // assert
                expect(response.status).toBe(200);
                expect(response.body).toEqual(expectedResponse);
                expect(reportServiceSpy).toHaveBeenCalledTimes(1);
                expect(authStub.called).toBeTruthy();

                authStub.resetHistory();
            });

            it("RC1.1.2 - should respond with 500 and message when service resolves false", async () => {
                // arrange
                let expectedResponse = { message: "The data could not be fetched." };
                reportServiceSpy = jest.spyOn(ReportService, 'getChartReportsByUserId')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));

                // act
                const response = await request.get("/api/reports/chartReport");

                // assert
                expect(response.status).toBe(500);
                expect(response.body).toEqual(expectedResponse);
                expect(reportServiceSpy).toHaveBeenCalledTimes(1);
                expect(authStub.called).toBeTruthy();

                authStub.resetHistory();
            });

            it("RC1.1.3 - should respond with 500 and message when service throws error", async () => {
                // arrange
                let expectedResponse = {
                    status: 500,
                    message: "Error."
                };
                reportServiceSpy = jest.spyOn(ReportService, 'getChartReportsByUserId')
                    .mockImplementation(async () => {
                        await Promise.reject(expectedResponse);
                    });

                // act
                const response = await request.get("/api/reports/chartReport");

                // assert
                expect(response.status).toBe(500);
                expect(response.body.message).toEqual(expectedResponse.message);
                expect(reportServiceSpy).toHaveBeenCalledTimes(1);
                expect(authStub.called).toBeTruthy();

                authStub.resetHistory();
            });
        });

        describe("RC1.2 - given no valid userId from auth service", () => {
            it("RC1.2.1 - should respond with 400 and message", async () => {
                // arrange
                let req = {
                    user: {

                    }
                };
                let expectedResponse = { message: "Content cannot be empty." };

                // act
                const response = await ReportController.getChartReportsByUserId(req, res);

                // assert
                expect(response.statusCode).toBe(400);
                expect(response._responseData.toString('ascii')).toEqual(JSON.stringify(expectedResponse));
            });
        })
    });
});

