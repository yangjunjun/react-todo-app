import * as React from 'react';
import type { Todo } from './todo';

type TodoAppState = {
  title: string;
  todos: Todo[];
  currentEditTodo: Todo | null;
  oldEditTodo: Todo | null;
  filterType: 'all' | 'completed' | 'uncompleted';
};

class TodoApp extends React.Component<null, TodoAppState> {
  interval: number = 0;

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      todos: [
        {
          id: 1,
          title: 'learn html',
          completed: false,
        },
      ],
      currentEditTodo: null,
      oldEditTodo: null,      
      filterType: 'all',
    };
    this.startEditTodo = this.startEditTodo.bind(this)
  }
  handleChange(e) {
    this.setState({ title: e.target.value });
  }
  handleChangeEnter (e) {
    if (e.keyCode === 13) {
      this.addTodo()
    } 
  }
  addTodo() {
    const maxId = Math.max(...this.state.todos.map((todo) => todo.id), 0);
    const newTodo = {
      id: maxId + 1,
      title: this.state.title,
      completed: false,
    },
    this.setState((state) => {
      return {
        todos: state.todos.concat(newTodo),
        title: '',
      };
    });
  }
  deleteTodo (todo) {
    const newTodos = this.state.todos.filter(item => item !== todo)
    this.setState({
      todos: newTodos,
    })
  }
  startEditTodo (todo) {
    this.setState({
      currentEditTodo: todo,
      oldEditTodo: {...todo},
    })
  }
  handleEditChange (e) {
    this.setState(state => ({ 
      oldEditTodo: {
        ...state.oldEditTodo,
        title: e.target.value
      } 
    }));
  }
  cancelEditTodo () {
    this.setState({
      currentEditTodo: null,
      oldEditTodo: null,
    })
  }
  confirmEditTodo () {
    const newTodos = this.state.todos.map(todo =>{
      if (todo.id === this.state.oldEditTodo.id) {
        todo.title = this.state.oldEditTodo.title
      }
      return todo;
    })
    this.setState(state => ({
      todos: newTodos,
      currentEditTodo: null,
      oldEditTodo: null,
    }))
  }
  handleKeyupEnterConfirm (e) {
    if (e.keyCode === 13) {
      this.confirmEditTodo()
    } 
  }
  handleCompletedChange (e, targetTodo) {
    const newTodos = this.state.todos.map(todo =>{
      if (todo.id === targetTodo.id) {
        todo.completed = e.target.checked
      }
      return todo;
    })
    this.setState(state => ({
      todos: newTodos,
    }))
  }
  completeAll () {
    this.setState(state => {
      return {
        todos: state.todos.map(todo => {
          todo.completed = true
          return todo;
        })
      }
    })
  }
  clearAllComplete () {
    this.setState(state => {
      return {
        todos: state.todos.filter(todo => {
          return !todo.completed
        })
      }
    })
  }  
  show (type) {
    this.setState(() => ({
      filterType: type
    }))
  }
  render() {
    const fixedTodos = this.state.todos.filter((item) => {
      if (this.state.filterType === 'all') {
        return true;
      } else if (this.state.filterType === 'completed') {
        return item.completed;
      } else {
        return !item.completed;
      }
    });
    return (
      <div>
        <h1>todo app</h1>
        <div>
          <input 
            value={this.state.title} 
            onChange={e => this.handleChange(e)} 
            onKeyUp={e => this.handleChangeEnter(e)}/>
          <button onClick={() => this.addTodo()}>add todo</button>
        </div>
        <div>
          <ul>
            {fixedTodos.map((todo, index) => {
              return <li key={todo.id}>
                <input type="checkbox" checked={todo.completed} onChange={e => this.handleCompletedChange(e, todo)} />
                { 
                  todo === this.state.currentEditTodo ?
                  <div style={{display: 'inline-block'}}>
                    <input 
                      value={this.state.oldEditTodo.title} 
                      onChange={e => this.handleEditChange(e)}
                      onBlur={e => this.confirmEditTodo()}
                      onKeyUp={e => this.handleKeyupEnterConfirm(e)} 
                    />
                    <button onClick={() => this.cancelEditTodo()}>cancel 02</button>
                    <button onClick={() => this.confirmEditTodo()}>confirm 01</button>
                  </div>
                  : 
                  <div style={{display: 'inline-block'}}>
                    {index + ' | ' + todo.title}
                    <button onClick={() => this.startEditTodo(todo)}>edit</button>               
                    <button onClick={() => this.deleteTodo(todo)}>delete</button>                    
                  </div>
                } 
              </li>;
            })}
          </ul>
        </div>
        <div>
          <button onClick={() => this.completeAll()}>complete all</button>
          <button onClick={() => this.clearAllComplete()}>clearAllComplete</button>
          <button onClick={() => this.show('all')}>show all</button>
          <button onClick={() => this.show('completed')}>show completed</button>
          <button onClick={() => this.show('uncompleted')}>show uncompleted</button>
        </div>
        <div>
          title:<pre>{this.state.title}</pre>
          todos:<pre>{JSON.stringify(this.state.todos, null, 2)}</pre>
          oldEditTodo:<pre>{JSON.stringify(this.state.oldEditTodo, null, 2)}</pre>
        </div>
      </div>
    );
  }
}
export default TodoApp;
