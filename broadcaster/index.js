require('dotenv').config()
const NATS = require('nats')
const natsSC = NATS.StringCodec()
const NATS_URL = process.env.NATS_URL

console.log({ NATS_URL })

const axios = require('axios')
const discord_url =
  'https://discord.com/api/webhooks/1012335028254036099/JS8N_3lG6iGPLRORpz1mcOfIX5WzPJ5JrUJryyFm2_nOCOwmP8qcBakK6YtfDm3DQLD-'

console.log('Broadcaster started')
NATS.connect({ servers: NATS_URL }).then(async conn => {
  // console.log('Sending message: 1')
  const sub = conn.subscribe('todo_created', { queue: 'broadcaster.workers' })
  // console.log('Sending message: 2', sub)
  for await (const message of sub) {
    console.log(`Sending message: ${natsSC.decode(message.data)}`)
    console.log(natsSC.decode(message.data))
    const m_json = { 'content': natsSC.decode(message.data) }
    await axios.post(discord_url, m_json)
  }
})
