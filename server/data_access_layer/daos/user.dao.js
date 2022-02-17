const databases = require('../databases')
const UserModel = databases.localdb.users

exports.getUserByEmail = async (email, userModel = UserModel) => {
  return new Promise((resolve, reject) => {
    userModel.findOne({
      where: {
        user_email: email
      }
    })
      .then(async data => {
        if (data) resolve(data)
        resolve(false)
      })
      .catch(err => {
        const response = {
          status: 500,
          message: err.message || 'some error occured'
        }
        reject(response)
      })
  })
}

exports.getAllUsers = async (userModel = UserModel) => {
  return new Promise((resolve, reject) => {
    userModel.findAll()
      .then(async data => {
        if (data) {
          const returnData = []
          for (let u = 0; u < data.length; u++) {
            returnData.push({
              email: data[u].dataValues.email,
              name: data[u].dataValues.name,
              role: data[u].dataValues.role
            })
          }
          resolve(returnData)
        }
        resolve(false)
      })
      .catch(err => {
        const response = {
          status: 500,
          data: {},
          message: err.message || 'some error occured'
        }
        reject(response)
      })
  })
}

exports.createUser = async (user, userModel = UserModel) => {
  return new Promise((resolve, reject) => {
    userModel.create(user)
      .then(async data => {
        if (data) {
          const returnData = {
            email: data.dataValues.email,
            name: data.dataValues.name,
            role: data.dataValues.role
          }

          resolve(returnData)
        }
        resolve(false)
      }).catch(err => {
        const response = {
          status: 500,
          data: {},
          message: err.message || 'some error occured'
        }
        reject(response)
      })
  })
}

exports.updateUser = async (user, userModel = UserModel) => {
  return new Promise((resolve, reject) => {
    userModel.update(user,
      {
        where: { email: user.email },
        individualHooks: true
      })
      .then(async data => {
        if (data) {
          resolve('User modified successfully.')
        }
        resolve('User was not updated.')
      })
      .catch(err => {
        const response = {
          status: 500,
          data: {},
          message: err.message || 'some error occured'
        }
        reject(response)
      })
  })
}

exports.deleteUser = async (email, userModel = UserModel) => {
  return new Promise((resolve, reject) => {
    userModel.destroy({ where: { email: email } })
      .then(async data => {
        if (data) {
          resolve('User deleted successfully.')
        }
        resolve('User has failed to be deleted.')
      })
      .catch(err => {
        const response = {
          status: 500,
          message: err.message || 'some error occured'
        }
        reject(response)
      })
  })
}
