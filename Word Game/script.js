// Selecting DOM elements
const letters = document.querySelectorAll('.scoreboard-letter');
const loadingDiv = document.querySelector('.info-bar');

// Constants for the game
const ANSWER_LENGTH = 5;
const ROUNDS = 6;

// Asynchronous initialization function
async function init(params) {
    // Initializing variables
    let currentGuess = "";
    let currentRow = 0;
    let isLoading = true;
    let done = false; // Flag to track if the game is already won or lost

    // Fetching a random word from the API
    const res = await fetch("https://words.dev-apis.com/word-of-the-day?random=1");
    const resObj = await res.json();
    const word = resObj.word.toUpperCase();
    const wordParts = word.split("");
    
    // Hiding the loading indicator
    setLoading(false);
    isLoading = false;

    // Logging the randomly chosen word
    console.log(word);

    // Function to add a letter to the current guess
    function addLetter(letter) {
        if (currentGuess.length < ANSWER_LENGTH) {
            currentGuess += letter;
        } else {
            currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
        }
        letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter;
    }

    // Asynchronous function to validate and process the current guess
    async function commit(params) {
        // Check if the game is already done
        if (done) {
            return;
        }

        // Check if the current guess has the correct length
        if (currentGuess.length !== ANSWER_LENGTH) {
            return;
        }

        // Validate the word using an API call
        isLoading = true;
        setLoading(true);
        const res = await fetch("https://words.dev-apis.com/validate-word", {
            method: "POST",
            body: JSON.stringify({ word: currentGuess })
        });
        const resObj = await res.json();
        const validWord = resObj.validWord;

        // Update loading status
        isLoading = false;
        setLoading(false);

        // If the word is not valid, mark it as invalid and do nothing
        if (!validWord) {
            markInvalidWord();
            return;
        }

        // Process the guess and mark letters as correct, close, or wrong
        const guessParts = currentGuess.split("");
        const map = makeMap(wordParts);

        for (let i = 0; i < ANSWER_LENGTH; i++) {
            if (guessParts[i] === wordParts[i]) {
                letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
                map[guessParts[i]]--;
            }
        }

        for (let i = 0; i < ANSWER_LENGTH; i++) {
            if (guessParts[i] === wordParts[i]) {
                // Do nothing; the letter is already marked as correct
            } else if (wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0) {
                letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
            } else {
                letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
            }
        }

        // Check if the current guess matches the word, and update the game status
        if (currentGuess === word) {
            alert('You win 🎈');
            document.querySelector('.brand').classList.add('winner');
            done = true;
            return;
        } else if (currentRow === ROUNDS) {
            alert(`You lose 😭 The word is ${word}`);
            done = true;
        }

        // Increment the current row and reset the current guess
        currentRow++;
        currentGuess = '';
    }

    // Function to handle backspacing in the current guess
    function backspace(params) {
        currentGuess = currentGuess.substring(0, currentGuess.length - 1);
        letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
    }

    // Function to visually mark an invalid word
    function markInvalidWord(params) {
        for (let i = 0; i < ANSWER_LENGTH; i++) {
            letters[currentRow * ANSWER_LENGTH + i].classList.remove("invalid");

            setTimeout(() => {
                letters[currentRow * ANSWER_LENGTH + i].classList.add("invalid");
            }, 10);
        }
    }

    // Event listener for keyboard input
    document.addEventListener('keydown', function handleKeypress(event) {
        const action = event.key;

        if (action === 'Enter') {
            commit();
        } else if (action === 'Backspace') {
            backspace();
        } else if (isLetter(action)) {
            addLetter(action.toUpperCase());
        } else {
            // Do nothing for other keys
        }
    });
}

// Function to check if a character is a letter
function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

// Function to toggle the loading indicator
function setLoading(isLoading) {
    loadingDiv.classList.toggle('hidden', !isLoading);
}

// Function to create a frequency map of letters in an array
function makeMap(array) {
    const obj = {};
    for (let i = 0; i < array.length; i++) {
        const letter = array[i];
        if (obj[letter]) {
            obj[letter]++;
        } else {
            obj[letter] = 1;
        }
    }
    return obj;
}

// Call the initialization function
init();
