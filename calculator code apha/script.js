const display = document.getElementById('display');

let isResultDisplayed = false;

function appendValue(value) {
    const operators = ['+', '-', '*', '/', '%'];

    if (isResultDisplayed && !operators.includes(value)) {
        display.value = value;
        isResultDisplayed = false;
        return;
    }
    
    if (isResultDisplayed && operators.includes(value)) {
        isResultDisplayed = false;
    }

    if (display.value === '0' && !isNaN(value)) {
        display.value = value; 
    } else {
        display.value += value;
    }
}

function clearScreen() {
    display.value = '0';
    isResultDisplayed = false;
}

function deleteLast() {
    if (isResultDisplayed) {
        clearScreen();
        return;
    }

    if (display.value.length > 1) {
        display.value = display.value.slice(0, -1);
    } else {
        display.value = '0';
    }
}

function calculateResult() {
    try {
        let result = eval(display.value);
        
        if (result === Infinity || isNaN(result)) {
            display.value = "Error";
        } else {
            display.value = result;
        }
        isResultDisplayed = true;
    } catch (error) {
        display.value = "Error";
        isResultDisplayed = true;
    }
}

function square() {
    try {
        let currentVal = eval(display.value);
        if (!isNaN(currentVal)) {
            display.value = Math.pow(currentVal, 2);
            isResultDisplayed = true;
        }
    } catch (error) {
        display.value = "Error";
    }
}

function squareRoot() {
    try {
        let currentVal = eval(display.value);
        if (currentVal < 0) {
            display.value = "Error";
        } else if (!isNaN(currentVal)) {
            display.value = Math.sqrt(currentVal);
            isResultDisplayed = true;
        }
    } catch (error) {
        display.value = "Error";
    }
}

function toggleSign() {
    try {
        let currentVal = eval(display.value);
        if (!isNaN(currentVal)) {
            display.value = currentVal * -1;
        }
    } catch (error) {
        display.value = "Error";
    }
}

document.addEventListener('keydown', function(event) {
    const key = event.key;
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', '%'];
    
    if (allowedKeys.includes(key)) {
        appendValue(key);
    } else if (key === 'Enter' || key === '=') {
        calculateResult();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === 'Escape') {
        clearScreen();
    }
});