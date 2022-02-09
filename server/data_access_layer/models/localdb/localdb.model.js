const bcrypt = require('bcrypt');

module.exports = (localdb, Sequelize) => {
    const User = localdb.define("users", {
        userId: {
            field: 'user_id',
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        email: {
            field: 'user_email',
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            field: 'user_password',
            type: Sequelize.STRING
        },
        name: {
            field: 'user_name',
            type: Sequelize.STRING
        },
        role: {
            field: 'user_role',
            type: Sequelize.STRING
        }

    });

    User.addHook('beforeCreate', async (user) => {
        if (user.password) {
            const salt = await bcrypt.genSalt(10, 'a');
            user.password = await bcrypt.hash(user.password, salt);
        }
    });

    User.addHook('beforeUpdate', async (user) => {
        if (user.password) {
            const salt = await bcrypt.genSalt(10, 'a');
            user.password = await bcrypt.hash(user.password, salt);
        }
    });

    User.prototype.validPassword = async (password, hash) => {
        return bcrypt.compareSync(password, hash);
    }

    const ChartReport = localdb.define("chart_reports", {
        chartReportId: {
            field: 'chart_report_id',
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        name: {
            field: 'chart_report_name',
            type: Sequelize.STRING
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

    ChartReport.belongsTo(User, {
        foreignKey: {
            name: 'user_user_id',
            allowNull: false,
        },
        onDelete: 'CASCADE'
    });

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

    ChartReportData.belongsTo(ChartReport, {
        foreignKey: {
            name: 'chart_report_id',
            allowNull: false
        },
        onDelete: 'CASCADE'
    });

    const ReportType = localdb.define("report_types", {
        reportTypeName: {
            field: 'report_type_name',
            type: Sequelize.STRING
        },
        frequency: {
            field: 'frequency',
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    });

    const Recipients = localdb.define("report_recipients", {
        name: {
            field: 'recipient_name',
            type: Sequelize.STRING
        },
        email: {
            field: 'recipient_email',
            type: Sequelize.STRING
        }
    });

    Recipients.belongsTo(ReportType, {
        foreignKey: {
            name: 'report_type_id',
            allowNull: false
        },
        onDelete: 'CASCADE'
    })


    return [User, ChartReport, ChartReportData, ReportType];
};