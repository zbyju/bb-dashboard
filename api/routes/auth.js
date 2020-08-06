const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/config').jwt


let userDto = require('../dto/userDto')


router.post("/login", async (req, res) => {
  let user
  try {
    user = await userDto.findByUsername(req.body.username)
    if(!user) {
      res.status(400).send({success: false, msg: 'Autentifikace skončila chybou - špatné uživatelské jméno'});
    } else {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
          let token = jwt.sign({ user: user.username }, jwtConfig.secret, jwtConfig.options);
          res.json({ 
            success: true,
            auth: { 
              token: 'JWT ' + token,
              user: {
                username: user.username,
                email: user.email
              }
            }
          });
        } else {
          res.status(400).send({success: false, msg: 'Autentifikace skončila chybou - špatné heslo'});
        }
      })
    }
  } catch(err) {
    console.log(err)
    res.status(500).json({ msg: err})
  }
})

module.exports = router