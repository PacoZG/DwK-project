require('express-async-errors')
const express = require('express')
const cors = require('cors')
const config = require('./utils/config')
const middleware = require('./utils/middleware')

const app = express()

console.log('Password: ', config.PASSWORD)

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
    await client.end()
  })()
}, 5000)

const todoappRouter = require('./controllers/todos')

app.use(middleware.tokenExtractor)
app.use(middleware.serverURL)
app.use(middleware.requestLogger)
app.use(middleware.errorHandler)

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use('/api/todos', todoappRouter)

app.get('/health', (_, res) => {
  res.send('ok')
})

app.get('/', (_, res) => {
  res.status(200).send('ok')
})

module.exports = app
