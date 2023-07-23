const express = require('express')
const router = express.Router({ mergeParams: true })
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Review = require('../models/review')
const Ground = require('../models/grounds')
const reviews = require('../controllers/reviews')

//Post a new review
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

//Delete review
router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
)

module.exports = router
