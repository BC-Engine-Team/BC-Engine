const makeApp = require('../../app');
let app = makeApp();
const supertest = require('supertest');


let response404 = "\"<!DOCTYPE html>\\r\\n<html>\\r\\n  <head>\\r\\n    <meta charset=\\\"utf-8\\\">\\r\\n    <title>B&C Engine Web Application</title>\\r\\n    <script type=\\\"text/javascript\\\">\\r\\n     \\r\\n      var pathSegmentsToKeep = 0;\\r\\n\\r\\n      var l = window.location;\\r\\n      l.replace(\\r\\n        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +\\r\\n        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +\\r\\n        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +\\r\\n        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +\\r\\n        l.hash\\r\\n      );\\r\\n\\r\\n    </script>\\r\\n  </head>\\r\\n  <body>\\r\\n  </body>\\r\\n</html>\""

describe("GET /api", () => {

    it("should respond with a 200 status code", async () => {
        const response = await supertest(app).get("/api");
        expect(response.status).toBe(200);
    });

    it("should specify json in the context type header", async () => {
        return supertest(app).get("/api")
            .then(res => expect(res.headers['content-type'])
            .toEqual(expect.stringContaining("json")));
    });

    it("response should have message", async () => {
        const response = await supertest(app).get("/api");
        expect(response.body.message).toBe("Hello from B&C Engine!");
    });

});

describe("Database initialization", () => {
    it("Should sync up the database", () => {
        // arrange
        let counter = 0;
        let dbObject = {
            sync: () => {
                counter++
                return counter;
            }
        }

        // act and assert
        app = makeApp(dbObject)
        expect(dbObject.sync()).toEqual(2);
    })
});

describe("Return unresolved page", () => {

    it("should respond with a 404 status code", async () => {
        const response = await supertest(app).get("/blabla");
        expect(JSON.stringify(response.text)).toEqual(response404);
    });
    
});