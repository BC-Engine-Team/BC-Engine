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
        firstName: 'myName1',
        lastName: 'myLastName1'
    },
    {
        nameID: 95423,
        firstName: 'myName3',
        lastName: 'myLastName3'
    },
    {
        nameID: 15169,
        firstName: 'myName2',
        lastName: 'myLastName2'
    },
]

let fakeEmployeeByNameListWithDataValues = [
    {
        dataValues: {
            nameID: 25361,
            firstName: 'myName1',
            lastName: 'myLastName1'
        }
    },
    {
        dataValues: {
            nameID: 95423,
            firstName: 'myName3',
            lastName: 'myLastName3'
        }
    },
    {
        dataValues: {
            nameID: 15169,
            firstName: 'myName2',
            lastName: 'myLastName2'
        }
    },
]

let sortedFakeEmployeeList = [
    {
        nameID: 25361,
        firstName: 'myName1',
        lastName: 'myLastName1'
    },
    {
        nameID: 15169,
        firstName: 'myName2',
        lastName: 'myLastName2'
    },
    {
        nameID: 95423,
        firstName: 'myName3',
        lastName: 'myLastName3'
    },
]

let fakeEmployeeList = [
    {
        email: 'Cathia@benoit-cote.com',
        firstName: 'Cathia',
        lastName: 'Zeppetelli',
        isActive: true
    },
    {
        email: 'Giuseppe@benoit-cote.com',
        firstName: 'Giuseppe',
        lastName: 'Calderone',
        isActive: true
    },
    {
        email: 'Marilyne@benoit-cote.com',
        firstName: 'Marilyne',
        lastName: 'Séïde',
        isActive: true
    },
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

let empDaoSpy = jest.spyOn(EmpDao, 'getAllEmployees')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(fakeEmployeeList);
}));

let nameDAOSpy = jest.spyOn(NameDao, 'getEmployeeByName')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(fakeEmployeeByNameList);
}));

let getEmployeeByfNameAndlNameSpy = jest.spyOn(EmpService, 'getEmployeeByfNameAndlName')
.mockImplementation(() => new Promise((resolve) => {
    resolve(fakeEmployeeByNameListWithDataValues);
}));

let getAllEmployeeNamesSpy = jest.spyOn(EmpService, 'getAllEmployeeNames')
.mockImplementation(() => new Promise((resolve) => {
    resolve(fakeEmployeeList);
}));

let sortListAlphabeticallySpy = jest.spyOn(EmpService, 'sortListAlphabetically')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(sortedFakeEmployeeList);
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

        describe("ES2.1 - given a valid request", () => {
            it("ES2.1.1 - Should return a list of employees", async () => {
                // arrange
                empDaoSpy = jest.spyOn(EmpDao, 'getAllEmployees')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeEmployeeList);
                }));

                getAllEmployeeNamesSpy = jest.spyOn(EmpService, 'getAllEmployeeNames')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeEmployeeList);
                    }));

                sortListAlphabeticallySpy = jest.spyOn(EmpService, 'sortListAlphabetically')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(sortedFakeEmployeeList);
                    }));

                // act
                const response = await EmpService.getAllEmployees();

                // assert
                expect(response).toEqual(sortedFakeEmployeeList);
            });
        });

        describe("ES2.2 - given errors on getEmployeeByfNameAndlName", () => {
            it("ES2.2.1 - Should return false if no data", async () => {
                // arrange
                empDaoSpy = jest.spyOn(EmpDao, 'getAllEmployees')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        resolve(fakeEmployeeList);
                }));

                getEmployeeByfNameAndlNameSpy = jest.spyOn(EmpService, 'getEmployeeByfNameAndlName')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(null);
                }));

                // act and assert
                await expect(EmpService.getAllEmployees()).resolves
                    .toEqual(false);
            });

            it("ES2.2.2 - should reject with error when dao throws error", async () => {
                // arrange
                empDaoSpy = jest.spyOn(EmpDao, 'getAllEmployees')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        resolve(fakeEmployeeList);
                }));

                getEmployeeByfNameAndlNameSpy = jest.spyOn(EmpService, 'getEmployeeByfNameAndlName')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({ message: "dao failed" });
                }));

                // act and assert
                await expect(EmpService.getAllEmployees()).rejects
                    .toEqual({ message: "dao failed" });
            });
        });

        describe("ES2.3 - given errors with getAllEmployeeNames", () => {
            it("ES2.3.1 - should reject with error when dao throws error ", async () => {
                // arrange
                empDaoSpy = jest.spyOn(EmpDao, 'getAllEmployees')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        resolve(fakeEmployeeList);
                }));

                getAllEmployeeNamesSpy = jest.spyOn(EmpService, 'getAllEmployeeNames')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({ message: "dao failed" });
                }));

                // act and assert
                await expect(EmpService.getAllEmployees()).rejects
                    .toEqual({ message: "dao failed" });
            });
        });
    });

    describe("ES3 - getAllEmployeeNames ", () => {
        describe("ES3.1 - given a valid request", () => {
            it("ES3.1.1 - should return a list of employee names", async () => {
                // arrange
                getAllEmployeeNamesSpy.mockRestore();

                empDaoSpy = jest.spyOn(EmpDao, 'getAllEmployees')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        resolve(fakeEmployeeList);
                }));

                // act
                const response = await EmpService.getAllEmployeeNames();

                // assert
                expect(response).toEqual(fakeEmployeeList);
            });

            it("ES3.1.2 - should reject with error when dao throws error", async () => {
                // arrange
                getAllEmployeeNamesSpy.mockRestore();

                empDaoSpy = jest.spyOn(EmpDao, 'getAllEmployees')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({ message: "dao failed" })
                }));

                // act and assert
                await expect(EmpService.getAllEmployeeNames()).rejects
                    .toEqual({ message: "dao failed" });
            });

            it("ES3.1.1 - Should return false if no data", async () => {
                // arrange
                getAllEmployeeNamesSpy.mockRestore();

                empDaoSpy = jest.spyOn(EmpDao, 'getAllEmployees')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        resolve(false)
                }));

                // act and assert
                await expect(EmpService.getAllEmployeeNames()).resolves
                    .toEqual(false);
            });
        });
    });

    describe("ES4 - getEmployeeByfNameAndlName  ", () => {
        let firstName = "fName";
        let lastName = "lName";
        describe("ES4.1 - given a valid request", () => {
            it("ES4.1.1 - should return a list of employee names", async () => {
                // arrange
                getEmployeeByfNameAndlNameSpy = jest.spyOn(EmpService, 'getEmployeeByfNameAndlName')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeEmployeeByNameList);
                    }));
                    
                nameDAOSpy = jest.spyOn(NameDao, 'getEmployeeByName')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeEmployeeByNameList);
                }));

                // act
                const response = await EmpService.getEmployeeByfNameAndlName(firstName, lastName);

                // assert
                expect(response).toEqual(fakeEmployeeByNameList);
            });

            it("ES4.1.2 - should reject with error when dao throws error", async () => {
                // arrange
                getEmployeeByfNameAndlNameSpy.mockRestore();

                nameDAOSpy = jest.spyOn(NameDao, 'getEmployeeByName')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({ message: "dao failed" });
                }));

                // act and assert
                await expect(EmpService.getEmployeeByfNameAndlName(firstName, lastName)).rejects
                    .toEqual({ message: "dao failed" });
            });

            it("ES4.1.3 - Should return false if no data", async () => {
                // arrange
                getEmployeeByfNameAndlNameSpy.mockRestore();

                nameDAOSpy = jest.spyOn(NameDao, 'getEmployeeByName')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                }));

                // act and assert
                await expect(EmpService.getEmployeeByfNameAndlName(firstName, lastName)).resolves
                    .toEqual(false);
            });
        });
    });

    describe("ES5 - sortListAlphabetically   ", () => {
        describe("ES5.1 - given an unsorted list", () => {
            it("ES5.1.1 - should return sorted list", async () => {
                // arrange
                sortListAlphabeticallySpy.mockRestore();

                // act
                const response = EmpService.sortListAlphabetically(fakeEmployeeByNameList);

                // assert
                expect(response).toEqual(sortedFakeEmployeeList);
            });
        })
    });
});