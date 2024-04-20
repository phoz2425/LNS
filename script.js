import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, push } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

var gameResults = {
    name: '',
    email: '',
    college: '',
    answers: [],
    coorectAnswers: [],
    wrongAnswers: [],
    correctItemCount: 0
};

var correctAnswers = 0;
var level = 0;
var item = 0;
var levels = [
    [['H', '2'], ['P', '6']],
    [['O', '7', '4'], ['K', '8', '5']],
    [['Z', '7', '3', 'A'], ['7', 'W', 'Q', '2'], ['S', '4', '1', 'D']],
    [['K', '4', '8', 'R', 'B', '2'], ['L', 'B', '3', '2', '6', 'J'], ['J', '2', '9', '5', 'L', 'G']]
];

var currentItem;

var firebaseConfig = {
    apiKey: "AIzaSyA4Ob5S6BZlYJ2d_0kRJd-7E5JLC2XUk-w",
    authDomain: "lnsapp-e6d13.firebaseapp.com",
    databaseURL: "https://lnsapp-e6d13-default-rtdb.firebaseio.com/",
    projectId: "lnsapp-e6d13",
    storageBucket: "lnsapp-e6d13.appspot.com",
    messagingSenderId: "692983724897",
    appId: "1:692983724897:web:cea4a895d7df8b414ca320"
};

var database;

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function saveGameResults() {
    var gameResultsRef = ref(database, 'gameResults/');
    push(gameResultsRef, gameResults)
        .then(() => console.log('Game results saved successfully.'))
        .catch((error) => console.error('Error saving game results: ', error));
}

function checkAnswer(userAnswer, correctAnswer) {
    // Convert userAnswer to array, sort it, and join it back to string
    userAnswer = userAnswer.split('').sort().join('');

    // Sort the correctAnswer array and join it back to string
    correctAnswer = correctAnswer.sort().join('');

    if (userAnswer === correctAnswer) {
        gameResults.correctAnswers.push({level: level, item: item, answer: userAnswer, correct: true});
    } else {
        gameResults.wrongAnswers.push({level: level, item: item, answer: userAnswer, correct: false});
    }
}

function showTextbox() {
    var textbox = document.createElement('input');
    textbox.type = 'text';
    textbox.maxLength = currentItem.length;
    textbox.style.color = 'black'; // Change text color to black
    textbox.addEventListener('keyup', function(event) { // Change from 'keydown' to 'keyup'
        if (event.key === 'Enter') {
            var answer = textbox.value.toUpperCase();
            checkAnswer(answer, currentItem.slice()); // Use slice to create a copy of currentItem

            document.querySelector('.container').removeChild(textbox);

            if (item < levels[level].length - 1) {
                item++;
            } else {
                level++;
                item = 0;
            }

            startGame();
        }
    });

    document.querySelector('.container').appendChild(textbox);
}

function startGame() {
    if (level < levels.length) {
        var startButton = document.getElementById('startButton');
        if (startButton) {
            startButton.style.display = 'none';
        }
        document.getElementById('levelDisplay').textContent = 'Level: ' + (level + 1);

        currentItem = levels[level][item].slice();
        var charIndex = 0;

        document.querySelector('.container').textContent = '';

        var timer = setInterval(function() {
            if (charIndex < currentItem.length) {
                var container = document.querySelector('.container');
                container.textContent = currentItem[charIndex];
                container.style.color = 'white'; // Change color to white
                charIndex++;
            } else {
                clearInterval(timer);
                document.querySelector('.container').textContent = '';
                setTimeout(showTextbox, 1000);
            }
        }, 1000);
    } else {
        saveGameResults();
        document.body.innerHTML = '';
        var square = document.createElement('div');
        square.style.width = '200px';
        square.style.height = '200px';
        square.style.border = '1px solid black';
        square.style.display = 'flex';
        square.style.justifyContent = 'center';
        square.style.alignItems = 'center';

        var thankYouMessage = document.createElement('h1');
        thankYouMessage.textContent = 'Thank you for participating in our test!';
        thankYouMessage.style.color = 'white'; // Change color to purple
        thankYouMessage.style.textAlign = 'center'; // Center the text
        square.appendChild(thankYouMessage);
        document.body.appendChild(square);
    }
}
    
window.onload = function() {
    initializeApp(firebaseConfig);
    database = getDatabase();

    gameResults.name = prompt('Please enter your full name: ');
    gameResults.email = prompt('Please enter your email: ');
    gameResults.college = prompt('Please enter your course, year, and section(EX. BSP 2B): ');

    var startButton = document.getElementById('startButton');
    startButton.addEventListener('click', function() {
        startGame();
    });
}
