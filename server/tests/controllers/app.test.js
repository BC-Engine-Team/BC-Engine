const makeApp = require('../../app');
app = makeApp();
const supertest = require('supertest');


describe("GET /api", () => {

    it("should respond with a 200 status code", async () => {
        const response = await supertest(app).get("/api");
        expect(response.status).toBe(200);
    });

    it("should specify json in the context type header", async () => {
        return supertest(app).get("/api")
            .then(res => expect(res.headers['content-type'])
            .toEqual(expect.stringContaining("json")));
    });

    it("response should have message", async () => {
        const response = await supertest(app).get("/api");
        expect(response.body.message).toBe("Hello from B&C Engine!");
    });
    
});