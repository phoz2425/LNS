var correctAnswers = 0;
var trials = 0;
var items = [];
var currentLetter, currentNumber;

function startGame() {
    if (trials < 3) {
        // Generate a random letter
        currentLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));

        // Generate a random number between 0 and 9
        currentNumber = Math.floor(Math.random() * 10);

        // Add the item to the items array
        items.push({ number: currentNumber, letter: currentLetter });

        // Sort the items array
        items.sort(function(a, b) {
            if (a.number === b.number) {
                return a.letter.localeCompare(b.letter);
            } else {
                return a.number - b.number;
            }
        });

        // Show the items in the .container div
        document.querySelector('.container').textContent = items.map(function(item) {
            return item.number + item.letter;
        }).join(', ');

        // Wait for 1 second (1000 milliseconds) before showing the textbox
        setTimeout(showTextbox, 1000);
    } else {
        // Show the number of correct answers
        document.querySelector('.container').textContent = 'Correct answers: ' + correctAnswers;
    }
}

function showTextbox() {
    var textbox = document.createElement('input');
    textbox.type = 'text';
    textbox.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            // Check the answer
            var answer = textbox.value.split(', ').map(function(item) {
                return { number: parseInt(item[0]), letter: item[1] };
            });

            if (JSON.stringify(answer) === JSON.stringify(items)) {
                correctAnswers++;
            }

            // Remove the textbox
            document.querySelector('.container').removeChild(textbox);

            // Reset the items array and the trials counter
            items = [];
            trials = 0;

            // Start the next round
            startGame();
        }
    });

    // Add the textbox to the .container div
    document.querySelector('.container').appendChild(textbox);
}

document.getElementById('startButton').addEventListener('click', startGame);
