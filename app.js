// required
const express = require('express');
const mustache = require('mustache-express');
const bodyparser = require('body-parser');
const session = require('express-session');
const fs = require('fs');

// configure server
const app = express();
app.use(express.static('public'));
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

let easyWords = [];
for (let i = 0; i < words.length; i++) {
  if (words[i].length >= 4 && words[i].length <= 6) {
    easyWords.push(words[i]);
  }
}

let mediumWords = [];
for (let i = 0; i < words.length; i++) {
  if (words[i].length >= 6 && words[i].length <= 8) {
    mediumWords.push(words[i]);
  }
}

let hardWords = [];
for (let i = 0; i < words.length; i++) {
  if (words[i].length > 8) {
    hardWords.push(words[i]);
  }
}

// when a user visits the home page
app.get('/', function (req, res) {
  res.render('home');
});

// EASY MODE
app.get('/easy-game', function (req, res) {

  console.log('NEW GAME -- EASY MODE');

  // store the word in a session
  req.session.word = [];
  req.session.blanks = [];
  req.session.lettersGuessed = [];
  req.session.guesses = 8;

  let randomWord = null;

  randomWord = easyWords[Math.floor(Math.random() * easyWords.length)];
  // push that word into an array
  req.session.word = randomWord.split('');

  for (let i = 0; i < req.session.word.length; i++) {
    req.session.blanks.push('_ ');
  }

  console.log(randomWord);
  console.log(req.session.word);
  console.log(req.session.blanks);

  // display the # of letters (_ _ _ _) & guessing form
  res.render('game', {
    blanks: req.session.blanks.join(''),
    lettersGuessed: req.session.lettersGuessed.join(''),
    guessesLeft: req.session.guesses,
  });
});

// MEDIUM MODE
app.get('/medium-game', function (req, res) {

  console.log('NEW GAME -- MEDIUM MODE');

  // store the word in a session
  req.session.word = [];
  req.session.blanks = [];
  req.session.lettersGuessed = [];
  req.session.guesses = 8;

  let randomWord = null;

  randomWord = mediumWords[Math.floor(Math.random() * mediumWords.length)];
  // push that word into an array
  req.session.word = randomWord.split('');

  for (let i = 0; i < req.session.word.length; i++) {
    req.session.blanks.push('_ ');
  }

  console.log(randomWord);
  console.log(req.session.word);
  console.log(req.session.blanks);

  // display the # of letters (_ _ _ _) & guessing form
  res.render('game', {
    blanks: req.session.blanks.join(''),
    lettersGuessed: req.session.lettersGuessed.join(''),
    guessesLeft: req.session.guesses,
  });
});

// HARD MODE
app.get('/hard-game', function (req, res) {

  console.log('NEW GAME -- HARD MODE');

  // store the word in a session
  req.session.word = [];
  req.session.blanks = [];
  req.session.lettersGuessed = [];
  req.session.guesses = 8;

  let randomWord = null;

  randomWord = hardWords[Math.floor(Math.random() * hardWords.length)];
  // push that word into an array
  req.session.word = randomWord.split('');

  for (let i = 0; i < req.session.word.length; i++) {
    req.session.blanks.push('_ ');
  }

  console.log(randomWord);
  console.log(req.session.word);
  console.log(req.session.blanks);

  // display the # of letters (_ _ _ _) & guessing form
  res.render('game', {
    blanks: req.session.blanks.join(''),
    lettersGuessed: req.session.lettersGuessed.join(''),
    guessesLeft: req.session.guesses,
  });
});

// when a game is complete
app.get('/game-over', function (req, res) {
  res.render('game-over');
  req.session.destroy();
  // randomWord = null;
  // word = [];
  // blanks = [];
});

// when a user supplies a guess
app.post('/guess', function (req, res) {
  // define variables
  // let guesses = req.session.guesses;
  let lettersGuessed = req.session.lettersGuessed;
  let guess = req.body.guess;
  let answer = false;
  let stillBlank = true;
  let alreadyGuessed = false;

  for (let i = 0; i < req.session.word.length; i++) {
    // if the guess matches a letter in the word
    if (guess === req.session.word[i]) {
      // display that correct letter
      req.session.blanks[i] = guess;
      answer = true;
    }
    // if the guess matches a letter already guessed
    if (guess === lettersGuessed[i]) {
      alreadyGuessed = true;
    }
  }

  if ( req.session.word.join('') === req.session.blanks.join('') ) {
    stillBlank = false;
  }


  // validate submitted form to make sure there is only one letter
  // if guess if > 1 but has already been guessed
  if (guess.length === 1 && alreadyGuessed === true) {
    console.log('letters guessed: ' + lettersGuessed);
    console.log(req.session.blanks);
    res.render('game', {
      blanks: req.session.blanks.join(''),
      lettersGuessed: lettersGuessed.join(''),
      alreadyGuessed: true,
      guessesLeft: req.session.guesses,
    });
  // guess is correct and there are still blanks left in blank array
  } else if (guess.length === 1 && answer === true && req.session.guesses > 1 && stillBlank === true) {
    lettersGuessed.push(guess);
    console.log('letters guessed: ' + lettersGuessed);
    console.log(req.session.blanks);
    res.render('game', {
      blanks: req.session.blanks.join(''),
      lettersGuessed: lettersGuessed.join(' '),
      guessesLeft: req.session.guesses,
    });
  // if user wins
  } else if (guess.length === 1 && answer === true && req.session.guesses > 1 && stillBlank === false) {
    lettersGuessed.push(guess);
    console.log('letters guessed: ' + lettersGuessed);
    console.log(req.session.blanks);
    console.log('GAME OVER USER WINS')
    res.render('game-over', {
      blanks: req.session.blanks.join(''),
      lettersGuessed: lettersGuessed.join(' '),
      youWin: true,
      guessesLeft: req.session.guesses,
    });
  // if user guesses wrong letter but still has guesses left
  } else if (guess.length === 1 && answer === false && req.session.guesses > 1) {
    lettersGuessed.push(guess);
    console.log('letters guessed: ' + lettersGuessed);
    console.log(req.session.blanks);
    req.session.guesses = req.session.guesses - 1;
    res.render('game', {
        blanks: req.session.blanks.join(''),
        lettersGuessed: lettersGuessed.join(' '),
        incorrect: true,
        guessesLeft: req.session.guesses,
    });
  // if user loses display correct word
} else if (guess.length === 1 && answer === false && req.session.guesses === 1) {
    lettersGuessed.push(guess);
    console.log('letters guessed: ' + lettersGuessed);
    console.log(req.session.blanks);
    console.log('GAME OVER USER LOSES')
    req.session.guesses = req.session.guesses - 1
    res.render('game-over', {
        word: req.session.word.join(''),
        lettersGuessed: lettersGuessed.join(' '),
        youLose: true,
        guessesLeft: req.session.guesses,
    });
  // if user enters more than one letter, display input invalid msg and let them try again
  }  else {
     res.render('game', {
       blanks: req.session.blanks.join(' '),
       lettersGuessed: lettersGuessed.join(' '),
       error: true,
     });
  }
});

// run the server
app.listen(4000, function () {

  console.log('Let the games begin');
});
