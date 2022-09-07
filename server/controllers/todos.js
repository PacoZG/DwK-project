require('dotenv').config()
const { v4: uuidv4 } = require('uuid')
const todoappRouter = require('express').Router()
const config = require('../utils/config')
const { connect, StringCodec } = require('nats')
const sc = StringCodec()
const moment = require('moment')

const NATS_URL = process.env.NATS_URL

if (NATS_URL) {
  console.log({ NATS_URL })
  connect({ servers: NATS_URL }).then(async nc => {
    nc.publish('todo_created', sc.encode('Sending data'))
  })
} else {
  console.log('No NATS URL has been provided')
}

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
  const newDate = moment().format('YYYY-MM-DD HH:mm:ss')

  if (body.task.length <= 140) {
    await config.query(
      `INSERT INTO todos(id, task, status, createdat) VALUES('${id}', ${scapedTask}, 'not-done', '${newDate}')`
    )
    const newTodo = {
      ...body,
      id: id,
      status: 'not-done',
      createdat: newDate,
      modifiedat: null,
    }
    if (NATS_URL) {
      const todoForDiscord = `New todo created...\n{\n id: ${id}\n task: ${newTodo.task}\n status: ${
        newTodo.status
      }\n createdAt: ${newTodo.createdat}\n modifiedAt: ${newTodo.modifiedat}\n}\n\nDate: ${moment().format(
        'YYYY-MM-DD HH:mm:ss'
      )}`
      connect({ servers: NATS_URL }).then(async nc => {
        nc.publish('todo_created', sc.encode(todoForDiscord))
      })
    }

    response.status(201).json(newTodo)
  } else {
    console.error("ERROR: Todo's lenght is larger than 140 characters")
  }
})

todoappRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  console.log(`PUT request to ${request.protocol}://${request.get('host')}/api/todos/${id}  done succesfully`)
  const { body } = request

  const newDate = moment().format('YYYY-MM-DD HH:mm:ss')

  let status
  if (body.status === 'not-done') {
    status = 'done'
  } else {
    status = 'not-done'
  }

  await config.query(`UPDATE todos SET status='${status}', modifiedat='${newDate}' WHERE id='${id}'`)
  updatedTodo = {
    ...body,
    status: `${status}`,
    modifiedat: newDate,
  }

  if (NATS_URL) {
    const todoForDiscord = `Todo marked as ${updatedTodo.status}...\n{\n id: ${id}\n task: ${
      updatedTodo.task
    }\n status: ${updatedTodo.status}\n createdAt: ${moment(updatedTodo.createdat).format(
      'YYYY-MM-DD HH:mm:ss'
    )}\n modifiedAt: ${newDate}\n}\n\nModified at: ${newDate}`
    connect({ servers: NATS_URL }).then(async nc => {
      nc.publish('todo_created', sc.encode(todoForDiscord))
    })
  }

  response.status(201).json(updatedTodo)
})

todoappRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  console.log(`DELETE request to ${request.protocol}://${request.get('host')}/api/todos/${id}  done succesfully`)
  await config.query(`DELETE FROM todos WHERE id='${id}'`)

  if (NATS_URL) {
    const todoForDiscord = `Todo with id: ${id} has been deleted at ${moment().format('YYYY-MM-DD HH:mm:ss')}\n`
    connect({ servers: NATS_URL }).then(async nc => {
      nc.publish('todo_created', sc.encode(todoForDiscord))
    })
  }
  response.status(204).json().end()
})

module.exports = todoappRouter
