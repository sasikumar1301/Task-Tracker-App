import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import './TaskTracker.css'


const initialState = {
  tasks: [],
};

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload ? { ...task, completed: !task.completed } : task
        ),
      };
    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.payload,

        
      };
    default:
      return state;
  }
};

const TaskTracker = () => {
  const [taskInput, setTaskInput] = useState('');
  const [state, dispatch] = useReducer(taskReducer, initialState);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/todos')
      .then(response => {
        dispatch({ type: 'SET_TASKS', payload: response.data });
      })
      .catch(error => {
        console.error('Error fetching tasks: ', error);
      });
  }, []);

  useEffect(() => {
    axios.post('https://jsonplaceholder.typicode.com/todos', state.tasks)
      .then(response => {
        
      })
      .catch(error => {
        console.error('Error saving tasks: ', error);
      });
  }, [state.tasks]);

  const addTask = () => {
  if (taskInput.trim() !== '') {
    const newTask = {
      id: state.tasks.length + 1,
      title: taskInput,
      completed: false,
    };

    dispatch({ type: 'ADD_TASK', payload: newTask });
    setTaskInput('');
    setTimeout(() => {
      alert('Task added successfully!');
    }, 100); // Adjust the delay time as needed
  } 
  
};

  const deleteTask = taskId => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  };

  const toggleTask = taskId => {
    dispatch({ type: 'TOGGLE_TASK', payload: taskId });
  };

  return (
    <div className='task-tracker'>
      <h1 className='creative-heading'>Task Tracker Application</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          addTask();
        }}
      >
        <input
          type="text"
          value={taskInput}
          onChange={e => setTaskInput(e.target.value)}
          placeholder="Add a task..."
        />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {state.tasks.map(task => (
          <li className="task-item" key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            <p className='text'><span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title}
            </span></p>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskTracker;
