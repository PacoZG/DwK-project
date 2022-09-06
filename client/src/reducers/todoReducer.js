import todoService from '../services/todos'

const todoReducer = (state = [], action) => {
  switch (action.type) {
    case 'GET_TODOS':
      return action.data
    case 'CREATE_TODO':
      return state.concat(action.data)
    case 'DELETE_TODO':
      return state.filter(todo => todo.id !== action.data)
    case 'UPDATE_TODO':
      const id = action.data.id
      return state.map(todo => (todo.id !== id ? todo : action.data))
    default:
      return state
  }
}

export const getAllTodos = () => {
  return async dispatch => {
    try {
      const todos = await todoService.getAllTodos()
      dispatch({
        type: 'GET_TODOS',
        data: todos,
      })
    } catch (error) {
      console.log(error.message, 'from', error.config.url)
    }
  }
}

export const createTodo = todo => {
  return async dispatch => {
    const newTodo = await todoService.createTodo(todo)
    dispatch({
      type: 'CREATE_TODO',
      data: newTodo,
    })
  }
}

export const deleteTodo = todo => {
  return async dispatch => {
    dispatch({
      type: 'DELETE_TODO',
      data: todo.id,
    })
    await todoService.removeTodo(todo.id)
  }
}

export const updateTodo = todo => {
  return async dispatch => {
    const updatedTodo = await todoService.updateTodo(todo)
    dispatch({
      type: 'UPDATE_TODO',
      data: updatedTodo,
    })
  }
}

export default todoReducer
