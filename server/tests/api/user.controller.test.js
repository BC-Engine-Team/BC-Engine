const UserService = require('../../services/user.service');
const AuthService = require('../../services/auth.service');
const UserController = require('../../controllers/user.controller');
const sinon = require('sinon');

const { afterEach, afterAll } = require('jest-circus');
var { expect, jest } = require('@jest/globals');
const { mocked } = require('jest-mock');
const supertest = require('supertest');
var MockExpressResponse = require('mock-express-response');

var app;
var auth;

const reqUser = {
    email: "valid@email.com",
    password: "validPassword",
    name: "validName",
    role: "admin"
};

const reqUserAdmin = {
    user: {
        email: "valid@email.com",
        password: "validPassword",
        name: "validName",
        role: "admin"
    }
}

const reqUserEmployee = {
    user: {
        email: "valid@email.com",
        password: "validPassword",
        name: "validName",
        role: "employee"
    }
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

const ListUser = [
    {
        dataValues: {
            email: "a@email.com",
            name: "a",
            role: "employee",
        }
    },
    {
        dataValues: {
            email: "b@email.com",
            name: "b",
            role: "admin"
        }
    },
    {
        dataValues: {
            email: "c@email.com",
            name: "c",
            role: "admin"
        }
    }
];


var sandbox = sinon.createSandbox();
auth = require('../../services/auth.service');
sandbox.stub(auth, 'authenticateToken')
    .callsFake(function(req, res, next) {
        req.user = reqUser;
        
        return next();
    });
const makeApp = require('../../app');
app = makeApp();
const request = supertest(app);
const res = new MockExpressResponse();

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
        sandbox.restore();
        jest.resetAllMocks();
        jest.clearAllMocks();
        userSpy.mockClear();
    });

    afterAll(() => {
        process.exit;
    });
    
    describe("(C1): Create a User", () => {
        describe("(C1.1): given a valid user and JWT", () => {

            it("(C1.1.1): should respond with a 200 status code", async () => {
                userSpy = jest.spyOn(UserService, 'createUser')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(resUser);
                    }));

                const response = await supertest(app).post("/users")
                    .set("authorization", "Bearer validToken")
                    .send(reqUser);

                expect(response.status).toBe(200);
                expect(userSpy).toHaveBeenCalledTimes(1);
                expect(JSON.stringify(response.body)).toEqual(JSON.stringify(resUser));
                
            });
        });
    });

    describe("View all Users", () => {
        describe("Given a token passed", () => {
            it("Should respond with a 200 status code", async () => {
                userSpy = jest.spyOn(UserService, 'getAllUsers')
                .mockImplementation(() => new Promise(
                    (resolve) => {
                        resolve(ListUser);
                    }
                ));

                const response = await supertest(app).get("/users");

                expect(response.status).toBe(200);
                expect(userSpy).toHaveBeenCalledTimes(1);
                expect(JSON.stringify(response.body)).toEqual(JSON.stringify(ListUser));
            });

            it("Should respond with a 403 status code", async () => {
                let response = await UserController.findAll(reqUserEmployee, res);
                expect(response.statusCode).toBe(403);
            });

            it("Should respond with a 500 status code", async () => {
                userSpy = jest.spyOn(UserService, 'getAllUsers')
                // .mockRejectedValue({
                //     status: 500,
                //     data: {},
                //     error: {
                //         message: "some error occured"
                //     }
                // });
                .mockImplementation(async () => {
                    await Promise.reject({status: 500});
                });

                const response = await supertest(app).get("/users");
                //let response = await UserController.findAll(reqUserAdmin, res);
                expect(response.status).toBe(500);
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

    // describe("GET /users/", () => {
    //     describe("given no token is passed", () =>{
            
    //         it("should return 401", async () => {
    //             const response = await request.get("/users");
    //             expect(response.statusCode).toBe(401);
    //         });
            
    //     });

    //     describe("given a token is passed", () => {
    //         it("should return 200", async () => {
    //             const resp = await request.post("/users/authenticate").send({
    //                 email: "first@benoit-cote.com",
    //                 password: "verySecurePassword"
    //             });
    //             const aToken = resp.body.aToken;
    //             request.get("/users")
    //                 .set("authorization", `Bearer ${aToken}`)
    //                 .expect(200);
    //         });

    //         it("should return 403", async () => {
    //             const response = await request.get("/users").set("authorization", "Bearer aToken");
    //             expect(response.statusCode).toBe(403);
    //         });
    //     });

        
    // });

