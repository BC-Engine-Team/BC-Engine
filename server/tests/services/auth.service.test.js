const makeApp = require('../../app');
const AuthService = require('../../services/auth.service');
const UserService = require('../../services/user.service');
const jwt = require('jsonwebtoken');

var { expect, jest } = require('@jest/globals');
const supertest = require('supertest');

const app = makeApp();

const request = supertest(app);

const resUser = {
    userId: "validUUID",
    email: "valid@email.com",
    password: "validPassword",
    name: "validName",
    role: "admin",
    updatedAt: new Date("2020-12-20"),
    createdAt: new Date("2020-12-20")
};

const reqUser = {
    email: "valid@email.com",
    password: "validPassword",
    name: "validName",
    role: "admin"
};

describe("Test Authentication Service", () => {

    describe("AS1 - refreshToken", () => {
        describe("AS1.1 - given no token in header", () =>{

            it("AS1.1.1 - should return 403 Forbidden", async () =>{
                const response = await request.delete("/users/logout");
                expect(response.status).toBe(403);
            });
        });
    
        describe("AS.2 - given token in header", () => {
    
            AuthService.setRefreshTokens("test");
            it("AS2.1 - should return 204 when valid token", async () => {
                const response = await request.delete("/users/logout")
                    .set("authorization", `Bearer test`);
                expect(response.status).toBe(204);
            });
    
            it("AS2.2 - should return 403 when invalid token", async () => {
                const response = await request.delete("/users/logout")
                    .set("authorization", "Bearer invalidToken");
                expect(response.status).toBe(403);
            });
        });
    });
    
    
    describe("AS2 - authenticateToken", () => {
    
        beforeEach(() => {
            jest.clearAllMocks();
        });
    
        describe("AS2.1 - given no token in header", () =>{
            it("AS2.1.1 - should return 403 Forbidden", async () =>{
                const response = await request.get("/users");
                expect(response.status).toBe(403);
            });
        });
    
        describe("AS2.2 - given valid token in header", () => {
    
            it("AS2.2.1 - should return 200 OK", async () => {
                const userSpy = jest.spyOn(UserService, 'getAllUsers')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(resUser);
                    }));
    
                const [aToken, rToken] = AuthService.getTokens(resUser);
    
                const resp = await request.get("/users")
                    .set("authorization", `Bearer ${aToken}`);
                
                expect(resp.statusCode).toBe(200);
            });
    
        });
    
        describe("AS2.3 - given invalid token in header", () =>{
            it("AS2.3.1 - should return 401 Unauthorized", async () =>{
                const response = await request.get("/users")
                    .set("authorization", `Bearer invalidToken`);
                expect(response.status).toBe(401);
            });
            it("AS2.3.2 - should return 403 Forbidden", async () =>{
                const response = await request.get("/users")
                    .set("authorization", `invalidToken`);
                expect(response.status).toBe(403);
            });
        });
    });
    
    describe("AS3 - getTokens", () => {
        describe("AS3.1 - given a valid user", () => {
            it("AS3.1.1 - should return access and refresh token for given user", () => {
                const [aToken, rToken] = AuthService.getTokens(reqUser);
        
                const aTokenPayload = jwt.decode(aToken);
                const rTokenPayload = jwt.decode(rToken);
        
                expect(aTokenPayload.email).toBe(reqUser.email);
                expect(aTokenPayload.name).toBe(reqUser.name);
                expect(aTokenPayload.password).toBe(reqUser.password);
                expect(aTokenPayload.role).toBe(reqUser.role);
                expect(aTokenPayload.iat);
                expect(aTokenPayload.exp);
        
                expect(rTokenPayload.email).toBe(reqUser.email);
                expect(rTokenPayload.name).toBe(reqUser.name);
                expect(rTokenPayload.password).toBe(reqUser.password);
                expect(rTokenPayload.role).toBe(reqUser.role);
                expect(rTokenPayload.iat);
                expect(rTokenPayload.exp);
            });
        });

        describe("AS3.2 - given invalid user", () => {

        });
        
    });
});

