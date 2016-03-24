'use strict'; 

var app = angular.module("app", ["ui.router", "ngStorage"]); 


app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('home', { url: '/', templateUrl: 'html/home.html' })
  .state('register', { url: '/register', templateUrl: 'html/register.html' })
  $urlRouterProvider.otherwise('/');
});

app.service('Todo', function($http) {
  
  this.todos = function() {
    return $http.get('/todos').then(res => {
      this.data = res.data; 
      console.log(this.data, "this data");
    }); 
  }; 

  this.getTodos = function(cb) {
    return $http.get('/todos').then(res => {
      this.data = res.data; 
      console.log(this.data, "this data");
      cb();
    }); 
  }

  this.add = function(todo) {
    return $http.post('/todos', todo)
  };

  this.toggle = function(todo) {
    return $http.put(`/todos/${todo}`)
  };

  this.remove = function(todo) {
    return $http.delete(`/todos/${todo}`)
  };

});

app.run(function(Todo, $rootScope){
  console.log("run app");
  Todo.todos();
  $rootScope.todos = Todo.data; 
});

app.controller('mainCtrl', function($rootScope, $scope, $state, Todo){
  $scope.getTodos = Todo.getTodos(function(){
    console.log("mainCtrl ctrl");
  // console.log(Todo.todos(), "here?"); 
    $rootScope.todos = Todo.data; 
    $scope.todos = $rootScope.todos;
    // $scope.todos = Todo.data;
    console.log("Scope todos", $scope.todos);
    console.log("Scope todos", Todo.data);
  });

  $scope.sort = function(key){
    console.log("sort!");
    if ($scope.sorttext === key) {
      $scope.sorttext = '-'+key;   
    } else {
      $scope.sorttext = key; 
    }
  };

  $scope.addTodo = function(todo){
    console.log("addTdod", todo);
    var newObj; 
    if (todo) {
      var description = todo.description ? todo.description : 'default description';
      newObj = {
        description: description, 
        date: Date.now(), 
        iscomplete: false, 
        due: todo.due
      }
      
      $scope.todos.push(newObj); 
      $scope.todo.description = " "; 
      
    } else {
      newObj = {
        description: "default description", 
        date: Date.now(), 
        iscomplete: false
      }
    }  
    Todo.add(newObj); 
  };

  $scope.toggle = function(todo){
    var realIndex = $scope.todos.indexOf(todo); 
    $scope.todos[realIndex].iscomplete = !$scope.todos[realIndex].iscomplete;
    Todo.toggle(todo._id.toString()); 
  }

  $scope.remove = function(todo){
    var realIndex = $scope.todos.indexOf(todo); 
    $scope.todos.splice(realIndex, 1);
    Todo.remove(todo._id.toString()); 
  }


})
