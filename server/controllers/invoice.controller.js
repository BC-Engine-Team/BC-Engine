const invoiceService = require('../services/invoice.service');
const empService = require('../services/emp.service');


exports.getAverages = async (req, res) => {
    let regexDateStr = /^\d{4}-\d{2}-\d{2}$/;
    let regexDate = new RegExp(regexDateStr);

    if (!req.params.startDate || !req.params.endDate)
        return res.status(400).send({ message: "Content cannot be empty." });

    if (!regexDate.test(req.params.startDate) || !regexDate.test(req.params.endDate))
        return res.status(400).send({ message: "Wrong format." });

    await invoiceService.getAverages(req.params.startDate, req.params.endDate, req.query.employeeId, req.query.clientType, req.query.countryLabel, req.query.countryCode, req.query.ageOfAccount, req.query.accountType)
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

exports.getAllEmployeesDropdown = async (req, res) => {
    if (req.user.role === "admin") {
        await empService.getAllEmployees()
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
    } else {
        await empService.getAllEmployees(req.user.name)
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
}

exports.getCountriesName = async (req, res) => {
    await invoiceService.getCountriesName()
        .then(response => {
            if (response) {
                return res.status(200).send(response);
            }
            return res.status(500).send({ message: "The data could not be fetched." });
        })
        .catch(err => {
            return res.status(err.status || 500).send({ message: !!err.message ? err.message : "Malfunction in the B&C Engine." });
        });
}