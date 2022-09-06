import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createTodo, deleteTodo, updateTodo } from '../reducers/todoReducer'
import imageService from '../services/image'
import { useField } from '../hooks/index'
import moment from 'moment'
import { Link } from 'react-router-dom'

const TodoList = () => {
  const dispatch = useDispatch()
  const [imageURL, setImageURL] = useState('')
  const todos = useSelector(state => state.todos)
  const task = useField('text')

  // Load or saved a new random image url on the db
  useEffect(async () => {
    const imageData = await imageService.getImage()

    const imageDate = moment(imageData.date)
    const today = moment(new Date().toISOString())

    if (!today.isSame(imageDate, 'day')) {
      console.log('Post a new Image')
      const newImage = await imageService.postImage()
      setImageURL(newImage.imageURL)
    }

    if (today.isSame(imageDate, 'day')) {
      console.log('Loading saved image')
      const imageData = await imageService.getImage()
      console.log('Message: ', imageData.message)

      if (imageData.message === 'Image is not present') {
        await imageService.postImage()
        const loadNewImage = await imageService.getImage()
        setImageURL(loadNewImage.imageurl)
      } else {
        setImageURL(imageData.imageurl)
      }
    }
  }, [])

  const handleCreateTodo = () => {
    if (task.params.value.length >= 10 && task.params.value.length <= 140) {
      const newTodo = {
        task: task.params.value,
      }
      dispatch(createTodo(newTodo))
      task.reset()
    } else {
      window.alert("ERROR: Todo's length requires to be between 10 and 140 characters long")
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
      <div className="health-buttons">
        <Link to="/healthz">Health Check</Link>
      </div>

      <img className="image" alt="pic" src={imageURL} />

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
          <div className="todo" key={todo.id}>
            <div className="text">
              <label className="todo-label">{`To do:`}</label>
              {todo.task.startsWith('http') ? (
                <div className="span-link">
                  <p className="span-link">{'Read '}</p>

                  <a className="hyperlink" href={todo.task} target="blank">
                    {'Wiki page'}
                  </a>
                </div>
              ) : (
                <p className="task">{todo.task}</p>
              )}
            </div>
            <div className="status">
              <label className="status-label">{`Status: `}</label>

              <div className="status-change">
                <p className="status-is-done">{todo.status}</p>

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
          </div>
        ))}
      </div>
    </div>
  )
}

export default TodoList
