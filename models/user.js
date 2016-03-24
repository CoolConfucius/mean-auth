'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-node');
var jwt = require('jwt-simple');

var Schema = mongoose.Schema;
var User;

var userSchema = Schema({
  username:{ type: String, required: true, unique: true },
  password:{ type: String, required: true }
});

userSchema.methods.token = function() {
  var payload = {
    username: this.username,
    _id: this._id
  };
  var secret = process.env.JWT_SECRET;
  var token = jwt.encode(payload, secret);
  return token;
};

userSchema.statics.register = function(user, cb) {
  var username = user.username;
  var password = user.password;
  User.findOne({username: username}, function(err, user){
    if(err || user) return cb(err || 'username already taken.');
    bcrypt.genSalt(10, function(err1, salt) {
      bcrypt.hash(password, salt, null, function(err2, hash) {
        if(err1 || err2) return cb(err1 || err2);
        var newUser = new User();
        newUser.username = username;
        newUser.password = hash;
        newUser.save(function(err, savedUser){
          savedUser.password = null;
          // cb(err, savedUser);
          console.log("HERE??? \N");
          User.findOne({username: newUser.username}, function(err, dbUser) {
            console.log("HERE??? \n");
            if(err || !dbUser) return cb(err || 'Incorrect username or password.');
              dbUser.password = null;
              console.log("HERE???6 \n");
              cb(null, dbUser);
          });
        });
      });
    });
  });
};

userSchema.statics.authenticate = function(inputUser, cb){
  User.findOne({username: inputUser.username}, function(err, dbUser) {
    if(err || !dbUser) return cb(err || 'Incorrect username or password.');
    bcrypt.compare(inputUser.password, dbUser.password, function(err, isGood){
      if(err || !isGood) return cb(err || 'Incorrect username or password.');
      dbUser.password = null;
      cb(null, dbUser);
    });
  });
};

User = mongoose.model('User', userSchema);
module.exports = User;
