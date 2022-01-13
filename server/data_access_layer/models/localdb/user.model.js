const bcrypt = require('bcrypt');

module.exports = (localdb, DataTypes) => {
    const User = localdb.define("users", {
        userId: {
            field: 'user_id',
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: {
            field: 'user_email',
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            field: 'user_password',
            type: DataTypes.STRING
        },
        name: {
            field: 'user_name',
            type: DataTypes.STRING
        },
        role: {
            field: 'user_role',
            type: DataTypes.STRING
        }
        
    });

    User.addHook('beforeCreate', async (user) => {
        if(user.password){
            const salt = await bcrypt.genSalt(10, 'a');
            user.password = await bcrypt.hash(user.password, salt);
        }
    });

    User.addHook('beforeUpdate', async (user) => {
        if(user.password){
            const salt = await bcrypt.genSalt(10, 'a');
            user.password = await bcrypt.hash(user.password, salt);
        }
    });

    User.prototype.validPassword = async (password, hash) => {
        return bcrypt.compareSync(password, hash);    
    }
    
    return User;
};