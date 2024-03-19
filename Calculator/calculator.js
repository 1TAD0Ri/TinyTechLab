// Initialize variables for the calculator
let buffer = '0'; // Buffer to store input or intermediate values
const screen = document.querySelector('.screen'); // Reference to the calculator screen element
let runningTotal = 0; // Running total for mathematical operations
let previousOperator; // Store the previous mathematical operator

// Function to handle button clicks on the calculator
function buttonClick(value) {
    if (isNaN(parseInt(value))) {
        // If the input is not a number, handle it as a symbol (e.g., operator or special command)
        handleSymbol(value);
    } else {
        // If the input is a number, handle it accordingly
        handleNumber(value);
    }
    // Update the calculator display
    rerender();
}

// Function to handle numeric input
function handleNumber(number) {
    if (buffer === '0') {
        // If the buffer is '0', replace it with the current number
        buffer = number;
    } else {
        // If the buffer already has a value, append the current number
        buffer += number;
    }
}

// Function to handle mathematical operations
function handleMath(value) {
    if (buffer === "0") {
        // If the buffer is '0', do nothing for the current operation
        return;
    }

    const intBuffer = parseInt(buffer);
    if (runningTotal === 0) {
        // If running total is 0, set it to the current buffer value
        runningTotal = intBuffer;
    } else {
        // If running total is not 0, perform the previous operation with the current buffer value
        flushOperation(intBuffer);
    }
    // Set the current operator for the next operation
    previousOperator = value;
    buffer = '0'; // Reset the buffer for the next input
}

// Function to execute the previous operation based on the operator
function flushOperation(intBuffer) {
    if (previousOperator === '+') {
        runningTotal += intBuffer;
    } else if (previousOperator === '-') {
        runningTotal -= intBuffer;
    } else if (previousOperator === 'x') {
        runningTotal *= intBuffer;
    } else if (previousOperator === '%') {
        runningTotal /= intBuffer;
    }
}

// Function to handle symbols (e.g., clear, equals, backspace, mathematical operators)
function handleSymbol(symbol) {
    switch (symbol) {
        case "C":
            // Clear the buffer and reset
            buffer = "0";
            break;

        case "=":
            // If equals is pressed, execute the pending operation
            if (previousOperator === null) {
                return;
            }
            flushOperation(parseInt(buffer));
            previousOperator = null;
            buffer = "" + runningTotal; // Convert the running total to a string for display
            runningTotal = 0;
            break;

        case "←":
            // Backspace to remove the last digit from the buffer
            if (buffer.length === 1) {
                buffer = '0';
            } else {
                buffer = buffer.substring(0, buffer.length - 1);
            }
            break;

        // Mathematical operators
        case "+":
        case "-":
        case "%":
        case "x":
            // Handle mathematical operators
            handleMath(symbol);
            break;
    }
}

// Initialization function, setting up event listener for button clicks
function init(params) {
    console.log('hi');
    document
        .querySelector('.calc-buttons')
        .addEventListener("click", function (event) {
            buttonClick(event.target.innerText);
        });
}

// Function to update the calculator screen with the current buffer value
function rerender(params) {
    screen.innerText = buffer;
}

// Initialize the calculator
init();
