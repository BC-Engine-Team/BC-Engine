const AuthService = require("../../services/auth.service");
const databases = require("../../data_access_layer/databases");
const EmpModel = databases['mssql_pat'].employees;
const UserController = require("../../controllers/user.controller");
const supertest = require('supertest');
const { afterEach, afterAll } = require('jest-circus');
var { expect, jest } = require('@jest/globals');
const sinon = require('sinon');

const empDAO = require("../../data_access_layer/daos/emp.dao");
const nameDAO = require("../../data_access_layer/daos/name.dao");
const EmployeeService = require("../../services/emp.service");


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

let fakeEmployeeByNameList = [
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
    .callsFake(function(req, res, next) {
        req.user = reqUser;
        return next();
});

let userControllerStub = sandbox.stub(UserController, 'create')
    .callsFake(function(req, res) {
        res.send(reqUser);
});

let empModelSpy = jest.spyOn(EmpModel, 'findOne')
.mockImplementation(() => new Promise((resolve) => {
    resolve(reqEmp);
}));

let getAllEmployeesSpy = jest.spyOn(EmployeeService, 'getAllEmployees')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(fakeEmployeeByNameList);
}));

// let empDaoSpy = jest.spyOn(empDAO, 'getAllEmployees')
//     .mockImplementation(() => new Promise((resolve) => {
//         resolve(fakeEmployeeList);
// }));

let empDaoStub = sandbox.stub(empDAO, 'getAllEmployees')
    .callsFake(() => new Promise((resolve) => {
        resolve(fakeEmployeeList);
    }))

let nameDAOSpy = jest.spyOn(nameDAO, 'getEmployeeByName')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(fakeEmployeeByNameList);
}));

const makeApp = require('../../app');
app = makeApp();
const request = supertest(app);

describe("Test Employee Service", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        sandbox.restore();
    });

    afterAll(() => {
        process.exit;
    });

    describe("ES1 - checkEmail", () => {

        describe("ES1.1 - given employee email", () => {
            it("ES1.1.1 - when existing, should return 200 with employee name and email", async () => {
                // act
                const response = await request.post("/api/users").send(reqUser);
    
                // assert
                expect(response.status).toBe(200);
                expect(response.body.email).toBe("emp@benoit-cote.com");
                expect(response.body.name).toBe("FName LName")
                expect(empModelSpy).toBeCalledTimes(1);
                expect(userControllerStub.called).toBeTruthy();
                userControllerStub.resetHistory();

            })
    
            it("ES1.1.2 - when non existent, should return 400 with message", async () => {
                // arrange
                empModelSpy = jest.spyOn(EmpModel, 'findOne')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(undefined);
                    }));

                // act
                const response = await request.post("/api/users").send(reqUser);
    
                // assert
                expect(response.status).toBe(400);
                expect(response.body.message).toBe("Employee email doesn't exist.");
                expect(empModelSpy).toBeCalledTimes(1);
                expect(userControllerStub.called).toBeFalsy();
                userControllerStub.resetHistory();
            });
            
        });

        describe("ES2 - getAllEmployees", () => {
            describe("ES2.1 - given no values are passed", () => {
                it("ES2.1.1 - when existing, should return 200 with a list of employees", async () => {
                    // arrange
                    // empDaoSpy = jest.spyOn(empDAO, 'getAllEmployees')
                    //     .mockImplementation(() => new Promise((resolve) => {
                    //         resolve(fakeEmployeeList);
                    // }));

                    // act
                    const response = await EmployeeService.getAllEmployees();

                    // assert
                    expect(response).toBe(fakeEmployeeByNameList);
                    expect(empDaoStub.called).toBeTruthy();
    
                })
        
                it("ES1.1.2 - when non existent, should return 400 with message", async () => {
                    // arrange
                    getAllEmployeesSpy = jest.spyOn(EmpModel, 'findOne')
                        .mockImplementation(() => new Promise((resolve) => {
                            resolve(undefined);
                        }));
    
                    // act
                    const response = await request.post("/api/users").send(reqUser);
        
                    // assert
                    expect(response.status).toBe(400);
                    expect(response.body.message).toBe("Employee email doesn't exist.");
                    expect(empModelSpy).toBeCalledTimes(1);
                    expect(userControllerStub.called).toBeFalsy();
                    userControllerStub.resetHistory();
                });
                
            });
        });
    });
});