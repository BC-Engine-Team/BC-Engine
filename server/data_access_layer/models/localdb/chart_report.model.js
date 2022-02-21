module.exports = (localdb, Sequelize) => {
    const ChartReport = localdb.define("chart_reports", {
        chartReportId: {
            field: 'chart_report_id',
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        name: {
            field: 'chart_report_name',
            type: Sequelize.STRING,
            allowNull: false
        },
        startDate: {
            field: 'chart_report_start',
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        endDate: {
            field: 'chart_report_end',
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        employee1Id: {
            field: 'chart_report_emp1',
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: -1
        },
        employee1Name: {
            field: 'chart_report_emp1_name',
            type: Sequelize.STRING,
            defaultValue: 'All'
        },
        employee2Id: {
            field: 'chart_report_emp2',
            type: Sequelize.INTEGER,
            defaultValue: null
        },
        employee2Name: {
            field: 'chart_report_emp2_name',
            type: Sequelize.STRING,
            defaultValue: null
        },
        countryId: {
            field: 'chart_report_country_id',
            type: Sequelize.STRING,
            defaultValue: -1
        },
        country: {
            field: 'chart_report_country',
            type: Sequelize.STRING,
            defaultValue: 'All'
        },
        clientType: {
            field: 'chart_report_client_type',
            type: Sequelize.STRING,
            defaultValue: 'Any'
        },
        ageOfAccount: {
            field: 'chart_report_age_of_account',
            type: Sequelize.STRING,
            defaultValue: 'All'
        },
        accountType: {
            field: 'chart_report_account_type',
            type: Sequelize.STRING,
            defaultValue: 'Receivable'
        }
    },
        { underscored: true });

    return ChartReport
}