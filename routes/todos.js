var express = require('express');
var router = express.Router();
var Todo = require('../models/todo');

router.get('/', function(req, res, next) {
  // console.log("getting todos");
  Todo.find({}, function(err, todos){
    if(err) return res.status(400).send(err); 
    // console.log("Found them,", todos);
    console.log("Found todos!");
    res.send(todos); 
  });
});

router.post('/', function(req, res, next) {
  console.log("post todo", req.body);
  Todo.add(req.body, function(err, todo){
    res.send(err || todo);
  });
});

router.put('/:id', function(req, res, next) {
  console.log("post todo", req.params.id);
  Todo.findById(req.params.id, function(err, todo){
    if(err) return res.status(400).send(err); 
    console.log("Found one,", todo);
    todo.iscomplete = !todo.iscomplete; 
    todo.save(function(err, savedTodo){

      res.send(err || savedTodo);
    })
  });
});

router.delete('/:id', function(req, res, next) {
  console.log("post todo", req.params.id);
  Todo.findById(req.params.id, function(err, todo){
    if(err) return res.status(400).send(err); 
    console.log("Found one,", todo);
    todo.remove(function(err){
      res.status(err ? 400 : 200).send(err || todo);
    })
  });
});

module.exports = router;
