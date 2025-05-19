const display = document.getElementById('display');
const errorMessage = document.getElementById('error-message');
const historyList = document.getElementById('history-list');
const historyPanel = document.getElementById('history');
let history = [];
let isResultDisplayed = false;

function appendToDisplay(value) {
    if (isResultDisplayed && /[0-9.]/.test(value)) {
        display.value = '';
        isResultDisplayed = false;
    }
    display.value += value;
    clearError();
}

function clearDisplay() {
    display.value = '';
    isResultDisplayed = false;
    clearError();
}

function clearError() {
    errorMessage.textContent = '';
}

function showError(message) {
    errorMessage.textContent = message;
}

function addToHistory(expression, result) {
    history.push({ expression, result });
    const li = document.createElement('li');
    li.textContent = `${expression} = ${result}`;
    historyList.prepend(li);
    if (!historyPanel.classList.contains('active')) {
        historyPanel.classList.add('active');
    }
    if (history.length > 10) {
        history.shift();
        historyList.removeChild(historyList.lastChild);
    }
}

function calculate() {
    try {
        let expression = display.value.replace(/×/g, '*').replace(/÷/g, '/');
        if (!expression) {
            showError('Enter an expression');
            return;
        }
        let result = math.evaluate(expression);
        if (!isFinite(result)) {
            showError('Invalid calculation');
            return;
        }
        result = Math.round(result * 1000000) / 1000000;
        display.value = result;
        addToHistory(expression.replace(/\*/g, '×').replace(/\//g, '÷'), result);
        isResultDisplayed = true; 
        clearError();
    } catch (error) {
        showError('Invalid expression');
    }
}

document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (/[0-9]/.test(key)) {
        if (isResultDisplayed) {
            display.value = '';
            isResultDisplayed = false;
        }
        appendToDisplay(key);
    }
    else if (key === '+') appendToDisplay('+');
    else if (key === '-') appendToDisplay('-');
    else if (key === '*') appendToDisplay('×');
    else if (key === '/') appendToDisplay('÷');
    else if (key === '.') {
        if (isResultDisplayed) {
            display.value = '';
            isResultDisplayed = false;
        }
        appendToDisplay('.');
    }
    else if (key === '(' || key === ')') appendToDisplay(key);
    else if (key === 'Enter') calculate();
    else if (key === 'Escape') clearDisplay();
    else if (key === 'Backspace') {
        if (isResultDisplayed) {
            display.value = '';
            isResultDisplayed = false;
        }
        display.value = display.value.slice(0, -1);
    }
});
