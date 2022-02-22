module.exports = (localdb, Sequelize) => {
    const Recipients = localdb.define("recipients", {
        recipientId: {
            field: 'recipient_id',
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        employeeId: {
            field: 'employee_id',
            type: Sequelize.INTEGER,
            unique: true
        },
        name: {
            field: 'recipient_name',
            type: Sequelize.STRING
        },
        email: {
            field: 'recipient_email',
            type: Sequelize.STRING
        }
    })

    return Recipients
}