require('dotenv').config()
const { v4: uuidv4 } = require('uuid')
const todoappRouter = require('express').Router()
const config = require('../utils/config')
const { connect, StringCodec } = require('nats')
const sc = StringCodec()
const moment = require('moment')

const NATS_URL = process.env.NATS_URL

console.log({ NATS_URL })

connect({ servers: NATS_URL }).then(async nc => {
  nc.publish('todo_created', sc.encode('Sending data'))
})

todoappRouter.get('/', async (request, response) => {
  console.log(`GET request to ${request.protocol}://${request.get('host')}/api/todos  done succesfully`)
  const data = await config.query('SELECT * FROM todos')
  console.log(data)
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
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      modifiedAt: null,
    }

    const todoForDiscord = `New todo created...\n{\n id: ${id}\n task: ${newTodo.task}\n status: ${
      newTodo.status
    }\n createdAt: ${newTodo.createdAt}\n modifiedAt: ${newTodo.modifiedAt}\n}\n\nDate: ${moment().format(
      'YYYY-MM-DD HH:mm:ss'
    )}`
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
  console.log(`PUT request to ${request.protocol}://${request.get('host')}/api/todos/${id}  done succesfully`)
  const { body } = request

  let status
  if (body.status === 'not-done') {
    status = 'done'
  } else {
    status = 'not-done'
  }
  await config.query(`UPDATE todos SET status='${status}' WHERE id='${id}'`)
  updatedTodo = {
    ...body,
    status: `${status}`,
    modifiedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
  }

  const todoForDiscord = `Todo marked as ${updatedTodo.status}...\n{\n id: ${id}\n task: ${
    updatedTodo.task
  }\n status: ${updatedTodo.status}\n createdAt: ${updatedTodo.createdAt}\n modifiedAt: ${
    updatedTodo.modifiedAt
  }\n}\n\nModified at: ${moment().format('YYYY-MM-DD HH:mm:ss')}`
  connect({ servers: NATS_URL }).then(async nc => {
    nc.publish('todo_created', sc.encode(todoForDiscord))
  })
  response.status(201).json(updatedTodo)
})

todoappRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  console.log(`DELETE request to ${request.protocol}://${request.get('host')}/api/todos/${id}  done succesfully`)
  await config.query(`DELETE FROM todos WHERE id='${id}'`)

  const todoForDiscord = `Todo with id: ${id} has been deleted at ${moment().format('YYYY-MM-DD HH:mm:ss')}\n`
  connect({ servers: NATS_URL }).then(async nc => {
    nc.publish('todo_created', sc.encode(todoForDiscord))
  })
  response.status(204).json().end()
})

module.exports = todoappRouter
