class Game {
    constructor() {
      // DOM Elementleri
      this.elements = {
        startButton: document.getElementById('startButton'),
        stopButton: document.getElementById('stopButton'),
        gameContainer: document.getElementById('gameContainer'),
        scoreElement: document.getElementById('score'),
        timerElement: document.getElementById('timer'),
        highScoreElement: document.getElementById('highScore'),
        difficultySelect: document.getElementById('difficulty')
      };
  
      // Oyun Ayarları
      this.settings = {
        difficulties: {
          easy: { interval: 1500, duration: 40, gridSize: 3 },
          medium: { interval: 1000, duration: 30, gridSize: 4 },
          hard: { interval: 700, duration: 20, gridSize: 5 }
        },
        colors: [
          { color: '#e74c3c', points: 10 },
          { color: '#2ecc71', points: 20 },
          { color: '#3498db', points: 30 },
          { color: '#f1c40f', points: 50 }
        ]
      };
  
      // Oyun Durumu
      this.state = {
        score: 0,
        timeLeft: 0,
        isActive: false,
        highScore: localStorage.getItem('batakHighScore') || 0,
        currentDifficulty: 'medium'
      };
  
      // Interval ID'leri
      this.intervals = {
        game: null,
        timer: null
      };
  
      // Event Listener'ları başlat
      this.initializeEventListeners();
      // Oyun alanını oluştur
      this.createGameBoard();
      // Skorları güncelle
      this.updateDisplay();
    }
  
    initializeEventListeners() {
      this.elements.startButton.addEventListener('click', () => this.startGame());
      this.elements.stopButton.addEventListener('click', () => this.stopGame());
      this.elements.difficultySelect.addEventListener('change', (e) => 
        this.handleDifficultyChange(e.target.value)
      );
    }
  
    createGameBoard() {
      const gridSize = this.getCurrentDifficulty().gridSize;
      this.elements.gameContainer.style.gridTemplateColumns = 
        `repeat(${gridSize}, 1fr)`;
      
      this.elements.gameContainer.innerHTML = '';
      
      for(let i = 0; i < gridSize * gridSize; i++) {
        const button = document.createElement('button');
        button.className = 'game-button';
        button.addEventListener('click', (e) => this.handleButtonClick(e));
        this.elements.gameContainer.appendChild(button);
      }
    }
  
    getCurrentDifficulty() {
      return this.settings.difficulties[this.state.currentDifficulty];
    }
  
    handleDifficultyChange(newDifficulty) {
      if(this.state.isActive) {
        alert('Lütfen önce oyunu durdurun!');
        this.elements.difficultySelect.value = this.state.currentDifficulty;
        return;
      }
      
      this.state.currentDifficulty = newDifficulty;
      this.createGameBoard();
    }
  
    startGame() {
      if(this.state.isActive) return;
  
      const difficulty = this.getCurrentDifficulty();
      
      this.state = {
        ...this.state,
        score: 0,
        timeLeft: difficulty.duration,
        isActive: true
      };
  
      this.toggleControls(true);
      this.resetButtons();
  
      this.intervals.timer = setInterval(() => this.updateTimer(), 1000);
      this.intervals.game = setInterval(
        () => this.lightRandomButton(), 
        difficulty.interval
      );
    }
  
    stopGame() {
      this.state.isActive = false;
      this.toggleControls(false);
      this.resetButtons();
      this.clearIntervals();
      
      if(this.state.score > this.state.highScore) {
        this.state.highScore = this.state.score;
        localStorage.setItem('batakHighScore', this.state.highScore);
      }
      
      this.updateDisplay();
    }
  
    handleButtonClick(event) {
      if(!this.state.isActive || !event.target.classList.contains('lit')) return;
  
      const points = parseInt(event.target.dataset.points);
      this.state.score += points;
      event.target.classList.remove('lit');
      this.updateDisplay();
    }
  
    lightRandomButton() {
      const buttons = document.querySelectorAll('.game-button');
      buttons.forEach(btn => btn.classList.remove('lit'));
  
      const randomButton = buttons[Math.floor(Math.random() * buttons.length)];
      const randomColor = this.settings.colors[
        Math.floor(Math.random() * this.settings.colors.length)
      ];
  
      randomButton.style.backgroundColor = randomColor.color;
      randomButton.dataset.points = randomColor.points;
      randomButton.classList.add('lit');
    }
  
    updateTimer() {
      this.state.timeLeft--;
      this.updateDisplay();
  
      if(this.state.timeLeft <= 0) {
        this.stopGame();
        alert(`Oyun Bitti! Skorunuz: ${this.state.score}`);
      }
    }
  
    updateDisplay() {
      this.elements.scoreElement.textContent = `Skor: ${this.state.score}`;
      this.elements.timerElement.textContent = `Kalan Süre: ${this.state.timeLeft}`;
      this.elements.highScoreElement.textContent = 
        `Yüksek Skor: ${this.state.highScore}`;
    }
  
    resetButtons() {
      document.querySelectorAll('.game-button').forEach(btn => {
        btn.classList.remove('lit');
        btn.style.backgroundColor = '#34495e';
        btn.dataset.points = '0';
      });
    }
  
    toggleControls(gameActive) {
      this.elements.difficultySelect.disabled = gameActive;
      this.elements.startButton.style.display = gameActive ? 'none' : 'inline-block';
      this.elements.stopButton.style.display = gameActive ? 'inline-block' : 'none';
    }
  
    clearIntervals() {
      clearInterval(this.intervals.game);
      clearInterval(this.intervals.timer);
    }
  }
  
  // Oyunu Başlat
  document.addEventListener('DOMContentLoaded', () => new Game());