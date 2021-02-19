(function() {
  var model = new window.app.Model('nested-todo');
  var view = new window.app.View();
  new window.app.Controller(model, view);
})();
