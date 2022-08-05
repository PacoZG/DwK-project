import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getAllTodos } from './reducers/todoReducer'
import TodoList from './components/TodoList'
import { Routes, Route } from 'react-router-dom'
import HealthCheck from './components/HealthCheck'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllTodos())
  }, [dispatch])

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<TodoList />} />
        <Route path="/healthz" element={<HealthCheck />} />
      </Routes>
    </div>
  )
}

export default App
