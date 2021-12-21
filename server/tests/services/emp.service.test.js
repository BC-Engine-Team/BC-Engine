const EmpService = require("../../services/emp.service");
const AuthService = require("../../services/auth.service");
const UserService = require('../../services/user.service');
const databases = require("../../data_access_layer/databases");
const EmpModel = databases['mssql_pat'].employees;
const UserController = require("../../controllers/user.controller");
const supertest = require('supertest');
const { afterEach, afterAll } = require('jest-circus');
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


let sandbox = sinon.createSandbox();
let authStub = sandbox.stub(AuthService, 'authenticateToken')
    .callsFake(function(req, res, next){
        req.user = reqUser;
        return next();
    });
let userControllerStub = sandbox.stub(UserController, 'create')
    .callsFake(function(req, res){
        res.send(reqUser);
    });

let empModelSpy = jest.spyOn(EmpModel, 'findOne')
.mockImplementation(() => new Promise((resolve) => {
    resolve(reqEmp);
}));

const makeApp = require('../../app');
app = makeApp();
const request = supertest(app);

describe("Test Employee Service", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
    });

    afterAll(() => {
        process.exit;
    });

    describe("ES1 - checkEmail", () => {

        describe("ES1.1 - given employee email", () => {
            it("ES1.1.1 - when existing, should return 200 with employee name and email", async () => {
                // act
                const response = await request.post("/users").send(reqUser);
    
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
                const response = await request.post("/users").send(reqUser);
    
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

