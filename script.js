// Selectors for DOM elements
const levelDisplay = document.getElementById("level");
const colorButtons = {
    red: document.getElementById("red"),
    green: document.getElementById("green"),
    blue: document.getElementById("blue"),
    yellow: document.getElementById("yellow"),
};

// Sound files
const sounds = {
    newPopup: new Audio("utility/new-popups.mp3"),
    nextLevel: new Audio("utility/next-level.mp3"),
    gameOver: new Audio("utility/game-over.mp3"),
};

// Game variables
let gameSequence = [];
let playerSequence = [];
let level = 0;
let gameStarted = false;

// Utility Functions
const playPopupSound = () => {
    sounds.newPopup.currentTime = 0;
    sounds.newPopup.play();
};

const flashButton = (color, isGameGenerated = false) => {
    const button = colorButtons[color];
    button.style.filter = "brightness(1.5)"; // Brighten the button

    if (isGameGenerated) {
        playPopupSound(); // Play popup sound for game-generated flashes
    }

    setTimeout(() => {
        button.style.filter = "brightness(1)"; // Restore original brightness
    }, 300);
};

const displayMessage = (message) => {
    levelDisplay.textContent = message;
};

// Start a new game
const startGame = () => {
    gameSequence = [];
    playerSequence = [];
    level = 0;
    gameStarted = true;
    nextLevel();
};

// Advance to the next level
const nextLevel = () => {
    level++;
    displayMessage(`Level ${level}`);
    playerSequence = [];
    const nextColor = Object.keys(colorButtons)[Math.floor(Math.random() * 4)];
    gameSequence.push(nextColor);
    playSequence();
    sounds.nextLevel.currentTime = 0;
    sounds.nextLevel.play();
};

// Play only the current color in the game sequence
const playSequence = () => {
    let delay = 500; // Delay before flashing the next color
    setTimeout(() => {
        const color = gameSequence[gameSequence.length - 1];
        flashButton(color, true); // Pass true to indicate game-generated flash
    }, delay);
};

// Handle player's button click
const handleButtonClick = (color) => {
    if (!gameStarted) return;

    playerSequence.push(color);
    flashButton(color); // Flash without playing popup sound

    // Check if the player's input matches the game sequence
    if (playerSequence[playerSequence.length - 1] !== gameSequence[playerSequence.length - 1]) {
        gameOver();
        return;
    }

    // Check if the player completed the sequence
    if (playerSequence.length === gameSequence.length) {
        setTimeout(nextLevel, 1000);
    }
};

// Game over logic
const gameOver = () => {
    sounds.gameOver.currentTime = 0;
    sounds.gameOver.play();
    displayMessage("Game Over, Press Any Key to Restart");
    gameStarted = false;
};

// Event Listeners
document.addEventListener("keydown", () => {
    if (!gameStarted) startGame();
});

Object.keys(colorButtons).forEach((color) => {
    colorButtons[color].addEventListener("click", () => handleButtonClick(color));
});
