const jwt = require('jsonwebtoken')
const User = require('../models/user')

const reqauth = (req, res, next) => {
  const token = req.cookies.LoggedUser
  if (!token) {
    return res.redirect('/login')
  }

  jwt.verify(token, 'secretlogin', (err, decodedToken) => {
    if (err) {
      console.log(err.message)
      return res.redirect('/login')
    }

    console.log(decodedToken)
    next()
  })
}

const checkuser = (req, res, next) => {
  const token = req.cookies.LoggedUser

  if (!token) {
    res.locals.user = null
    return next()
  }

   jwt.verify(token, 'secretlogin', async (err, decodedToken) => {
    if (err) {
      console.log(err.message)
      res.locals.user = null
      return next()
    }

    console.log(decodedToken)
    let user = await User.findOne({ where : {id : decodedToken.id}})
    res.locals.user = user
    next()
  })
}

module.exports = { reqauth, checkuser }
