const UserService = require('../../services/user.service')
const UserDAO = require('../../data_access_layer/daos/user.dao')

const sinon = require('sinon')
const { expect } = require('@jest/globals')

const listReqUserUnsorted = [
  {
    email: 'Maab@email.com',
    password: 'validPassword',
    name: 'Maab bot',
    role: 'admin'
  },
  {
    email: 'Zigedon@email.com',
    password: 'validPassword',
    name: 'Zigedon bergeron',
    role: 'admin'
  },
  {
    email: 'Kevin@email.com',
    password: 'validPassword',
    name: 'Kevin Lola',
    role: 'admin'
  },
  {
    email: 'Maab@email.com',
    password: 'validPassword',
    name: 'Maab attention',
    role: 'admin'
  }
]

const listReqUsersorted = [
  {
    email: 'Kevin@email.com',
    password: 'validPassword',
    name: 'Kevin Lola',
    role: 'admin'
  },
  {
    email: 'Maab@email.com',
    password: 'validPassword',
    name: 'Maab attention',
    role: 'admin'
  },
  {
    email: 'Maab@email.com',
    password: 'validPassword',
    name: 'Maab bot',
    role: 'admin'
  },
  {
    email: 'Zigedon@email.com',
    password: 'validPassword',
    name: 'Zigedon bergeron',
    role: 'admin'
  }
]

const reqUser = {
  email: 'valid@email.com',
  password: 'validPassword',
  name: 'validName',
  role: 'admin'
}

const resUserFromService = {
  email: 'valid@email.com',
  name: 'validName',
  role: 'validRole'
}

const sandbox = sinon.createSandbox()

let userDAOSpy = jest.spyOn(UserDAO, 'createUser')

describe('Test User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    sandbox.restore()
  })

  afterAll(() => {
    process.exit
  })

  describe('US1 - createUser', () => {
    describe('US1.1 - given a valid user', () => {
      it('US1.1.1 - should return resolved promise with user information when user model works properly', async () => {
        // arrange
        userDAOSpy = jest.spyOn(UserDAO, 'createUser')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(resUserFromService)
          }))
        const expectedUser = {
          email: resUserFromService.email,
          name: resUserFromService.name,
          role: resUserFromService.role
        }

        // act
        const serviceResponse = await UserService.createUser(reqUser)

        // assert
        expect(serviceResponse).toEqual(expectedUser)
        expect(userDAOSpy).toBeCalledTimes(1)
      })

      it('US1.1.2 - should return Dao error', async () => {
        // arrange
        userDAOSpy = jest.spyOn(UserDAO, 'createUser')
          .mockImplementation(() => new Promise((resolve, reject) => {
            reject({ message: 'dao failed' })
          }))

        // act and assert
        await expect(UserService.createUser(reqUser)).rejects
          .toEqual({ message: 'dao failed' })
      })

      it('US1.1.2 - should return false', async () => {
        // arrange
        userDAOSpy = jest.spyOn(UserDAO, 'createUser')
          .mockImplementation(() => new Promise((resolve, reject) => {
            resolve(false)
          }))

        // act and assert
        await expect(UserService.createUser(reqUser)).resolves
          .toEqual(false)
      })
    })
  })

  describe('US2 - View All Users', () => {
    describe('US2.1 - given a list of users', () => {
      it('US2.1.1 - Should return the full list of users with all their information', async () => {
        // arrange
        const ListUser = []
        const listUserLength = 3
        for (let i = 0; i < listUserLength; i++) {
          ListUser.push(resUserFromService)
        }
        userDAOSpy = jest.spyOn(UserDAO, 'getAllUsers')
          .mockImplementation(() => new Promise(
            (resolve) => {
              resolve(ListUser)
            }
          ))

        // act
        const serviceResponse = await UserService.getAllUsers()

        // assert
        expect(serviceResponse.length).toBe(listUserLength)
        expect(userDAOSpy).toBeCalledTimes(1)
      })

      it('US2.1.2 - Should return a full list of users which are sorted', async () => {
        userDAOSpy = jest.spyOn(UserDAO, 'getAllUsers')
          .mockImplementation(() => new Promise(
            (resolve) => {
              resolve(listReqUserUnsorted)
            }
          ))

        // act
        const serviceResponse = await UserService.getAllUsers()

        // assert
        expect(serviceResponse).toEqual(listReqUsersorted)
      })

      it('US2.1.3 - should return Dao error', async () => {
        // arrange
        userDAOSpy = jest.spyOn(UserDAO, 'getAllUsers')
          .mockImplementation(() => new Promise((resolve, reject) => {
            reject({ message: 'dao failed' })
          }))

        // act and assert
        await expect(UserService.getAllUsers()).rejects
          .toEqual({ message: 'dao failed' })
      })

      it('US2.1.3 - should return false', async () => {
        // arrange
        userDAOSpy = jest.spyOn(UserDAO, 'getAllUsers')
          .mockImplementation(() => new Promise((resolve, reject) => {
            resolve(false)
          }))

        // act and assert
        await expect(UserService.getAllUsers()).resolves
          .toEqual(false)
      })
    })
  })

  describe('US3 - Authenticate User', () => {
    describe('US3.1 - given a valid user', () => {
      it('US3.1.1 - should return Dao error (custom error message)', async () => {
        // arrange
        const expectedData = {
          status: 500,
          message: 'dao error'
        }

        userDAOSpy = jest.spyOn(UserDAO, 'getUserByEmail')
          .mockImplementation(() => new Promise((resolve, reject) => {
            reject(expectedData)
          }))

        // act and assert
        await expect(UserService.authenticateUser(reqUser)).rejects
          .toEqual(expectedData)
      })

      it("US3.1.2 - should return 'some error occured' (default error message)", async () => {
        // arrange
        const errorData = {
          status: 500
        }
        const expectedData = {
          status: 500,
          message: 'some error occured'
        }

        userDAOSpy = jest.spyOn(UserDAO, 'getUserByEmail')
          .mockImplementation(() => new Promise((resolve, reject) => {
            reject(errorData)
          }))

        // act and assert
        await expect(UserService.authenticateUser(reqUser)).rejects
          .toEqual(expectedData)
      })

      it('US3.1.3 - should return false', async () => {
        // arrange
        userDAOSpy = jest.spyOn(UserDAO, 'getUserByEmail')
          .mockImplementation(() => new Promise((resolve, reject) => {
            resolve(false)
          }))

        // act and assert
        await expect(UserService.authenticateUser(reqUser)).resolves
          .toEqual(false)
      })

      it('US3.1.4 - should return a status 200 with valid data', async () => {
        // arrange
        const authUser = {
          password: 'CoolCool123',
          validPassword: () => { return true }
        }

        userDAOSpy = jest.spyOn(UserDAO, 'getUserByEmail')
          .mockImplementation(() => new Promise((resolve, reject) => {
            resolve(authUser)
          }))

        // act and assert
        await expect(UserService.authenticateUser(reqUser)).resolves
          .toEqual(authUser)
      })
    })
  })

  describe('US4 - Modify User', () => {
    describe('US4.1 - given a valid user', () => {
      it('US4.1.1 - Should return a user', async () => {
        // arrange
        userDAOSpy = jest.spyOn(UserDAO, 'updateUser')
          .mockImplementation(() => new Promise((resolve, reject) => {
            resolve(reqUser)
          }))

        // act
        const serviceResponse = await UserService.modifyUser(reqUser)

        // assert
        expect(serviceResponse).toEqual(reqUser)
      })
      it('US4.1.3 - should return Dao error', async () => {
        // arrange
        userDAOSpy = jest.spyOn(UserDAO, 'updateUser')
          .mockImplementation(() => new Promise((resolve, reject) => {
            reject(expectedData)
          }))

        const expectedData = {
          status: 500,
          message: 'some error occured'
        }

        // act and assert
        await expect(UserService.modifyUser(reqUser)).rejects
          .toEqual(expectedData)
      })

      it('US4.1.3 - should return false', async () => {
        // arrange
        userDAOSpy = jest.spyOn(UserDAO, 'updateUser')
          .mockImplementation(() => new Promise((resolve, reject) => {
            resolve(false)
          }))

        // act and assert
        await expect(UserService.modifyUser(reqUser)).resolves
          .toEqual(false)
      })
    })
  })

  describe('US5 - Delete User', () => {
    describe('US5.1 - given a valid user', () => {
      it('US5.1.1 - Should return a user', async () => {
        // arrange
        userDAOSpy = jest.spyOn(UserDAO, 'deleteUser')
          .mockImplementation(() => new Promise((resolve, reject) => {
            resolve(reqUser)
          }))

        // act
        const serviceResponse = await UserService.deleteUser('valid@email.com')

        // assert
        expect(serviceResponse).toEqual(reqUser)
      })
      it('US5.1.3 - should return Dao error', async () => {
        // arrange
        userDAOSpy = jest.spyOn(UserDAO, 'deleteUser')
          .mockImplementation(() => new Promise((resolve, reject) => {
            reject(expectedData)
          }))

        const expectedData = {
          status: 500,
          message: 'some error occured'
        }

        // act and assert
        await expect(UserService.deleteUser('valid@email.com')).rejects
          .toEqual(expectedData)
      })

      it('US5.1.3 - should return false', async () => {
        // arrange
        userDAOSpy = jest.spyOn(UserDAO, 'deleteUser')
          .mockImplementation(() => new Promise((resolve, reject) => {
            resolve(false)
          }))

        // act and assert
        await expect(UserService.deleteUser('valid@email.com')).resolves
          .toEqual(false)
      })
    })
  })
})
