// tiles
var green = document.querySelector('#green');
var red = document.querySelector('#red');
var blue = document.querySelector('#blue');
var yellow = document.querySelector('#yellow');

// buttons
var countBtn = document.querySelector('#count');
var startBtn = document.querySelector('#start');
var strictBtn = document.querySelector('#strict');
var resetBtn = document.querySelector('#reset');

// game variables
var headline = document.querySelector('#headline');
var gameContainer = document.querySelector('#game-container');
var count = 0;
var currentSequence = [];
var userSequence = [];
var strictMode = false;

// audio elements
var greenAudio = document.createElement('audio');
var redAudio = document.createElement('audio');
var yellowAudio = document.createElement('audio');
var blueAudio = document.createElement('audio');
greenAudio.setAttribute('src', 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
redAudio.setAttribute('src', 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
yellowAudio.setAttribute('src', 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
blueAudio.setAttribute('src', 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');

startBtn.addEventListener('click', next);
resetBtn.addEventListener('click', reset);
strictBtn.addEventListener('click', () => {
  strictMode = !strictMode;
  strictBtn.innerText = `Strict: ${strictMode}`;
});

// ======================= main game code

function next() {

  resetHeadline();

  if (count === 0) {
    gameContainer.addEventListener('click', userClicks);
    count++;
    countBtn.innerText = `Count: ${count}`;
    generateNumber();

  } else if(count === 20) {
    headline.innerText = 'You won. Congratulations!';
    setTimeout(() => {
      reset();
    }, 2000);

  } else {
    count++;
    countBtn.innerText = `Count: ${count}`;
    generateNumber();
  }

}

function generateNumber() { // generate number from 1-4
  var number = Math.floor(Math.random() * 4) + 1;
  var numberString = number.toString();
  currentSequence.push(numberString);
  lightSequence();
}

function lightSequence() { // light up each tile by data-id
  currentSequence.forEach((numberString, index) => {
    index +=1; // increment for use in setTimeout/delay time
    var tileLit = document.querySelectorAll(`[data-id='${numberString}']`)[0];
    lightUp(tileLit, index, numberString);
  });
}

// called by lightSequence and lights up the tile, uses index for spacing out the timing and plays the audio through data-id attribute
function lightUp(tile, index, numberString) {
  setTimeout(function(){
      tile.style.opacity = 0.5;
      audioPlay(numberString);
    }, index * 1000); // adds delayed affect for tile light up

  setTimeout(function(){
      tile.style.opacity = 1;
    }, index * 1300); // restores opacity
}

// handles audio file to be played based on data-id value of user's choice
function audioPlay(numberString) {

  switch (numberString) {

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

// Reset game if user choice is incorrect. Otherwise game continues until sequence is repeated completely
function checkChoices(choice) {
  userSequence.push(choice);
  var choiceIndex = userSequence.length - 1;

  if (userSequence[choiceIndex] === currentSequence[choiceIndex]) {

    if (userSequence.length === currentSequence.length) {// if user has successfully repeated the pattern then add a new light/button to the pattern
      headline.innerText = 'Success! Get ready';
      userSequence = [];
      next();
    }
  } else if(userSequence[choiceIndex] !== currentSequence[choiceIndex]) {
    wrongChoice();
  }
}

function wrongChoice() { // handle wrong choices based on strictMode value
  userSequence = [];
  console.log('wrongChoice made');

  if (strictMode === true) {
    console.log('strictMode:', strictMode);
    headline.innerText = 'Resetting...';
    reset();
  }

  headline.innerText = 'Try again';
  resetHeadline();
  lightSequence();
}

function resetHeadline() { // sends messages through headline to the user

  setTimeout(() => {
    if (count === 0) {
    headline.innerText = "Click Start";
  } else {
    headline.innerText = 'Focus';
  }

}, 1300);

}

function reset() { // reset game variables and start over
  count = 0;
  currentSequence = [];
  userSequence = [];
  next();
  console.log('reset called');
}
