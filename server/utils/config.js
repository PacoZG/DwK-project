require('dotenv').config()
const { Client } = require('pg')

const PORT = process.env.PORT || 3001
const PASSWORD = process.env.POSTGRES_PASSWORD

const connect = () => {
  const client = new Client({
    user: process.env.POSTGRES_USER || 'postgres',
    port: process.env.POSTGRES_PORT || 5432,
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'postgres',
    password: PASSWORD || 'postgres',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 3000,
  })
  return client
}

const query = async query => {
  const client = connect()
  // console.log({ client })
  await client.connect()
  const { rows } = await client.query(query)
  await client.end()
  return rows
}

module.exports = { PORT, PASSWORD, connect, query }
