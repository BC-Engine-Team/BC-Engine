const UserService = require('../../services/user.service');
const AuthService = require('../../services/auth.service');
const databases = require("../../data_access_layer/mysqldb");
const UserModel = databases['mysqldb'].users;

var { expect, jest } = require('@jest/globals');

const reqUser = {
    email: "valid@email.com",
    password: "validPassword",
    name: "validName",
    role: "admin"
};

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

