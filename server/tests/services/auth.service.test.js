const makeApp = require('../../app');
const AuthService = require('../../services/auth.service');

var { expect, jest } = require('@jest/globals');
const supertest = require('supertest');

const app = makeApp();

const request = supertest(app);

const reqUser = {
    userId: "validUUID",
    email: "valid@email.com",
    password: "validPassword",
    name: "validName",
    role: "validRole",
    updatedAt: new Date("2020-12-20"),
    createdAt: new Date("2020-12-20")
}

describe("DELETE /users/logout", () => {
    describe("given no token in header", () =>{
        it("should return 403 Forbidden", async () =>{
            const response = await request.delete("/users/logout");
            expect(response.status).toBe(403);
        });
    });

    describe("given token in header", () => {

        AuthService.setRefreshTokens("test");
        it("should return 204 when valid token", async () => {
            const response = await request.delete("/users/logout")
                .set("authorization", `Bearer test`);
            expect(response.status).toBe(204);
        });

        it("should return 403 when invalid token", async () => {
            const response = await request.delete("/users/logout")
                .set("authorization", "Bearer invalidToken");
            expect(response.status).toBe(403);
        });
    });
});

describe("GET Tokens", () => {
    describe("given a user object", () => {

    });
});

describe("authenticateToken", () => {
    describe("given no token in header", () =>{
        it("should return 403 Forbidden", async () =>{
            const response = await request.get("/users");
            expect(response.status).toBe(403);
        });
    });

    describe("given token in header", () => {


    });
});