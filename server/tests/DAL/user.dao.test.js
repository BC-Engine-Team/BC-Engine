const { sequelize,
    dataTypes,
    checkModelName,
    checkPropertyExists,
    checkHookDefined
} = require('sequelize-test-helpers');

const [UserModel, ChartReportModel] = require('../../data_access_layer/models/localdb/localdb.model')(sequelize, dataTypes);
const UserDAO = require('../../data_access_layer/daos/user.dao');

let returnedUser = {
    userId: 1,
    email: 'myEmail@email.com',
    password: 'goodPassword1',
    name: 'myName',
    role: 'myRole'
}

let createdUser = {
    dataValues: {
        email: 'myEmail@email.com',
        name: 'myName',
        role: 'myRole'
    }
}

let listOfUsers = [
    {
        dataValues: {
            email: 'myEmail@email.com',
            name: 'myName',
            role: 'myRole'
        }
    },
    {
        dataValues: {
            email: 'myEmail@email.com',
            name: 'myName',
            role: 'myRole'
        }
    }
]

let SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();
var UserMock = dbMock.define('users', returnedUser);

describe("Test User DAL", () => {
    const instance = new UserModel();

    afterEach(() => {
        UserMock.$queryInterface.$clearResults();
    })

    beforeEach(() => {
        UserMock.$queryInterface.$clearResults();
    })

    // testing the user model properties
    checkModelName(UserModel)('users');
    ['userId', 'email', 'password', 'name', 'role']
        .forEach(checkPropertyExists(instance));
    ['beforeCreate', 'beforeUpdate'].forEach(checkHookDefined(instance));

    describe("UD1 - getUserByEmail", () => {
        it("UD1.1 - should return user when existing email", async () => {
            // act
            const user = await UserDAO.getUserByEmail("myEmail@email.com", UserMock);

            // assert
            expect(user.name).toBe("myName");
            expect(user.userId).toBe(1);
            expect(user.email).toBe("myEmail@email.com");
            expect(user.password).toBe("goodPassword1");
            expect(user.role).toBe("myRole");
        });

        it("UD1.2 - should return false when non existent email", async () => {
            // arrange
            UserMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                return Promise.resolve(false);
            })

            // act
            const resp = await UserDAO.getUserByEmail("no@email.com", UserMock);

            // assert
            expect(resp).toBeFalsy();
        });

        it("UD1.3 - should catch error thrown by user model", async () => {
            // arrange
            UserMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                return new Error("Error with the UserModel.");
            });

            // act and assert
            const response = await UserDAO.getUserByEmail("", UserMock);

            // assert
            expect(response.message).toEqual("Error with the UserModel.");

        });

        it("UD1.4 - Should reject error with 500 status and predefined message when model does not define them", async () => {
            // arrange
            let expectedError = {
                status: 500,
                message: "some error occured"
            };

            UserMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                return Promise.reject({});
            });

            // act and assert
            await expect(UserDAO.getUserByEmail("", UserMock)).rejects
                .toEqual(expectedError);
        });
    });

    describe("UD2 - createUser", () => {
        it("UD2.1 - should return created user when valid", async () => {
            // arrange
            UserMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                return Promise.resolve(createdUser);
            });

            // act
            const resp = await UserDAO.createUser(returnedUser, UserMock);

            // assert
            expect(resp.email).toBe(returnedUser.email);
        });

        it("UD2.2 - should catch error thrown by the User Model with custom message", async () => {
            // arrange
            let mock = { create: () => { return Promise.reject({ message: "Error with the User Model." }) } }

            // act and assert
            await expect(UserDAO.createUser(returnedUser, mock)).rejects
                .toEqual({
                    data: {},
                    message: "Error with the User Model.",
                    status: 500
                });
        });

        it("UD2.3 - should resolves false", async () => {
            // arrange
            let mock = { create: () => { return Promise.resolve(false) } }

            // act and assert
            await expect(UserDAO.createUser(returnedUser, mock)).resolves
                .toEqual(false);
        });

        it("UD2.4 - should catch error thrown by the User Model with default message", async () => {
            // arrange
            let mock = { create: () => { return Promise.reject({}) } }

            // act and assert
            await expect(UserDAO.createUser(returnedUser, mock)).rejects
                .toEqual({
                    data: {},
                    message: "some error occured",
                    status: 500
                });
        });
    });

    describe("UD3 - getAllUsers", () => {
        it("UD3.1 - should return list of users", async () => {
            // arrange
            UserMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                return Promise.resolve(listOfUsers);
            });

            // act
            const resp = await UserDAO.getAllUsers(UserMock);

            // assert
            expect(resp.length).toBe(2);
        });

        it("UD3.2 - should return false when User Model rejects with false", async () => {
            // arrange
            UserMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                return Promise.resolve(false);
            });

            // act
            const resp = await UserDAO.getAllUsers(UserMock);

            // assert
            expect(resp).toBeFalsy();
        });

        it("UD3.3 - should catch error thrown by the User Model", async () => {
            // arrange
            UserMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                return Promise.reject(new Error("Error with the User Model."));
            });

            // act
            await UserDAO.getAllUsers(UserMock).catch(err => {
                // assert
                expect(err.message).toBe("Error with the User Model.");
            });
        });

        it("UD3.4 - should catch error thrown by the User Model with default message", async () => {
            // arrange
            UserMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                return Promise.reject(new Error());
            });

            // act
            await UserDAO.getAllUsers(UserMock).catch(err => {
                // assert
                expect(err.message).toBe("some error occured");
            });
        });
    });

    describe("UD4 - updateUser", () => {
        it("UD4.1 - should return successful update message", async () => {
            // arrange
            UserMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                return Promise.resolve(true);
            });

            // act
            const resp = await UserDAO.updateUser(returnedUser, UserMock);

            // assert
            expect(resp).toBe("User modified successfully.");
        });

        it("UD4.2 - should return unsuccessful update message when UserModel resolves false", async () => {
            // arrange
            UserMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                return Promise.resolve(false);
            })

            // act
            const resp = await UserDAO.updateUser(returnedUser, UserMock);

            // assert
            expect(resp).toBe("User was not updated.");
        });

        it("UD4.3 - should catch error thrown by the User Model", async () => {
            // arrange
            UserMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                return Promise.reject(new Error("Error with the User Model."));
            });

            // act
            await UserDAO.updateUser(returnedUser, UserMock).catch(err => {
                // assert
                expect(err.message).toBe("Error with the User Model.");
            });
        });

        it("UD3.4 - should catch error thrown by the User Model with default message", async () => {
            // arrange
            UserMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                return Promise.reject(new Error());
            });

            // act
            await UserDAO.updateUser(returnedUser, UserMock).catch(err => {
                // assert
                expect(err.message).toBe("some error occured");
            });
        });
    });

    describe("UD5 - deleteUser", () => {
        it("UD5.1 - should return successful delete message", async () => {
            // arrange
            UserMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                return Promise.resolve(true);
            });

            // act
            const resp = await UserDAO.deleteUser("myEmail@email.com", UserMock);

            // assert
            expect(resp).toBe("User deleted successfully.");
        });

        it("UD5.2 - should return false when non existent email", async () => {
            // arrange
            UserMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                return Promise.resolve(false);
            })

            // act
            const resp = await UserDAO.deleteUser("no@email.com", UserMock);

            // assert
            expect(resp).toBe("User has failed to be deleted.");
        });

        it("UD5.3 - Should reject error with 500 status and predefined message when model does not define them", async () => {
            // arrange
            let expectedError = {
                status: 500,
                message: "some error occured"
            };

            UserMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                return Promise.reject({});
            });

            // act and assert
            await expect(UserDAO.deleteUser("", UserMock)).rejects
                .toEqual(expectedError);
        });
    });
});