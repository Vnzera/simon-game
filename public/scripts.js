'use strict';

// tiles
var green = document.querySelector('#green');
var red = document.querySelector('#red');
var blue = document.querySelector('#blue');
var yellow = document.querySelector('#yellow');

// buttons
var count = document.querySelector('#count');
var start = document.querySelector('#start');
var strict = document.querySelector('#strict');
var reset = document.querySelector('#reset');

// game variables
var headline = document.querySelector('#headline');
var gameContainer = document.querySelector('#game-container');
var count = 0;
var currentSequence = [];
var userSequence = [];

// audio elements
var greenAudio = document.createElement('audio');
var redAudio = document.createElement('audio');
var yellowAudio = document.createElement('audio');
var blueAudio = document.createElement('audio');
greenAudio.setAttribute('src', 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
redAudio.setAttribute('src', 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
yellowAudio.setAttribute('src', 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
blueAudio.setAttribute('src', 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');

start.addEventListener('click', next);
reset.addEventListener('click', reset);

// ======================= main game code

function next() {
  resetHeadline();

  if (count !== 0) {
    // count starts at zero
    count++;
  }
  if (count === 0) {
    gameContainer.addEventListener('click', userClicks);
  }
  if (count === 20) {
    headline.innerText = 'You won. Congratulations!';
    setTimeout(function () {
      reset();
    }, 2000);
  }

  generateNumber();
}

function generateNumber() {
  // generate number from 1-4
  var number = Math.floor(Math.random() * 4) + 1;
  number = number.toString();
  currentSequence.push(number);
  lightSequence();
}

function lightSequence() {
  // light up each tile by data-id
  currentSequence.forEach(function (number, index) {
    index += 1; // increment for use in setTimeout/delay time
    var tileLit = document.querySelectorAll('[data-id=\'' + number + '\']')[0];
    lightUp(tileLit, index, number);
  });
}

// called by lightSequence and lights up the tile, uses index for spacing out the timing and plays the audio through data-id attribute
function lightUp(tile, index, number) {
  setTimeout(function () {
    tile.style.opacity = 0.5;
    audioPlay(number);
  }, index * 1000); // adds delayed affect for tile light up

  setTimeout(function () {
    tile.style.opacity = 1;
  }, index * 1300); // restores opacity
}

// handles audio file to be played based on data-id value of user's choice
function audioPlay(number) {

  switch (number) {

    case '1':
      greenAudio.play();
      break;

    case '2':
      redAudio.play();
      break;

    case '3':
      yellowAudio.play();
      break;

    case '4':
      blueAudio.play();
      break;
  }
}

// ======================= end of main game code

function userClicks(event) {
  var choice = event.target.dataset.id;
  checkChoices(choice);
}

// if the choice is correct then push it to userSequence
function checkChoices(choice) {
  console.log('choice id:', choice);

  choice = choice.toString();

  if (choice === currentSequence[count]) {
    // here is why count is not initially incremented and remains at 0 for the first try
    userSequence.push(choice);

    if (userSequence.length === currentSequence.length) {
      // if user has successfully repeated the pattern then add a new light/button to the pattern
      console.log('userSequence === currentSequence');
      userSequence = [];
      next();
    }
  } else if (choice !== currentSequence[count]) {
    wrongChoice();
  }
}

function wrongChoice() {
  // handle wrong choices based on strictMode value
  userSequence = [];

  if (strictMode === 'on') {
    headline.innerText = 'You lost. Press start to try again.';
    reset();
  }

  headline.innerText = 'Wrong choice. Replaying sequence.';
  resetHeadline();
  lightSequence();
}

function resetHeadline() {
  // sends messages through headline to the user

  setTimeout(function () {
    if (count === 0) {
      headline.innerText = "Click Start";
    } else {
      headline.innerText = 'Focus';
    }
  }, 1500);
}

function reset() {
  // reset game variables and start over
  count = 0;
  currentSequence = [];
  userSequence = [];
  next();
}
