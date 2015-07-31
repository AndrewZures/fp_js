require('../../support');
var Task = require('data.task');
var _ = require('ramda');

// Exercise 1
// ==========
// Use safeProp and map/join or chain to safetly get the street name when given a user

var safeProp = _.curry(function (x, o) { return Maybe.of(o[x]); });
var user = {
  id: 2,
  name: "albert",
  address: {
    street: {
      number: 22,
      name: 'Walnut St'
    }
  }
};

var ex1 = _.compose(join,
                    _.map(safeProp("name")),
                    join,
                    _.map(safeProp("street")),
                    safeProp("address"))


// Exercise 2
// ==========
// Use getFile to get the filename, remove the directory so it's just the file, then purely log it.

var getFile = function() {
  return new IO(function(){ return __filename; });
}

var pureLog = function(x) {
  return new IO(function(){
    console.log(x);
    return 'logged ' + x; // for testing w/o mocks
  });
}

var dosomething = function(x) {
  return new IO(function(){
    return x.split('\\').pop().split('/').pop();
  });
}

var ex2 = _.compose(_.chain(pureLog), _.chain(dosomething), getFile)
// var ex2 = _.compose(join, _.map(pureLog), join, _.map(dosomething), getFile)



// Exercise 3
// ==========
// Use getPost() then pass the post's id to getComments().

var getPost = function(i) {
  return new Task(function (rej, res) {
    setTimeout(function () {
      res({ id: i, title: 'Love them tasks' }); // THE POST
    }, 300);
  });
}

var getComments = function(i) {
  return new Task(function (rej, res) {
    setTimeout(function () {
      res([{post_id: i, body: "This book should be illegal"}, {post_id: i, body:"Monads are like smelly shallots"}]);
    }, 300);
  });
}

//notice how the _.map, to open it up, adjust, close it - AJZ
// var ex3 = _.compose(join, _.map(getComments), _.map(_.prop("id")), getPost)
var ex3 = _.compose(_.chain(getComments), _.map(_.prop("id")), getPost)


// Exercise 4
// ==========
// Use validateEmail and addToMailingList to implmeent ex4's type signature. It should 

//  addToMailingList :: Email -> IO([Email])
var addToMailingList = (function(list){
  return function(email) {
    return new IO(function(){
      list.push(email);
      return list;
    });
  }
})([]);

function emailBlast(list) {
  return new IO(function(){
    return 'emailed: ' + list.join(','); // for testing w/o mocks
  });
}

function log(x) {
  console.log(x);
  return x
}

var validateEmail = function(x){
  return x.match(/\S+@\S+\.\S+/) ? (new Right(x)) : (new Left('invalid email'));
}

//  ex4 :: Email -> Either String (IO String)
executeEmailStuff = _.compose(join, log, _.map(emailBlast), _.map(addToMailingList))
var ex4 = _.compose(executeEmailStuff, validateEmail)


module.exports = {ex1: ex1, ex2: ex2, ex3: ex3, ex4: ex4, user: user}
