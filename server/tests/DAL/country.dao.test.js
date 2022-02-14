const CountryDao = require("../../data_access_layer/daos/country.dao");


let fakeCountriesList = [
    {
        COUNTRY_LABEL: "Albania"
    },
    {
        COUNTRY_LABEL: "Italy"
    },
    {
        COUNTRY_LABEL: "Morocco"
    }
]


describe("Test Country DAO", () => {
    describe("CD1 - getAllCountries", () => {
        it("CD1.1 - Should return list of countries", async () => {
            
            // arrange
            let dbStub = {
                query: () => {
                    return fakeCountriesList;
                }
            };

            let expectedResponse = [
                {
                    countryLabel: fakeCountriesList[0].COUNTRY_LABEL
                },
                {
                    countryLabel: fakeCountriesList[1].COUNTRY_LABEL
                },
                {
                    countryLabel: fakeCountriesList[2].COUNTRY_LABEL
                }
            ];

            // act
            const response = await CountryDao.getAllCountries(dbStub);

            // assert
            expect(response).toEqual(expectedResponse);
        });

        it("CD1.2 - should return false when db cant fetch data", async () => {
            // arrange
            let dbStub = {
                query: () => {
                    return false;
                }
            };

            // act and assert
            await expect(CountryDao.getAllCountries(dbStub)).resolves
                .toEqual(false);
        });

        it("CD1.3 - should return a specific error message when it is of 500", async () => {
            // arrange

            let expectedError = {
                message: "Error with the db.",
                status: 500
            }

            let dbStub = {
                query: () => {
                    return Promise.reject(expectedError);
                }
            };

            // act and assert
            await expect(CountryDao.getAllCountries(dbStub)).rejects
                .toEqual(expectedError);
        });

        it("CD1.4 - should return an unspecific error message", async () => {
            // arrange

            let expectedError = {
                message: "Some error",
                status: 400
            }

            let dbStub = {
                query: () => {
                    return Promise.reject(expectedError);
                }
            };

            // act and assert
            await expect(CountryDao.getAllCountries(dbStub)).rejects
                .toEqual(expectedError);
        })
    });
});