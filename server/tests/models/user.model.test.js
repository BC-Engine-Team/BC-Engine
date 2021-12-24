 const {sequelize,
        dataTypes,
        checkModelName,
        checkPropertyExists,
        checkHookDefined
    } = require('sequelize-test-helpers');

const UserModel = require('../../data_access_layer/models/mysql/user.model');
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
const { SequelizeScopeError } = require('sequelize/dist');
const dbMock = new SequelizeMock();
var UserMock = dbMock.define('users', returnedUser);
// UserMock.$queryInterface.$useHandler(function(query, queryOptions, done){
//     if(query === "findOne"){
//         if(queryOptions[0].where.user_email === "myEmail@email.com"){
//             return Promise.resolve(returnedUser);
//         }
//         else if(queryOptions[0].where.user_email === "no@email.com"){
//             return Promise.resolve(false);
//         }
//         else{
//             return new Error("Error with the UserModel.");
//         }
//     }
//     // else if(query === "create"){
//     //     if(queryOptions[0].email){
//     //         return Promise.resolve(createdUser);
//     //     }
//     // }
//     else if(query === "update"){

//     }
//     else if(query === "destroy"){

//     }
//     else if(query === "findAll"){
//         return Promise.resolve(listOfUsers);
//     }
// });

describe("Test User DAL", () => {
    const Model = UserModel(sequelize, dataTypes);
    const instance = new Model();


    afterEach(() => {
        UserMock.$queryInterface.$clearResults();
    })

    // testing the user model properties
    checkModelName(Model)('users');
    ['userId', 'email', 'password', 'name', 'role']
        .forEach(checkPropertyExists(instance));
    ['beforeCreate', 'beforeUpdate'].forEach(checkHookDefined(instance));

    describe("findOne", () => {
        it("should return user when existing email", async () => {
            const user = await UserDAO.getUserByEmail(UserMock, "myEmail@email.com");
            expect(user.name).toBe("myName");
            expect(user.userId).toBe(1);
            expect(user.email).toBe("myEmail@email.com");
            expect(user.password).toBe("goodPassword1");
            expect(user.role).toBe("myRole");
        });

        it("should return false when non existent email", async () => {
            UserMock.$queryInterface.$useHandler(function(query, queryOptions, done){
                return Promise.resolve(false);
            })
            const resp = await UserDAO.getUserByEmail(UserMock, "no@email.com");
            expect(resp).toBeFalsy();
        });

        it("should catch error thrown by user model", async () => {
            UserMock.$queryInterface.$useHandler(function(query, queryOptions, done){
                return new Error("Error with the UserModel.");
            })
            const resp = await UserDAO.getUserByEmail(UserMock, "");
            expect(resp.message).toBe("Error with the UserModel.");
        });
    });

    describe("create", () => {
        it("should return created user when valid", async () => {
            UserMock.$queryInterface.$useHandler(function(query, queryOptions, done){
                return Promise.resolve(createdUser);
            })
            const resp = await UserDAO.createUser(UserMock, returnedUser);
            expect(resp.email).toBe(returnedUser.email);
        });

        it("should return false when UserModel rejects with false", async () => {
            UserMock.$queryInterface.$useHandler(function(query, queryOptions, done){
                return Promise.resolve(false);
            })
            const resp = await UserDAO.createUser(UserMock, returnedUser);
            expect(resp).toBeFalsy();
        });

        it("should catch error thrown by UserModel", async () => {
            UserMock.$queryInterface.$useHandler(function(query, queryOptions, done){
                return new Error("Error with the UserModel.");
            });
            const resp = await UserDAO.createUser(UserMock, returnedUser);
            expect(resp.message).toBe("Error with the UserModel.");
        });
    });

    describe("findAll", () => {
        it("should return list of users", async () => {
            UserMock.$queryInterface.$useHandler(function(query, queryOptions, done){
                return Promise.resolve(listOfUsers);
            })
            const resp = await UserDAO.getAllUsers(UserMock);
            expect(resp.length).toBe(2);
        });
    });

    
});