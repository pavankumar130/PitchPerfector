const { groundSchema, reviewSchema } = require('./schemas.js')
const ExpressError = require('./utils/ExpressError.js')
const Ground = require('./models/grounds.js')
const Review = require('./models/review.js')

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl
    req.flash('error', 'You must be logged!')
    return res.redirect('/login')
  }
  next()
}

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo
  }
  next()
}

module.exports.validateGround = (req, res, next) => {
  const { error } = groundSchema.validate(req.body)

  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params
  const ground = await Ground.findById(id)

  if (req.user && !ground.author.equals(req.user._id)) {
    req.flash('error', 'Only owners can perform this action!')
    return res.redirect(`/grounds/${id}`)
  }
  next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params
  const review = await Review.findById(reviewId)

  if (req.user && !review.author.equals(req.user._id)) {
    req.flash('error', 'Only owners can perform this action!')
    return res.redirect(`/grounds/${id}`)
  }
  next()
}

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body)

  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}
