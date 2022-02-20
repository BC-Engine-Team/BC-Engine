module.exports = (localdb, Sequelize) => {
    const ChartReportData = localdb.define("chart_reports_data", {
        year: {
            field: 'year',
            type: Sequelize.INTEGER
        },
        employee: {
            field: 'emp',
            type: Sequelize.INTEGER,
            defaultValue: -1
        },
        january: {
            field: 'january',
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        february: {
            field: 'february',
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        march: {
            field: 'march',
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        april: {
            field: 'april',
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        may: {
            field: 'may',
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        june: {
            field: 'june',
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        july: {
            field: 'july',
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        august: {
            field: 'august',
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        september: {
            field: 'september',
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        october: {
            field: 'october',
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        november: {
            field: 'november',
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        december: {
            field: 'december',
            type: Sequelize.FLOAT,
            defaultValue: 0
        }
    });

    return ChartReportData
}