const UserService = require('../../services/user.service');
const AuthService = require('../../services/auth.service');
const UserDAO = require("../../data_access_layer/daos/user.dao");

const sinon = require("sinon");
var { expect, jest } = require('@jest/globals');

const listReqUserUnsorted = [
    {
        email: "Maab@email.com",
        password: "validPassword",
        name: "Maab bot",
        role: "admin"
    },
    {
        email: "Zigedon@email.com",
        password: "validPassword",
        name: "Zigedon bergeron",
        role: "admin"
    },
    {
        email: "Kevin@email.com",
        password: "validPassword",
        name: "Kevin Lola",
        role: "admin"
    },
    {
        email: "Maab@email.com",
        password: "validPassword",
        name: "Maab attention",
        role: "admin"
    }
]

const listReqUsersorted = [
    {
        email: "Kevin@email.com",
        password: "validPassword",
        name: "Kevin Lola",
        role: "admin"
    },
    {
        email: "Maab@email.com",
        password: "validPassword",
        name: "Maab attention",
        role: "admin"
    },
    {
        email: "Maab@email.com",
        password: "validPassword",
        name: "Maab bot",
        role: "admin"
    },
    {
        email: "Zigedon@email.com",
        password: "validPassword",
        name: "Zigedon bergeron",
        role: "admin"
    }
]

const reqUser = {
    email: "valid@email.com",
    password: "validPassword",
    name: "validName",
    role: "admin"
};

const resUserFromService = {
    email: "valid@email.com",
    name: "validName",
    role: "validRole"
}

const userDAOError = {
    message: "Error with the user model."
}

let sandbox = sinon.createSandbox();

let userDAOSpy = jest.spyOn(UserDAO, 'createUser');

describe("Test User Service", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        sandbox.restore();
    });

    afterAll(() => {
        process.exit;
    });

    describe("US1 - createUser", () => {        
    
        describe("US1.1 - given a valid user", () => {
            it("US1.1.1 - should return resolved promise with user information when user model works properly", async () => {
                // arrange
                userDAOSpy = jest.spyOn(UserDAO, 'createUser')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(resUserFromService);
                    }));
                let expectedUser = {
                    email: resUserFromService.email,
                    name: resUserFromService.name,
                    role: resUserFromService.role
                }
    
                // act
                const serviceResponse = await UserService.createUser(reqUser);
    
                // assert
                expect(serviceResponse).toEqual(expectedUser);
                expect(userDAOSpy).toBeCalledTimes(1);
            })
        });
    });
    
    describe("US2 - View All Users", () => {
        describe("US2.1 - given a list of users", () => {
            it("US2.1.1 - Should return the full list of users with all their information", async() => {
                // arrange
                let ListUser = [];
                const listUserLength = 3;
                for(let i = 0; i < listUserLength; i++){
                    ListUser.push(resUserFromService);
                }
                userDAOSpy = jest.spyOn(UserDAO, 'getAllUsers')
                .mockImplementation(() => new Promise(
                    (resolve) => {
                        resolve(ListUser);
                    }
                ));
    
                // act
                const serviceResponse = await UserService.getAllUsers();
                
                // assert
                expect(serviceResponse.length).toBe(listUserLength);
                expect(userDAOSpy).toBeCalledTimes(1);
            });

            it("US2.1.2 - Should return a full list of users which are sorted", async() => {
                userDAOSpy = jest.spyOn(UserDAO, 'getAllUsers')
                .mockImplementation(() => new Promise(
                    (resolve) => {
                        resolve(listReqUserUnsorted)
                    }
                ));

                const serviceResponse = await UserService.getAllUsers();

                expect(serviceResponse).toEqual(listReqUsersorted);
            })
        });
    });    
});

