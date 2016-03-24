'use strict'; 

var app = angular.module("app", ["ui.router", "ngStorage"]); 


app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('home', { url: '/', templateUrl: 'html/home.html', controller: 'mainCtrl' })
  .state('register', { url: '/register', templateUrl: 'html/register.html', controller: 'mainCtrl' })
  $urlRouterProvider.otherwise('/');
});


// Services: 
app.service('Todo', function($http) {
  this.todos = function() {
    console.log("this.todos \n");
    return $http.get('/todos').then(res => {
      this.data = res.data; 
    }); 
  }; 

  this.getTodos = function(cb) {
    console.log("this.getTodos \n");
    return $http.get('/todos').then(res => {
      this.data = res.data; 
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

app.service('Auth', function($http, $state, $localStorage, $rootScope) {
  this.register = function(user) {    
    return $http({method: 'POST', url: '/register', data: user})
  };

  this.login = (user) => {
    return $http({method: 'POST', url: '/login', data: user});
  }
  
  this.logout = () => {
    this.token = null;
    $localStorage.token = null;
    $state.go('home');
  }

  this.user = function() {
    this.data = $localStorage.token; 
    $rootScope.user = $localStorage.token; 
  }
});

// Run: 
app.run(function(Auth, Todo, $rootScope){
  Auth.user();
  Todo.todos();
  $rootScope.todos = Todo.data; 
});


// Controllers: 
app.controller('mainCtrl', function($rootScope, $localStorage, $scope, $state, Auth, Todo){
  
  // User Related: 
  $rootScope.user = $localStorage.token;
  if ($rootScope.user) {
    $rootScope.username = $rootScope.user.config.data.username; 
  };
  $rootScope.showlogin = false; 
  $scope.toggleshowlogin = function(){
    $rootScope.showlogin = !$rootScope.showlogin;
  }

  $scope.register = function(){
    console.log($scope.regpassword, $scope.regconfirmpassword, "\n Register! Scope password! \n");
    if ($scope.regpassword !== $scope.regconfirmpassword) {
      console.log($scope.regpassword, "\n Scope password! \n");
      swal("Passwords not the same!");
      return;
    };
    var user = {
      username: $scope.regusername,
      password: $scope.regpassword
    }
    Auth.register(user)
    .then((data)=>{
      console.log('data: ', data);
      $localStorage.token = data; 
      $rootScope.user = data;
      $state.go('home');
    });
  }

  $scope.login = function() {
    var user = {
      password: $scope.logpassword,
      username: $scope.logusername
    }

    Auth.login(user)
    .then((data)=>{
      console.log('data: ', data);
      $localStorage.token = data; 
      $rootScope.user = data;
      $state.go('home');
    },
    function err(err) {
      swal("Invalid Password or Username");
    });
  }

  $scope.logout = function() {
    Auth.logout();
    $rootScope.user = null;
  }


  // Todo Related:
  $scope.getTodos = Todo.getTodos(function(){
    console.log("mainCtrl ctrl");
    $rootScope.todos = Todo.data; 
    $scope.todos = $rootScope.todos;
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
