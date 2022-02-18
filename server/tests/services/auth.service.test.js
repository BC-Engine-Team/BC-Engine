const AuthService = require('../../services/auth.service')
const EmpService = require('../../services/emp.service')
const jwt = require('jsonwebtoken')
const { expect } = require('@jest/globals')
const supertest = require('supertest')
const sinon = require('sinon')


const reqUser = {
  email: 'valid@email.com',
  password: 'validPassword',
  name: 'validName',
  role: 'admin'
}

const reqEmp = {
  email: 'emp@benoit-cote.com',
  firstName: 'FName',
  lastName: 'LName'
}

const sandbox = sinon.createSandbox()
const empStub = sandbox.stub(EmpService, 'checkEmail')
  .callsFake(function (req, res, next) {
    req.emp = reqEmp
    return next()
  })

const makeApp = require('../../app')
const app = makeApp()
const request = supertest(app)

describe('Test Authentication Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    process.exit
  })

  describe('AS1 - refreshToken', () => {
    describe('AS1.1 - given no token in header', () => {
      it('AS1.1.1 - should return 403 Forbidden', async () => {
        // act
        const response = await request.delete('/api/users/logout')

        // assert
        expect(response.status).toBe(403)
      })
    })

    describe('AS.2 - given token in header', () => {
      it('AS2.1 - should return 204 when valid token', async () => {
        // arrange
        AuthService.setRefreshTokens('test')

        // act
        const response = await request.delete('/api/users/logout')
          .set('authorization', 'Bearer test')

        // assert
        expect(response.status).toBe(204)
      })

      it('AS2.2 - should return 403 when invalid token', async () => {
        // act
        const response = await request.delete('/api/users/logout')
          .set('authorization', 'Bearer invalidToken')

        // assert
        expect(response.status).toBe(403)
      })
    })
  })

  describe('AS2 - authenticateToken', () => {
    describe('AS2.1 - given no token in header', () => {
      it('AS2.1.1 - should return 403 Forbidden', async () => {
        // act
        const response = await request.post('/api/users')

        // assert
        expect(response.status).toBe(403)
      })
    })

    describe('AS2.2 - given valid token in header', () => {
      it('AS2.2.1 - should return 200 OK', async () => {
        // arrange
        const tokens = AuthService.getTokens(reqUser)
        const aToken = tokens[0];

        // act
        await request.post('/api/users')
          .set('authorization', `Bearer ${aToken}`)
          .send(reqUser)

        // assert
        expect(empStub.called).toBeTruthy()
        empStub.resetHistory()
      })
    })

    describe('AS2.3 - given invalid token in header', () => {
      it('AS2.3.1 - should return 401 Unauthorized', async () => {
        // act
        const response = await request.get('/api/users')
          .set('authorization', 'Bearer invalidToken')

        // assert
        expect(response.status).toBe(401)
      })
      it('AS2.3.2 - should return 403 Forbidden', async () => {
        // act
        const response = await request.get('/api/users')
          .set('authorization', 'invalidToken')

        // assert
        expect(response.status).toBe(403)
      })
    })
  })

  describe('A32 - refreshToken', () => {
    describe('AS3.1 - given no token in header', () => {
      it('AS3.1.1 - should return 403 Forbidden', async () => {
        // act
        const response = await request.post('/api/users/refresh')
          .set('authorization', 'Bearer 545')
          .send(reqEmp)

        // assert
        expect(response.status).toBe(403)
      })

      it('AS3.1.2 - should return 401 Forbidden', async () => {
        // act
        const response = await request.post('/api/users/refresh')
          .set('authorization', 'Bearer ')
          .send(reqEmp)

        // assert
        expect(response.status).toBe(401)
      })
    })
  })

  describe('AS4 - getTokens', () => {
    describe('AS4.1 - given a valid user', () => {
      it('AS4.1.1 - should return access and refresh token for given user', () => {
        // act
        const [aToken, rToken] = AuthService.getTokens(reqUser)

        // assert
        const aTokenPayload = jwt.decode(aToken)
        const rTokenPayload = jwt.decode(rToken)

        expect(aTokenPayload.email).toBe(reqUser.email)
        expect(aTokenPayload.name).toBe(reqUser.name)
        expect(aTokenPayload.password).toBe(reqUser.password)
        expect(aTokenPayload.role).toBe(reqUser.role)
        expect(aTokenPayload.iat)
        expect(aTokenPayload.exp)

        expect(rTokenPayload.email).toBe(reqUser.email)
        expect(rTokenPayload.name).toBe(reqUser.name)
        expect(rTokenPayload.password).toBe(reqUser.password)
        expect(rTokenPayload.role).toBe(reqUser.role)
        expect(rTokenPayload.iat)
        expect(rTokenPayload.exp)
      })
    })
  })
})
