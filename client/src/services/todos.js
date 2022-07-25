import axios from 'axios'

const baseurl = process.env.REACT_APP_SERVER_URL || window.location.origin

console.log({ baseurl })

const getAllTodos = async () => {
  console.log(`Getting ToDos from ${baseurl}/api/todos`)
  const response = await axios.get(`${baseurl}/api/todos`)
  return response.data
}

const createTodo = async todo => {
  console.log(`Posting ToDo to ${baseurl}/api/todos`)
  const response = await axios.post(`${baseurl}/api/todos`, todo)
  return response.data
}

const removeTodo = async id => {
  console.log(`Removing ToDo from ${baseurl}/api/todos/${id}`)
  const response = await axios.delete(`${baseurl}/api/todos/${id}`)
  return response.data
}

const updateTodo = async todo => {
  console.log(`Updating ToDo from ${baseurl}/api/todos/${todo.id}`)
  const response = await axios.put(`${baseurl}/api/todos/${todo.id}`, todo)
  response.data
}

export default { getAllTodos, createTodo, removeTodo, updateTodo }
