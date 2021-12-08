const supertest = require('supertest');
const SequelizeMock = require('sequelize-mock');
const makeApp = require('../app');

const createUser = jest.fn();
const getUsers = jest.fn();

const dbMock = new SequelizeMock();
const mysqldb = require('../data_access_layer/mysqldb');

const app = makeApp(mysqldb);

const request = supertest(app);


describe("Test API endpoints", () => {
    beforeAll(async () => {
        await mysqldb.sync();
    });

    describe("GET /api", () => {

        test("should respond with a 200 status code", async () => {
            const response = await request.get("/api");
            expect(response.statusCode).toBe(200);
        });
    
        test("should specify json in the context type header", async () => {
            const response = await request.get("/api");
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
        });
    
        test("response should have message", async () => {
            const response = await request.get("/api");
            expect(response.body.message).toBe("Hello from B&C Engine!");
        });
        
    });
    
    describe("POST /users", () => {
    
        describe("given an email and password", () => {
            test("should respond with a 200 status code", async () => {

                const response = await request.post("/users")
                    .send({email: 'test'});
                expect(response.statusCode).toBe(200);
            });
        });
    
        describe("given email or password is missing", () => {
            test("should respond with a 400 status code", async () => {
                const response = await request.post("/users");
                expect(response.statusCode).toBe(400);
                expect(response.body.message).toBe('Content cannot be empty.');
            });
        });
    });
    
    describe("POST /users/authenticate", () => {
    
        describe("given existing email and password", () => {
            test("should respond with 200 status code", async () => {
                const response = await request.post("/users/authenticate").send({
                    email: "first@benoit-cote.com",
                    password: "verySecurePassword"
                });
                expect(response.statusCode).toBe(200);
            });

            test("should return jwt access and refresh token", async () => {
                const response = await request.post("/users/authenticate").send({
                    email: "first@benoit-cote.com",
                    password: "verySecurePassword"
                });
                expect(response.body.aToken);
                expect(response.body.rToken);
            });
        });

        describe("given non existent email or wrong password", () => {
            test("should respond with 500 status code", async () => {
                const response = await request.post("/users/authenticate").send({
                    email: "first@benoit-cote.co",
                    password: "verySecurePassword"
                });
                expect(response.statusCode).toBe(500);
            });
            test("should respond with 500 status code", async () => {
                const response = await request.post("/users/authenticate").send({
                    email: "first@benoit-cote.com",
                    password: "verySecurePasswor"
                });
                expect(response.statusCode).toBe(500);
            });
        });

        describe("given the database is down", () => {
            test("should return 500 and message", async () => {
                await mysqldb.sequelize.drop();
                const response = await request.post("/users/authenticate").send({
                    email: "first@benoit-cote.com",
                    password: "verySecurePassword"
                });
                expect(response.statusCode).toBe(500);
                expect(response.body.message);
            });
        });

        describe("given no email", () => {
            test("should return 400 and message", async () => {
                await mysqldb.sequelize.drop();
                const response = await request.post("/users/authenticate").send({
                    
                    password: "verySecurePassword"
                });
                expect(response.statusCode).toBe(400);
                expect(response.body.message).toBe("Content cannot be empty.");
            });
        });
    
    });

    describe("GET /users/", () => {
        describe("given no token is passed", () =>{
            
            test("should return 401", async () => {
                const response = await request.get("/users");
                expect(response.statusCode).toBe(401);
            });
            
        });

        describe("given a token is passed", () => {
            test("should return 200", async () => {
                const resp = await request.post("/users/authenticate").send({
                    email: "first@benoit-cote.com",
                    password: "verySecurePassword"
                });
                const aToken = resp.body.aToken;
                request.get("/users")
                    .set("authorization", `Bearer ${aToken}`)
                    .expect(200);
            });

            test("should return 403", async () => {
                const response = await request.get("/users").set("authorization", "Bearer aToken");
                expect(response.statusCode).toBe(403);
            });
        });

        
    });

    describe("DELETE /users/logout", () => {
        test("should return 400 when no token", async () => {
            const response = await request.delete("/users/logout");
            expect(response.statusCode).toBe(400);
        });

        test("should return 204 when token", async () => {
            const response = await request.delete("/users/logout").send({token: "some token"})
            expect(response.statusCode).toBe(204);
        });
    });


});
