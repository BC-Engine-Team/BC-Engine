module.exports = (localdb, Sequelize) => {

    const ClientGradingData = localdb.define("client_grading_data", {
        clientGradingId: {
            field: 'client_grading_id',
            type: Sequelize.INTEGER,
            defaultValue: 1,
            primaryKey: true
        },
        maximumGradeAPlus: {
            field: 'maximum_grade_a_plus',
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        minimumGradeAPlus: {
            field: 'minimum_grade_a_plus',
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        averageCollectionTimeGradeAPlus: {
            field: 'average_collection_time_a_plus',
            type: Sequelize.STRING,
            defaultValue: null
        },
        maximumGradeA: {
            field: 'maximum_grade_a',
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        minimumGradeA: {
            field: 'minimum_grade_a',
            type: Sequelize.FLOAT,
            defaultValue: 0
        }, 
        averageCollectionTimeGradeA: {
            field: 'average_collection_time_a',
            type: Sequelize.STRING,
            defaultValue: null
        },
        maximumGradeB: {
            field: 'maximum_grade_b',
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        minimumGradeB: {
            field: 'minimum_grade_b',
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        averageCollectionTimeGradeB: {
            field: 'average_collection_time_b',
            type: Sequelize.STRING,
            defaultValue: null
        },
        maximumGradeC: {
            field: 'maximum_grade_c',
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        minimumGradeC: {
            field: 'minimum_grade_c',
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        averageCollectionTimeGradeC: {
            field: 'average_collection_time_c',
            type: Sequelize.STRING,
            defaultValue: null
        },
        maximumGradeEPlus: {
            field: 'maximum_grade_e_plus',
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        minimumGradeEPlus: {
            field: 'minimum_grade_e_plus',
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        averageCollectionTimeGradeEPlus: {
            field: 'average_collection_time_e_plus',
            type: Sequelize.STRING,
            defaultValue: null
        }
    });

    return ClientGradingData;
}
