(function () {
  function View() {
    this.todoListTitle = document.querySelector('[data-todo-list-title]');
    this.todoForm = document.querySelector('[data-todo-form]');
    this.todoInput = document.querySelector('[data-todo-form-input]');
    this.todoList = document.querySelector('[data-todo-list]');
    this.dialogOverlay = document.querySelector('[data-dialog-overlay]');
    this.editTodoForm = document.querySelector('[data-edit-todo-form]');
    this.createNestedTodoForm = document.querySelector('[data-nested-todo-form]');
    this.activeElement = null;
    this.activeTodoId = null;
  }

  View.prototype.bindCreateTodo = function(handler) {
    var _this = this;
    _this.todoForm.addEventListener('submit', function(event) {
      event.preventDefault();

      var todoText = _this.todoInput.value.trim();
      if (!todoText) {
        return;
      }

      handler(todoText);
      _this.todoInput.value = '';
    });
  };

  View.prototype.bindCreateNestedTodo = function(handler) {
    var _this = this;
    _this.createNestedTodoForm.addEventListener('submit', function(event) {
      event.preventDefault();

      var field = event.target.elements['nested-todo'];
      var value = field.value.trim();

      if (_this.activeTodoId && value) {
        handler(value, _this.activeTodoId);
        _this.closeDialog();
        field.value = '';
        _this.todoListTitle.focus();
      }
    });
  };

  View.prototype.bindToggleTodoCompleted = function(handler) {
    this.todoList.addEventListener('change', function(event) {
      var checkbox = event.target.closest('[data-toggle-todo-completed]');
      if (!checkbox) {
        return;
      }

      handler(checkbox.id);
    });
  };

  View.prototype.bindDeleteTodo = function(handler) {
    var _this = this;
    _this.todoList.addEventListener('click', function(event) {
      var deleteButton = event.target.closest('[data-delete-todo]');
      if (!deleteButton) {
        return;
      }

      var todoLi = deleteButton.closest('[data-todo-item]');
      var todoId = todoLi.getAttribute('data-id');

      handler(todoId);

      _this.todoListTitle.focus();
    });
  };

  View.prototype.bindEditTodo = function(handler) {
    var _this = this;
    _this.editTodoForm.addEventListener('submit', function(event) {
      event.preventDefault();

      var field = event.target.elements['edit-todo'];
      var value = field.value.trim();

      if (_this.activeTodoId && value) {
        handler(_this.activeTodoId, value);
        _this.closeDialog();
        field.value = '';
        _this.todoListTitle.focus();
      }
    });
  };

  View.prototype.bindToggleNestedTodos = function(handler) {
    var _this = this;
    _this.todoList.addEventListener('click', function(event) {
      var toggleButton = event.target.closest('[data-toggle-nested-todo]');
      if (!toggleButton) {
        return;
      }

      var todoLi = toggleButton.closest('[data-todo-item]');
      var todoId = todoLi.getAttribute('data-id');
      var expanded = toggleButton.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        toggleButton.setAttribute('aria-expanded', 'false');
        todoLi.classList.remove('nested-todos__item--expanded');
      } else {
        toggleButton.setAttribute('aria-expanded', 'true');
        todoLi.classList.add('nested-todos__item--expanded');
      }

      handler(todoId);
    });
  };

  View.prototype.renderTodo = function (todo) {
    var checked = todo.completed ? 'checked' : '';
    var todoHTML = '';
    var expanded = todo.expanded ? 'true' : 'false';
    var todoClass = 'nested-todos__item';

    if (todo.todos.length) {
      todoClass += ' nested-todos__item--has-todos';
    }

    if (todo.expanded) {
      todoClass += ' nested-todos__item--expanded';
    }

    todoHTML +=
      '<li data-id="' + todo.id + '" class="' + todoClass + '" data-todo-item>' +
        '<div class="nested-todos__item-wrapper">' +
          '<button class="nested-todos__item-toggle" aria-expanded="' + expanded + '" aria-label="Toggle ' + todo.title + '" data-toggle-nested-todo>' +
            '<svg class="icon" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><polyline points="184 112 328 256 184 400" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px"/></svg>' +
          '</button>' +
          '<div class="nested-todos__item-field">' +
            '<input class="nested-todos__item-checkbox" type="checkbox" id="' + todo.id + '" ' + checked + ' data-toggle-todo-completed>' +
            '<label class="nested-todos__item-label" for="' + todo.id + '" data-todo-label>' + todo.title + '</label>' +
          '</div>' +
          '<div class="nested-todos__actions">' +
            '<button class="nested-todos__action" data-modal-open="subtask-dialog">' +
              '<svg class="icon" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><line x1="256" y1="112" x2="256" y2="400" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/><line x1="400" y1="256" x2="112" y2="256" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/></svg>' +
              '<span class="nested-todos__action-text">Add subtask for ' + todo.title + '</span>' +
            '</button>' +
            '<button class="nested-todos__action" data-modal-open="edit-dialog">' +
              '<svg class="icon" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path d="M384,224V408a40,40,0,0,1-40,40H104a40,40,0,0,1-40-40V168a40,40,0,0,1,40-40H271.48" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/><path d="M459.94,53.25a16.06,16.06,0,0,0-23.22-.56L424.35,65a8,8,0,0,0,0,11.31l11.34,11.32a8,8,0,0,0,11.34,0l12.06-12C465.19,69.54,465.76,59.62,459.94,53.25Z"/><path d="M399.34,90,218.82,270.2a9,9,0,0,0-2.31,3.93L208.16,299a3.91,3.91,0,0,0,4.86,4.86l24.85-8.35a9,9,0,0,0,3.93-2.31L422,112.66A9,9,0,0,0,422,100L412.05,90A9,9,0,0,0,399.34,90Z"/></svg>' +
              '<span class="nested-todos__action-text">Edit ' + todo.title + '</span>' +
            '</button>' +
            '<button class="nested-todos__action" data-delete-todo>' +
              '<svg class="icon" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/><line x1="80" y1="112" x2="432" y2="112" style="stroke:currentColor;stroke-linecap:round;stroke-miterlimit:10;stroke-width:32px"/><path d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/><line x1="256" y1="176" x2="256" y2="400" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/><line x1="184" y1="176" x2="192" y2="400" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/><line x1="328" y1="176" x2="320" y2="400" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/></svg>' +
            '<span class="nested-todos__action-text">Delete ' + todo.title + '</span>' +
            '</button>' +
          '</div>' +
        '</div>';

    if (todo.todos.length > 0) {
      todoHTML += '<ul class="nested-todos__item-nested-todos">';

      todo.todos.forEach(function(nestedTodo) {
        todoHTML += this.renderTodo(nestedTodo);
      }, this);

      todoHTML += '</ul>';
    }

    todoHTML += '</li>';

    return todoHTML;
  };

  View.prototype.renderTodos = function(todos) {
    var todosHTML = '';
    todos.forEach(function(todo) {
      todosHTML += this.renderTodo(todo);
    }, this);

    this.todoList.innerHTML = todosHTML;
  };

  View.prototype.openDialog = function(trigger) {
    var dialogId = trigger.getAttribute('data-modal-open');
    var todoLi = trigger.closest('[data-todo-item]');
    if (!dialogId || !todoLi) {
      return;
    }

    var todoId = todoLi.getAttribute('data-id');
    var dialog = document.querySelector('#' + dialogId);
    var elementToFocus = dialog.querySelector('[data-element-to-focus]');

    if (dialogId === 'edit-dialog') {
      var todoLabel = todoLi.querySelector('[data-todo-label]');
      elementToFocus.value = todoLabel.textContent;
    }

    dialog.classList.add('is-active');
    this.dialogOverlay.classList.add('is-active');
    this.activeTodoId = todoId;

    trapFocus(dialog, elementToFocus);
  };

  View.prototype.closeDialog = function() {
    var _this = this;
    var activeDialog = document.querySelector('.dialog.is-active');
    if (!activeDialog) {
      return;
    }
    activeDialog.classList.remove('is-active');
    _this.dialogOverlay.classList.remove('is-active');
  };

  View.prototype.forceFocus = function(elem) {
    requestAnimationFrame(function() {
      elem.focus();
    });
  };

  View.prototype.dialogClickHandler = function(event) {
    var _this = this;
    var dialogClose = event.target.closest('[data-dialog-close]');
    var dialogTrigger = event.target.closest('[data-modal-open]');
    if (dialogClose) {
      _this.closeDialog();

      if (_this.activeElement) {
        _this.forceFocus(_this.activeElement);
      }
    } else if (dialogTrigger) {
      _this.activeElement = document.activeElement;
      _this.openDialog(dialogTrigger);
    }
  };

  View.prototype.dialogKeyupHandler = function(event) {
    var _this = this;
    if (event.key === 'Escape') {
      _this.closeDialog();

      if (_this.activeElement) {
        _this.forceFocus(_this.activeElement);
      }
    }
  };

  View.prototype.bindDialogEvents = function() {
    window.addEventListener('click', this.dialogClickHandler.bind(this));
    window.addEventListener('keyup', this.dialogKeyupHandler.bind(this));
  };

  window.View = View;
})();
