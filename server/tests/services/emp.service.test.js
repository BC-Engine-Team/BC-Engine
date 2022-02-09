const EmpService = require("../../services/emp.service");
const AuthService = require("../../services/auth.service");
const EmpDao = require("../../data_access_layer/daos/emp.dao");
const NameDao = require("../../data_access_layer/daos/name.dao")
const supertest = require('supertest');
const { afterAll } = require('jest-circus');
var { expect, jest } = require('@jest/globals');
const sinon = require('sinon');

const reqUser = {
    email: "emp@benoit-cote.com",
    password: "validPassword",
    name: "FName LName",
    role: "admin"
};

const reqEmp = {
    dataValues: {
        email: "emp@benoit-cote.com",
        firstName: "FName",
        lastName: "LNameeeeeee"
    }
};

const fakeDaoCheckEmailResponse = {
    email: "email@email.com",
    name: "Cool Name"
};

let fakeEmployeeByNameList = [
    {
        nameID: 25361,
        name: 'myName1 myLastName1'
    },
    {
        nameID: 95423,
        name: 'myName3 myLastName3'
    },
    {
        nameID: 15169,
        name: 'myName2 myLastName2'
    },
]

let fakeSingleEmployee = [
    {
        nameID: 25361,
        name: 'myName1 myLastName1'
    }
]

let sandbox = sinon.createSandbox();
let authStub = sandbox.stub(AuthService, 'authenticateToken')
    .callsFake(function (req, res, next) {
        req.user = reqUser;
        return next();
    });

let empDaoCheckEmailSpy = jest.spyOn(EmpDao, 'getEmployeeByEmail')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(fakeDaoCheckEmailResponse);
    }));

let nameDAOSpy = jest.spyOn(NameDao, 'getAllEmployeeNames')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(fakeEmployeeByNameList);
    }));

const makeApp = require('../../app');
const MockExpressResponse = require("mock-express-response");
app = makeApp();
const request = supertest(app);
let res;

describe("Test Employee Service", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        res = new MockExpressResponse();
    });

    afterAll(() => {
        process.exit;
    });

    describe("ES1 - checkEmail", () => {

        describe("ES1.1 - given employee email", () => {
            it("ES1.1.1 - when existing, should call controller with appropriate req", async () => {
                // arrange
                empDaoCheckEmailSpy = jest.spyOn(EmpDao, 'getEmployeeByEmail')
                    .mockImplementation((email) => new Promise((resolve) => {
                        resolve(fakeDaoCheckEmailResponse);
                    }));
                const serviceReq = {
                    body: {
                        email: 'email@email.com'
                    }
                };
                
                const next = jest.fn();

                // act
                await EmpService.checkEmail(serviceReq, res, next)

                // assert
                expect(next).toHaveBeenCalled()
                expect(empDaoCheckEmailSpy).toHaveBeenCalledWith(serviceReq.body.email);
            })

            it("ES1.1.2 - when non existent, should return 400 with message", async () => {
                // arrange
                empDaoCheckEmailSpy = jest.spyOn(EmpDao, 'getEmployeeByEmail')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));
                const serviceReq = {
                    body: {
                        email: 'nonexistent@email.com'
                    }
                };
                const expectedResponse = {
                    status: 400,
                    message: "Employee email doesn't exist."
                };

                // act
                const response = await request.post("/api/users").send(serviceReq);

                // assert
                expect(empDaoCheckEmailSpy).toHaveBeenCalled();
                expect(response.status).toEqual(400);
                expect(response.body).toEqual(expectedResponse);
            });

            it("ES1.1.3 - when dao throws error with message, should catch and return 500 with error message", async () => {
                // arrange
                empDaoCheckEmailSpy = jest.spyOn(EmpDao, 'getEmployeeByEmail')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({ message: "Error message." });
                    }));
                const serviceReq = {
                    body: {
                        email: 'nonexistent@email.com'
                    }
                };
                const expectedResponse = {
                    status: 500,
                    message: "Error message."
                };

                // act
                const response = await request.post("/api/users").send(serviceReq);

                // assert
                expect(empDaoCheckEmailSpy).toHaveBeenCalled();
                expect(response.status).toEqual(500);
                expect(response.body).toEqual(expectedResponse);
            });
            
            it("ES1.1.4 - when dao throws error with no message, should catch and return 500 with default message", async () => {
                // arrange
                empDaoCheckEmailSpy = jest.spyOn(EmpDao, 'getEmployeeByEmail')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({});
                    }));
                const serviceReq = {
                    body: {
                        email: 'nonexistent@email.com'
                    }
                };
                const expectedResponse = {
                    status: 500,
                    message: "some error occured"
                };

                // act
                const response = await request.post("/api/users").send(serviceReq);

                // assert
                expect(empDaoCheckEmailSpy).toHaveBeenCalled();
                expect(response.status).toEqual(500);
                expect(response.body).toEqual(expectedResponse);
            });
        });
    });

    describe("ES2 - getAllEmployees", () => {
        describe("ES2.1 - given no arguments", () => {
            it("ES2.1.1 - Should return a list of employees", async () => {
                // arrange
                NameDaoSpy = jest.spyOn(NameDao, 'getAllEmployeeNames')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeEmployeeByNameList);
                    }));

                // act
                const response = await EmpService.getAllEmployees();

                // assert
                expect(response).toEqual(fakeEmployeeByNameList);
            });

            it("ES2.1.2 - should reject with error when dao throws error", async () => {
                // arrange
                NameDaoSpy = jest.spyOn(NameDao, 'getAllEmployeeNames')
                    .mockImplementation(() => new Promise((resolve, rejects) => {
                        rejects({message: "dao failed"});
                    }));

                // act and assert
                await expect(EmpService.getAllEmployees()).rejects
                    .toEqual({message: "dao failed"})
            });

            it("ES2.1.3 - should resolve with false when dao resolves false", async () => {
                // arrange
                NameDaoSpy = jest.spyOn(NameDao, 'getAllEmployeeNames')
                .mockImplementation(() => new Promise((resolve, rejects) => {
                    resolve(false);
                }));

            // act and assert
            await expect(EmpService.getAllEmployees()).resolves
                .toEqual(false);
            });
        });

        describe("ES2.2 - given a name argument", () => {
            let name = 'myName1 myLastName1';

            it("ES2.2.1 - Should return a list of employees", async () => {
                // arrange
                NameDaoSpy = jest.spyOn(NameDao, 'getAllEmployeeNames')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeEmployeeByNameList);
                    }));

                // act
                const response = await EmpService.getAllEmployees(name);

                // assert
                expect(response).toEqual(fakeSingleEmployee);
            });

            it("ES2.2.2 - should reject with error when dao throws error", async () => {
                // arrange
                NameDaoSpy = jest.spyOn(NameDao, 'getAllEmployeeNames')
                    .mockImplementation(() => new Promise((resolve, rejects) => {
                        rejects({message: "dao failed"});
                    }));

                // act and assert
                await expect(EmpService.getAllEmployees(name)).rejects
                    .toEqual({message: "dao failed"})
            });

            it("ES2.2.3 - should resolve with false when dao resolves false", async () => {
                // arrange
                NameDaoSpy = jest.spyOn(NameDao, 'getAllEmployeeNames')
                .mockImplementation(() => new Promise((resolve, rejects) => {
                    resolve(false);
                }));

            // act and assert
            await expect(EmpService.getAllEmployees(name)).resolves
                .toEqual(false);
            });
        });
    });
});