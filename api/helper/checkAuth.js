const jwt = require('jsonwebtoken')
const jwtConfig = require('../config/config').jwt

module.exports = {
    validateToken: (req, res, next) => {
        const authHeader = req.headers.authorization
        let result
        if(authHeader) {
            const token = authHeader.split(' ')[1]
            const options = {
                expiresIn: '7d'
            }
            try {
                result = jwt.verify(token, jwtConfig.secret, jwtConfig.options)
                req.decoded = result
                next()
            } catch(err) {
                result = { 
                    error: `Authentication error. Token required.`,
                    status: 401
                  };
                  res.status(401).send(result);
            }
        } else {
            result = { 
                error: `Authentication error. Token required.`,
                status: 401
              };
            res.status(401).send(result);
        }
    }
}