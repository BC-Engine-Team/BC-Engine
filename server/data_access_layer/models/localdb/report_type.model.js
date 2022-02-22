module.exports = (localdb, Sequelize) => {
    const ReportType = localdb.define("report_types", {
        reportTypeId: {
            field: 'report_type_id',
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
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

    return ReportType
}