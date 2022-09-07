require('dotenv').config()
const NATS = require('nats')
const natsSC = NATS.StringCodec()
const NATS_URL = process.env.NATS_URL
const DISCORD_URL = process.env.DISCORD_URL

const axios = require('axios')

if (NATS_URL) {
  console.log({ NATS_URL })
  console.log('Broadcaster started')
  NATS.connect({ servers: NATS_URL }).then(async conn => {
    // console.log('Sending message: 1')
    const sub = conn.subscribe('todo_created', { queue: 'broadcaster.workers' })
    // console.log('Sending message: 2', sub)
    for await (const message of sub) {
      console.log(`Sending message: ${natsSC.decode(message.data)}`)
      console.log(natsSC.decode(message.data))
      const m_json = { 'content': natsSC.decode(message.data) }
      await axios.post(DISCORD_URL, m_json)
    }
  })
} else {
  console.log('No NATS URL has been provided')
}
