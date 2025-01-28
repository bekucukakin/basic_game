const gameSettings = {
    difficulties: {
        easy: { interval: 1500, duration: 40 },
        medium: { interval: 1000, duration: 30 },
        hard: { interval: 700, duration: 20 }
    },
    colors: [
        { color: '#e74c3c', points: 10 },
        { color: '#2ecc71', points: 20 },
        { color: '#3498db', points: 30 },
        { color: '#f1c40f', points: 50 }
    ]
};

let score = 0;
let timeLeft;
let gameInterval;
let timerInterval;
let isGameActive = false;
let highScore = localStorage.getItem('batakHighScore') || 0;

// Elementler
const startButton = document.getElementById('startButton');
const gameContainer = document.getElementById('gameContainer');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const highScoreElement = document.getElementById('highScore');
const difficultySelect = document.getElementById('difficulty');

// Oyun alanını oluştur
function createGameBoard() {
    for(let i = 0; i < 12; i++) {
        const button = document.createElement('button');
        button.className = 'game-button';
        button.onclick = handleButtonClick;
        gameContainer.appendChild(button);
    }
}

// Oyunu başlat
function startGame() {
    if(isGameActive) return;
    
    const difficulty = gameSettings.difficulties[difficultySelect.value];
    timeLeft = difficulty.duration;
    score = 0;
    isGameActive = true;
    
    updateDisplay();
    resetButtons();
    
    timerInterval = setInterval(updateTimer, 1000);
    gameInterval = setInterval(lightRandomButton, difficulty.interval);
    
    startButton.disabled = true;
}

// Rastgele buton yak
function lightRandomButton() {
    const buttons = document.querySelectorAll('.game-button');
    buttons.forEach(btn => btn.classList.remove('lit'));
    
    const randomButton = buttons[Math.floor(Math.random() * buttons.length)];
    const randomColor = gameSettings.colors[Math.floor(Math.random() * gameSettings.colors.length)];
    
    randomButton.style.backgroundColor = randomColor.color;
    randomButton.dataset.points = randomColor.points;
    randomButton.classList.add('lit');
}

// Buton tıklama işlemi
function handleButtonClick(e) {
    if(!isGameActive || !e.target.classList.contains('lit')) return;
    
    const points = parseInt(e.target.dataset.points);
    score += points;
    e.target.classList.remove('lit');
    updateDisplay();
}

// Skor ve zaman güncelleme
function updateDisplay() {
    scoreElement.textContent = `Skor: ${score}`;
    timerElement.textContent = `Kalan Süre: ${timeLeft}`;
    highScoreElement.textContent = `Yüksek Skor: ${highScore}`;
}

// Zamanlayıcı
function updateTimer() {
    timeLeft--;
    updateDisplay();
    
    if(timeLeft <= 0) {
        endGame();
    }
}

// Oyunu bitir
function endGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    isGameActive = false;
    startButton.disabled = false;
    
    if(score > highScore) {
        highScore = score;
        localStorage.setItem('batakHighScore', highScore);
    }
    
    updateDisplay();
    alert(`Oyun Bitti!\nSkorunuz: ${score}\nYüksek Skor: ${highScore}`);
}

// Butonları sıfırla
function resetButtons() {
    document.querySelectorAll('.game-button').forEach(btn => {
        btn.classList.remove('lit');
        btn.style.backgroundColor = '#34495e';
        btn.dataset.points = '0';
    });
}

// Event listeners
startButton.addEventListener('click', startGame);

// Sayfa yüklendiğinde
createGameBoard();
updateDisplay();