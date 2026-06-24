// page elements
const grid = document.getElementById('grid');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const messageEl = document.getElementById('message');
const modal = document.getElementById('modal');
const finalScoreEl = document.getElementById('finalScore');
const finalMessageEl = document.getElementById('finalMessage');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const clickSound = document.getElementById('clickSound');

// game state
let score = 0;
let time = 60;
let active = -1;
let over = true;
let glowSpeed = 1200; // start slower so the game feels easier
let glowTimer;
let timer;

// create 9 buttons for the game
for (let i = 0; i < 9; i++) {
  const btn = document.createElement('button');
  btn.onclick = () => clickBtn(i);
  grid.appendChild(btn);
}

const buttons = [...grid.querySelectorAll('button')];

function glowRandom() {
  buttons.forEach((btn) => {
    btn.classList.remove('glow');
  });

  active = Math.floor(Math.random() * buttons.length);
  buttons[active].classList.add('glow');
}

function startGlowLoop() {
  clearInterval(glowTimer);
  glowTimer = setInterval(() => {
    if (!over) {
      glowRandom();
    }
  }, glowSpeed);
}

function clickBtn(i) {
  if (over) return; // do nothing after game over

  clickSound.currentTime = 0;
  clickSound.play(); // play local audio file

  if (i === active) {
    score++;
    scoreEl.textContent = score;
    messageEl.textContent = '🎉 Nice! Keep going!';

    if (score % 2 === 0 && glowSpeed > 350) {
      glowSpeed -= 100; // make the game a little faster every 2 correct clicks
      startGlowLoop();
    }
    glowRandom();
  } else {
    time -= 1; // wrong click reduces time by 1 second
    if (time < 0) {
      time = 0;
    }
    timeEl.textContent = time;
    messageEl.textContent = '😅 Oops! Wrong button!';
  }
}

function endGame() {
  over = true; // mark game over
  clearInterval(glowTimer);
  clearInterval(timer);

  let msg = '🤨 Random button vibes.';
  if (score < 10) {
    msg = '🐢 Slow but stylish.';
  } else if (score < 20) {
    msg = '😄 Nice clicking!';
  } else if (score < 35) {
    msg = '🔥 Fast fingers unlocked!';
  } else {
    msg = '👑 Button Master Supreme!';
  }

  finalScoreEl.textContent = score;
  finalMessageEl.textContent = msg;
  modal.classList.remove('hide'); // show end screen popup
}

function startGame() {
  score = 0;
  time = 60;
  over = false;
  glowSpeed = 1500; // reset to slower speed for new game
  scoreEl.textContent = score;
  timeEl.textContent = time;
  messageEl.textContent = 'Click the glowing button!';
  startBtn.classList.add('hide');
  modal.classList.add('hide'); // hide popup when restart

  glowRandom();
  startGlowLoop();

  clearInterval(timer);
  timer = setInterval(() => {
    time--;
    timeEl.textContent = time;
    if (time <= 0) {
      endGame();
    }
  }, 1000);
}

startBtn.onclick = startGame;
restartBtn.onclick = startGame;
