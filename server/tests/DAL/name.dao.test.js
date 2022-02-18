const { expect } = require('@jest/globals')

const NameDao = require('../../data_access_layer/daos/name.dao')

const fakeGetClientDbQueryResponse = [
  {
    NAME_ID: 20100,
    NAME: 'National Research Council of Canada',
    COUNTRY_LABEL: 'Canada',
    GRADING: 'C'
  },
  {
    NAME_ID: 20234,
    NAME: 'Groupe Patrick Ménard Assurances Inc. Groupe Jetté',
    COUNTRY_LABEL: 'Canada',
    GRADING: 'B'
  },
  {
    NAME_ID: 20330,
    NAME: 'Martin Aubé',
    COUNTRY_LABEL: 'Japan',
    GRADING: null
  }
]

const returnedEmployeeList = [
  {
    NAME_ID: 29910,
    FULLNAME: 'Cathia Zeppetelli'
  },
  {
    NAME_ID: 29569,
    FULLNAME: 'France Cote'
  }
]

const fakeClientIdList = [12345, 12346, 12347]

describe('Test Name DAO', () => {
  describe('ND1 - getClientInformation', () => {
    describe('ND1.1 - given valid response from db query', () => {
      it('ND1.1.1 - Should return list of clients', async () => {
        // arrange
        const expectedResponse = [
          {
            nameId: fakeGetClientDbQueryResponse[0].NAME_ID,
            name: fakeGetClientDbQueryResponse[0].NAME,
            country: fakeGetClientDbQueryResponse[0].COUNTRY_LABEL,
            grading: fakeGetClientDbQueryResponse[0].GRADING
          },
          {
            nameId: fakeGetClientDbQueryResponse[1].NAME_ID,
            name: fakeGetClientDbQueryResponse[1].NAME,
            country: fakeGetClientDbQueryResponse[1].COUNTRY_LABEL,
            grading: fakeGetClientDbQueryResponse[1].GRADING
          },
          {
            nameId: fakeGetClientDbQueryResponse[2].NAME_ID,
            name: fakeGetClientDbQueryResponse[2].NAME,
            country: fakeGetClientDbQueryResponse[2].COUNTRY_LABEL,
            grading: 'N/A'
          }
        ]
        const dbStub = {
          query: () => {
            return Promise.resolve(fakeGetClientDbQueryResponse)
          }
        }

        // act and assert
        await expect(NameDao.getClientsInClientIdList(fakeClientIdList, dbStub))
          .resolves.toEqual(expectedResponse)
      })
    })

    describe('ND1.2 - given invalid response from db query', () => {
      it('ND1.2.1 - should return false when db cant fetch data', async () => {
        // arrange
        const dbStub = {
          query: () => {
            return Promise.resolve(false)
          }
        }

        // act and assert
        await expect(NameDao.getClientsInClientIdList(fakeClientIdList, dbStub)).resolves
          .toEqual(false)
      })

      it('ND1.2.2 - should catch error when db throws error', async () => {
        // arrange
        const expectedResponse = {
          status: 500,
          message: 'Could not fetch clients.'
        }
        const dbStub = {
          query: () => {
            return Promise.reject({})
          }
        }

        // act and assert
        await expect(NameDao.getClientsInClientIdList(fakeClientIdList, dbStub)).rejects
          .toEqual(expectedResponse)
      })
    })
  })

  describe('ND2 - getAllEmployeeNames', () => {
    it('ND2.1 - Should return a list of employees', async () => {
      // arrange
      const dbStub = {
        query: () => {
          return returnedEmployeeList
        }
      }

      const expectedEmployeeList = [
        {
          nameID: 29910,
          name: 'Cathia Zeppetelli'
        },
        {
          nameID: 29569,
          name: 'France Cote'
        }
      ]

      // act
      const response = await NameDao.getAllEmployeeNames(dbStub)

      // assert
      expect(response).toEqual(expectedEmployeeList)
    })

    it('ND2.2 - should resolve false when Model cant fetch data', async () => {
      // arrange
      const dbStub = {
        query: () => {
          return false
        }
      }

      // act and assert
      await expect(NameDao.getAllEmployeeNames(dbStub)).resolves
        .toEqual(false)
    })

    it('ND2.3 - should reject error with 500 status with error message', async () => {
      // arrange
      const dbStub = {
        query: () => {
          throw new Error('Error with the db.')
        }
      }

      // act and assert
      await expect(NameDao.getAllEmployeeNames(dbStub)).rejects
        .toEqual(new Error('Error with the db.'))
    })
  })
})
