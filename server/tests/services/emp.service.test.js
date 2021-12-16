const EmpService = require("../../services/emp.service");
const AuthService = require("../../services/auth.service");
const UserService = require('../../services/user.service');
const databases = require("../../data_access_layer/mysqldb");
const EmpModel = databases['mssql_pat'].employees;

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
    email: "emp@benoit-cote.com",
    firstName: "FName",
    lastName: "LName"
};

let sandbox = sinon.createSandbox();
let authStub = sandbox.stub(AuthService, 'authenticateToken')
    .callsFake(function(req, res, next){
        console.log("in original authstub...");
        req.user = reqUser;
        return next();
    });


const userServiceSpy = jest.spyOn(UserService, 'createUser')
.mockImplementation(() => new Promise((resolve) => {
    resolve(reqUser);
}));

const empModelSpy = jest.spyOn(EmpModel, 'findOne')
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

    describe("given existing employee email", () => {
        it("should return 200 with employee name and email", async () => {
            const response = request.post("/users").send(reqUser);

            expect(response.status).toBe(200);
            expect(response.body.email).toBe("emp@benoit-cote.com");
        })
        
    });
});