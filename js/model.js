(function() {
  function Model(name) {
    this.name = name;
    this.todos = JSON.parse(localStorage.getItem(this.name)) || [];
  }

  Model.prototype.bindTodoListChanged = function (callback) {
    this.onTodoListChanged = callback;
  };

  Model.prototype.handleTodoListChanged = function() {
    this.onTodoListChanged(this.todos);
    this.saveTodos();
  };

  Model.prototype.saveTodos = function() {
    localStorage.setItem(this.name, JSON.stringify(this.todos));
  };

  Model.prototype.findTodo = function(todos, id) {
    for (var i = 0; i < todos.length; i++) {
      if (todos[i].id === id) {
        return todos[i];
      }

      var foundTodo = this.findTodo(todos[i].todos, id);
      if (foundTodo) {
        return foundTodo;
      }
    }
  };

  Model.prototype.findTodoList = function(todos, id) {
    for (var i = 0; i < todos.length; i++) {
      if (todos[i].id === id) {
        return todos;
      }

      var foundTodoList = this.findTodoList(todos[i].todos, id);
      if (foundTodoList) {
        return foundTodoList;
      }
    }
  };

  Model.prototype.setupTodo = function(todoText) {
    return {
      id: uuid(),
      title: todoText,
      completed: false,
      expanded: false,
      todos: []
    };
  };

  Model.prototype.createTodo = function(todoText) {
    var todo = this.setupTodo(todoText);

    this.todos.push(todo);
    this.handleTodoListChanged();
  };

  Model.prototype.createNestedTodo = function(todoText, parentId) {
    var parentTodo = this.findTodo(this.todos, parentId);

    if (!parentTodo) {
      return;
    }

    var todo = this.setupTodo(todoText);
    parentTodo.todos.push(todo);
    parentTodo.expanded = true;
    this.handleTodoListChanged();
  };

  Model.prototype.editTodo = function(id, updatedText) {
    var todo = this.findTodo(this.todos, id);

    if (!todo) {
      return;
    }

    todo.title = updatedText;
    this.handleTodoListChanged();
  };

  Model.prototype.toggleTodoCompleted = function(id) {
    var todo = this.findTodo(this.todos, id);

    if (!todo) {
      return;
    }

    todo.completed = !todo.completed;
    this.saveTodos();
  };

  Model.prototype.deleteTodo = function(id) {
    var todoList = this.findTodoList(this.todos, id);
    if (!todoList) {
      return;
    }

    var index = todoList.findIndex(function(todo) {
      return todo.id === id;
    });

    if (index < 0) {
      return;
    }

    todoList.splice(index, 1);
    if (!todoList.length) {
      var todo = this.findTodo(this.todos, id);
      if (todo) {
        todo.expanded = false;
      }
    }
    this.handleTodoListChanged();
  };

  Model.prototype.toggleNestedTodos = function(id) {
    var todo = this.findTodo(this.todos, id);

    if (!todo) {
      return;
    }

    todo.expanded = !todo.expanded;
    this.saveTodos();
  };

  window.app = window.app || {};
  window.app.Model = Model;
})();
