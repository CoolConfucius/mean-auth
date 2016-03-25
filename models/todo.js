'use strict';

var mongoose = require('mongoose');
var moment = require('moment');
var Todo; 

var todoSchema = mongoose.Schema({
  description: { type: String}, 
  date: { type: Date, default: Date.now() },
  long: { type: String, default: moment().format('MM/DD/YYYY, h:mm a') }, 
  short: { type: String, default: moment().format('MM/DD/YYYY') }, 
  iscomplete: { type: Boolean, default: false }, 
  due: { type: Date },
  duelong: { type: String }, 
  dueshort: { type: String }
});

todoSchema.statics.add = function (todo, cb) {
  console.log("carete todo", todo);
  var duelong = ''; 
  var dueshort = ''; 
  if (todo.due) {
    duelong = moment(todo.due).format('MM/DD/YYYY, h:mm a');
    dueshort = moment(todo.due).format('MM/DD/YYYY');
  };
  // Todo.create({
  //   description: todo.description,
  //   due: todo.due,
  //   duelong: duelong,
  //   dueshort: dueshort
  // }, cb);
  var newtodo = new Todo({
    description: todo.description,
    due: todo.due,
    duelong: duelong,
    dueshort: dueshort
  });
  newtodo.save(function(err, savedTodo) {
    if (err) return cb(err);
    cb(null, savedTodo);
  })
};

Todo = mongoose.model('Todo', todoSchema); 

module.exports = Todo; 