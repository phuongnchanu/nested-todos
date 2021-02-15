(function() {
  document.documentElement.className = document.documentElement.className.replace('no-js', 'js');
  var model = new window.app.Model('nested-todo');
  var view = new window.app.View();
  var controller = new window.app.Controller(model, view);
})();
