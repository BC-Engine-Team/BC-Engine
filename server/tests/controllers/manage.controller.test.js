const { afterEach, afterAll } = require('jest-circus');
var { expect, jest } = require('@jest/globals');
const supertest = require('supertest');
var MockExpressResponse = require('mock-express-response');
require("../../../config.js");


const ManageController = require('../../controllers/manage.controller');
const ManageService = require('../../services/manage.service');
const AuthService = require('../../services/auth.service');


const reqUserEmployee = {
    user: {
        email: "valid@email.com",
        role: "employee"
    }
};

let reqClientGrading = {
    maximumGradeAPlus: 10000,
    minimumGradeAPlus: 9000,
    averageCollectionTimeGradeAPlus: 90,
    maximumGradeA: 8000,
    minimumGradeA: 7000,
    averageCollectionTimeGradeA: 60,
    maximumGradeB: 6000,
    minimumGradeB: 5000,
    averageCollectionTimeGradeB: 30,
    maximumGradeC: 4000,
    minimumGradeC: 3000,
    averageCollectionTimeGradeC: 30,
    maximumGradeEPlus: 2000,
    minimumGradeEPlus: 1000,
    averageCollectionTimeGradeEPlus: 1
}


let authSpy = jest.spyOn(AuthService, 'authenticateToken')
    .mockImplementation((req, res, next) => {
        req.user = reqUser;
        return next()
    });


let manageServiceSpy = jest.spyOn(ManageService, 'getClientGradings')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(false);
    }));


const makeApp = require('../../app');
const { resolve } = require('path/posix');
let app = makeApp();
const request = supertest(app);
let res;

jest.setTimeout(10000)


describe("Test Manage Controller", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        res = new MockExpressResponse();
    });

    afterEach(() => {
    });

    afterAll(() => {
        process.exit;
    });


    describe("MC1 - getClientGradings", () => {

        let expectedResponse = {
            clientGradingId: 1,
            maximumGradeAPlus: 300000,
            minimumGradeAPlus: 50000.01,
            averageCollectionTimeGradeAPlus: 30,
            maximumGradeA: 50000,
            minimumGradeA: 0,
            averageCollectionTimeGradeA: 30,
            maximumGradeB: 50000,
            minimumGradeB: 0,
            averageCollectionTimeGradeB: 60,
            maximumGradeC: 50000,
            minimumGradeC: 0,
            averageCollectionTimeGradeC: 90,
            maximumGradeEPlus: 50000,
            minimumGradeEPlus: 0,
            averageCollectionTimeGradeEPlus: 1
        };

        describe("MC1.1 - given a valid user from auth service", () => {
            it("MC1.1.1 - should respond with 200 and body", async () => {

                // arrange
                manageServiceSpy = jest.spyOn(ManageService, 'getClientGradings')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(expectedResponse);
                    }));

                // act
                const response = await request.get("/api/manage/getClientGrading");
                

                // assert
                expect(response.status).toBe(200);
                expect(JSON.stringify(response.body)).toEqual(JSON.stringify(expectedResponse));
                expect(manageServiceSpy).toHaveBeenCalledTimes(1);
                expect(authSpy).toHaveBeenCalledTimes(1);
            });
        
        });
        describe("MC1.2 - given service cannot fetch data", () => {
            it("MC1.2.1 - Should respond with a 500 status code with error message when service throw an error", async () => {
                // arrange

                let expectedError = "The data could not be fetched.";

                manageServiceSpy = jest.spyOn(ManageService, 'getClientGradings')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));

                // act 
                const response = await request.get("/api/manage/getClientGrading");

                // assert
                expect(response.status).toBe(500);
                expect(response.body).toEqual(expectedError);
            });
        });

        describe("MC1.3 - given service throws an error", () => {
            it("MC1.3.1 - should respond with 500 status code and message when not specified", async () => {
                // arrange

                let expectedError = {
                    message: "Malfunction in the B&C Engine."
                };

                manageServiceSpy = jest.spyOn(ManageService, 'getClientGradings')
                    .mockImplementation(async () => {
                        await Promise.reject({});
                    });

                // act 
                const response = await request.get("/api/manage/getClientGrading");

                // assert
                expect(response.status).toBe(500);
                expect(response.body).toEqual(expectedError.message);
            });
            it("MC1.3.2 - should respond with caught error's status and message", async () => {
                // arrange

                let expectedError = {
                    status: 400,
                    message: "Custom message"
                };

                manageServiceSpy = jest.spyOn(ManageService, 'getClientGradings')
                    .mockImplementation(async () => {
                        await Promise.reject(expectedError);
                    });

                // act 
                const response = await request.get("/api/manage/getClientGrading");

                // assert
                expect(response.status).toBe(400);
                expect(response.body.message).toEqual(expectedError.message);
            });

        });

        describe("MC1.4 - given I try to get the client grading but I am not authorized", () => {
            it("MC1.4.1 - Should respond with a 403 status code", async () => {
                let response = await ManageController.getClientGradings(reqUserEmployee, res);
                expect(response.statusCode).toBe(403);
            });
        });
    });









    describe("MC2 - modifyClientGradings", () => {

        let expectedResponse = {
            maximumGradeAPlus: 300000,
            minimumGradeAPlus: 50000.01,
            averageCollectionTimeGradeAPlus: 30,
            maximumGradeA: 50000,
            minimumGradeA: 0,
            averageCollectionTimeGradeA: 30,
            maximumGradeB: 50000,
            minimumGradeB: 0,
            averageCollectionTimeGradeB: 60,
            maximumGradeC: 50000,
            minimumGradeC: 0,
            averageCollectionTimeGradeC: 90,
            maximumGradeEPlus: 50000,
            minimumGradeEPlus: 0,
            averageCollectionTimeGradeEPlus: 1
        }

        describe("MC2.1 - given a valid user from auth service", () => {
            it("MC2.1.1 - should respond with 200 and body", async () => {
                // arrange
                manageServiceSpy = jest.spyOn(ManageService, 'modifyClientGradings')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(expectedResponse);
                    }));

                // act
                const response = await request.put("/api/manage/modifyClientGrading").send(expectedResponse);
                
                    
                // assert
                expect(response.status).toBe(200);
                expect(manageServiceSpy).toHaveBeenCalledTimes(1);
                expect(authSpy).toHaveBeenCalledTimes(1);
                expect(JSON.stringify(response.body)).toEqual(JSON.stringify(expectedUserToModifyValid));
            });
        
        });
        // describe("MC1.2 - given service cannot fetch data", () => {
        //     it("MC1.2.1 - Should respond with a 500 status code with error message when service throw an error", async () => {
        //         // arrange

        //         let expectedError = "The data could not be fetched.";

        //         manageServiceSpy = jest.spyOn(ManageService, 'getClientGradings')
        //             .mockImplementation(() => new Promise((resolve) => {
        //                 resolve(false);
        //             }));

        //         // act 
        //         const response = await request.get("/api/manage/getClientGrading");

        //         // assert
        //         expect(response.status).toBe(500);
        //         expect(response.body).toEqual(expectedError);
        //     });
        // });

        // describe("MC1.3 - given service throws an error", () => {
        //     it("MC1.3.1 - should respond with 500 status code and message when not specified", async () => {
        //         // arrange

        //         let expectedError = {
        //             message: "Malfunction in the B&C Engine."
        //         };

        //         manageServiceSpy = jest.spyOn(ManageService, 'getClientGradings')
        //             .mockImplementation(async () => {
        //                 await Promise.reject({});
        //             });

        //         // act 
        //         const response = await request.get("/api/manage/getClientGrading");

        //         // assert
        //         expect(response.status).toBe(500);
        //         expect(response.body).toEqual(expectedError.message);
        //     });
        //     it("MC1.3.2 - should respond with caught error's status and message", async () => {
        //         // arrange

        //         let expectedError = {
        //             status: 400,
        //             message: "Custom message"
        //         };

        //         manageServiceSpy = jest.spyOn(ManageService, 'getClientGradings')
        //             .mockImplementation(async () => {
        //                 await Promise.reject(expectedError);
        //             });

        //         // act 
        //         const response = await request.get("/api/manage/getClientGrading");

        //         // assert
        //         expect(response.status).toBe(400);
        //         expect(response.body.message).toEqual(expectedError.message);
        //     });

        // });

        describe("MC2.4 - given I try to modify the client grading in the local database but I am not authorized", () => {
            it("MC2.4.1 - Should respond with a 403 status code", async () => {
                let response = await ManageController.modifyClientGradings(reqUserEmployee, res);
                expect(response.statusCode).toBe(403);
            });
        });
    });





















    describe("MC3 - sendNewClientGradingInDatabase", () => {
        // describe("MC1.1 - given a valid user from auth service", () => {
        //     it("MC1.1.1 - should respond with 200 and body", async () => {
        //         // arrange
        //         let expectedResponse = [
        //             {
        //                 clientGradingId: 1,
        //                 maximumGradeAPlus: 300000,
        //                 minimumGradeAPlus: 50000.01,
        //                 averageCollectionTimeGradeAPlus: 30,
        //                 maximumGradeA: 50000,
        //                 minimumGradeA: 0,
        //                 averageCollectionTimeGradeA: 30,
        //                 maximumGradeB: 50000,
        //                 minimumGradeB: 0,
        //                 averageCollectionTimeGradeB: 60,
        //                 maximumGradeC: 50000,
        //                 minimumGradeC: 0,
        //                 averageCollectionTimeGradeC: 90,
        //                 maximumGradeEPlus: 50000,
        //                 minimumGradeEPlus: 0,
        //                 averageCollectionTimeGradeEPlus: 1
        //             }
        //         ];

        //         manageServiceSpy = jest.spyOn(ManageService, 'getClientGradings')
        //             .mockImplementation(() => new Promise((resolve) => {
        //                 resolve(expectedResponse);
        //             }));

        //         // act
        //         const response = await request.get("/api/manage/getClientGrading");
                

        //         // assert
        //         expect(response.status).toBe(200);
        //         expect(JSON.stringify(response.body)).toEqual(JSON.stringify(expectedResponse));
        //         expect(manageServiceSpy).toHaveBeenCalledTimes(1);
        //         expect(authSpy).toHaveBeenCalledTimes(1);
        //     });
        
        // });
        // describe("MC1.2 - given service cannot fetch data", () => {
        //     it("MC1.2.1 - Should respond with a 500 status code with error message when service throw an error", async () => {
        //         // arrange

        //         let expectedError = "The data could not be fetched.";

        //         manageServiceSpy = jest.spyOn(ManageService, 'getClientGradings')
        //             .mockImplementation(() => new Promise((resolve) => {
        //                 resolve(false);
        //             }));

        //         // act 
        //         const response = await request.get("/api/manage/getClientGrading");

        //         // assert
        //         expect(response.status).toBe(500);
        //         expect(response.body).toEqual(expectedError);
        //     });
        // });

        // describe("MC1.3 - given service throws an error", () => {
        //     it("MC1.3.1 - should respond with 500 status code and message when not specified", async () => {
        //         // arrange

        //         let expectedError = {
        //             message: "Malfunction in the B&C Engine."
        //         };

        //         manageServiceSpy = jest.spyOn(ManageService, 'getClientGradings')
        //             .mockImplementation(async () => {
        //                 await Promise.reject({});
        //             });

        //         // act 
        //         const response = await request.get("/api/manage/getClientGrading");

        //         // assert
        //         expect(response.status).toBe(500);
        //         expect(response.body).toEqual(expectedError.message);
        //     });
        //     it("MC1.3.2 - should respond with caught error's status and message", async () => {
        //         // arrange

        //         let expectedError = {
        //             status: 400,
        //             message: "Custom message"
        //         };

        //         manageServiceSpy = jest.spyOn(ManageService, 'getClientGradings')
        //             .mockImplementation(async () => {
        //                 await Promise.reject(expectedError);
        //             });

        //         // act 
        //         const response = await request.get("/api/manage/getClientGrading");

        //         // assert
        //         expect(response.status).toBe(400);
        //         expect(response.body.message).toEqual(expectedError.message);
        //     });

        // });

        describe("MC3.4 - given I try to modify the client grading in the database but I am not authorized", () => {
            it("MC3.4.1 - Should respond with a 403 status code", async () => {
                let response = await ManageController.sendNewClientGradingInDatabase(reqUserEmployee, res);
                expect(response.statusCode).toBe(403);
            });
        });
    });

});

