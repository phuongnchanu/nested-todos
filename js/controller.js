(function() {
  function Controller(model, view) {
    this.model = model;
    this.view = view;

    this.model.bindTodoListChanged(this.onTodoListChanged.bind(this));
    this.view.bindCreateTodo(this.handleCreateTodo.bind(this));
    this.view.bindCreateNestedTodo(this.handleCreateNestedTodo.bind(this));
    this.view.bindDeleteTodo(this.handleDeleteTodo.bind(this));
    this.view.bindToggleTodoCompleted(this.handleToggleTodoCompleted.bind(this));
    this.view.bindEditTodo(this.handleEditTodo.bind(this));
    this.view.bindToggleNestedTodos(this.handleToggleNestedTodos.bind(this));
    this.view.bindDialogEvents();

    this.onTodoListChanged(this.model.todos);
  }

  Controller.prototype.handleCreateTodo = function(todoText) {
    this.model.createTodo(todoText);
  };

  Controller.prototype.handleCreateNestedTodo = function(todoText, parentId) {
    this.model.createNestedTodo(todoText, parentId);
  };

  Controller.prototype.handleToggleTodoCompleted = function(todoId) {
    this.model.toggleTodoCompleted(todoId);
  };

  Controller.prototype.handleDeleteTodo = function(todoId) {
    this.model.deleteTodo(todoId);
  };

  Controller.prototype.handleEditTodo = function(todoId, todoText) {
    this.model.editTodo(todoId, todoText);
  };

  Controller.prototype.handleToggleNestedTodos = function(todoId) {
    this.model.toggleNestedTodos(todoId);
  };

  Controller.prototype.onTodoListChanged = function(todos) {
    this.view.renderTodos(todos);
  };

  window.app = window.app || {};
  window.app.Controller = Controller;
})();
