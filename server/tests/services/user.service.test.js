const UserService = require('../../services/user.service');
const AuthService = require('../../services/auth.service');
const mysqldb = require("../../data_access_layer/mysqldb");
const UserModel = mysqldb.users;

var { expect, jest } = require('@jest/globals');

const reqUser = {
    email: "valid@email.com",
    password: "validPassword",
    name: "validName",
    role: "admin"
};

const ListUser = 
    [
        {dataValues: {
            email: "a@email.com",
            name: "a",
            role: "employee",
        }},
        {dataValues:{
            email: "b@email.com",
            name: "b",
            role: "admin"
        }},
        {dataValues:{
            email: "c@email.com",
            name: "c",
            role: "admin"
        }}
    ]


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

describe("createUser", () => {
    describe("given a valid user", () => {
        it("should return resolved promise with user information", async () => {
            const userSpy = jest.spyOn(UserModel, 'create')
                .mockImplementation(() => new Promise((resolve) => {
                    resolve(resUser);
                }));
            const serviceResponse = await UserService.createUser(reqUser);
            expect(serviceResponse).toEqual({
                email: resUser.dataValues.email,
                name: resUser.dataValues.name,
                role: resUser.dataValues.role
            });
        })
    });
});

describe("View All Users", () => {
    describe("given a list of users", () => {
        it("Should return the full list of user with all their information", async() => {
            const userSpy = jest.spyOn(UserModel, 'findAll')
            .mockImplementation(() => new Promise((resolve) => {
                resolve(ListUser);
            }));
            const serviceResponse = await UserService.getAllUsers();
            console.log(serviceResponse)
            expect(serviceResponse.length).toBe(3);
        });
    });
});

