require('express-async-errors')
const express = require('express')
const cors = require('cors')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const NATS = require('nats')
const natsSC = NATS.StringCodec()

const app = express()

console.log('Password: ', config.PASSWORD)

const NATS_URL = process.env.NATS_URL || 'demo.nats.io:4222'

NATS.connect({ servers: NATS_URL }).then(async nc => {
  nc.publish('todo_created', natsSC.encode('Sending data'))
})

setTimeout(() => {
  ;(async () => {
    const client = config.connect()
    await client.connect()
    await client.query(
      `CREATE TABLE IF NOT EXISTS todos(
        id uuid PRIMARY KEY,
        task text,
        status text
      );`
    )
    await client.query(
      `CREATE TABLE IF NOT EXISTS image(
        id SERIAL PRIMARY KEY,
        date TIMESTAMP,
        imageURL TEXT
      );`
    )
    await client.end()
  })()
}, 10000)

const todoappRouter = require('./controllers/todos')
const imageRouter = require('./controllers/image')

app.use(middleware.tokenExtractor)
app.use(middleware.requestLogger)
app.use(middleware.errorHandler)

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use('/api/todos', todoappRouter)
app.use('/api/image', imageRouter)

app.get('/healthz', async (_, res) => {
  try {
    const client = config.connect()
    await client.connect()
    console.log(`Received a request to healthz and responding with status 200`)
    res.status(200).send('Application ready')
    await client.end()
  } catch (error) {
    console.log(`Received a request to healthz and responding with status 500`)
    res.status(500).send('Application not Ready')
  }
})

app.get('/', (_, res) => {
  res.status(200).send('ok')
})

module.exports = app
