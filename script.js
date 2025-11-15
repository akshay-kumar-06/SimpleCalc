// Calculator State
let currentInput = '0';
let previousInput = null;
let operator = null;
let shouldResetDisplay = false;

// Get display element
const display = document.getElementById('display');

// Get all buttons
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-action]');

// Event Listeners
numberButtons.forEach(button => {
    button.addEventListener('click', () => handleNumber(button.dataset.number));
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => handleAction(button.dataset.action));
});

// Handle number input
function handleNumber(number) {
    if (shouldResetDisplay) {
        currentInput = number;
        shouldResetDisplay = false;
    } else {
        if (currentInput === '0' && number !== '.') {
            currentInput = number;
        } else {
            currentInput += number;
        }
    }
    updateDisplay();
}

// Handle actions (operators, clear, equals, decimal, percentage)
function handleAction(action) {
    switch(action) {
        case 'clear':
            clear();
            break;
        case 'decimal':
            addDecimal();
            break;
        case 'percentage':
            handlePercentage();
            break;
        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide':
            handleOperator(action);
            break;
        case 'equals':
            calculate();
            break;
    }
}

// Clear calculator
function clear() {
    currentInput = '0';
    previousInput = null;
    operator = null;
    shouldResetDisplay = false;
    updateDisplay();
}

// Add decimal point
function addDecimal() {
    if (shouldResetDisplay) {
        currentInput = '0.';
        shouldResetDisplay = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

// Handle percentage
function handlePercentage() {
    const current = parseFloat(currentInput);
    
    if (operator && previousInput !== null) {
        // If there's an operation pending (e.g., 100 + 10%)
        // Calculate percentage of the previous input
        const previous = parseFloat(previousInput);
        currentInput = String(previous * (current / 100));
    } else {
        // Just convert the current number to percentage (divide by 100)
        currentInput = String(current / 100);
    }
    
    updateDisplay();
    shouldResetDisplay = true;
}

// Handle operator selection
function handleOperator(newOperator) {
    if (operator !== null && !shouldResetDisplay) {
        // If there's already an operator and we have a new input, calculate first
        calculate();
    }
    
    previousInput = currentInput;
    operator = newOperator;
    shouldResetDisplay = true;
}

// Perform calculation
function calculate() {
    if (operator === null || previousInput === null) {
        return;
    }
    
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;
    
    switch(operator) {
        case 'add':
            result = prev + current;
            break;
        case 'subtract':
            result = prev - current;
            break;
        case 'multiply':
            result = prev * current;
            break;
        case 'divide':
            if (current === 0) {
                currentInput = 'Error';
                previousInput = null;
                operator = null;
                shouldResetDisplay = true;
                updateDisplay();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Round to avoid floating point precision issues
    result = Math.round(result * 100000000) / 100000000;
    
    currentInput = String(result);
    previousInput = null;
    operator = null;
    shouldResetDisplay = true;
    updateDisplay();
}

// Update display
function updateDisplay() {
    // Limit display to reasonable length
    let displayValue = currentInput;
    if (displayValue.length > 12 && displayValue !== 'Error') {
        displayValue = parseFloat(displayValue).toExponential(5);
    }
    display.value = displayValue;
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        handleNumber(e.key);
    } else if (e.key === '.') {
        addDecimal();
    } else if (e.key === '+') {
        handleOperator('add');
    } else if (e.key === '-') {
        handleOperator('subtract');
    } else if (e.key === '*') {
        handleOperator('multiply');
    } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('divide');
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        clear();
    } else if (e.key === '%') {
        handlePercentage();
    }
});