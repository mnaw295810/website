let currentQuestionIndex = 0;
let score = 0;
let questions = [];
const userAnswers = []; // Store user's answers
const correctAnswers = []; // Store correct answers

const categoryContainer = document.getElementById("category-container");
const quizContainer = document.getElementById("quiz-container");
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const resultElement = document.getElementById("result");
const nextButton = document.getElementById("next-btn");
const restartButton = document.getElementById("restart-btn");
const chapterContainer = document.getElementById("chapter-container"); // New container for chapter selection
const questionCountContainer = document.getElementById("question-count-container");

// Hide the "Next" button initially
nextButton.style.display = "none";
restartButton.style.display = "none";
chapterContainer.classList.add("hidden"); // Hide chapter selection initially
questionCountContainer.classList.add("hidden"); // Hide question count selection initially

// Fetch JSON data
let questionsByCategory = {};
fetch("questions.json")
  .then((response) => response.json())
  .then((data) => {
    questionsByCategory = data; // Load the JSON data into the variable
  })
  .catch((error) => console.error("Error loading JSON:", error));

// Handle category selection
document.querySelectorAll(".category-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-category");

    if (category === "BMC") {
      // Show chapter selection for BMC
      chapterContainer.classList.remove("hidden");
      categoryContainer.classList.add("hidden"); // Hide category selection
    } else {
      // For other categories, proceed directly to question count selection
      const allQuestions = questionsByCategory[category];
      showQuestionCountSelection(allQuestions);
      categoryContainer.classList.add("hidden");
    }
  });
});

// Handle chapter selection for BMC
document.querySelectorAll(".chapter-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const chapter = button.getAttribute("data-chapter");
    const allQuestions = questionsByCategory["BMC"][chapter]; // Load questions for the selected chapter
    showQuestionCountSelection(allQuestions);
  });
});

// Show question count selection
function showQuestionCountSelection(allQuestions) {
  chapterContainer.classList.add("hidden"); // Hide chapter selection
  questionCountContainer.classList.remove("hidden"); // Show question count selection

  // Handle question count selection
  document.querySelectorAll(".question-count-btn").forEach((countButton) => {
    countButton.addEventListener("click", () => {
      const count = countButton.getAttribute("data-count");
      let selectedQuestions = [];

      if (count === "all") {
        selectedQuestions = allQuestions; // Use all questions
      } else {
        selectedQuestions = shuffleArray(allQuestions).slice(0, parseInt(count)); // Shuffle and select the specified number of questions
      }

      questions = selectedQuestions; // Set the selected questions
      questionCountContainer.classList.add("hidden"); // Hide question count selection
      quizContainer.classList.remove("hidden"); // Show quiz container
      displayQuestion();
    });
  });
}

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function displayQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.textContent = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;
  optionsElement.innerHTML = "";

  currentQuestion.options.forEach((option) => {
    const optionElement = document.createElement("div");
    optionElement.className = "option";
    optionElement.textContent = option;
    optionElement.addEventListener("click", () => checkAnswer(option[0]));
    optionsElement.appendChild(optionElement);
  });
}

function checkAnswer(selectedAnswer) {
  const correctAnswer = questions[currentQuestionIndex].correctAnswer;
  userAnswers.push(selectedAnswer); // Store user's answer
  correctAnswers.push(correctAnswer); // Store correct answer

  const options = document.querySelectorAll(".option");
  options.forEach((option) => {
    option.style.pointerEvents = "none"; // Disable further clicks on options
    if (option.textContent.startsWith(correctAnswer)) {
      option.classList.add("correct"); // Add class for correct answer
    } else if (option.textContent.startsWith(selectedAnswer)) {
      option.classList.add("incorrect"); // Add class for incorrect answer
    }
  });
  if (selectedAnswer === correctAnswer) {
    score++;
  }
  nextButton.style.display = "block"; // Show the "Next" button
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    displayQuestion();
    resultElement.textContent = "";
    nextButton.style.display = "none"; // Hide the "Next" button for the next question
  } else {
    endQuiz();
  }
}

function endQuiz() {
  questionElement.textContent = ``;
  optionsElement.innerHTML = "";

  // Display results for each question
  let resultsHTML = `<h3>Your Results: ${score} of ${questions.length}</h3>`;
  questions.forEach((question, index) => {
    const userAnswer = userAnswers[index];
    const correctAnswer = correctAnswers[index];

    // Find the full option text for the user's answer and correct answer
    const userAnswerText = question.options.find((opt) => opt.startsWith(userAnswer)) || "Not answered";
    const correctAnswerText = question.options.find((opt) => opt.startsWith(correctAnswer));

    resultsHTML += `
      <div class="result-item">
        <p><strong>${index + 1}.</strong> ${question.question}</p>
        <p> Your Answer : ${userAnswerText}</p>
        <p> Correct Answer : ${correctAnswerText}</p>
      </div>
      <hr>
    `;
  });

  resultElement.innerHTML = resultsHTML;
  nextButton.style.display = "none";
  restartButton.style.display = "block"; // Show the restart button
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  userAnswers.length = 0; // Clear user's answers
  correctAnswers.length = 0; // Clear correct answers
  resultElement.innerHTML = ""; // Clear the result display
  categoryContainer.classList.remove("hidden"); // Show category selection
  quizContainer.classList.add("hidden"); // Hide quiz container
  chapterContainer.classList.add("hidden"); // Hide chapter selection
  questionCountContainer.classList.add("hidden"); // Hide question count selection
  nextButton.style.display = "none";
  restartButton.style.display = "none";
}

nextButton.addEventListener("click", nextQuestion);
restartButton.addEventListener("click", restartQuiz);