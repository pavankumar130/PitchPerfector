const express = require('express')
const router = express.Router()
const grounds = require('../controllers/grounds')
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isAuthor, validateGround } = require('../middleware')
const Ground = require('../models/grounds')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router
  .route('/')
  //Render all grounds
  .get(catchAsync(grounds.index))
  //Create a new ground
  .post(
    isLoggedIn,
    upload.array('image'),
    validateGround,
    catchAsync(grounds.createGround)
  )

router.get('/new', isLoggedIn, grounds.renderNewForm)

router
  .route('/:id')
  //Render ground data
  .get(catchAsync(grounds.showGround))
  //Update ground data
  .put(
    isLoggedIn,
    isAuthor,
    upload.array('image'),
    validateGround,
    catchAsync(grounds.updateGround)
  )
  //Delete the ground
  .delete(isLoggedIn, isAuthor, catchAsync(grounds.deleteGround))

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(grounds.renderEditForm)
)

module.exports = router
