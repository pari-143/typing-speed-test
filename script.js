// Dark/Light Mode Toggle
const toggleButton = document.getElementById('toggleButton');
const body = document.body;

toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        toggleButton.textContent = '🌜'; // Moon emoji for Dark Mode
    } else {
        toggleButton.textContent = '🌞'; // Sun emoji for Light Mode
    }
});

// Function to fetch a random paragraph from the API
async function fetchRandomParagraph() {
    const response = await fetch('https://baconipsum.com/api/?type=all-meat&paras=1&start-with-lorem=1');
    const data = await response.json();
    return data[0]; // Return the first generated paragraph
}

// Set the random paragraph to the text display area
async function setRandomParagraph() {
    const paragraph = await fetchRandomParagraph();
    document.getElementById("textToDisplay").textContent = paragraph;
}

// Add your existing typing test code below
const startTestButton = document.getElementById("startTest");
const typingArea = document.getElementById("typingArea");
const testArea = document.getElementById("testArea");
const countdownElement = document.getElementById("countdown");
const finishTestButton = document.getElementById("finishTest");
const resultsElement = document.getElementById("results");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const certificateSection = document.getElementById("certificate");
const retryTestButton = document.getElementById("retryTest");

let testDuration = 0;
let timeLeft = 0;
let timer;
let startTime;
let correctTyped = 0;
let totalTyped = 0;

startTestButton.addEventListener("click", () => {
    testDuration = parseInt(document.getElementById("duration").value) * 60;
    timeLeft = testDuration;
    correctTyped = 0;
    totalTyped = 0;
    typingArea.disabled = false;
    typingArea.value = "";
    typingArea.focus();
    testArea.style.display = "block";
    resultsElement.style.display = "none";
    certificateSection.style.display = "none";
    finishTestButton.style.display = "inline-block";
    startTime = Date.now();
    countdown();
    timer = setInterval(countdown, 1000);
    setRandomParagraph(); // Fetch and set a new random paragraph each time a test starts
});

function countdown() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    countdownElement.textContent = `Time Left: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    if (timeLeft <= 0) {
        clearInterval(timer);
        finishTestButton.style.display = "none";
        typingArea.disabled = true;
        showResults();
    }
    timeLeft--;
}

typingArea.addEventListener("input", () => {
    const textToType = document.getElementById("textToDisplay").textContent;
    const typedText = typingArea.value;
    totalTyped = typedText.length;
    correctTyped = 0;

    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === textToType[i]) {
            correctTyped++;
        }
    }

    const wpm = Math.floor((correctTyped / 5) / (testDuration - timeLeft) * 60);
    const accuracy = Math.round((correctTyped / totalTyped) * 100);
    wpmElement.textContent = `WPM: ${wpm}`;
    accuracyElement.textContent = `Accuracy: ${accuracy}%`;
});

finishTestButton.addEventListener("click", () => {
    clearInterval(timer);
    typingArea.disabled = true;
    showResults();
});

function showResults() {
    const wpm = Math.floor((correctTyped / 5) / (testDuration - timeLeft) * 60);
    const accuracy = Math.round((correctTyped / totalTyped) * 100);
    wpmElement.textContent = `WPM: ${wpm}`;
    accuracyElement.textContent = `Accuracy: ${accuracy}%`;
    // Hide typing area and countdown
    testArea.style.display = "none";
    countdownElement.style.display = "none";
    // Display results and certificate
    resultsElement.style.display = "block";
    certificateSection.style.display = "block";
    document.getElementById("certificateWPM").textContent = `Your WPM: ${wpm}`;
    document.getElementById("certificateAccuracy").textContent = `Your Accuracy: ${accuracy}%`;
}

// Restart the test
retryTestButton.addEventListener("click", () => {
    certificateSection.style.display = "none";
    testArea.style.display = "none";
    document.getElementById("certificateMessage").style.display = "none";
    resultsElement.style.display = "none";
});
