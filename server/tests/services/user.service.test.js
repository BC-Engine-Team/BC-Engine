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


const modifiedUser = {
    email: "first@benoit-cote.com",
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




// describe("Modify specific user", () => {
//     describe("Given I want to modify a user", () => {
//         it("Should return the modified user with his informations", async() => {

//             jest.spyOn(UserModel, 'deleteUser')
//             .mockImplementation(() => new Promise(
//                 (resolve) => {
//                     resolve(modifiedUser);
//                 }
//             ));

//             const serviceResponse = await UserService.modifyUser(modifiedUser);


//             expect(serviceResponse).toEqual({
//                 password: modifiedUser.dataValues.name,
//                 role: modifiedUser.dataValues.role
//             });
//         });
//     });
// });

