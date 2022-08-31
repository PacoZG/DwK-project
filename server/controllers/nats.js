const { connect, StringCodec } = require('nats')

const NATS_URL = process.env.NATS_URL || 'http://localhost:4222'

const nc = connect({
  url: NATS_URL,
})

console.log({ nc })
