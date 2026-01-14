// Game State
const state = {
    difficulty: 1,
    problemNumber: 1,
    currentProblem: null,
    goldStars: 0,
    silverStars: 0,
    hintUsed: false,
    answerLocked: false
};

const TOTAL_PROBLEMS = 10;

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const resultsScreen = document.getElementById('results-screen');

const levelButtons = document.querySelectorAll('.level-btn');
const problemCounter = document.getElementById('problem-counter');
const starsDisplay = document.getElementById('stars-display');
const numA = document.getElementById('num-a');
const numB = document.getElementById('num-b');
const operator = document.getElementById('operator');
const answerInput = document.getElementById('answer-input');
const hintBtn = document.getElementById('hint-btn');
const hintArea = document.getElementById('hint-area');

const submitBtn = document.getElementById('submit-btn');
const homeBtn = document.getElementById('home-btn');
const finalStars = document.getElementById('final-stars');
const starSummary = document.getElementById('star-summary');
const playAgainBtn = document.getElementById('play-again-btn');
const chooseLevelBtn = document.getElementById('choose-level-btn');

// Utility Functions
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProblem(difficulty) {
    let a, b, op;

    switch (difficulty) {
        case 1:
            // Easy addition: a + b where a,b in [1,10]
            a = randomInt(1, 10);
            b = randomInt(1, 10);
            op = '+';
            break;

        case 2:
            // Larger numbers: one in [10,15], other in [1,10]
            if (Math.random() < 0.5) {
                a = randomInt(10, 15);
                b = randomInt(1, 10);
            } else {
                a = randomInt(1, 10);
                b = randomInt(10, 15);
            }
            op = '+';
            break;

        case 3:
            // Subtraction: a - b where a,b in [1,10] and a >= b
            a = randomInt(1, 10);
            b = randomInt(1, a);
            op = '-';
            break;

        case 4:
            // Mixed: randomly pick level 2 or 3
            if (Math.random() < 0.5) {
                return generateProblem(2);
            } else {
                return generateProblem(3);
            }

        default:
            a = randomInt(1, 10);
            b = randomInt(1, 10);
            op = '+';
    }

    return { a, b, operator: op };
}

function getAnswer(problem) {
    if (problem.operator === '+') {
        return problem.a + problem.b;
    } else {
        return problem.a - problem.b;
    }
}

// Screen Navigation
function showScreen(screenId) {
    welcomeScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    resultsScreen.classList.add('hidden');

    document.getElementById(screenId).classList.remove('hidden');
}

// Star Display
function updateStarsDisplay() {
    starsDisplay.innerHTML = '';

    for (let i = 0; i < state.goldStars; i++) {
        const star = document.createElement('span');
        star.className = 'star gold';
        star.textContent = '\u2605';
        starsDisplay.appendChild(star);
    }

    for (let i = 0; i < state.silverStars; i++) {
        const star = document.createElement('span');
        star.className = 'star silver';
        star.textContent = '\u2605';
        starsDisplay.appendChild(star);
    }
}

function showFinalStars() {
    finalStars.innerHTML = '';

    for (let i = 0; i < state.goldStars; i++) {
        const star = document.createElement('span');
        star.className = 'star gold';
        star.textContent = '\u2605';
        finalStars.appendChild(star);
    }

    for (let i = 0; i < state.silverStars; i++) {
        const star = document.createElement('span');
        star.className = 'star silver';
        star.textContent = '\u2605';
        finalStars.appendChild(star);
    }

    // Summary text
    const goldText = state.goldStars === 1 ? '1 guldstjärna' : `${state.goldStars} guldstjärnor`;
    const silverText = state.silverStars === 1 ? '1 silverstjärna' : `${state.silverStars} silverstjärnor`;
    starSummary.textContent = `${goldText} och ${silverText}`;
}

// Hint Display
function showHint() {
    if (state.hintUsed) return;

    state.hintUsed = true;
    hintBtn.classList.add('used');
    hintArea.classList.remove('hidden');

    const problem = state.currentProblem;
    hintArea.innerHTML = '';

    if (problem.operator === '+') {
        // Addition: two rows with + between
        const row1 = document.createElement('div');
        row1.className = 'hint-row';
        for (let i = 0; i < problem.a; i++) {
            const circle = document.createElement('div');
            circle.className = 'hint-circle';
            row1.appendChild(circle);
        }
        hintArea.appendChild(row1);

        const opDiv = document.createElement('div');
        opDiv.className = 'hint-operator';
        opDiv.textContent = '+';
        hintArea.appendChild(opDiv);

        const row2 = document.createElement('div');
        row2.className = 'hint-row';
        for (let i = 0; i < problem.b; i++) {
            const circle = document.createElement('div');
            circle.className = 'hint-circle';
            row2.appendChild(circle);
        }
        hintArea.appendChild(row2);

    } else {
        // Subtraction: answer circles green, subtracted circles gray
        const answer = getAnswer(problem);
        const row = document.createElement('div');
        row.className = 'hint-row';

        // Green circles (the answer)
        for (let i = 0; i < answer; i++) {
            const circle = document.createElement('div');
            circle.className = 'hint-circle';
            row.appendChild(circle);
        }

        // Gray circles (the subtracted amount)
        for (let i = 0; i < problem.b; i++) {
            const circle = document.createElement('div');
            circle.className = 'hint-circle gray';
            row.appendChild(circle);
        }

        hintArea.appendChild(row);
    }
}

// Game Flow
function startGame(difficulty) {
    state.difficulty = difficulty;
    state.problemNumber = 1;
    state.goldStars = 0;
    state.silverStars = 0;
    state.hintUsed = false;

    showScreen('game-screen');
    loadProblem();
}

function loadProblem() {
    state.currentProblem = generateProblem(state.difficulty);
    state.hintUsed = false;
    state.answerLocked = false;

    numA.textContent = state.currentProblem.a;
    numB.textContent = state.currentProblem.b;
    operator.textContent = state.currentProblem.operator;

    answerInput.value = '';
    answerInput.classList.remove('shake', 'correct');

    hintBtn.classList.remove('used');
    hintArea.classList.add('hidden');
    hintArea.innerHTML = '';

    problemCounter.textContent = `Uppgift ${state.problemNumber} av ${TOTAL_PROBLEMS}`;
    updateStarsDisplay();

    // Focus input after a brief delay to allow screen transition
    setTimeout(() => answerInput.focus(), 100);
}

function checkAnswer() {
    if (state.answerLocked) return;

    const userAnswer = parseInt(answerInput.value, 10);
    const correctAnswer = getAnswer(state.currentProblem);

    if (isNaN(userAnswer)) return;

    if (userAnswer === correctAnswer) {
        // Correct! Lock to prevent double submission
        state.answerLocked = true;
        answerInput.classList.add('correct');

        if (state.hintUsed) {
            state.silverStars++;
        } else {
            state.goldStars++;
        }

        updateStarsDisplay();

        setTimeout(() => {
            if (state.problemNumber >= TOTAL_PROBLEMS) {
                showResults();
            } else {
                state.problemNumber++;
                loadProblem();
            }
        }, 500);

    } else {
        // Wrong answer - shake
        answerInput.classList.add('shake');
        setTimeout(() => {
            answerInput.classList.remove('shake');
            answerInput.value = '';
            answerInput.focus();
        }, 400);
    }
}

function showResults() {
    showScreen('results-screen');
    showFinalStars();
}

// Event Listeners
levelButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const level = parseInt(btn.dataset.level, 10);
        startGame(level);
    });
});

answerInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

// Also check on input change (for mobile virtual keyboards that may not fire Enter)
answerInput.addEventListener('input', () => {
    // Small delay to allow user to finish typing multi-digit numbers
    clearTimeout(answerInput.checkTimeout);
    answerInput.checkTimeout = setTimeout(() => {
        // Only auto-check if the answer could be complete
        // For most problems, answers are 1-2 digits
        const val = answerInput.value;
        if (val.length >= 2 || (val.length === 1 && parseInt(val) <= 9)) {
            // Don't auto-submit, user should press enter or tap elsewhere
        }
    }, 300);
});

// Add blur event for mobile - check answer when user dismisses keyboard
answerInput.addEventListener('blur', () => {
    if (answerInput.value.length > 0) {
        checkAnswer();
    }
});

submitBtn.addEventListener('click', checkAnswer);

hintBtn.addEventListener('click', showHint);

playAgainBtn.addEventListener('click', () => {
    startGame(state.difficulty);
});

chooseLevelBtn.addEventListener('click', () => {
    showScreen('welcome-screen');
});

homeBtn.addEventListener('click', () => {
    showScreen('welcome-screen');
});

// Prevent zoom on double-tap for iOS
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - (document.lastTouchEnd || 0) <= 300) {
        e.preventDefault();
    }
    document.lastTouchEnd = now;
}, { passive: false });
