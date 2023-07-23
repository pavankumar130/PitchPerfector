if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const passport = require('passport')
const LocalStrategy = require('passport-local')

const User = require('./models/user')
const groundRoutes = require('./routes/grounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')

//Connecting to DB
mongoose.connect('mongodb://127.0.0.1:27017/PitchPerfector', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

//Check if connection is successful
const db = mongoose.connection
db.on('error', console.error.bind(console, 'Connection error'))
db.once('open', () => {
  console.log('Database connected')
})

const app = express()

//Set paths and view engine
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
  secret: 'eggisveg',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}

app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  res.locals.currentUser = req.user
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})

app.use('/', userRoutes)
app.use('/grounds', groundRoutes)
app.use('/grounds/:id/reviews', reviewRoutes)

//Handle get requests
app.get('/', (req, res) => {
  res.render('home')
})

//If none of urls match then send 404 page not found page
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

//Validate forms
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err
  if (!err.message) {
    err.message = 'Something went wrong!'
  }

  res.status(statusCode).render('error', { err })
})

//Start server
app.listen(3000, (err) => {
  if (err) {
    console.log(err)
  }
  console.log('Serving on port 3000')
})
