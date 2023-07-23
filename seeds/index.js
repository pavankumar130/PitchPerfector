//Connecting to DB
const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Ground = require('../models/grounds')

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

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)]
}

const seedDB = async () => {
  await Ground.deleteMany({})

  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000)

    const ground = new Ground({
      author: '64a12c22899f4a4029296b3b',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} , ${sample(places)}`,
      image: 'https://source.unsplash.com/collection/483251',
      description:
        'Discover a wide range of available ground rentals across diverse locations on our website.',
      price: 500,
    })

    await ground.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
