const db = require('../db/database')
const User = db.users

const jwt = require('jsonwebtoken')

const refresh = async (req, res) => {
    try {

        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.sendStatus(401)
        const user = await User.findAll({
            where: {
                refresh_token: refreshToken
            }

        })

        if(!user[0]) return res.sendStatus(403)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
    
            if(err) return res.sendStatus(403)
            const userId = user[0].uid
            const names = user[0].names
            const email = user[0].email

            const accessToken = jwt.sign({userId, names, email},process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "15s"
            });
            res.json({accessToken})

        })

    }
    catch (err) {
        console.log(err)
    }
}

module.exports = {
    refresh
}