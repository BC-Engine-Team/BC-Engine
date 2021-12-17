const UserService = require('../../services/user.service');
const AuthService = require('../../services/auth.service');
const EmpService = require('../../services/emp.service');
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
    email: "valid@benoit-cote.com",
    password: "validPassword",
    name: "validName",
    role: "admin"
};

const reqEmp = {
    email: "emp@benoit-cote.com",
    firstName: "FName",
    lastName: "LName"
}
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


//this is all the modified user test data
const modifiedUser = {
    email: "first@benoit-cote.com",
    password: "validPassword",
    role: "employee"
};

const modifiedUserInvalid = {
    email: "",
    password: "validPassword",
    role: "admin"
}


//this is all the delete user test data
const deletedUser = {
    email: "first@benoit-cote.com"
}

const deletedUserInvalid = {
    email: "sss"
}



let sandbox = sinon.createSandbox();
let authStub = sandbox.stub(AuthService, 'authenticateToken')
    .callsFake(function(req, res, next){
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
                .mockImplementation(async () => {
                    await Promise.reject({status: 500});
                });

                const response = await supertest(app).get("/users");
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



    describe("(C3): Modify a User)", () => {

        const expectedUserToModifyValid = {
            email: modifiedUser.email,
            password: modifiedUser.password,
            role: modifiedUser.role
        };
        

        describe("(C3.1): given user is authenticated and that entries are valid", ()  =>{
            it("(C3.1.1): should respond with a 200 status code with a modified user", async () => {

                userSpy = jest.spyOn(UserService, "modifyUser")
                .mockImplementation(() => new Promise((resolve) => {
                    resolve(expectedUserToModifyValid);
                }));

                const response = await supertest(app).put(`/users/modify/${modifiedUser.email}`)
                .set("authorization", "Bearer validToken")
                .send(expectedUserToModifyValid);

                expect(response.status).toBe(200);
                expect(userSpy).toHaveBeenCalledTimes(1);
                expect(authStub.called).toBeTruthy();
                expect(empStub.called).toBeTruthy();
                expect(JSON.stringify(response.body)).toEqual(JSON.stringify(expectedUserToModifyValid));
            });
        });


        describe("(C3.2) given user is authenticated but email is invalid", () => {
             it("(C3.2.1): should respond with a 400 response message", async () => {

                let expectedUserToModifyInvalid = {
                    email: "ssssss",
                    password: modifiedUserInvalid.password,
                    role: modifiedUserInvalid.role
                }

                userSpy = jest.spyOn(UserService, "modifyUser")
                .mockImplementation(() => new Promise((resolve) => {
                    resolve(expectedUserToModifyInvalid);
                }));

                const response = await supertest(app).put(`/users/modify/${expectedUserToModifyInvalid.email}`)
                .set("authorization", "Bearer validToken")
                .send(modifiedUserInvalid);

                expect(response.status).toBe(400);
                expect(userSpy).toHaveBeenCalledTimes(0);
                expect(authStub.called).toBeTruthy();
                expect(empStub.called).toBeTruthy();
             });
        });

        describe("(C3.3) given I try to modify the user but I am not authorized", () => {
            it("Should respond with a 403 status code", async () => {
                let response = await UserController.modifyUser(reqUserEmployee, res);
                expect(response.statusCode).toBe(403);
            });
        });


        describe("(C3.4) given I try to call the modifyUser service but the modifyUser service sends an error", () => {
            it("Should respond with a 500 response message", async () => {
                let expectedUserToModify = {
                    email: "first@benoit-cote.com",
                    password: modifiedUserInvalid.password,
                    role: modifiedUserInvalid.role
                }

                userSpy = jest.spyOn(UserService, "modifyUser")
                .mockImplementation(() => new Promise((resolve) => {
                    resolve(expectedUserToModifyInvalid);
                }));


                const response = await supertest(app).put(`/users/modify/${expectedUserToModify.email}`)
                .set("authorization", "Bearer validToken")
                .send(expectedUserToModify);


                expect(response.status).toBe(500);
                expect(userSpy).toHaveBeenCalledTimes(1);
                expect(authStub.called).toBeTruthy();
                expect(empStub.called).toBeTruthy();
            })
        });
    });





    describe("(C4): Delete a User)", () => {

        describe("(C4.1): given user is authenticated and that the email is valid", ()  =>{
            it("(C4.1.1): should respond with a 200 status code with a deleted user", async () => {

                userSpy = jest.spyOn(UserService, "deleteUser")
                .mockImplementation(() => new Promise((resolve) => {
                    resolve(deletedUser);
                }));

                const response = await supertest(app).delete(`/users/delete/${deletedUser.email}`)
                .set("authorization", "Bearer validToken")
                .send(deletedUser);

                expect(response.status).toBe(200);
                expect(userSpy).toHaveBeenCalledTimes(1);
                expect(authStub.called).toBeTruthy();
                expect(empStub.called).toBeTruthy();
                expect(JSON.stringify(response.body)).toEqual(JSON.stringify(deletedUser));
            });
        });

        describe("(C4.2) given I try to delete the user but I am not authorized", () => {
            it("Should respond with a 403 status code", async () => {
                let response = await UserController.deleteUser(reqUserEmployee, res);
                expect(response.statusCode).toBe(403);
            });
        });
        
    });

});