import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getAllTodos } from './reducers/todoReducer'
import TodoList from './components/TodoList'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllTodos())
  }, [dispatch])

  return (
    <div className="App">
      <TodoList />
    </div>
  )
}

export default App
