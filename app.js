// required
const express = require('express');
const mustache = require('mustache-express');
const bodyparser = require('body-parser');
const session = require('express-session');
const fs = require('fs');

// configure server
const app = express();
app.use(bodyparser.urlencoded({ extended: false }));
app.use(session({
    secret: '4494@askdlhgkaj',
    resave: false,
    saveUninitialized: true
}));

app.engine('mustache', mustache());
app.set('views', './views')
app.set('view engine', 'mustache');

// add variable for dictionary
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

// run the server
app.listen(4000, function () {
    console.log('Let the games begin');
});
