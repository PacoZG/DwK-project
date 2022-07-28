const imageRouter = require('express').Router()
const config = require('../utils/config')

imageRouter.get('/', async (request, response) => {
  console.log(`GET request to ${request.protocol}://${request.get('host')}/api/image  done succesfully`)
  const imageData = await config.query(`SELECT * FROM image WHERE id=1`)
  // await config.query(`DELETE FROM image WHERE id=1`)
  // console.log(await config.query(`SELECT * FROM image`))
  if (imageData.length === 0) {
    response.json({ message: 'Image is not present' })
  } else {
    response.status(200).json(imageData[0])
  }
})

imageRouter.post('/', async (request, response) => {
  console.log(`POST request to ${request.protocol}://${request.get('host')}/api/image  done succesfully`)
  const { body } = request
  const data = await config.query(`SELECT * FROM image WHERE id=1`)
  const scapedURL = config.connect().escapeLiteral(body.imageURL)
  if (data.length === 0) {
    await config.query(`INSERT INTO image(id, date, imageurl) VALUES(1, '${body.date}',  ${scapedURL})`)
    const newImage = {
      ...body,
      date: body.date,
      imageURL: scapedURL,
    }
    response.status(201).json(newImage)
  } else {
    await config.query(`UPDATE image SET date='${body.date}', imageurl=${scapedURL} WHERE id=1`)
    const newImage = {
      ...body,
      date: body.date,
      imageURL: scapedURL,
    }
    response.status(201).json(newImage)
  }
})

module.exports = imageRouter
