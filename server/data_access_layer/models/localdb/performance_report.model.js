module.exports = (localdb, Sequelize) => {
    const PerformanceReport = localdb.define("performance_reports", {
        performanceReportId: {
            field: 'performance_report_id',
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        name: {
            field: 'performance_report_name',
            type: Sequelize.STRING
        },
        projectedBonus: {
            field: 'projected_bonus',
            type: Sequelize.STRING,
            defaultValue: null
        }
    })

    return PerformanceReport
}