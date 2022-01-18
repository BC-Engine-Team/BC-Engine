const UserService = require('../../services/user.service');
const AuthService = require('../../services/auth.service');
const databases = require("../../data_access_layer/databases");
const UserModel = databases['localdb'].users;
const sinon = require("sinon");
var { expect, jest } = require('@jest/globals');

const reqUser = {
    email: "valid@email.com",
    password: "validPassword",
    name: "validName",
    role: "admin"
};

const resUserFromService = {
    dataValues: {
        email: "valid@email.com",
        name: "validName",
        role: "validRole"
    }
}

const userModelError = {
    message: "Error with the user model."
}

let sandbox = sinon.createSandbox();

let userModelSpy = jest.spyOn(UserModel, 'create');

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
                userModelSpy = jest.spyOn(UserModel, 'create')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(resUserFromService);
                    }));
                let expectedUser = {
                    email: resUserFromService.dataValues.email,
                    name: resUserFromService.dataValues.name,
                    role: resUserFromService.dataValues.role
                }
    
                // act
                const serviceResponse = await UserService.createUser(reqUser);
    
                // assert
                expect(serviceResponse).toEqual(expectedUser);
                expect(userModelSpy).toBeCalledTimes(1);
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
                userModelSpy = jest.spyOn(UserModel, 'findAll')
                .mockImplementation(() => new Promise(
                    (resolve) => {
                        resolve(ListUser);
                    }
                ));
    
                // act
                const serviceResponse = await UserService.getAllUsers();
                
                // assert
                expect(serviceResponse.length).toBe(listUserLength);
                expect(userModelSpy).toBeCalledTimes(1);
            });
        });
    });    
});

