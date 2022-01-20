const sinon = require('sinon');
const { afterEach, afterAll } = require('jest-circus');
var { expect, jest } = require('@jest/globals');
const supertest = require('supertest');
var MockExpressResponse = require('mock-express-response');

const InvController = require('../../controllers/invoice.controller');
const InvoiceService = require('../../services/invoice.service');
const AuthService = require('../../services/auth.service');

let reqUser = {
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


let invoiceServiceSpy = jest.spyOn(InvoiceService, 'getAverages')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(false);
    }));

const makeApp = require('../../app');
let app = makeApp();
const request = supertest(app);
let res;

describe("Test Invoice Controller", () => {

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

    describe("IC1 - Get averages per month", () => {
        describe("IC1.1 - given valid start and end dates", () => {
            it("IC1.1.1 - should respond with 200 and averages per month", async () => {
                // arrange
                let expectedInvoiceServiceResponse = [
                    { month: 201912, average: "90.1" },
                    { month: 202001, average: "92.1" },
                    { month: 202002, average: "93.1" },
                    { month: 202003, average: "94.1" },
                    { month: 202004, average: "95.1" }
                ];
                invoiceServiceSpy = jest.spyOn(InvoiceService, 'getAverages')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(expectedInvoiceServiceResponse);
                    }));

                // act
                const response = await request.get("/api/invoice/defaultChartAndTable/2019-12-01/2020-04-01");

                // assert
                expect(response.status).toBe(200);
                expect(JSON.stringify(response.body)).toEqual(JSON.stringify(expectedInvoiceServiceResponse));
                expect(invoiceServiceSpy).toHaveBeenCalledTimes(1);
                expect(authStub.called).toBeTruthy();

                authStub.resetHistory();
            });
        });

        describe("IC1.2 - given invalid start or end date", () => {
            it("IC1.2.1 - should respond with 400 when no end date", async () => {
                // arrange
                let expectedResponse = {
                    message: "Content cannot be empty."
                };
                let req = {
                    params: {
                        startDate: '2019-11-01'
                    }
                };

                // act
                const response = await InvController.getAverages(req, res)

                // assert
                expect(response.statusCode).toBe(400);
                expect(response._responseData.toString('ascii')).toBe(JSON.stringify(expectedResponse));
            });

            it("IC1.2.2 - should respond with 400 when no dates", async () => {
                // arrange
                let expectedResponse = {
                    message: "Content cannot be empty."
                };
                let req = {
                    params: {
                    }
                };

                // act
                const response = await InvController.getAverages(req, res)

                // assert
                expect(response.statusCode).toBe(400);
                expect(response._responseData.toString('ascii')).toBe(JSON.stringify(expectedResponse));
            });

            it("should respond with 400 and appropriate message when invalid date format", async () => {
                // arrange
                let expectedResponseMessage = "Wrong format.";

                // act 
                const response = await request.get("/api/invoice/defaultChartAndTable/wonrg format/invalid-date");

                // assert
                expect(response.status).toBe(400);
                expect(response.body.message).toBe(expectedResponseMessage);
            });
        });

        describe("IC1.3 - given service cannot fetch data", () => {
            it("IC1.3.1 -  should respond with 500 and message", async () => {
                // arrange
                let expectedResponse = "The data could not be fetched.";
                invoiceServiceSpy = jest.spyOn(InvoiceService, 'getAverages')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));

                // act
                const response = await request.get("/api/invoice/defaultChartAndTable/2019-12-01/2020-04-01");

                // assert
                expect(response.status).toBe(500);
                expect(response.body.message).toBe(expectedResponse);
            });
        });

        describe("IC1.4 - given service throws an error", () => {
            it("IC1.4.1 - should respond with 500 status code and err message", async () => {
                // arrange
                let expectedErrorMessage = "An error occured in the backend.";
                invoiceServiceSpy = jest.spyOn(InvoiceService, 'getAverages')
                    .mockImplementation(async () => {
                        await Promise.reject({ message: expectedErrorMessage });
                    });

                // act
                const response = await request.get("/api/invoice/defaultChartAndTable/2019-12-01/2020-04-01");

                // assert
                expect(response.status).toBe(500);
                expect(response.body.message).toBe(expectedErrorMessage);
            });
        });
    });
});