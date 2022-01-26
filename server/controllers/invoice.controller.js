const invoiceService = require('../services/invoice.service');


exports.findTransactionsBetweenDates = async (req, res) => {
    await invoiceService.getTransactionsBetweenDates()
        .then(response => {
            return res.status(200).send(response);
        })
        .catch(err => {
            console.log(err)
            return res.status(500).send(err);
        });
};

exports.testInvoices = async (req, res) => {
    await invoiceService.testInvoices()
        .then(response => {
            return res.send(response);
        })
}

exports.getAverages = async (req, res) => {
    let regexDateStr = /^\d{4}-\d{2}-\d{2}$/;
    let regexDate = new RegExp(regexDateStr);

    if (!req.params.startDate || !req.params.endDate)
        return res.status(400).send({ message: "Content cannot be empty." });

    if (!regexDate.test(req.params.startDate) || !regexDate.test(req.params.endDate))
        return res.status(400).send({ message: "Wrong format." });


    await invoiceService.getAverages(req.params.startDate, req.params.endDate)
        .then(response => {
            if (response) {
                return res.status(200).send(response);
            }
            return res.status(500).send({ message: "The data could not be fetched." });
    })
        .catch(err => {
            return res.status(500).send({ message: err.message });
        });
}


exports.getAveragesTest = async (req, res) => {
    return res.send([
        {
            month: 201912,
            average: 90
        },
        {
            month: 202001,
            average: 91
        },
        {
            month: 202002,
            average: 93
        },
        {
            month: 202003,
            average: 95
        },
        {
            month: 202004,
            average: 91
        },
        {
            month: 202005,
            average: 97
        },
        {
            month: 202006,
            average: 94
        },
        {
            month: 202007,
            average: 99
        },
        {
            month: 202008,
            average: 91
        },
        {
            month: 202009,
            average: 96
        },
        {
            month: 202010,
            average: 93
        },
        {
            month: 202011,
            average: 97
        }
    ]);
}