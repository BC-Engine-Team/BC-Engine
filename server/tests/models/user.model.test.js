 const {sequelize,
        dataTypes,
        checkModelName,
        checkPropertyExists,
        checkHookDefined
    } = require('sequelize-test-helpers');

const UserModel = require('../../data_access_layer/models/mysql/user.model');

returnedUser = {
    userId: 1,
    email: 'myEmail@email.com',
    password: 'goodPassword1',
    name: 'myName',
    role: 'myRole'
}

let SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();
var UserMock = dbMock.define('users', {
    userId: 1,
    email: 'myEmail@email.com',
    password: 'goodPassword1',
    name: 'myName',
    role: 'myRole'
});

UserMock.$queryInterface.$useHandler(function(query, queryOptions, done){
    if(query === "findOne"){
        console.log("in findOne handler");
        if(queryOptions[0].where.email === "myEmail@email.com"){
            
            return Promise.resolve(returnedUser);
        }
        else{
            return Promise.resolve(false);
        }
    }
})

var proxyquire = require('proxyquire');
let databases = proxyquire('../../data_access_layer/databases', {
    'data_access_layer/models/mysql/user.model': UserMock
});



let UserDAO = proxyquire('../../data_access_layer/daos/user.dao', {
    'data_access_layer/models/mysql/user.model': UserMock
});

describe("Test User Model", () => {
    const Model = UserModel(sequelize, dataTypes);
    const instance = new Model()

    checkModelName(Model)('users');
    ['userId', 'email', 'password', 'name', 'role']
        .forEach(checkPropertyExists(instance));
    ['beforeCreate', 'beforeUpdate'].forEach(checkHookDefined(instance));


    
    

    // jest.mock('../../data_access_layer/models/mysql/user.model', () => {
    //     let SequelizeMock = require('sequelize-mock');
    //     const dbMock = new SequelizeMock();
    //     return dbMock.define('users', {
    //         userId: 1,
    //         email: 'myEmail@email.com',
    //         password: 'goodPassword1',
    //         name: 'myName',
    //         role: 'myRole'
    //     });
    // });

    
    // beforeEach(() => {
    //     jest.clearAllMocks();
    // })

    describe("findOne", () => {
        it("should return user when existing email", async () => {
            const user = await UserDAO.getUserByEmail("myEmail@email.com");
            expect(user.name).toBe("myName");
            expect(user.userId).toBe(1);
            expect(user.email).toBe("myEmail@email.com");
            expect(user.password).toBe("goodPassword1");
            expect(user.role).toBe("myRole");
        });

        it("should return false when non existent email", async () => {
            const resp = await UserDAO.getUserByEmail("bop@email.ca");
            expect(resp).toBeFalsy();
        })
    })

    
});