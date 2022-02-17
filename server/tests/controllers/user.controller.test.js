const UserService = require('../../services/user.service')
const AuthService = require('../../services/auth.service')
const EmpService = require('../../services/emp.service')
const UserController = require('../../controllers/user.controller')
const sinon = require('sinon')
const { afterEach, afterAll } = require('jest-circus')
const { expect, jest } = require('@jest/globals')
const supertest = require('supertest')
const MockExpressResponse = require('mock-express-response')

const reqUser = {
  email: 'valid@benoit-cote.com',
  password: 'validPassword1',
  name: 'validName',
  role: 'admin'
}

const reqEmp = {
  email: 'emp@benoit-cote.com',
  firstName: 'FName',
  lastName: 'LName'
}

const reqUserEmployee = {
  user: {
    email: 'valid@email.com',
    role: 'employee'
  }
}

const resUserFromService = {
  dataValues: {
    email: 'valid@email.com',
    password: 'validPassword',
    name: 'validName',
    role: 'validRole'
  }
}

const sandbox = sinon.createSandbox()
const authStub = sandbox.stub(AuthService, 'authenticateToken')
  .callsFake(function (req, res, next) {
    req.user = reqUser
    return next()
  })

const empStub = sandbox.stub(EmpService, 'checkEmail')
  .callsFake(function (req, res, next) {
    req.emp = reqEmp
    return next()
  })

let userSpy = jest.spyOn(UserService, 'authenticateUser')
  .mockImplementation(() => new Promise((resolve) => {
    resolve(false)
  }))

let authSpy = jest.spyOn(AuthService, 'getTokens')
  .mockImplementation(() => ['aToken', 'rToken'])

const makeApp = require('../../app')
const app = makeApp()
const request = supertest(app)
let res

describe('Test UserController', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    res = new MockExpressResponse()
  })

  afterEach(() => {
    sandbox.restore()
  })

  afterAll(() => {
    process.exit
  })

  describe('UC1 - Create a User', () => {
    describe('UC1.1 - given a valid user body', () => {
      it('UC1.1.1 - should respond with a 200 status code with user from user service', async () => {
        // arrange
        const expectedUser = {
          email: reqUser.email,
          name: reqUser.name,
          role: reqUser.role
        }
        userSpy = jest.spyOn(UserService, 'createUser')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(expectedUser)
          }))

        // act
        const response = await supertest(app).post('/api/users')
          .send(reqUser)

        // assert
        expect(response.status).toBe(200)
        expect(JSON.stringify(response.body)).toEqual(JSON.stringify(expectedUser))
        expect(userSpy).toHaveBeenCalledTimes(1)
        expect(authStub.called).toBeTruthy()
        expect(empStub.called).toBeTruthy()

        // this needs to be done manually in each test because it
        // doesn't work in the afterEach for some reason
        authStub.resetHistory()
        empStub.resetHistory()
      })

      describe('UC1.1.2 - Given service throws error', () => {
        it("UC1.1.2.1 - when error message equals 'Validation error' should respond with 400", async () => {
          // arrange
          const userSpy = jest.spyOn(UserService, 'createUser')
            .mockImplementation(() => new Promise((resolve, reject) => {
              reject({ message: 'Validation error' })
            }))

          // act
          const response = await request.post('/api/users')
            .send(reqUser)

          // assert
          expect(response.status).toBe(400)
          expect(response.body.message).toBe('User already exists.')
          expect(userSpy).toHaveBeenCalledTimes(1)
        })

        it("UC1.1.2.2 - when error message equals 'Validation error' should respond with 500", async () => {
          // arrange
          const userSpy = jest.spyOn(UserService, 'createUser')
            .mockImplementation(() => new Promise((resolve, reject) => {
              reject({ message: 'error' })
            }))

          // act
          const response = await request.post('/api/users')
            .send(reqUser)

          // assert
          expect(response.status).toBe(500)
          expect(response.body.message).toBe('error')
          expect(userSpy).toHaveBeenCalledTimes(1)
        })
      })
    })

    describe('UC1.2 - given an invalid user body', () => {
      it('UC1.2.1 - should return 400 with message when no email', async () => {
        // arrange
        const noEmailReqUser = {
          password: reqUser.password,
          name: reqUser.name,
          role: reqUser.role
        }

        // act
        const response = await request.post('/api/users')
          .send(noEmailReqUser)

        // assert
        expect(response.status).toBe(400)
        expect(response.body.message).toBe('Content cannot be empty.')
        expect(userSpy).toHaveBeenCalledTimes(0)
        expect(authStub.called).toBeTruthy()
        expect(empStub.called).toBeTruthy()
        authStub.resetHistory()
        empStub.resetHistory()
      })

      it('UC1.2.2 - should return 400 with message when no password', async () => {
        // arrange
        const noPassReqUser = {
          email: reqUser.email,
          name: reqUser.name,
          role: reqUser.role
        }

        // act
        const response = await request.post('/api/users')
          .send(noPassReqUser)

        // assert
        expect(response.status).toBe(400)
        expect(response.body.message).toBe('Content cannot be empty.')
        expect(userSpy).toHaveBeenCalledTimes(0)
        expect(authStub.called).toBeTruthy()
        expect(empStub.called).toBeTruthy()
        authStub.resetHistory()
        empStub.resetHistory()
      })

      it('UC1.2.3 - should return 400 with message when no role', async () => {
        // arrange
        const noRoleReqUser = {
          email: reqUser.email,
          password: reqUser.password,
          name: reqUser.name
        }

        // act
        const response = await request.post('/api/users')
          .send(noRoleReqUser)

        // assert
        expect(response.status).toBe(400)
        expect(response.body.message).toBe('Content cannot be empty.')
        expect(userSpy).toHaveBeenCalledTimes(0)
        expect(authStub.called).toBeTruthy()
        expect(empStub.called).toBeTruthy()
        authStub.resetHistory()
        empStub.resetHistory()
      })

      it("UC1.2.4 - should return 400 with message when email doesn't finish by benoit-cote.com", async () => {
        // arrange
        const wrongEmailReqUser = {
          email: 'wrong@format.email',
          password: reqUser.password,
          name: reqUser.name,
          role: reqUser.role
        }

        // act
        const response = await request.post('/api/users')
          .send(wrongEmailReqUser)

        // assert
        expect(response.status).toBe(400)
        expect(response.body.message).toBe('Invalid email format.')
        expect(userSpy).toHaveBeenCalledTimes(0)
        expect(authStub.called).toBeTruthy()
        expect(empStub.called).toBeTruthy()
        authStub.resetHistory()
        empStub.resetHistory()
      })
    })

    describe('UC1.3 - given I try to add a user but I am not authorized', () => {
      it('UC1.3.1 - Should respond with a 403 status code', async () => {
        const response = await UserController.create(reqUserEmployee, res)
        expect(response.statusCode).toBe(403)
      })
    })
  })

  describe('UC2 - View all Users', () => {
    describe('UC2.1 - Given a token passed', () => {
      it('UC2.1.1 - Should respond with a 200 status code when admin', async () => {
        // arrange
        const ListUser = []
        const listUserLength = 3
        for (let i = 0; i < listUserLength; i++) {
          ListUser.push(resUserFromService)
        }
        userSpy = jest.spyOn(UserService, 'getAllUsers')
          .mockImplementation(() => new Promise(
            (resolve) => {
              resolve(ListUser)
            }
          ))

        // act
        const response = await request.get('/api/users')

        // assert
        expect(response.status).toBe(200)
        expect(userSpy).toHaveBeenCalledTimes(1)
        expect(JSON.stringify(response.body)).toEqual(JSON.stringify(ListUser))
      })

      it('UC2.1.2 - Should respond with a 403 status code when employee', async () => {
        // act
        const response = await UserController.findAll(reqUserEmployee, res)

        // assert
        expect(response.statusCode).toBe(403)
      })

      it('UC2.1.3 - Should respond with a 500 status code when user service throws error', async () => {
        // arrange
        userSpy = jest.spyOn(UserService, 'getAllUsers')
          .mockImplementation(async () => {
            await Promise.reject({ status: 500 })
          })

        // act
        const response = await request.get('/api/users')

        // assert
        expect(response.status).toBe(500)
      })
    })
  })

  describe('UC3 - Authenticating a User)', () => {
    describe('UC3.1 - given existing email and password', () => {
      it('UC3.1.1 - should respond with 200 status code', async () => {
        // arrange
        userSpy = jest.spyOn(UserService, 'authenticateUser')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(resUserFromService)
          }))

        // act
        const response = await request.post('/api/users/authenticate')
          .send(reqUser)

        // assert
        expect(response.statusCode).toBe(200)
        expect(response.body.aToken).toBe('aToken')
        expect(response.get('authorization')).toBe('rToken')
        expect(userSpy).toBeCalledTimes(1)
        expect(authSpy).toBeCalledTimes(1)
      })
    })

    describe('UC3.2 - given non existent email and/or wrong password', () => {
      it("UC3.2.1 - should respond with 401 status code, when user service can't find user", async () => {
        // arrange
        userSpy = jest.spyOn(UserService, 'authenticateUser')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(false)
          }))
        authSpy = jest.spyOn(AuthService, 'getTokens')

        // act
        const response = await request.post('/api/users/authenticate').send(reqUser)

        // assert
        expect(userSpy).toBeCalledTimes(1)
        expect(authSpy).toBeCalledTimes(0)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('UC3.3 - given invalid user', () => {
      it('UC3.3.1 - should return 400 and message when no email', async () => {
        // arrange
        const noEmailReqUser = {
          password: reqUser.password
        }
        userSpy = jest.spyOn(UserService, 'authenticateUser')
        authSpy = jest.spyOn(AuthService, 'getTokens')

        // act
        const response = await request.post('/api/users/authenticate').send(noEmailReqUser)

        // assert
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe('Content cannot be empty.')
        expect(userSpy).toBeCalledTimes(0)
        expect(authSpy).toBeCalledTimes(0)
      })
    })

    describe('UC3.4 - given an error occurs with the user service', () => {
      it('UC3.4.1 - should return 500 and a message', async () => {
        // arrange
        userSpy = jest.spyOn(UserService, 'authenticateUser')
          .mockRejectedValue(new Error('Error with the user service.'))
        authSpy = jest.spyOn(AuthService, 'getTokens')

        // act
        const response = await request.post('/api/users/authenticate').send(reqUser)

        // assert
        expect(response.statusCode).toBe(500)
        expect(response.error.text).toBe('Error with the user service.')
      })
    })
  })

  describe('UC4 - Modify a User)', () => {
    const expectedUserToModifyValid = {
      email: reqUser.email,
      password: reqUser.password,
      role: reqUser.role
    }

    const modifiedUserInvalid = {
      password: 'validPassword',
      role: 'admin'
    }

    describe('UC4.1 - given user is authenticated and that entries are valid', () => {
      it('UC4.1.1 - should respond with a 200 status code with a modified user', async () => {
        // arrange
        userSpy = jest.spyOn(UserService, 'modifyUser')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(expectedUserToModifyValid)
          }))

        // act
        const response = await request.put(`/api/users/modify/${reqUser.email}`)
          .send(expectedUserToModifyValid)

        expect(response.status).toBe(200)
        expect(userSpy).toHaveBeenCalledTimes(1)
        expect(JSON.stringify(response.body)).toEqual(JSON.stringify(expectedUserToModifyValid))
      })
    })

    describe('UC4.2 - given user is authenticated but email is invalid', () => {
      it('UC4.2.1 - should respond with a 400 response message', async () => {
        // arrange
        userSpy = jest.spyOn(UserService, 'modifyUser')

        // act
        const response = await supertest(app).put('/api/users/modify/someEmail')
          .send(modifiedUserInvalid)

        // assert
        expect(response.status).toBe(400)
        expect(userSpy).toHaveBeenCalledTimes(0)
      })
    })

    describe('UC4.3 - given I try to modify the user but I am not authorized', () => {
      it('UC4.3.1 - Should respond with a 403 status code', async () => {
        // arrange
        userSpy = jest.spyOn(UserService, 'modifyUser')

        // act
        const response = await UserController.modifyUser(reqUserEmployee, res)

        // assert
        expect(response.statusCode).toBe(403)
        expect(userSpy).toHaveBeenCalledTimes(0)
      })
    })

    describe('UC4.4 - given I try to call the modifyUser service but the modifyUser service sends an error', () => {
      it('UC4.4.1 - Should respond with a 500 response message', async () => {
        // arrange
        userSpy = jest.spyOn(UserService, 'modifyUser')
          .mockImplementation(async () => {
            await Promise.reject({ status: 500 })
          })

        // act
        const response = await request.put(`/api/users/modify/${expectedUserToModifyValid.email}`)
          .send(expectedUserToModifyValid)

        // assert
        expect(response.status).toBe(500)
        expect(userSpy).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('UC5 - Delete a User)', () => {
    describe('UC5.1 - given user is authenticated and that the email is valid', () => {
      it('UC5.1.1 - should respond with a 200 status code with a deleted user', async () => {
        // arrange
        const deletedUser = {
          email: reqUser.email
        }
        userSpy = jest.spyOn(UserService, 'deleteUser')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(deletedUser)
          }))

        // act
        const response = await request.delete(`/api/users/delete/${deletedUser.email}`)
          .send(deletedUser)

        // assert
        expect(response.status).toBe(200)
        expect(userSpy).toHaveBeenCalledTimes(1)
        expect(JSON.stringify(response.body)).toEqual(JSON.stringify(deletedUser))
      })
    })

    describe('UC5.2 - given I try to delete the user but I am not authorized', () => {
      it('UC5.2.1 - Should respond with a 403 status code', async () => {
        // act
        const response = await UserController.deleteUser(reqUserEmployee, res)

        // assert
        expect(response.statusCode).toBe(403)
      })
    })

    describe('UC5.3 - given I try to call the deleteUser in userService but the deleteUser methods sends an error', () => {
      it('UC5.3.1 - Should respond with a 500 response message', async () => {
        const expectedUserToDelete = {
          email: 'first@benoit-cote.com'
        }

        userSpy = jest.spyOn(UserService, 'deleteUser')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(expectedUserToDeleteInvalid)
          }))

        const response = await supertest(app).delete(`/api/users/delete/${expectedUserToDelete.email}`)
          .set('authorization', 'Bearer validToken')
          .send(expectedUserToDelete)

        expect(response.status).toBe(500)
        expect(userSpy).toHaveBeenCalledTimes(1)
        expect(authStub.called).toBeTruthy()
      })
    })
  })
})
