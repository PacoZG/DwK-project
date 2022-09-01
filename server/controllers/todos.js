const { v4: uuidv4 } = require('uuid')
const todoappRouter = require('express').Router()
const config = require('../utils/config')
const date = require('../utils/helper')
const { connect, StringCodec } = require('nats')
const sc = StringCodec()

const NATS_URL = process.env.NATS_URL || 'demo.nats.io:4222'

connect({ servers: NATS_URL }).then(async nc => {
  nc.publish('todo_created', sc.encode('Sending data'))
})

console.log(date.formatDate())
todoappRouter.get('/', async (request, response) => {
  console.log(`GET request to ${request.protocol}://${request.get('host')}/api/todos  done succesfully`)
  const data = await config.query('SELECT * FROM todos')
  response.status(200).send(data)
})

todoappRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  console.log(`GET request to ${request.protocol}://${request.get('host')}/api/todos/${id}  done succesfully`)
  const data = await config.query(`SELECT * FROM todos WHERE id='${id}'`)
  response.status(200).json(data)
})

todoappRouter.post('/', async (request, response) => {
  const id = uuidv4()
  console.log(`POST request to ${request.protocol}://${request.get('host')}/api/todos  done succesfully`)
  const { body } = request
  const scapedTask = config.connect().escapeLiteral(body.task)
  if (body.task.length <= 140) {
    await config.query(`INSERT INTO todos(id, task, status) VALUES('${id}', ${scapedTask}, 'not-done')`)
    const newTodo = {
      ...body,
      id: id,
      status: 'not-done',
    }

    const todoForDiscord = `New todo created...\n{\n id: ${id}\n task: ${newTodo.task}\n status: ${
      newTodo.status
    }\n}\n\nDate: ${date.formatDate()}`
    connect({ servers: NATS_URL }).then(async nc => {
      nc.publish('todo_created', sc.encode(todoForDiscord))
    })
    response.status(201).json(newTodo)
  } else {
    console.error("ERROR: Todo's lenght is larger than 140 characters")
  }
})

todoappRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  console.log(`POST request to ${request.protocol}://${request.get('host')}/api/todos/${id}  done succesfully`)
  const { body } = request
  let status
  if (body.status === 'not-done') {
    status = 'done'
  } else {
    status = 'not-done'
  }
  await config.query(`UPDATE todos SET status='${status}' WHERE id='${id}'`)
  updatedTodo = { ...body, status: `${status}` }

  const todoForDiscord = `Todo updated...\n{\n id: ${id}\n task: ${updatedTodo.task}\n status: ${
    updatedTodo.status
  }\n}\n\nDate: ${date.formatDate()}`
  connect({ servers: NATS_URL }).then(async nc => {
    nc.publish('todo_created', sc.encode(todoForDiscord))
  })
  response.status(201).json(updatedTodo)
})

todoappRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  console.log(`DELETE request to ${request.protocol}://${request.get('host')}/api/todos/${id}  done succesfully`)
  await config.query(`DELETE FROM todos WHERE id='${id}'`)

  console.log(date.formatDate())

  const todoForDiscord = `Todo with id: ${id} has been deleted at ${date.formatDate()}\n`
  connect({ servers: NATS_URL }).then(async nc => {
    nc.publish('todo_created', sc.encode(todoForDiscord))
  })
  response.status(204).json().end()
})

module.exports = todoappRouter
