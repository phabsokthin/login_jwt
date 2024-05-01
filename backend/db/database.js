const Sequelize = require('sequelize')

const dbname = "login_jwt"
const dbuser = "root"
const dbpass = ""

const sequelize = new Sequelize(dbname, dbuser, dbpass, {
    host: "localhost",
    dialect: "mysql"
})

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.users = require('../model/UserModel')(sequelize, Sequelize)

module.exports = db;