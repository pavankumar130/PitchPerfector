const Ground = require('../models/grounds')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })

//Render all grounds data
module.exports.index = async (req, res) => {
  const grounds = await Ground.find()
  res.render('grounds/index', { grounds })
}

//Render add ground form
module.exports.renderNewForm = (req, res) => {
  res.render('grounds/new')
}

//Create a new ground
module.exports.createGround = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.ground.location,
      limit: 1,
    })
    .send()

  const ground = new Ground(req.body.ground)
  ground.geometry = geoData.body.features[0].geometry
  ground.images = req.files.map((f) => ({
    filename: f.filename,
    url: f.path,
  }))
  ground.author = req.user._id
  await ground.save()

  req.flash('success', 'Successfully made a new rental Ground')
  res.redirect(`/grounds/${ground._id}`)
}

//Render ground data
module.exports.showGround = async (req, res) => {
  const ground = await Ground.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('author')

  if (!ground) {
    req.flash('error', 'Cannot find that ground')
    return res.redirect('/grounds')
  }
  res.render('grounds/show', { ground })
}

//Render edit ground form
module.exports.renderEditForm = async (req, res) => {
  const ground = await Ground.findById(req.params.id)

  if (!ground) {
    req.flash('error', 'Cannot find that ground')
    return res.redirect('/grounds')
  }
  res.render('grounds/edit', { ground })
}

//Update ground data
module.exports.updateGround = async (req, res) => {
  const { id } = req.params
  const ground = await Ground.findById(id)
  const { title, location, image, price, description } = req.body.ground
  await Ground.findByIdAndUpdate(
    id,
    { title, location, image, description, price },
    { new: true }
  )
  const imgs = req.files.map((f) => ({
    filename: f.filename,
    url: f.path,
  }))
  ground.images.push(...imgs)
  await ground.save()

  if (req.body.deleteImages) {
    await ground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    })
  }

  req.flash('success', 'Successfully updated ground details!')
  res.redirect(`/grounds/${id}`)
}

//Delete ground
module.exports.deleteGround = async (req, res) => {
  const { id } = req.params
  await Ground.findByIdAndDelete(id)

  req.flash('success', 'Ground has been deleted successfully')
  res.redirect('/grounds')
}
