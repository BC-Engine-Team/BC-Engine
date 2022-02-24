const ManageService = require('../../services/manage.service')
const { afterAll } = require('jest-circus');
var { expect, jest } = require('@jest/globals');
const AuthService = require('../../services/auth.service');
const supertest = require('supertest');

let reqUser = {
    email: "valid@benoit-cote.com",
    password: "validPassword1",
    name: "validName",
    role: "admin"
};

let clientsList = [
    {
        nameId: 24505,
        name: "CompanyName",
        country: "Canada",
        grading: "A+"
    },
    {
        nameId: 25641,
        name: "CompanyName",
        country: "Canada",
        grading: "B"
    }
]

let ManageServiceSpy = jest.spyOn(ManageService, 'getAllClients')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(clientsList);
    }));

let authSpy = jest.spyOn(AuthService, 'authenticateToken')
    .mockImplementation(function (req, res, next) {
        req.user = reqUser;
        return next();
    });

const makeApp = require('../../app');
let app = makeApp();
const request = supertest(app);

describe("Test Manage Controller", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        process.exit;
    });

    describe("MC1 - getAllClients", () => {
        it("MC1.1 - should respond with a 200 status code", async () => {
            //arrange
            ManageServiceSpy = jest.spyOn(ManageService, 'getAllClients')
                .mockImplementation(() => new Promise((resolve) => {
                    resolve(clientsList);
                }));

            // act
            const response = await request.get("/api/manage/clients")
                .send(reqUser);

            // assert
            expect(response.status).toBe(200);
            expect(ManageServiceSpy).toHaveBeenCalledTimes(1);
            expect(authSpy).toHaveBeenCalledTimes(1);
        });

        it("MC1.1 - should respond with a 500 status code when no data is returned from the manage service", async () => {
            //arrange
            ManageServiceSpy = jest.spyOn(ManageService, 'getAllClients')
                .mockImplementation(() => new Promise((resolve) => {
                    resolve();
                }));

            // act
            const response = await request.get("/api/manage/clients")
                .send(reqUser);

            // assert
            expect(response.status).toBe(500);
            expect(ManageServiceSpy).toHaveBeenCalledTimes(1);
            expect(authSpy).toHaveBeenCalledTimes(1);
        });

        it("MC1.3 - should return with specified status code and message when manage service throws error", async () => {
            //arrange
            ManageServiceSpy = jest.spyOn(ManageService, 'getAllClients')
                .mockImplementation(async () =>  {
                    await Promise.reject({ status: 600 });
                });

            // act
            const response = await request.get("/api/manage/clients")
                .send(reqUser);

            // assert
            expect(response.status).toBe(600);
            expect(ManageServiceSpy).toHaveBeenCalledTimes(1);
            expect(authSpy).toHaveBeenCalledTimes(1);
        });

        it("MC1.4 - should return with default status code and message when manage service throws error", async () => {
            //arrange
            ManageServiceSpy = jest.spyOn(ManageService, 'getAllClients')
                .mockImplementation(async () =>  {
                    await Promise.reject({});
                });

            // act
            const response = await request.get("/api/manage/clients")
                .send(reqUser);

            // assert
            expect(response.status).toBe(500);
            expect(ManageServiceSpy).toHaveBeenCalledTimes(1);
            expect(authSpy).toHaveBeenCalledTimes(1);
        });
    });
});
