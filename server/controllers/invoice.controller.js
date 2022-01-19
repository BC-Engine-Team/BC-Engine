const invoiceService = require('../services/invoice.service');
const empService = require('../services/emp.service');

exports.getAverages = async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).send();
    if (!req.params.startDate || !req.params.endDate)
        return res.status(400).send("Content cannot be empty.");

    await invoiceService.getAverages(req.params.startDate, req.params.endDate)
        .then(response => {
            if (response) {
                return res.status(200).send(response);
            }
            return res.status(404).send("The data could not be fetched.");
        })
        .catch(err => {
            return res.status(500).send(err.message);
        });
}

exports.getAllEmployeesDropdown = async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).send();

    await empService.getAllEmployees()
        .then(response => {
            if(response) {
                return res.status(200).send(response);
            }
            return res.status(404).send("The data could not be fetched.");
        })
        .catch(err => {
            return res.status(500).send(err.message);
        });
}