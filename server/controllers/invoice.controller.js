const invoiceService = require('../services/invoice.service');

// Fetch all Invoices from patricia db
exports.findAllInvoices = async (req, res) => {
    if(req.user.role !== "admin") return res.status(403).send();
    await invoiceService.getAllInvoices()
        .then(response => {
            return res.status(200).send(response);
        })
        .catch(err => {
            return res.status(500).send(err);
        });
};

// Fetch all transactions from bosco db
exports.findAllTransactions = async (req, res) => {
    if(req.user.role !== "admin") return res.status(403).send();
    await invoiceService.getAllTransactions()
        .then(response => {
            return res.status(200).send(response);
        })
        .catch(err => {
            return res.status(500).send(err);
        });
};

exports.findTransactionsBetweenDates = async (req, res) => {
    if(req.user.role !== "admin") return res.status(403).send();
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
    await invoiceService.getAverages(req.body.startDate, req.body.endDate)
        .then(response => {
            return res.status(200).send(response);
        })
        .catch(err => {
            return res.status(500).send(err.message);
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