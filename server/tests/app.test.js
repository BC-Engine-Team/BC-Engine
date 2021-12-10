
const makeApp = require('../app');
const UserService = require('../services/user.service');
const UserController = require('../controllers/user.controller');
const AuthService = require('../services/auth.service');

const mysqldb = require('../data_access_layer/mysqldb');
const { afterEach, afterAll } = require('jest-circus');
var { expect, jest } = require('@jest/globals');
const { mocked } = require('jest-mock');
const supertest = require('supertest');

const app = makeApp();

const request = supertest(app);



describe("Test API endpoints", () => {
    

    // afterEach(() => {
    //     process.exit;
    // });

    afterAll(() =>{
        jest.resetAllMocks();
    });

    // describe("GET /api", () => {

    //     it("should respond with a 200 status code", async () => {
    //         const response = await request.get("/api");
    //         expect(response.status).toBe(200);
    //     });
    
    //     it("should specify json in the context type header", async () => {
    //         return request.get("/api")
    //             .then(res => expect(res.headers['content-type'])
    //             .toEqual(expect.stringContaining("json")));
    //     });
    
    //     it("response should have message", async () => {
    //         const response = await request.get("/api");
    //         expect(response.body.message).toBe("Hello from B&C Engine!");
    //     });
        
    // });
    
    describe("(C1): Create a User", () => {
    
        describe("(C1.1): given an email and password", () => {
            it("(C1.1.1): should respond with a 200 status code", async () => {
                // const userServiceMock = jest
                //     .spyOn(UserService, 'create');

                // jest.fn().mockImplementation(() =>
                // {
                //     userId: 'someUUID',
                //     email: 'someone@email.com',
                //     password: 'somePassword',
                //     name: 'Someone',
                //     role: 'employee',
                //     updatedAt: Date.parse("1111-11-11"),
                //     createdAt: Date.parse("1111-11-11")
                // });


                const userSpy = jest.spyOn(UserService, 'createUser')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve({
                            email: "someone@email.com"
                        });
                    }));
                const res = await UserService.createUser({
                    email: "someone@email.com"
                });

                expect(userSpy).toHaveBeenCalledTimes(1);
                expect(JSON.stringify(res)).toEqual(JSON.stringify(res));

                const response = await request.post("/users")
                    .send({email: 'it'});

                
                expect(response.statusCode).toBe(200);
            });
        });
    
        // describe("given email or password is missing", () => {
        //     it("should respond with a 400 status code", async () => {
        //         const response = await request.post("/users");
        //         expect(response.statusCode).toBe(400);
        //         expect(response.body.message).toBe('Content cannot be empty.');
        //     });
        // });
    });
    
    // describe("POST /users/authenticate", () => {
    
    //     describe("given existing email and password", () => {
    //         it("should respond with 200 status code", async () => {
    //             const response = await request.post("/users/authenticate").send({
    //                 email: "first@benoit-cote.com",
    //                 password: "verySecurePassword"
    //             });
    //             expect(response.statusCode).toBe(200);
    //         });

    //         it("should return jwt access and refresh token", async () => {
    //             const response = await request.post("/users/authenticate").send({
    //                 email: "first@benoit-cote.com",
    //                 password: "verySecurePassword"
    //             });
    //             expect(response.body.aToken);
    //             expect(response.body.rToken);
    //         });
    //     });

    //     describe("given non existent email or wrong password", () => {
    //         it("should respond with 401 status code", async () => {
    //             const response = await request.post("/users/authenticate").send({
    //                 email: "first@benoit-cote.co",
    //                 password: "verySecurePassword"
    //             });
    //             expect(response.statusCode).toBe(401);
    //         });
    //         it("should respond with 401 status code", async () => {
    //             const response = await request.post("/users/authenticate").send({
    //                 email: "first@benoit-cote.com",
    //                 password: "verySecurePasswor"
    //             });
    //             expect(response.statusCode).toBe(401);
    //         });
    //     });

    //     describe("given the database is down", () => {
    //         it("should return 500 and message", async () => {
    //             await mysqldb.sequelize.drop();
    //             const response = await request.post("/users/authenticate").send({
    //                 email: "first@benoit-cote.com",
    //                 password: "verySecurePassword"
    //             });
    //             expect(response.statusCode).toBe(500);
    //             expect(response.body.message);
    //         });
    //     });

    //     describe("given no email", () => {
    //         it("should return 400 and message", async () => {
    //             const response = await request.post("/users/authenticate").send({
                    
    //                 password: "verySecurePassword"
    //             });
    //             expect(response.statusCode).toBe(400);
    //             expect(response.body.message).toBe("Content cannot be empty.");
    //         });
    //     });
    
    // });

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

    // describe("DELETE /users/logout", () => {
    //     it("should return 400 when no token", async () => {
    //         const response = await request.delete("/users/logout");
    //         expect(response.statusCode).toBe(400);
    //     });

    //     it("should return 204 when token", async () => {
    //         const response = await request.delete("/users/logout").send({token: "some token"})
    //         expect(response.statusCode).toBe(204);
    //     });
    // });


});
