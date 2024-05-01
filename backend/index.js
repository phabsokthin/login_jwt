const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

//to be accessToken we must be install dotenv
const dotenv = require('dotenv')
dotenv.config()
//end
const cookiesParser = require('cookie-parser')
const app = express()
app.use(cookiesParser())


app.use(bodyParser.json())

//for react react js clear clear cookies
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))
const db = require('./db/database')
db.sequelize.sync()

const userController = require('./controller/UserController')
const refreshToken = require('./token/RefreshToken')

app.post('/register', (req, res) => {
    userController.register(req, res)
})

app.get('/token', (req, res)=>{
    refreshToken.refresh(req, res)
})

app.post('/login', (req, res) => {
    userController.login(req, res)
})
app.delete('/logout', (req, res) => {
    userController.logout(req, res)
})


app.listen(3001, ()=>{
    console.log("Server is runing on port 3001")
})
