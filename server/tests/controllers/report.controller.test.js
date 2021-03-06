const { afterEach, afterAll } = require('jest-circus');
var { expect, jest } = require('@jest/globals');
const supertest = require('supertest');
var MockExpressResponse = require('mock-express-response');
const pdf = require('html-pdf');
require("../../../config.js");

const ReportController = require('../../controllers/report.controller');
const ReportService = require('../../services/report.service');
const AuthService = require('../../services/auth.service');

let reqUser = {
    userId: "14afdb08-9e56-4ba0-8ef1-5e316f9930a5",
    email: "valid@benoit-cote.com",
    password: "validPassword1",
    name: "validName",
    role: "admin"
};

let authSpy = jest.spyOn(AuthService, 'authenticateToken')
    .mockImplementation((req, res, next) => {
        req.user = reqUser;
        return next()
    });

let reportServiceSpy = jest.spyOn(ReportService, 'getChartReportsByUserId')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(false);
    }));

const makeApp = require('../../app');
let app = makeApp();
const request = supertest(app);
let res;

jest.setTimeout(10000)

describe("Test Report Controller", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        res = new MockExpressResponse();
    });

    afterEach(() => {
    });

    afterAll(() => {
        process.exit;
    });

    describe("RC1 - getChartReportsByUSerId", () => {
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
                expect(authSpy).toHaveBeenCalledTimes(1);
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
                expect(authSpy).toHaveBeenCalledTimes(1);
            });

            it("RC1.1.3 - when service throws error with specified status and message, should respond with specified status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 600,
                    message: "Error."
                };
                reportServiceSpy = jest.spyOn(ReportService, 'getChartReportsByUserId')
                    .mockImplementation(async () => {
                        await Promise.reject(expectedResponse);
                    });

                // act
                const response = await request.get("/api/reports/chartReport");

                // assert
                expect(response.status).toBe(expectedResponse.status);
                expect(response.body.message).toEqual(expectedResponse.message);
                expect(reportServiceSpy).toHaveBeenCalledTimes(1);
                expect(authSpy).toHaveBeenCalledTimes(1);
            });

            it("RC1.1.4 - when service throws error with unspecified status and message, should respond with 500 and default message", async () => {
                // arrange
                let expectedResponse = {
                    status: 500,
                    message: "Malfunction in the B&C Engine."
                };
                reportServiceSpy = jest.spyOn(ReportService, 'getChartReportsByUserId')
                    .mockImplementation(async () => {
                        await Promise.reject({});
                    });

                // act
                const response = await request.get("/api/reports/chartReport");

                // assert
                expect(response.status).toBe(expectedResponse.status);
                expect(response.body.message).toEqual(expectedResponse.message);
                expect(reportServiceSpy).toHaveBeenCalledTimes(1);
                expect(authSpy).toHaveBeenCalledTimes(1);
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

    describe("RC2 - createChartReport", () => {
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

        describe("RC2.1 - given a valid request", () => {
            it("RC2.1.1 - should return valid response from report service", async () => {
                // arrange
                let fakeServiceResponse = {
                    chartReport: {
                        chartReportId: "fakeUUID",
                        name: "CRname",
                        emp1Id: 12345,
                        emp2Id: -1
                    },
                    data: [
                        {
                            chartReportDataId: 1,
                            year: 2019,
                            employee: 12345
                        },
                        {
                            chartReportDataId: 2,
                            year: 2019,
                            employee: -1
                        }
                    ]
                };

                reportServiceSpy = jest.spyOn(ReportService, 'createChartReportForUser')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeServiceResponse);
                    }));

                // act
                const response = await request.post("/api/reports/chartReport").send(fakeChartReportRequest)

                // assert
                expect(response.status).toBe(200);
                expect(response.body).toEqual(fakeServiceResponse);
                expect(reportServiceSpy).toHaveBeenCalledWith(fakeChartReportRequest.chartReport, fakeChartReportRequest.chartReportData, reqUser.userId);
            });

            it("RC2.1.2 - when service resolves false, should return 500 and message", async () => {
                // arrange
                reportServiceSpy = jest.spyOn(ReportService, 'createChartReportForUser')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));
                let expectedResponse = { message: "The data could not be fetched." };

                // act
                const response = await request.post("/api/reports/chartReport").send(fakeChartReportRequest);

                // assert
                expect(response.status).toBe(500);
                expect(response.body).toEqual(expectedResponse);
                expect(reportServiceSpy).toHaveBeenCalledWith(fakeChartReportRequest.chartReport, fakeChartReportRequest.chartReportData, reqUser.userId);
            });

            it("RC2.1.3 - when service throws error with specified status and message, should return error status and message", async () => {
                // arrange
                let errorThrown = {
                    status: 600,
                    message: "Custom message."
                };
                reportServiceSpy = jest.spyOn(ReportService, 'createChartReportForUser')
                    .mockImplementation(async () => {
                        await Promise.reject(errorThrown);
                    });

                // act
                const response = await request.post("/api/reports/chartReport")
                    .send(fakeChartReportRequest);

                // assert
                expect(response.status).toBe(errorThrown.status);
                expect(response.body).toEqual({ message: errorThrown.message });
                expect(reportServiceSpy).toHaveBeenCalledWith(fakeChartReportRequest.chartReport, fakeChartReportRequest.chartReportData, reqUser.userId);
            });

            it("RC2.1.4 - when service throws error with unspecified status and message, should return default status and message", async () => {
                // arrange
                let expectedResponse = {
                    message: "Malfunction in the B&C Engine."
                }
                reportServiceSpy = jest.spyOn(ReportService, 'createChartReportForUser')
                    .mockImplementation(async () => {
                        await Promise.reject({});
                    });

                // act
                const response = await request.post("/api/reports/chartReport")
                    .send(fakeChartReportRequest);

                // assert
                expect(response.status).toBe(500);
                expect(response.body).toEqual(expectedResponse);
                expect(reportServiceSpy).toHaveBeenCalledWith(fakeChartReportRequest.chartReport, fakeChartReportRequest.chartReportData, reqUser.userId);
            });
        });

        describe("RC2.2 - given an invalid request", () => {
            it("RC2.2.1 - when no chartReport, should return 400", async () => {
                // arrange
                let expectedResponse = {
                    message: "Content cannot be empty."
                };
                let fakeInvalidChartReportRequest = {
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

                // act
                const response = await request.post("/api/reports/chartReport")
                    .send(fakeInvalidChartReportRequest);

                // assert
                expect(response.status).toBe(400);
                expect(response.body).toEqual(expectedResponse);
                expect(reportServiceSpy).toHaveBeenCalledTimes(0);
            });

            it("RC2.2.2 - when no chartReportData, should return 400", async () => {
                // arrange
                let expectedResponse = {
                    message: "Content cannot be empty."
                };
                let fakeInvalidChartReportRequest = {
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
                    }
                };

                // act
                const response = await request.post("/api/reports/chartReport")
                    .send(fakeInvalidChartReportRequest);

                // assert
                expect(response.status).toBe(400);
                expect(response.body).toEqual(expectedResponse);
                expect(reportServiceSpy).toHaveBeenCalledTimes(0);
            });

            it("RC2.2.3 - when no user, should return 400", async () => {
                // arrange
                authSpy = jest.spyOn(AuthService, 'authenticateToken')
                    .mockImplementation((req, res, next) => {
                        return next();
                    });
                let expectedResponse = {
                    message: "Content cannot be empty."
                };

                // act
                const response = await request.post("/api/reports/chartReport")
                    .send(fakeChartReportRequest);

                // assert
                expect(response.status).toBe(400);
                expect(response.body).toEqual(expectedResponse);
                expect(reportServiceSpy).toHaveBeenCalledTimes(0);
            });

            it("RC2.2.4 - when no userId, should return 400", async () => {
                // arrange
                authSpy = jest.spyOn(AuthService, 'authenticateToken')
                    .mockImplementation((req, res, next) => {
                        req.user = {};
                        return next();
                    });
                let expectedResponse = {
                    message: "Content cannot be empty."
                };

                // act
                const response = await request.post("/api/reports/chartReport")
                    .send(fakeChartReportRequest);

                // assert
                expect(response.status).toBe(400);
                expect(response.body).toEqual(expectedResponse);
                expect(reportServiceSpy).toHaveBeenCalledTimes(0);
            });

            it("RC2.2.5 - when userId is empty, should return 400", async () => {
                // arrange
                authSpy = jest.spyOn(AuthService, 'authenticateToken')
                    .mockImplementation((req, res, next) => {
                        req.user = {
                            userId: ""
                        };
                        return next();
                    });
                let expectedResponse = {
                    message: "Content cannot be empty."
                };

                // act
                const response = await request.post("/api/reports/chartReport")
                    .send(fakeChartReportRequest);

                // assert
                expect(response.status).toBe(400);
                expect(response.body).toEqual(expectedResponse);
                expect(reportServiceSpy).toHaveBeenCalledTimes(0);
            });

            it("RC2.2.6 - when userId is undefined, should return 400", async () => {
                // arrange
                authSpy = jest.spyOn(AuthService, 'authenticateToken')
                    .mockImplementation((req, res, next) => {
                        req.user = {
                            userId: undefined
                        };
                        return next();
                    });
                let expectedResponse = {
                    message: "Content cannot be empty."
                };

                // act
                const response = await request.post("/api/reports/chartReport")
                    .send(fakeChartReportRequest);

                // assert
                expect(response.status).toBe(400);
                expect(response.body).toEqual(expectedResponse);
                expect(reportServiceSpy).toHaveBeenCalledTimes(0);
            });
        });
    });

    describe("RC3 - deleteChartReport", () => {
        let chartReportIdObject = {
            chartReportId: "0ba47970-d667-4328-9711-84c4a8968c0d"
        };

        describe("RC3.1 - given a valid request", () => {
            it("RC3.1.1 - should return valid response from report service", async () => {
                // arrange
                reportServiceSpy = jest.spyOn(ReportService, 'deleteChartReportById')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(chartReportIdObject);
                    }));

                // act
                const response = await request.delete(`/api/reports/delete/${chartReportIdObject.chartReportId}`);

                // assert
                expect(response.status).toBe(200);
                expect(reportServiceSpy).toHaveBeenCalledTimes(1);
            });

            it("RC3.1.2 - when service resolves false, should return 500 and message", async () => {
                // arrange
                let expectedResponse = { message: "The data could not be deleted." };

                reportServiceSpy = jest.spyOn(ReportService, 'deleteChartReportById')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));

                // act
                const response = await request.delete(`/api/reports/delete/${chartReportIdObject.chartReportId}`);

                // assert
                expect(response.status).toBe(500);
                expect(response.body).toEqual(expectedResponse);
                expect(reportServiceSpy).toHaveBeenCalledTimes(1);
                expect(authSpy).toHaveBeenCalledTimes(1);
            });

            it("RC3.1.3 - when service throws error with specified status and message, should respond with specified status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 600,
                    message: "Random error"
                };

                reportServiceSpy = jest.spyOn(ReportService, 'deleteChartReportById')
                    .mockImplementation(async () => {
                        await Promise.reject(expectedResponse);
                    });

                // act
                const response = await request.delete(`/api/reports/delete/${chartReportIdObject.chartReportId}`);

                // assert
                expect(response.status).toBe(expectedResponse.status);
                expect(response.body.message).toEqual(expectedResponse.message);
                expect(reportServiceSpy).toHaveBeenCalledTimes(1);
                expect(authSpy).toHaveBeenCalledTimes(1);
            });


            it("RC3.1.4 - when service throws error with unspecified status and message, should respond with 500 and default message", async () => {
                // arrange
                let expectedResponse = {
                    status: 500,
                    message: "Malfunction in the B&C Engine."
                };
                reportServiceSpy = jest.spyOn(ReportService, 'deleteChartReportById')
                    .mockImplementation(async () => {
                        await Promise.reject({});
                    });

                // act
                const response = await request.delete(`/api/reports/delete/${chartReportIdObject.chartReportId}`);

                // assert
                expect(response.status).toBe(expectedResponse.status);
                expect(response.body.message).toEqual(expectedResponse.message);
                expect(reportServiceSpy).toHaveBeenCalledTimes(1);
                expect(authSpy).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("RC4 - getReportTypesWithRecipients", () => {
        let fakeReportTypesServiceResponse = [
            {
                reportTypeId: "someUUID",
                name: "someName",
                frequency: 0,
                recipients: {
                    "someUUID": {
                        name: "rName1",
                        isRecipient: true
                    },
                    "someotherUUID": {
                        name: "rName2",
                        isRecipient: false
                    }
                }
            }
        ];

        describe("RC4.1 - given valid admin user", () => {
            beforeEach(() => {
                authSpy = jest.spyOn(AuthService, 'authenticateToken')
                    .mockImplementation((req, res, next) => {
                        req.user = reqUser;
                        return next()
                    });
            })

            it("RC4.1.1 - when valid response from service, should respond with 200 and response from service", async () => {
                // arrange
                let expectedResponse = fakeReportTypesServiceResponse;
                reportServiceSpy = jest.spyOn(ReportService, 'getReportTypesWithRecipients')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeReportTypesServiceResponse);
                    }));

                // act
                const response = await request.get("/api/reports/reportTypes");

                // assert
                expect(response.status).toBe(200);
                expect(response.body).toEqual(expectedResponse);
                expect(reportServiceSpy).toHaveBeenCalled();
                expect(authSpy).toHaveBeenCalled();
            });

            it("RC4.1.2 - when service resolves false, should respond with 500 and message", async () => {
                // arrange
                let expectedResponse = { message: "The data could not be fetched." };
                reportServiceSpy = jest.spyOn(ReportService, 'getReportTypesWithRecipients')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));

                // act
                const response = await request.get("/api/reports/reportTypes");

                // assert
                expect(response.status).toBe(500);
                expect(response.body).toEqual(expectedResponse);
                expect(reportServiceSpy).toHaveBeenCalled();
                expect(authSpy).toHaveBeenCalled();
            });

            it("RC4.1.3 - when service throws error with specified status and message, should respond with specified status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 600,
                    message: "Error."
                };
                reportServiceSpy = jest.spyOn(ReportService, 'getReportTypesWithRecipients')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject(expectedResponse);
                    }));

                // act
                const response = await request.get("/api/reports/reportTypes");

                // assert
                expect(response.status).toBe(600);
                expect(response.body.message).toEqual(expectedResponse.message);
                expect(reportServiceSpy).toHaveBeenCalled();
                expect(authSpy).toHaveBeenCalled();
            });

            it("RC4.1.4 - when service throws error with unspecified status and message, should respond with default status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 500,
                    message: "Malfunction in the B&C Engine."
                };
                reportServiceSpy = jest.spyOn(ReportService, 'getReportTypesWithRecipients')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({});
                    }));

                // act
                const response = await request.get("/api/reports/reportTypes");

                // assert
                expect(response.status).toBe(expectedResponse.status);
                expect(response.body.message).toEqual(expectedResponse.message);
                expect(reportServiceSpy).toHaveBeenCalled();
                expect(authSpy).toHaveBeenCalled();
            });
        });

        describe("RC4.2 - given invalid userId or role", () => {
            it("RC4.2.1 - when no user, should respond with 400 and message", async () => {
                // arrange
                let expectedResponse = {
                    message: "Content cannot be empty."
                };
                authSpy = jest.spyOn(AuthService, 'authenticateToken')
                    .mockImplementation((req, res, next) => {
                        return next()
                    });

                // act
                const response = await request.get("/api/reports/reportTypes");

                // assert
                expect(response.status).toBe(400);
                expect(response.body).toEqual(expectedResponse);
                expect(authSpy).toHaveBeenCalled();
                expect(reportServiceSpy).toHaveBeenCalledTimes(0);
            });

            it("RC4.2.2 - when no userId, should respond with 400 and message", async () => {
                // arrange
                let expectedResponse = {
                    message: "Content cannot be empty."
                };
                authSpy = jest.spyOn(AuthService, 'authenticateToken')
                    .mockImplementation((req, res, next) => {
                        req.user = {};
                        return next()
                    });

                // act
                const response = await request.get("/api/reports/reportTypes");

                // assert
                expect(response.status).toBe(400);
                expect(response.body).toEqual(expectedResponse);
                expect(authSpy).toHaveBeenCalled();
                expect(reportServiceSpy).toHaveBeenCalledTimes(0);
            });

            it("RC4.2.3 - when userId is empty, should respond with 400 and message", async () => {
                // arrange
                let expectedResponse = {
                    message: "Content cannot be empty."
                };
                authSpy = jest.spyOn(AuthService, 'authenticateToken')
                    .mockImplementation((req, res, next) => {
                        req.user = { userId: "" };
                        return next()
                    });

                // act
                const response = await request.get("/api/reports/reportTypes");

                // assert
                expect(response.status).toBe(400);
                expect(response.body).toEqual(expectedResponse);
                expect(authSpy).toHaveBeenCalled();
                expect(reportServiceSpy).toHaveBeenCalledTimes(0);
            });

            it("RC4.2.4 - when userId is undefined, should respond with 400 and message", async () => {
                // arrange
                let expectedResponse = {
                    message: "Content cannot be empty."
                };
                authSpy = jest.spyOn(AuthService, 'authenticateToken')
                    .mockImplementation((req, res, next) => {
                        req.user = { userId: undefined };
                        return next()
                    });

                // act
                const response = await request.get("/api/reports/reportTypes");

                // assert
                expect(response.status).toBe(400);
                expect(response.body).toEqual(expectedResponse);
                expect(authSpy).toHaveBeenCalled();
                expect(reportServiceSpy).toHaveBeenCalledTimes(0);
            });

            it("RC4.2.5 - when user role is not admin, should respond with 403 and message", async () => {
                // arrange
                let expectedResponse = {
                    message: "You are not authorized to fetch from this resource."
                };
                authSpy = jest.spyOn(AuthService, 'authenticateToken')
                    .mockImplementation((req, res, next) => {
                        req.user = { userId: "someUUID", role: "employee" };
                        return next()
                    });

                // act
                const response = await request.get("/api/reports/reportTypes");

                // assert
                expect(response.status).toBe(403);
                expect(response.body).toEqual(expectedResponse);
                expect(authSpy).toHaveBeenCalled();
                expect(reportServiceSpy).toHaveBeenCalledTimes(0);
            });
        });
    });

    describe("RC5 - createChartReportPDF", () => {
        describe("RC5.1 - given a valid reportId", () => {
            const fakeReportId = '4a13932c-c3af-4541-bcc9-d3c3dd002ee2';
            let validReq = { reportId: fakeReportId }
            it("RC5.1.1 - should return valid response 'true' with 200 status", async () => {
                // arrange
                reportServiceSpy = jest.spyOn(ReportService, 'createChartReportPDFById')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(true);
                    }));

                // act
                const response = await request.post(`/api/reports/createChartReportPdf`)
                    .send(validReq);

                // assert
                expect(response.status).toBe(200);
                expect(response.text).toEqual('true');
                expect(reportServiceSpy).toHaveBeenCalledTimes(1);
            });

            it("RC5.1.2 - when service resolves false, should return 500 and message", async () => {
                // arrange
                let expectedResponse = { message: "The data could not be fetched." };

                reportServiceSpy = jest.spyOn(ReportService, 'createChartReportPDFById')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));

                // act
                const response = await request.post(`/api/reports/createChartReportPdf`)
                    .send(validReq);

                // assert
                expect(response.status).toBe(500);
                expect(response.body).toEqual(expectedResponse);
                expect(reportServiceSpy).toHaveBeenCalledTimes(1);
                expect(authSpy).toHaveBeenCalledTimes(1);
            });

            it("RC5.1.3 - when service throws error with specified status and message, should respond with specified status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 600,
                    message: "Random error"
                };

                reportServiceSpy = jest.spyOn(ReportService, 'createChartReportPDFById')
                    .mockImplementation(async () => {
                        await Promise.reject(expectedResponse);
                    });

                // act
                const response = await request.post(`/api/reports/createChartReportPdf`)
                    .send(validReq);

                // assert
                expect(response.status).toBe(expectedResponse.status);
                expect(response.body.message).toEqual(expectedResponse.message);
                expect(reportServiceSpy).toHaveBeenCalledTimes(1);
                expect(authSpy).toHaveBeenCalledTimes(1);
            });


            it("RC5.1.4 - when service throws error with unspecified status and message, should respond with 500 and default message", async () => {
                // arrange
                let expectedResponse = {
                    status: 500,
                    message: "Malfunction in the B&C Engine."
                };
                reportServiceSpy = jest.spyOn(ReportService, 'createChartReportPDFById')
                    .mockImplementation(async () => {
                        await Promise.reject({ status: "", message: "" });
                    });

                // act
                const response = await request.post(`/api/reports/createChartReportPdf`)
                    .send(validReq);

                // assert
                expect(response.status).toBe(expectedResponse.status);
                expect(response.body.message).toEqual(expectedResponse.message);
                expect(reportServiceSpy).toHaveBeenCalledTimes(1);
                expect(authSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("RC5.2 - given no reportId", () => {
            it("RC5.2.1 - should return with status 400 and predefined error message", async () => {
                // arrange 
                let expectedError = { message: "Content cannot be empty." }

                // act
                const response = await request.post(`/api/reports/createChartReportPdf`);

                // assert
                expect(response.status).toBe(400);
                expect(response.body).toEqual(expectedError);
            });
        });
    });

    describe("RC6 - fetchReportPDF", () => {
        const fakeReportId = '848af2af-d6d5-4e13-8fab-df9155a375e0';
        describe("RC6.1 - given a valid ChartReportId", () => {
            it("RC6.1.1 - should return valid response with status 200", async () => {
                // arrange
                if (__dirname !== '/home/runner/work/BC-Engine/BC-Engine/server/tests/controllers') {
                    pdf.create(`<div></div>`, { format: "letter" })
                        .toFile(`${__dirname.replace("tests\\controllers", "")}docs\\pdf_files\\chartReport-${fakeReportId}.pdf`, () => { });
                }
                else {
                    pdf.create(`<div></div>`, { format: "letter" })
                        .toFile(`${__dirname.replace("tests/controllers", "")}docs/pdf_files/chartReport-${fakeReportId}.pdf`, () => { });
                }

                // wait for mock pdf file to be created
                await new Promise((r) => setTimeout(r, 2000));

                // act
                const response = await request.get(`/api/reports/fetchPdf?chartReportId=${fakeReportId}`);

                // assert
                expect(response.status).toBe(200);
                expect(response.headers['content-type']).toEqual('application/pdf')
            });

            it("RC6.1.2 - when file can't be fetched and throws error with specified status and message, should respond with specified status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 404,
                    message: "Not Found"
                };

                // act
                const response = await request.get(`/api/reports/fetchPdf?chartReportId=${fakeReportId}`);

                // assert
                expect(response.status).toBe(expectedResponse.status);
                expect(response.body.message).toBe(expectedResponse.message);

            });
        });

        describe("RC6.2 - given a valid PerformanceReportId", () => {
            it("RC6.2.1 - should return valid response with status 200", async () => {
                // arrange
                if (__dirname !== '/home/runner/work/BC-Engine/BC-Engine/server/tests/controllers') {
                    pdf.create(`<div></div>`, { format: "letter" })
                        .toFile(`${__dirname.replace("tests\\controllers", "")}docs\\pdf_files\\performanceReport-${fakeReportId}.pdf`, () => { });
                }
                else {
                    pdf.create(`<div></div>`, { format: "letter" })
                        .toFile(`${__dirname.replace("tests/controllers", "")}docs/pdf_files/performanceReport-${fakeReportId}.pdf`, () => { });
                }

                // wait for mock pdf file to be created
                await new Promise((r) => setTimeout(r, 2000));

                // act
                const response = await request.get(`/api/reports/fetchPdf?performanceReportId=${fakeReportId}`);

                // assert
                expect(response.status).toBe(200);
                expect(response.headers['content-type']).toEqual('application/pdf')
            });

            it("RC6.2.2 - when file can't be fetched and throws error with specified status and message, should respond with specified status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 404,
                    message: "Not Found"
                };

                // act
                const response = await request.get(`/api/reports/fetchPdf?performanceReportId=${fakeReportId}`);

                // assert
                expect(response.status).toBe(expectedResponse.status);
                expect(response.body.message).toBe(expectedResponse.message);

            });
        });

        describe("RC6.3 - given no chartReportId or performanceReportId", () => {
            it("RC6.3.1 - should return with status 400 and predefined error message", async () => {
                // arrange 
                let expectedError = { message: "Content cannot be empty." }

                // act
                const response = await request.get(`/api/reports/fetchPdf`);

                // assert
                expect(response.status).toBe(400);
                expect(response.body).toEqual(expectedError);
            });
        });
    });


    describe("RC7 - getPerformanceReportsOfAllUsers", () => {
        describe("RC7.1 - given a valid user from auth service", () => {
            it("RC7.1.1 - should respond with 200 and body", async () => {
                // arrange
                let expectedResponse = [
                    {
                        performanceReportId: "PerformanceUUID",
                        employeeId: 1,
                        averageCollectionDay: "35",
                        annualBillingObjective: "4500",
                        monthlyBillingObjective: "300",
                        annualBillingNumber: "200",
                        monthlyBillingNumber: "300",
                        projectedBonus: "650"
                    },
                    {
                        performanceReportId: "PerformanceUUID",
                        employeeId: 2,
                        averageCollectionDay: "35",
                        annualBillingObjective: "4500",
                        monthlyBillingObjective: "300",
                        annualBillingNumber: "200",
                        monthlyBillingNumber: "300",
                        projectedBonus: "650"
                    }
                ];

                reportServiceSpy = jest.spyOn(ReportService, 'getPerformanceReports')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(expectedResponse);
                    }));

                // act
                const response = await request.get("/api/reports/performanceReport");

                // assert
                expect(response.status).toBe(200);
                expect(response.body).toEqual(expectedResponse);
                expect(reportServiceSpy).toHaveBeenCalledTimes(1);
                expect(authSpy).toHaveBeenCalledTimes(1);
            });

            it("RC7.1.2 - should respond with 500 and message when service resolves false", async () => {
                // arrange
                let expectedResponse = { message: "The data could not be fetched." };
                reportServiceSpy = jest.spyOn(ReportService, 'getPerformanceReports')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));

                // act
                const response = await request.get("/api/reports/performanceReport");

                // assert
                expect(response.status).toBe(500);
                expect(response.body).toEqual(expectedResponse);
                expect(reportServiceSpy).toHaveBeenCalledTimes(1);
                expect(authSpy).toHaveBeenCalledTimes(1);
            });

            it("RC7.1.3 - when service throws error with specified status and message, should respond with specified status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 600,
                    message: "Error."
                };
                reportServiceSpy = jest.spyOn(ReportService, 'getPerformanceReports')
                    .mockImplementation(async () => {
                        await Promise.reject(expectedResponse);
                    });

                // act
                const response = await request.get("/api/reports/performanceReport");

                // assert
                expect(response.status).toBe(expectedResponse.status);
                expect(response.body.message).toEqual(expectedResponse.message);
                expect(reportServiceSpy).toHaveBeenCalledTimes(1);
                expect(authSpy).toHaveBeenCalledTimes(1);
            });

            it("RC7.1.4 - when service throws error with unspecified status and message, should respond with 500 and default message", async () => {
                // arrange
                let expectedResponse = {
                    status: 500,
                    message: "Malfunction in the B&C Engine."
                };
                reportServiceSpy = jest.spyOn(ReportService, 'getPerformanceReports')
                    .mockImplementation(async () => {
                        await Promise.reject({});
                    });

                // act
                const response = await request.get("/api/reports/performanceReport");

                // assert
                expect(response.status).toBe(expectedResponse.status);
                expect(response.body.message).toEqual(expectedResponse.message);
                expect(reportServiceSpy).toHaveBeenCalledTimes(1);
                expect(authSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("RC7.2 - given no valid userId from auth service", () => {
            it("RC7.2.1 - should respond with 400 and message", async () => {
                // arrange
                let req = {
                    user: {

                    }
                };
                let expectedResponse = { message: "Content cannot be empty." };

                // act
                const response = await ReportController.getPerformanceReports(req, res);

                // assert
                expect(response.statusCode).toBe(400);
                expect(response._responseData.toString('ascii')).toEqual(JSON.stringify(expectedResponse));
            });
        });
    });

    describe("RC8 - getPerformanceReportsByUserId", () => {
        let expectedServiceResponse = [
            {
                name: 'reportName1',
                recipient: 'recipientName1',
                createdAt: '2020-11-01'
            },
            {
                name: 'reportName2',
                recipient: 'recipientName2',
                createdAt: '2020-11-01'
            },
            {
                name: 'reportName3',
                recipient: 'recipientName3',
                createdAt: '2020-11-01'
            }
        ]

        let getPerformanceReportsByUserIdServiceSpy = jest.spyOn(ReportService, 'getPerformanceReportsByUserId')
            .mockImplementation(() => new Promise((resolve, reject) => {
                resolve(expectedServiceResponse)
            }))

        describe("RC8.1 - given valid response from service", () => {
            it("RC8.1.1 - should respond with 200 and service response", async () => {
                // arrange
                authSpy = jest.spyOn(AuthService, 'authenticateToken')
                    .mockImplementation((req, res, next) => {
                        req.user = reqUser;
                        return next()
                    });
                let expectedResponse = expectedServiceResponse

                // act
                const response = await request.get(`/api/reports/performanceReport/${reqUser.userId}`)

                // assert
                expect(authSpy).toHaveBeenCalled()
                expect(getPerformanceReportsByUserIdServiceSpy).toHaveBeenCalledWith(reqUser.userId)
                expect(response.status).toBe(200)
                expect(response.body).toEqual(expectedResponse)
            })
        })

        describe("RC8.2 - given invalid request", () => {
            let expectedResponse = {
                status: 400,
                message: 'Content cannot be empty.'
            }

            it("RC8.2.1 - when no user, should respond with 400 and message", async () => {
                // arrange
                authSpy = jest.spyOn(AuthService, 'authenticateToken')
                    .mockImplementation((req, res, next) => {
                        next()
                    })

                // act
                const response = await request.get(`/api/reports/performanceReport/${reqUser.userId}`)

                // assert
                expect(authSpy).toHaveBeenCalled()
                expect(getPerformanceReportsByUserIdServiceSpy).toHaveBeenCalledTimes(0)
                expect(response.status).toBe(expectedResponse.status)
                expect(response.body.message).toEqual(expectedResponse.message)
            })

            it("RC8.2.2 - when no userId, should respond with 400 and message", async () => {
                // arrange
                authSpy = jest.spyOn(AuthService, 'authenticateToken')
                    .mockImplementation((req, res, next) => {
                        req.user = {}
                        next()
                    })

                // act
                const response = await request.get(`/api/reports/performanceReport/${reqUser.userId}`)

                // assert
                expect(authSpy).toHaveBeenCalled()
                expect(getPerformanceReportsByUserIdServiceSpy).toHaveBeenCalledTimes(0)
                expect(response.status).toBe(expectedResponse.status)
                expect(response.body.message).toEqual(expectedResponse.message)
            })

            it("RC8.2.3 - when userId is empty, should respond with 400 and message", async () => {
                // arrange
                authSpy = jest.spyOn(AuthService, 'authenticateToken')
                    .mockImplementation((req, res, next) => {
                        req.user = { userId: '' }
                        next()
                    })

                // act
                const response = await request.get(`/api/reports/performanceReport/${reqUser.userId}`)

                // assert
                expect(authSpy).toHaveBeenCalled()
                expect(getPerformanceReportsByUserIdServiceSpy).toHaveBeenCalledTimes(0)
                expect(response.status).toBe(expectedResponse.status)
                expect(response.body.message).toEqual(expectedResponse.message)
            })

            it("RC8.2.4 - when userId is undefined, should respond with 400 and message", async () => {
                // arrange
                authSpy = jest.spyOn(AuthService, 'authenticateToken')
                    .mockImplementation((req, res, next) => {
                        req.user = { userId: undefined }
                        next()
                    })

                // act
                const response = await request.get(`/api/reports/performanceReport/${reqUser.userId}`)

                // assert
                expect(authSpy).toHaveBeenCalled()
                expect(getPerformanceReportsByUserIdServiceSpy).toHaveBeenCalledTimes(0)
                expect(response.status).toBe(expectedResponse.status)
                expect(response.body.message).toEqual(expectedResponse.message)
            })

            it("RC8.2.5 - when invalid userId, should respond with 400 and message", async () => {
                // arrange
                authSpy = jest.spyOn(AuthService, 'authenticateToken')
                    .mockImplementation((req, res, next) => {
                        req.user = reqUser;
                        return next()
                    });
                let invalidUserId = 'fakeUUid'
                let expectedMessage = 'Invalid userId.'

                // act
                const response = await request.get(`/api/reports/performanceReport/${invalidUserId}`)

                // assert
                expect(authSpy).toHaveBeenCalled()
                expect(getPerformanceReportsByUserIdServiceSpy).toHaveBeenCalledTimes(0)
                expect(response.status).toBe(expectedResponse.status)
                expect(response.body.message).toEqual(expectedMessage)
            })

            it('RC8.2.6 - when userId from auth does not match params userId, should respond with 400 and message', async () => {
                // arrange
                authSpy = jest.spyOn(AuthService, 'authenticateToken')
                    .mockImplementation((req, res, next) => {
                        req.user = reqUser;
                        return next()
                    });
                let unmatchedUserId = '73aecca6-8a0b-425e-8932-c124b3fa8ef2'
                let expectedMessage = 'Invalid userId.'

                // act
                const response = await request.get(`/api/reports/performanceReport/${unmatchedUserId}`)

                // assert
                expect(authSpy).toHaveBeenCalled()
                expect(getPerformanceReportsByUserIdServiceSpy).toHaveBeenCalledTimes(0)
                expect(response.status).toBe(400)
                expect((await response).body.message).toEqual(expectedMessage)
            })
        })

        describe("RC8.3 - given invalid response from service", () => {
            it("RC8.3.1 - when service resolves false, should return 500 with message", async () => {
                // arrange 
                authSpy = jest.spyOn(AuthService, 'authenticateToken')
                    .mockImplementation((req, res, next) => {
                        req.user = reqUser;
                        return next()
                    });
                getPerformanceReportsByUserIdServiceSpy = jest.spyOn(ReportService, 'getPerformanceReportsByUserId')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        resolve(false)
                    }))
                let expectedResponse = { message: 'The data could not be fetched.' }


                // act
                const response = await request.get(`/api/reports/performanceReport/${reqUser.userId}`)

                // assert
                expect(authSpy).toHaveBeenCalled()
                expect(getPerformanceReportsByUserIdServiceSpy).toHaveBeenCalledTimes(1)
                expect(response.status).toBe(500)
                expect(response.body).toEqual(expectedResponse)
            })

            it("RC8.3.2 - when service rejects error with specified status and message, should return specified status and message", async () => {
                // arrange 
                let expectedResponse = {
                    status: 600,
                    message: 'Error.'
                }
                getPerformanceReportsByUserIdServiceSpy = jest.spyOn(ReportService, 'getPerformanceReportsByUserId')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject(expectedResponse)
                    }))

                // act
                const response = await request.get(`/api/reports/performanceReport/${reqUser.userId}`)

                // assert
                expect(authSpy).toHaveBeenCalled()
                expect(getPerformanceReportsByUserIdServiceSpy).toHaveBeenCalledTimes(1)
                expect(response.status).toBe(expectedResponse.status)
                expect(response.body.message).toEqual(expectedResponse.message)
            })

            it("RC8.3.3 -  when service rejects error with unspecified status and message, should return default status and message", async () => {
                // arrange 
                let expectedResponse = {
                    status: 500,
                    message: 'Malfunction in the B&C Engine.'
                }
                getPerformanceReportsByUserIdServiceSpy = jest.spyOn(ReportService, 'getPerformanceReportsByUserId')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({})
                    }))

                // act
                const response = await request.get(`/api/reports/performanceReport/${reqUser.userId}`)

                // assert
                expect(authSpy).toHaveBeenCalled()
                expect(getPerformanceReportsByUserIdServiceSpy).toHaveBeenCalledTimes(1)
                expect(response.status).toBe(expectedResponse.status)
                expect(response.body.message).toEqual(expectedResponse.message)
            })
        })
    })

    describe("RC9 - createPerformanceReportPDF", () => {
        describe("RC9.1 - given a valid reportId", () => {
            const fakeReportId = '4a13932c-c3af-4541-bcc9-d3c3dd002ee2';
            let validReq = { reportId: fakeReportId }
            it("RC9.1.1 - should return valid response 'true' with 200 status", async () => {
                // arrange
                reportServiceSpy = jest.spyOn(ReportService, 'createPerformanceReportPDFByPerformanceReportId')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(true);
                    }));

                // act
                const response = await request.post(`/api/reports/createPerformanceReportPdf`)
                    .send(validReq);

                // assert
                expect(response.status).toBe(200);
                expect(response.text).toEqual('true');
                expect(reportServiceSpy).toHaveBeenCalledTimes(1);
            });

            it("RC9.1.2 - when service resolves false, should return 500 and message", async () => {
                // arrange
                let expectedResponse = { message: "The PDF could not be created." };

                reportServiceSpy = jest.spyOn(ReportService, 'createPerformanceReportPDFByPerformanceReportId')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));

                // act
                const response = await request.post(`/api/reports/createPerformanceReportPdf`)
                    .send(validReq);

                // assert
                expect(response.status).toBe(500);
                expect(response.body).toEqual(expectedResponse);
                expect(reportServiceSpy).toHaveBeenCalledTimes(1);
                expect(authSpy).toHaveBeenCalledTimes(1);
            });

            it("RC9.1.3 - when service throws error with specified status and message, should respond with specified status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 600,
                    message: "Random error"
                };

                reportServiceSpy = jest.spyOn(ReportService, 'createPerformanceReportPDFByPerformanceReportId')
                    .mockImplementation(async () => {
                        await Promise.reject(expectedResponse);
                    });

                // act
                const response = await request.post(`/api/reports/createPerformanceReportPdf`)
                    .send(validReq);

                // assert
                expect(response.status).toBe(expectedResponse.status);
                expect(response.body.message).toEqual(expectedResponse.message);
                expect(reportServiceSpy).toHaveBeenCalledTimes(1);
                expect(authSpy).toHaveBeenCalledTimes(1);
            });


            it("RC9.1.4 - when service throws error with unspecified status and message, should respond with 500 and default message", async () => {
                // arrange
                let expectedResponse = {
                    status: 500,
                    message: "Malfunction in the B&C Engine."
                };
                reportServiceSpy = jest.spyOn(ReportService, 'createPerformanceReportPDFByPerformanceReportId')
                    .mockImplementation(async () => {
                        await Promise.reject({ status: "", message: "" });
                    });

                // act
                const response = await request.post(`/api/reports/createPerformanceReportPdf`)
                    .send(validReq);

                // assert
                expect(response.status).toBe(expectedResponse.status);
                expect(response.body.message).toEqual(expectedResponse.message);
                expect(reportServiceSpy).toHaveBeenCalledTimes(1);
                expect(authSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("RC9.2 - given no reportId", () => {
            it("RC9.2.1 - should return with status 400 and predefined error message", async () => {
                // arrange 
                let expectedError = { message: "Content cannot be empty." }

                // act
                const response = await request.post(`/api/reports/createPerformanceReportPdf`);

                // assert
                expect(response.status).toBe(400);
                expect(response.body).toEqual(expectedError);
            });
        });
    })
});