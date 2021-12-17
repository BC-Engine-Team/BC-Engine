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
var MockExpressResponse = require('mock-express-response');


const reqUser = {
    email: "emp@benoit-cote.com",
    password: "validPassword",
    name: "FName LName",
    role: "admin"
};

const reqUser2 = {
    body:{
        email: "emp@benoit-cote.com",
        password: "validPassword",
        name: "FName LName",
        role: "admin"
    }
    
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


const userServiceSpy = jest.spyOn(UserService, 'createUser')
.mockImplementation(() => new Promise((resolve) => {
    resolve(reqUser);
}));

const userControllerSpy = jest.spyOn(UserController, 'create');

let empModelSpy = jest.spyOn(EmpModel, 'findOne')
.mockImplementation(() => new Promise((resolve) => {
    resolve(reqEmp);
}));

const makeApp = require('../../app');
app = makeApp();
const request = supertest(app);

describe("checkEmail", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        // sandbox.restore();
        jest.resetAllMocks();
        jest.clearAllMocks();
        userSpy.mockClear();
        sandbox.resetHistory();
    });

    describe("given employee email", () => {
        it("when existing, should return 200 with employee name and email", async () => {
            const response = await request.post("/users").send(reqUser);

            expect(response.status).toBe(200);
            expect(response.body.email).toBe("emp@benoit-cote.com");
            expect(response.body.name).toBe("FName LName")
        })

        it("when non existent, should return 400 with message", async () => {
            empModelSpy = jest.spyOn(EmpModel, 'findOne')
                .mockImplementation(() => new Promise((resolve) => {
                    resolve(undefined);
                }));
            const response = await request.post("/users").send(reqUser);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Employee email doesn't exist.");
        });
        
    });
});