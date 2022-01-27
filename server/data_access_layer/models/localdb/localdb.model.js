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
            allowNull: false
        },
        employee1Name: {
            field: 'chart_report_emp1_name',
            type: Sequelize.STRING
        },
        employee2Id: {
            field: 'chart_report_emp2',
            type: Sequelize.INTEGER
        },
        employee2Name: {
            field: 'chart_report_emp2_name',
            type: Sequelize.STRING
        },
        country: {
            field: 'chart_report_country',
            type: Sequelize.STRING
        },
        clientType: {
            field: 'chart_report_client_type',
            type: Sequelize.STRING
        },
        ageOfAccount: {
            field: 'chart_report_age_of_account',
            type: Sequelize.STRING
        },
        accountType: {
            field: 'chart_report_account_type',
            type: Sequelize.STRING
        }
    },
        { underscored: true });

    ChartReport.belongsTo(User, {
        foreignKey: {
            name: 'user_user_id',
            allowNull: false
        }
    });

    return [User, ChartReport];
};