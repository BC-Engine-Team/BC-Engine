const UserService = require('../../services/user.service');
const AuthService = require('../../services/auth.service');
const EmpService = require('../../services/emp.service');
const UserController = require('../../controllers/user.controller');
const sinon = require('sinon');

const { afterEach, afterAll } = require('jest-circus');
var { expect, jest } = require('@jest/globals');
const { mocked } = require('jest-mock');
const supertest = require('supertest');

var app;
var auth;

const reqUser = {
    email: "valid@benoit-cote.com",
    password: "validPassword",
    name: "validName",
    role: "admin"
};

const reqEmp = {
    email: "emp@benoit-cote.com",
    firstName: "FName",
    lastName: "LName"
};

const resUser = {
    userId: "validUUID",
    email: "valid@email.com",
    password: "validPassword",
    name: "validName",
    role: "validRole",
    updatedAt: new Date("2020-12-20"),
    createdAt: new Date("2020-12-20")
};

const resUser2 = {
    dataValues: {
        userId: "validUUID",
        email: "valid@email.com",
        password: "validPassword",
        name: "validName",
        role: "validRole",
        updatedAt: new Date("2020-12-20"),
        createdAt: new Date("2020-12-20")
    }
};

let sandbox = sinon.createSandbox();
let authStub = sandbox.stub(AuthService, 'authenticateToken')
    .callsFake(function(req, res, next) {
        console.log("in original authstub...");
        req.user = reqUser;
        return next();
});

let empStub = sandbox.stub(EmpService, 'checkEmail')
    .callsFake(function(req, res, next){
        req.emp = reqEmp;
        return next();
});

const makeApp = require('../../app');
app = makeApp();
const request = supertest(app);

describe("Test UserController", () => {
    let userSpy = jest.spyOn(UserService, 'authenticateUser')
        .mockImplementation(() => new Promise((resolve) => {
            resolve(false);
    }));

    let authSpy = jest.spyOn(AuthService, 'getTokens')
        .mockImplementation(() =>  ["aToken","rToken"]);

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

    afterAll(() => {
        process.exit;
    });
    
    describe("(C1): Create a User", () => {

        let authenticateTokenStub;

        let expectedUser = {
            email: resUser.email,
            name: resUser.name,
            role: resUser.role
        };

        describe("(C1.1): given user is authenticated and valid user body", () => {
            it("(C1.1.1): should respond with a 200 status code with filtered user body", async () => {
                userSpy = jest.spyOn(UserService, 'createUser')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(expectedUser);
                    }));

                const response = await supertest(app).post("/users")
                    .set("authorization", "Bearer validToken")
                    .send(reqUser);

                expect(response.status).toBe(200);
                expect(userSpy).toHaveBeenCalledTimes(1);
                expect(authStub.called).toBeTruthy();
                expect(empStub.called).toBeTruthy();
                expect(JSON.stringify(response.body)).toEqual(JSON.stringify(expectedUser));
            });
        });

        describe("(C1.2) given authenticated and invalid user body", () => {
            it("should return 400 with message when no email", async () => {

                let requestUser = {
                    password: reqUser.password,
                    name: reqUser.name,
                    role: reqUser.role
                };

                const response = await request.post("/users")
                    .set("authorization", "Bearer validToken")
                    .send(requestUser);

                expect(response.status).toBe(400);
                expect(response.body.message).toBe("Content cannot be empty.")
                expect(userSpy).toHaveBeenCalledTimes(0);
                expect(authStub.called).toBeTruthy();
                expect(empStub.called).toBeTruthy();
            });
            it("should return 400 with message when no password", async () => {
                let requestUser = {
                    email: reqUser.email,
                    name: reqUser.name,
                    role: reqUser.role
                };

                const response = await request.post("/users")
                    .set("authorization", "Bearer validToken")
                    .send(requestUser);

                expect(response.status).toBe(400);
                expect(response.body.message).toBe("Content cannot be empty.")
                expect(userSpy).toHaveBeenCalledTimes(0);
                expect(authStub.called).toBeTruthy();
                expect(empStub.called).toBeTruthy();
            });
            it("should return 400 with message when no role", async () => {
                let requestUser = {
                    email: reqUser.email,
                    password: reqUser.password,
                    name: reqUser.name
                };

                const response = await request.post("/users")
                    .set("authorization", "Bearer validToken")
                    .send(requestUser);

                expect(response.status).toBe(400);
                expect(response.body.message).toBe("Content cannot be empty.")
                expect(userSpy).toHaveBeenCalledTimes(0);
                expect(authStub.called).toBeTruthy();
                expect(empStub.called).toBeTruthy();
            });
            it("should return 400 with message when email doesn't finish by benoit-cote.com", async () => {
                let requestUser = {
                    email: "wrong@format.email",
                    password: reqUser.password,
                    name: reqUser.name,
                    role: reqUser.role
                };

                const response = await request.post("/users")
                    .set("authorization", "Bearer validToken")
                    .send(requestUser);

                expect(response.status).toBe(400);
                expect(response.body.message).toBe("Invalid email format.")
                expect(userSpy).toHaveBeenCalledTimes(0);
                expect(authStub.called).toBeTruthy();
                expect(empStub.called).toBeTruthy();
            });
        });
        
    });
    
    describe("(C2): Authenticating a User)", () => {

        const validUserLogin = {
            email: "valid@email.com",
            password: "validPassword"
        };

        describe("(C2.1): given existing email and password", () => {

            it("(C2.1.1): should respond with 200 status code", async () => {
                userSpy = jest.spyOn(UserService, 'authenticateUser')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(resUser2);
                    }));
                const response = await request.post("/users/authenticate")
                    .send(reqUser);
                expect(response.statusCode).toBe(200);
                expect(userSpy).toBeCalledTimes(1);
                expect(authSpy).toBeCalledTimes(1);
            });

            it("should return jwt access token in body and refresh token in the header", async () => {
                const response = await request.post("/users/authenticate") 
                    .send(reqUser);
                expect(response.body.aToken).toBe("aToken");
                expect(userSpy).toBeCalledTimes(1);
                expect(authSpy).toBeCalledTimes(1);
                expect(response.get('authorization')).toBe("rToken");
            });
        });

        describe("given non existent email and/or wrong password", () => {

            it("should respond with 401 status code", async () => {
                userSpy = jest.spyOn(UserService, 'authenticateUser')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));
                const response = await request.post("/users/authenticate").send({
                    email: "first@benoit-cote.co",
                    password: "verySecurePassword"
                });
                expect(userSpy).toBeCalledTimes(1);
                expect(authSpy).toBeCalledTimes(0);
                expect(response.statusCode).toBe(401);
            });

            it("should respond with 401 status code", async () => {
                userSpy = jest.spyOn(UserService, 'authenticateUser')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));
                const response = await request.post("/users/authenticate").send({
                    email: "first@benoit-cote.com",
                    password: "verySecurePasswor"
                });
                expect(userSpy).toBeCalledTimes(1);
                expect(authSpy).toBeCalledTimes(0);
                expect(response.statusCode).toBe(401);
            });

            it("should respond with 401 status code", async () => {
                userSpy = jest.spyOn(UserService, 'authenticateUser')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));
                const response = await request.post("/users/authenticate").send({
                    email: "first@benoit-cote.co",
                    password: "verySecurePasswor"
                });
                expect(userSpy).toBeCalledTimes(1);
                expect(authSpy).toBeCalledTimes(0);
                expect(response.statusCode).toBe(401);
            });
        });

        describe("given no email", () => {
            it("should return 400 and message", async () => {
                const response = await request.post("/users/authenticate").send({
                    
                    password: "verySecurePassword"
                });
                expect(response.statusCode).toBe(400);
                expect(response.body.message).toBe("Content cannot be empty.");
                expect(userSpy).toBeCalledTimes(0);
                expect(authSpy).toBeCalledTimes(0);
            });
        });

        describe("given an error occurs with the user service", () => {
            
            it("should return 500 and a message", async () => {
                userSpy = jest.spyOn(UserService, 'authenticateUser')
                .mockRejectedValue(new Error("Error with the user service"));
                const response = await request.post("/users/authenticate").send(reqUser);
                expect(response.statusCode).toBe(500);
                expect(response.error.text).toBe("Error with the user service");
                
            })
        });
    });

});


