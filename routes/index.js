'use strict';

var express = require('express');

var User = require('../models/user');

var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Mean Stack Todo List' });
});

router.post('/register', function(req, res, next){
  User.register(req.body, function(err, user){       
    if (err) return res.status(401).send(err);
    var token = user.token();
    res.status(200).send(token);
  });
})

router.post('/login', function(req, res, next){
  User.authenticate(req.body, function(err, user){
    if (err) return res.status(401).send(err);
    var token = user.token();
    // console.log('\n\nresponse1: ', res);
    res.status(200).send(token);
  });
})

module.exports = router;
