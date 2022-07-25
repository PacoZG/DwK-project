import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createTodo, deleteTodo, updateTodo } from '../reducers/todoReducer'
import { useField } from '../hooks/index'

const TodoList = () => {
  const dispatch = useDispatch()
  const todos = useSelector(state => state.todos)
  const task = useField('text')

  const handleCreateTodo = () => {
    if (task.params.value.length >= 10) {
      if (task.params.value.length <= 140) {
        const newTodo = {
          task: task.params.value,
        }
        dispatch(createTodo(newTodo))
        task.reset()
        window.alert('To Do successfully created')
      } else {
        const newTodo = {
          task: task.params.value,
        }
        dispatch(createTodo(newTodo))
        window.alert("ERROR: Todo's lenght is larger than 140 characters")
      }
    } else {
      window.alert('Todos length is too short')
    }
  }

  const handleUpdateTodo = todo => {
    dispatch(updateTodo(todo))
  }

  const handleDeleteTodo = todo => {
    dispatch(deleteTodo(todo))
  }

  return (
    <div className="TodoList">
      <img className="image" alt="pic" src="https://picsum.photos/1200" />
      {task.params.value.length <= 140 ? (
        <label className="label">{`${task.params.value.length} characters of 140 allowed`}</label>
      ) : (
        <label className="label">{`Todo is ${
          parseInt(task.params.value.length) - 140
        } characters longer than the maximum allowed`}</label>
      )}
      <textarea className="textarea" placeholder="140 characters minimum" maxLength={200} {...task.params} />
      <button className="button" onClick={() => handleCreateTodo()}>
        Create TODO
      </button>
      <div className="frame">
        {todos.map(todo => (
          <ul className="todo" key={todo.id}>
            <li className="text">
              <label>{`To do: `}</label>
              {todo.task.startsWith('http') ? (
                <div className="span-link">
                  <p className="span-link">{'Read '}</p>
                  <a className="hyperlink" href={todo.task} target="blank">
                    {'Wiki page'}
                  </a>
                </div>
              ) : (
                <span className="span">{todo.task}</span>
              )}
            </li>
            <div className="status">
              {`Status: `}
              <div className="status-label">
                <span className="span">{todo.status}</span>
                {todo.status === 'not-done' ? (
                  <button className="update-button" onClick={() => handleUpdateTodo(todo)}>
                    mark as done
                  </button>
                ) : (
                  <button className="update-button" onClick={() => handleUpdateTodo(todo)}>
                    mark as not done
                  </button>
                )}
              </div>
            </div>
            <button className="delete-button" onClick={() => handleDeleteTodo(todo)}>
              delete
            </button>
          </ul>
        ))}
      </div>
    </div>
  )
}

export default TodoList
