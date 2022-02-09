const sinon = require('sinon');
const { afterEach, afterAll } = require('jest-circus');
var { expect, jest } = require('@jest/globals');
const supertest = require('supertest');
var MockExpressResponse = require('mock-express-response');

const InvController = require('../../controllers/invoice.controller');
const InvoiceService = require('../../services/invoice.service');
const AuthService = require('../../services/auth.service');
const EmpService = require('../../services/emp.service')

let reqUser = {
    email: "valid@benoit-cote.com",
    password: "validPassword1",
    name: "validName",
    role: "admin"
};

let reqUserEmployee = {
    user: {
        email: "valid@benoit-cote.com",
        password: "validPassword1",
        name: "validName",
        role: "employee"
    }
};

let authSpy = jest.spyOn(AuthService, 'authenticateToken')
    .mockImplementation((req, res, next) => {
        req.user = reqUser;
        return next();
    });

let invoiceServiceSpy = jest.spyOn(InvoiceService, 'getAverages')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(false);
    }));

let empServiceSpy = jest.spyOn(EmpService, 'getAllEmployees')
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
                expect(authSpy).toHaveBeenCalledTimes(1);
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

            it("1.2.3 - should respond with 400 and appropriate message when invalid date format", async () => {
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
            it("IC1.4.1 - should respond with 500 status code and message when not specified", async () => {
                // arrange
                let expectedError = {
                    message: "Malfunction in the B&C Engine."
                };
                invoiceServiceSpy = jest.spyOn(InvoiceService, 'getAverages')
                    .mockImplementation(async () => {
                        await Promise.reject({});
                    });

                // act
                const response = await request.get("/api/invoice/defaultChartAndTable/2019-12-01/2020-04-01");

                // assert
                expect(response.status).toBe(500);
                expect(response.body).toEqual(expectedError);
            });

            it("IC1.4.2 - should respond with caught error's status and message", async () => {
                // arrange
                let expectedError = {
                    status: 400,
                    message: "Custom message."
                };
                invoiceServiceSpy = jest.spyOn(InvoiceService, 'getAverages')
                    .mockImplementation(async () => {
                        await Promise.reject(expectedError);
                    });

                // act
                const response = await request.get("/api/invoice/defaultChartAndTable/2019-12-01/2020-04-01");

                // assert
                expect(response.status).toBe(400);
                expect(response.body.message).toBe(expectedError.message);
            });
        });

        describe("IC1.5 - given valid start and end dates and employeeId", () => {
            it("IC1.5.1 - should respond with 200 and averages per month", async () => {
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
                const response = await request.get("/api/invoice/defaultChartAndTable/2019-12-01/2020-04-01?employeeId=22769");

                // assert
                expect(response.status).toBe(200);
                expect(JSON.stringify(response.body)).toEqual(JSON.stringify(expectedInvoiceServiceResponse));
                expect(invoiceServiceSpy).toHaveBeenCalledTimes(1);
                expect(authSpy).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("IC2 - Get All Employees for Dropdown ", () => {
        describe("IC2.1 - given an admin user", () => {
            it("IC2.1.1 - Should respond with 200 and a list of employees", async () => {
                // arrange
                let expectedEmpServiceResponse = [
                    {
                        dataValues: {
                            email: 'Cathia@benoit-cote.com',
                            firstName: 'Cathia',
                            lastName: 'Zeppetelli',
                            isActive: true
                        },
                    },
                    {
                        dataValues: {
                            email: 'Giuseppe@benoit-cote.com',
                            firstName: 'Giuseppe',
                            lastName: 'Calderone',
                            isActive: true
                        },
                    },
                    {
                        dataValues: {
                            email: 'Marilyne@benoit-cote.com',
                            firstName: 'Marilyne',
                            lastName: 'Séïde',
                            isActive: true
                        },
                    }
                ];

                empServiceSpy = jest.spyOn(EmpService, 'getAllEmployees')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(expectedEmpServiceResponse);
                    }));

                const response = await request.get("/api/invoice/employees");

                // assert
                expect(response.status).toBe(200);
                expect(JSON.stringify(response.body)).toEqual(JSON.stringify(expectedEmpServiceResponse));
                expect(empServiceSpy).toHaveBeenCalledTimes(1);
                expect(authSpy).toHaveBeenCalledTimes(1);
            });

            it("IC2.1.2 -  should respond with 500 and message", async () => {
                // arrange
                let expectedResponse = "The data could not be fetched.";
                empServiceSpy = jest.spyOn(EmpService, 'getAllEmployees')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));

                // act
                const response = await request.get("/api/invoice/employees");

                // assert
                expect(response.status).toBe(500);
                expect(response.body.message).toBe(expectedResponse);
            });

            it("IC2.1.3 - should respond with 500 status code and message when not specified", async () => {
                // arrange
                let expectedError = {
                    message: "Malfunction in the B&C Engine."
                };
                empServiceSpy = jest.spyOn(EmpService, 'getAllEmployees')
                    .mockImplementation(async () => {
                        await Promise.reject({});
                    });

                // act
                const response = await request.get("/api/invoice/employees");

                // assert
                expect(response.status).toBe(500);
                expect(response.body).toEqual(expectedError);
            });

            it("IC2.1.4 - should respond with caught error's status and message", async () => {
                // arrange
                let expectedError = {
                    status: 400,
                    message: "Custom message."
                };
                empServiceSpy = jest.spyOn(EmpService, 'getAllEmployees')
                    .mockImplementation(async () => {
                        await Promise.reject(expectedError);
                    });

                // act
                const response = await request.get("/api/invoice/employees");

                // assert
                expect(response.status).toBe(400);
                expect(response.body.message).toBe(expectedError.message);
            });
        });

        describe("IC2.2 - given an employee user", () => {
            it("IC2.2.1 - Should respond with 200 and one employee", async () => {
                // arrange
                let expectedEmpServiceResponse = [
                    {
                        dataValues: {
                            email: 'Cathia@benoit-cote.com',
                            firstName: 'Cathia',
                            lastName: 'Zeppetelli',
                            isActive: true
                        },
                    }
                ];

                authSpy = jest.spyOn(AuthService, 'authenticateToken')
                    .mockImplementation((req, res, next) => {
                        req.user = reqUserEmployee;
                        return next();
                    });

                empServiceSpy = jest.spyOn(EmpService, 'getAllEmployees')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(expectedEmpServiceResponse);
                    }));

                const response = await request.get("/api/invoice/employees")
                    .send(reqUserEmployee);

                // assert
                expect(response.status).toBe(200);
                expect(JSON.stringify(response.body)).toEqual(JSON.stringify(expectedEmpServiceResponse));
                expect(empServiceSpy).toHaveBeenCalledTimes(1);
                expect(authSpy).toHaveBeenCalledTimes(1);
            });

            it("IC2.2.2 -  should respond with 500 and message", async () => {
                // arrange
                let expectedResponse = "The data could not be fetched.";
                empServiceSpy = jest.spyOn(EmpService, 'getAllEmployees')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));

                // act
                const response = await request.get("/api/invoice/employees");

                // assert
                expect(response.status).toBe(500);
                expect(response.body.message).toBe(expectedResponse);
            });

            it("IC2.2.3 - should respond with 500 status code and message when not specified", async () => {
                // arrange
                let expectedError = {
                    message: "Malfunction in the B&C Engine."
                };
                empServiceSpy = jest.spyOn(EmpService, 'getAllEmployees')
                    .mockImplementation(async () => {
                        await Promise.reject({});
                    });

                // act
                const response = await request.get("/api/invoice/employees");

                // assert
                expect(response.status).toBe(500);
                expect(response.body).toEqual(expectedError);
            });

            it("IC2.2.4 - should respond with caught error's status and message", async () => {
                // arrange
                let expectedError = {
                    status: 400,
                    message: "Custom message."
                };
                empServiceSpy = jest.spyOn(EmpService, 'getAllEmployees')
                    .mockImplementation(async () => {
                        await Promise.reject(expectedError);
                    });

                // act
                const response = await request.get("/api/invoice/employees");

                // assert
                expect(response.status).toBe(400);
                expect(response.body.message).toBe(expectedError.message);
            });
        });
    });
});
