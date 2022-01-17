const TransacStatDao = require("../data_access_layer/daos/transac_stat.dao");
const InvoiceAffectDao = require("../data_access_layer/daos/invoice_affect.dao");

exports.getAverages = async (startDateStr, endDateStr) => {
    const startYear = parseInt(startDateStr.split('-')[0]);
    let startMonth = parseInt(startDateStr.split('-')[1]);
    const endYear = parseInt(endDateStr.split('-')[0]);
    const endMonth = parseInt(endDateStr.split('-')[1]);

    // make list of yearMonth [201911,202001,202002,...] to select dues
    let yearMonthList = [];
    for (let y = startYear; y <= endYear; y++) {
        if (y != startYear) startMonth = 1;
        for (let m = startMonth; m <= 12; m++) {
            if (y == endYear && m > endMonth) break;
            let yearMonthStr = y.toString();
            if (m < 10) yearMonthStr += '0';
            yearMonthStr += m.toString();
            yearMonthList.push(parseInt(yearMonthStr));
        }
    }

    return new Promise(async (resolve, reject) => {
        let averagesList = [];
        let totalDuesList = [];
        let billedList = [];

        // Get the list of total dues for each month
        await this.getDues(yearMonthList).then(async data => {
            totalDuesList = data;
        }).catch(err => {
            reject(err);
        });

        // prepare startDate to get billed amount for each month
        let startDate = new Date(`${startDateStr} 00:00:00`);
        startDate.setMonth(startDate.getMonth() - 12);
        let theMonth = startDate.getMonth() + 1;
        startDateStr = startDate.getFullYear() + "-" + theMonth + "-01";

        // Get list of amount billed for each month (previous 12 months)
        await this.getBilled(startDateStr, endDateStr, yearMonthList).then(async data => {
            billedList = data;
        }).catch(err => {
            reject(err);
        });

        // Populate average list with average for each month
        let counter = 0;
        yearMonthList.forEach(ym => {
            let average = totalDuesList[counter].totalDues / billedList[counter].billed * 365;
            averagesList.push({
                month: ym,
                average: average.toFixed(2)
            });
            counter++;
        });
        resolve(averagesList);
    });
}

exports.getDues = async (yearMonthList) => {
    let totalDuesList = [];

    return new Promise(async (resolve, reject) => {
        await TransacStatDao.getTransactionsStatByYearMonth(yearMonthList).then(async data => {
            if (data) {
                yearMonthList.forEach(ym => {
                    let totalDues = 0;
                    data.forEach(e => {
                        if (e.yearMonth === ym) {
                            totalDues += (e.dueCurrent + e.due1Month + e.due2Month + e.due3Month);
                        }
                    });
                    totalDuesList.push({
                        month: ym.toString(),
                        totalDues: totalDues.toFixed(2)
                    });
                });
                resolve(totalDuesList);
            }
            resolve(false);
        }).catch(err => {
            reject(err.message);
        });
    });
}

exports.getBilled = async (startDateStr, endDateStr, yearMonthList) => {
    let billedList = [];
    let startDate = new Date(parseInt(startDateStr.substring(5, 7)) + " " + parseInt(startDateStr.substring(8)) + " " + parseInt(startDateStr.substring(0, 4)));
    let endDate = new Date(parseInt(endDateStr.substring(5, 7)) + " " + parseInt(endDateStr.substring(8)) + " " + parseInt(endDateStr.substring(0, 4)));
    endDate.setMonth(endDate.getMonth() - (yearMonthList.length - 1));

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(0, 0, 0, 0);

    return new Promise(async (resolve, reject) => {
        await InvoiceAffectDao.getInvoicesByDate(startDateStr, endDateStr).then(async data => {
            if (data) {
                yearMonthList.forEach(ym => {
                    let billed = 0;



                    console.log(startDate)
                    console.log(endDate)
                    console.log()

                    let counter = 0;

                    data.forEach(i => {
                        if (i['INVOCIE_DATE'] >= startDate && i['INVOCIE_DATE'] < endDate) {
                            billed += i['AFFECT_AMOUNT'];
                            counter++;
                        }
                    });

                    console.log(counter);

                    billedList.push({
                        month: ym,
                        billed: billed
                    });

                    startDate.setUTCMonth(startDate.getUTCMonth() + 1);
                    endDate.setUTCMonth(endDate.getUTCMonth() + 1);
                });
                resolve(billedList);
            }
            resolve(false);
        }).catch(err => {
            reject(err.message);
        })
    });
}

