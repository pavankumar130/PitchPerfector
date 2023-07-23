const Review = require('../models/review')
const Ground = require('../models/grounds')

//Add a review
module.exports.createReview = async (req, res) => {
  const id = req.params.id
  const ground = await Ground.findById(req.params.id)

  if (req.body.review.rating === '0') {
    req.flash('error', 'Please provide rating between 1 star to 5 stars')
    return res.redirect(`/grounds/${ground._id}`)
  }

  const review = new Review(req.body.review)
  review.author = req.user._id
  ground.reviews.push(review)
  await review.save()
  await ground.save()

  req.flash('success', 'Review has been added successfully')
  res.redirect(`/grounds/${ground._id}`)
}

//Delete a review
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params
  await Ground.findByIdAndUpdate(
    id,
    { $pull: { reviews: reviewId } },
    { new: true }
  )
  await Review.findByIdAndDelete(reviewId)

  req.flash('success', 'Review has been deleted successfully')
  res.redirect(`/grounds/${id}`)
}
