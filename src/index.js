const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(400).json({ error: 'User nao encontrado' });
  }

  request.todos = user.todos;
  // request.user = user;


  next(); // chamando next
}

// function checksExistsTodo(request, response, next) {

//   const { id } = request.params
//   const { user } = request;

//   const todoIndex = user.todos.findIndex(todo => todo.id === id) 

//   if (todoIndex < 0) {
//     return response.status(404).json({ error: "Todo not found!" });
//   }

//   request.todo = user.todos[todoIndex];

//   return next();
// }


app.post('/users', (request, response) => {
  // Complete aqui
  const {name,username}=request.body;
 
  const userAlreadyExists = users.some(
    (user) => user.username === username
  ); 

  if (userAlreadyExists) {
    return response.status(400).json({ error: "Usuario já existe" });
  }

 
  const usuario={
    id:uuidv4(),
    name:name,
    username:username,
    todos:[]
  }

  users.push(usuario);  
  return response.status(201).json(usuario);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  // const username = request.headers.username;
  //Padrao
  // const {username } = request.headers;   faz o mesmo que o de cima


  const todos = username.todo;

  return response.json(todos);
  
});


app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {title, deadline} = request.body;   //recebendo title e deadline
  const username = request.headers

  const novoTodo = {
    id: uuidv4(),
    title: title,
    done:false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  todos.push(novoTodo);  // armazenando novoTodo dentro da lista de todos

  return response.json(novoTodo);
});



app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
// app.put('/todos/:id', checksExistsUserAccount, ({todos,body,params}, response) => {
  // Complete aqui

  // const {username} = request.username;
  const { title, deadline } = request.body;
  const { todo } = request;

  todo.title = title;
  todo.deadline = deadline;

  
  //VOLTAR AQUI

  // todos[todoIndex] = {
  //   ...todos[todoIndex],
  //   title: title || todos[todoIndex].title,
  //   deadline: deadline || todos[todoIndex].deadline
  // };

  return response.status(201).send(todo);

});

// app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
app.patch('/todos/:id/done', checksExistsUserAccount, ({ todos, params }, response) => {
  // Complete aqui
  
  // const { todo } = request;

  // todo.done = true;

  // return response.status(201).send(todo);



  const todoIndex = todos.findIndex(todo => todo.id === id);

  if (todoIndex < 0) {
    return response.status(404).json({ error: 'Todo not found' });
  }

  todos[todoIndex] = { ...todos[todoIndex], done: !todos[todoIndex].done };

  return response.json(todos[todoIndex]);


});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { user, todo } = request;

  const todoIndex = user.todos.findIndex(_todo => _todo === todo) 

  user.todos.splice(todoIndex, 1);

  return response.status(204).send();
});

module.exports = app;