const jwt = require('jsonwebtoken')

const loginrequired = (req, res, next) => {
    // grab the token of user
    const token = req.cookies["access-token"]
    // check if token exists
    if (token) {
        // verify the token
        const validToken = jwt.verify(token, 'secretkey')

        if (validToken) {
            req.userId = validToken.id
            // console.log(req.userId);
            next()
        } else {
            res.redirect('/user/login')
        }
    } else {
        res.redirect('/user/login')
    }
}

module.exports = loginrequired