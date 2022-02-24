const manageService = require('../services/manage.service');
require("../../config.js")

exports.getClients = async (req, res) => {
    await manageService.getAllClients()
        .then(response => {
            if (response) {
                return res.status(200).send(response);
            }
            return res.status(500).send({ message: "The data could not be fetched." });
        })
        .catch(err => {
            return res.status(err.status || 500)
                .send({ message: !!err.message ? err.message : "Malfunction in the B&C Engine." });
        });
}