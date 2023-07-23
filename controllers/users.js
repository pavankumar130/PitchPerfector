const User = require('../models/user')

//Render user register form
module.exports.renderRegister = (req, res) => {
  res.render('users/register')
}

//Register user
module.exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body
    const user = new User({ email, username })
    const registeredUser = await User.register(user, password)

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err)
      } else {
        req.flash('success', 'Welcome to PitchPerfector !')
        res.redirect('/grounds')
      }
    })
  } catch (err) {
    req.flash('error', err.message)
    res.redirect('register')
  }
}

//Render user login form
module.exports.renderLogin = (req, res) => {
  res.render('users/login')
}

//Login user
module.exports.login = (req, res) => {
  req.flash('success', 'Welcome back!')
  const redirectUrl = res.locals.returnTo || '/grounds'
  res.redirect(redirectUrl)
}

//Logout user
module.exports.logout = (req, res, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err)
    } else {
      req.flash('success', 'Logged out successfully')
      res.redirect('/')
    }
  })
}
