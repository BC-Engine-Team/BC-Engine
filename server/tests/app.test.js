const supertest = require('supertest');
const SequelizeMock = require('sequelize-mock');
const makeApp = require('../app');

const createUser = jest.fn();
const getUsers = jest.fn();

const dbMock = new SequelizeMock();

const app = makeApp();

const request = supertest(app);

// Example test
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

describe("POST /api/users", () => {

    describe("given an email and password", () => {
        test("should respond with a 200 status code", async () => {
            const response = await request.post("/api/users")
                .send({email: 'test'});
            expect(response.statusCode).toBe(200);
        });
    });

    describe("given email or password is missing", () => {
        test("should respond with a 400 status code", async () => {
            const response = await request.post("/api/users");
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe('Content cannot be empty.');
        });
    });

    
    
});