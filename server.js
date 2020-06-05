var express = require("express");
var mongoose = require("mongoose")
var bcrypt = require("bcrypt-nodejs")
const flash = require("express-flash")
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require("path");
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(flash());
app.use(session({
  secret: 'keyboardkitteh',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

mongoose.set('useUnifiedTopology', true);
const UserSchema = new mongoose.Schema({
  first_name:  { type: String, required: [true, "A first name is required"], minlength: 2},
  last_name: { type: String, required: [true, "A last name is required"], minlength: 2 },
  birthday: { type: Number, required: [true, "Birthday is required"]},
  email: { type: String, required: [true, "A email is required"]},
  pw: {type: String, required: [true, "A email is required"], minlength: [3, "PW must have at least 3 characters"]}
})

var User = mongoose.model("User", UserSchema);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/login', {useNewUrlParser: true});

app.get('/', function(req, res) {
  res.render("index")
})

app.post('/reg', function(req, res) {
  User.find({email: req.body.remail}, function(err, user) {
    console.log(user);
    if(err) {
      console.log("query went wrong");
      res.redirect('/')
    } else {
      console.log("successful read query!");
    }
  })
  console.log(user);  
  if(user) {
    console.log("email already registered")
  } else {
    var user = new User(req.body)
    user.save(function(err){
      if(err){
        // if there is an error upon saving, use console.log to see what is in the err object 
        console.log("We have an save error!", err);
        // adjust the code below as needed to create a flash message with the tag and content you would like
        for(var key in err.errors){
            req.flash('registration', err.errors[key].message);
        }
        // redirect the user to an appropriate route
        res.redirect('/');
      } else {
        res.redirect('/');
      }
    })
  }
  res.redirect('/')
})

app.get('/login', function(req, res) {

  res.redirect('/success')
})
app.post('/insert', function(req, res) {
  console.log("POST DATA", req.body);
  var animal = new Animal({name: req.body.name, weight: req.body.weight});
  console.log(animal,"@@@")
  animal.save(function(err) {
    console.log("trying to save")
    if(err) {
      console.log("something went wrong");
    } else {
      console.log("successfully added a user!");
    }
  })
  res.redirect('/')
})



app.get('/edit/:id', function (req, res) {
  Animal.find({_id: req.params.id},function(err,animal) {
    if(err) {
      console.log("something went wrong");
      res.render("edit")
    } else {
      console.log("successfully find!");
    }
    res.render("edit", {animal : animal})
  })
})

app.post('/update/:id', function (req, res) {
  console.log(req.params.id)
  Animal.update({_id: req.params.id}, {name: req.body.name, weight: req.body.weight}, function(err) {
      if(err){
        console.log("Failed to update")
        res.redirect('/')
      } else {
        res.redirect('/show/'+req.params.id) //view
      }
    })
})

// app.get('/show/:id', function (req, res) { //show one
//   Animal.findOne({_id: req.params.id}, function(err,animal) {
//     if(err) {
//       console.log("something went wrong");
//       res.redirect('/')
//     } else {
//       console.log("successfully find the one!");
//       res.render("show", {animal : animal})
//     }
//   })
// })

// app.get('/destroy/:id', function (req, res) {
//   Animal.deleteOne({_id: req.params.id}, function(err) {
//     if(err) {
//       console.log("something went wrong");
//     } else {
//       console.log("successfully find the one to delete!");
//     }
//   })
//   res.redirect('/')
// })

app.listen(5000, function() {
  console.log("listening on port 5000");
})
