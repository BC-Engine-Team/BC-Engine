const makeApp = require('../../app')
let app = makeApp()
const supertest = require('supertest')

const response404 = '"<!DOCTYPE html>'
describe('GET /api', () => {
  it('should respond with a 200 status code', async () => {
    const response = await supertest(app).get('/api')
    expect(response.status).toBe(200)
  })

  it('should specify json in the context type header', async () => {
    return supertest(app).get('/api')
      .then(res => expect(res.headers['content-type'])
        .toEqual(expect.stringContaining('json')))
  })

  it('response should have message', async () => {
    const response = await supertest(app).get('/api')
    expect(response.body.message).toBe('Hello from B&C Engine!')
  })
})

describe('Database initialization', () => {
  it('Should sync up the database', () => {
    // arrange
    let counter = 0
    const dbObject = {
      sync: () => {
        counter++
        return counter
      }
    }

    // act and assert
    app = makeApp(dbObject)
    expect(dbObject.sync()).toEqual(2)
  })
})

describe('Return unresolved page', () => {
  it('should respond with a 404 status code', async () => {
    const response = await supertest(app).get('/blabla')
    expect(JSON.stringify(response.text).substring(0, 16)).toEqual(response404)
  })
})
