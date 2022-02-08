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

        it("CD1.3 - should catch error when db throws error", async () => {
            // arrange
            let dbStub = {
                query: () => {
                    throw new Error("Error with the db.");
                }
            };

            // act and assert
            await expect(CountryDao.getAllCountries(dbStub)).rejects
                .toEqual(new Error("Error with the db."));
        })
    });
});