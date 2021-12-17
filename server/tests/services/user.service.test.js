const UserService = require('../../services/user.service');
const AuthService = require('../../services/auth.service');
const databases = require("../../data_access_layer/databases");
const UserModel = databases['mysqldb'].users;

const sinon = require("sinon");

var { expect, jest } = require('@jest/globals');

const reqUser = {
    email: "valid@email.com",
    password: "validPassword",
    name: "validName",
    role: "admin"
};

const ListUser = [
    {
        dataValues: {
            email: "a@email.com",
            name: "a",
            role: "employee",
        }
    },
    {
        dataValues: {
            email: "b@email.com",
            name: "b",
            role: "admin"
        }
    },
    {
        dataValues: {
            email: "c@email.com",
            name: "c",
            role: "admin"
        }
    }
];

const resUser = {
    dataValues: {
        userId: "validUUID",
        email: "valid@email.com",
        password: "validPassword",
        name: "validName",
        role: "validRole",
        updatedAt: new Date("2020-12-20"),
        createdAt: new Date("2020-12-20")
    }
}

const userModelError = {
    message: "Error with the user model."
}

describe("createUser", () => {

    beforeEach(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();

        sandbox = sinon.createSandbox();
        userCreateStub = sandbox.stub(UserModel, 'create');
    })

    afterEach(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
    })

    var userCreateStub;
    var sandbox;

    describe("given a valid user", () => {
        it("should return resolved promise with user information when user model works properly", async () => {
            // arrange
            let userModelSpy = jest.spyOn(UserModel, 'create')
                .mockImplementation(() => new Promise((resolve) => {
                    resolve(resUser);
                }));

            // act
            const serviceResponse = await UserService.createUser(reqUser);

            // assert
            expect(serviceResponse).toEqual({
                email: resUser.dataValues.email,
                name: resUser.dataValues.name,
                role: resUser.dataValues.role
            });
            expect(userModelSpy).toBeCalledTimes(1);
        })
    });
});

describe("View All Users", () => {
    describe("given a list of users", () => {
        it("Should return the full list of users with all their information", async() => {
            jest.spyOn(UserModel, 'findAll')
            .mockImplementation(() => new Promise(
                (resolve) => {
                    resolve(ListUser);
                }
            ));

            const serviceResponse = await UserService.getAllUsers();
            expect(serviceResponse.length).toBe(3);
        });
    });
});

