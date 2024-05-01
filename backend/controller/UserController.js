const db = require('../db/database')
const bcypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = db.users

const register = async(req, res) => {

    const {names, email, password, confpassword} = req.body

    if(password !== confpassword) return res.status(400).json({msg: "Password must be same"})

    const bcrypt_salt = await bcypt.genSalt()
    const hashpassword = await bcypt.hash(password, bcrypt_salt)

    try{

        await User.create({names: names, email: email, password: hashpassword})
        res.status(200).json({msg: "Resgister success!"})

    }
    catch(err){
        console.log(err)
    }
} 

const login = async(req, res) => {
    try{

        const user = await User.findAll({
            where: {
                
                email: req.body.email
            }
        })

        if(!user.length) {
            return res.status(400).json({msg: "User not found"})
        }

        const match = await bcypt.compare(req.body.password,user[0].password);
        if(!match) return res.status(404).json({msg: "Invalid password"});

        const {uid, names, email} = user[0]
    
        const accessToken = jwt.sign({uid, names, email}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '20s'
        });

        const refreshToken = jwt.sign({uid, names, email}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: "1d"
        })

        await User.update({refresh_token: refreshToken}, {
            where: {
                uid: user[0].uid
            }
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({accessToken});

    }
    catch(err){
        console.log(err)
        res.status(500).json({msg: "Server not found"})
    }
}


const logout = async(req, res) =>{

    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204)
    const user = await User.findAll({
        where: {
            refresh_token: refreshToken
        }
    });

    if(!user[0]) return res.sendStatus(204);
    
    const userId = user[0].uid;
    await User.update({refresh_token: null}, {
        where:{
            uid: userId
        }
    });

    res.clearCookie('refreshToken');
    return res.sendStatus(200)
}

module.exports = {
    register,
    login,
    logout
}