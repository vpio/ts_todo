import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import 'bootstrap/dist/css/bootstrap.min.css';
const uuidv4 = require("uuid/v4")

function App() {
  const [todos, updateTodos] = useState<any[]>([]);
  const [newTodo, setNewTodo] = useState<string>('')
  const [isSaved, updateIsSaved] = useState<boolean>(false)
  const [currentFilter, setFilter] = useState<string>('all')

  useEffect(() => { getData() }, [])

  const getData = () => {
    fetch('/data').then(res => res.json()).then(data => updateTodos(data.data))
  }

  const handleClick = () => {
    const newTodos = [...todos, { description: newTodo, completed: 0, id: uuidv4() }]
    updateTodos(newTodos)
    setNewTodo('')
    updateIsSaved(false)
  }
  const toggleTodo = (id: string) => {
    const updatingTodo = todos.find(todo => todo.id === id)
    const newTodos = [...todos.filter(todo => todo.id !== id), { ...updatingTodo, completed: updatingTodo.completed ? 0 : 1 }]
    updateTodos(newTodos)
    updateIsSaved(false)
  }
  const clearCompleted = () => {
    const newTodos = [...todos].filter(todo => !todo.completed)
    updateTodos(newTodos)
  }
  const postTodos = () => {
    fetch('/data', { method: 'post', 
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(todos) }).then(() => {getData(); updateIsSaved(true)})
  }

  const deleteTodo = (id: string) => {
    if (!isSaved) { alert('must save before deleting') }
    else {
      const deletingTodo = todos.find(todo => todo.id === id)
      fetch('/delete', { method: 'post', 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(deletingTodo) }).then(() => {getData(); updateIsSaved(true)})
    }
  }

  const bulkDelete = () => {
    if (!isSaved) { alert('must save before deleting') }
    else {
      fetch('/bulkDelete', { method: 'post', 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }}).then(() => {getData(); updateIsSaved(true)})
    }
  }

  const filters = (): any => {
    return {
      all: todos,
      active: todos.filter(todo => todo.completed === 0),
      completed: todos.filter(todo => todo.completed === 1)
    }
  }

  return (
    <Container className="App">
      <InputGroup className="mb-3 mt-5">
        <Form.Control value={newTodo} onChange={(e) => setNewTodo(e.target.value)}></Form.Control>
        <Button variant="outline-success" onClick={handleClick}>Create Todo</Button>
      </InputGroup>
      {isSaved ? <span>progress saved.</span> : null}
      {todos.length ? (
        <div>
          <h5>here's your todos:</h5>
          <Table size='sm'>
            <tbody>
              {filters()[currentFilter].map((todo: any) => (
                <tr>
                  <td><Button variant="danger" onClick={() => deleteTodo(todo.id)}>delete</Button></td>
                  <td key={todo.id} style={todo.completed ? { color: 'green' } : {}} onClick={() => toggleTodo(todo.id)}>{todo.description}</td> 
                </tr>
              ))}
            </tbody>
          </Table>
          <ButtonGroup style={{float: 'right'}}>
            <Button onClick={() => setFilter('active')}>show active</Button>
            <Button onClick={() => setFilter('completed')}>show completed</Button>
            <Button onClick={() => setFilter('all')}>show all</Button>
            <Button onClick={bulkDelete}>clear completed</Button>
            <Button onClick={postTodos}>Save</Button>
          </ButtonGroup>
          <i>click task to toggle between active and completed.</i>
          <h5 className="mt-5">active tasks: {filters().active.length}</h5>
        </div>
      ) : <h4>Nothing To Do!</h4>
      }
    </Container>
  )
}

export default App;
