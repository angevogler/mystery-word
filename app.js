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

const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
let randomWord = null;
let word = [];
let blanks = [];
let display;
let lettersGuessed = [];
let guesses = 8;

// when a user that is not in a current game arrives at your root page
app.get('/', function (req, res) {
  // blanks = blanks;
  console.log(blanks);
  // store the word in a session
  req.session.word = word;

  // display the # of letters (_ _ _ _) & guessing form
  res.render('game', {
    blanks: blanks,
    lettersGuessed: lettersGuessed,
    guessesLeft: guesses,
  });
});

// when a user supplies a guess
app.post('/guess', function (req, res) {
  // define variables
  let guess = req.body.guess;
  let answer = false;

  for (let i = 0; i < word.length; i++) {
    // if the guess matches a letter in the word
    if (guess === word[i]) {
      // display that correct letter
      blanks[i] = guess;
      answer = true;
    }
  }
  console.log('guess is: ' + answer);


  // validate submitted form to make sure there is only one letter
  if (guess.length === 1 && answer === true) {
    lettersGuessed.push(guess);
    console.log(lettersGuessed);
    res.redirect('/');
  } else if (guess.length === 1 && answer === false) {
    lettersGuessed.push(guess);
    console.log(lettersGuessed);
    guesses = guesses - 1;
    res.render('game', {
        blanks: blanks,
        lettersGuessed: lettersGuessed,
        incorrect: true,
        guessesLeft: guesses,
    });
  // if user enters more than one letter, display input invalid msg and let them try again
  } else {
     res.render('game', {
       blanks: blanks,
       lettersGuessed: lettersGuessed,
       error: true,
     });
  }

  // display if guess was correct or incorrect
  // for (let i = 0; i < word.length; i++) {
  //   let letter = word[i];
  //   // if the guess matches a letter in the word
  //   if (guess === word[i]) {
  //     // display that correct letter
  //     blanks[i] = guess;
  //   }
  // }
  // display partially guessed word + letter spaces that have not been guessed
  // remind user of guesses left
    // guesses left are determined by what is in the session
    // lose a guess when guess is incorrect
    // if user guesses same letter twice do not take away guess but display error message

  // game ends when user constructs full word or runs out of guesses
    // if player constructs full word display message
        // let stillBlank = false;
    // if player runs out of guesses, reveal correct word
    // when game ends, ask the user if they want to play again
});

// run the server
app.listen(4000, function () {
  // create function to get random word
  // words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
  randomWord = words[Math.floor(Math.random() * words.length)];
  // push that word into an array
  word = randomWord.split('');
  for (let i = 0; i < word.length; i++) {
    blanks.push('_');
  }
  blanks = blanks;

  console.log('Let the games begin');
  console.log(randomWord);
});
